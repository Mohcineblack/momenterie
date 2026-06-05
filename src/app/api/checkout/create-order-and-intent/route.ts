import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { incrementCouponUsage, priceCheckout } from "@/lib/checkout";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { z } from "zod";

const createOrderAndIntentSchema = z.object({
  shipping: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    street: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string(),
  }),
  billing: z.object({
    sameAsShipping: z.boolean(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    street: z.string().optional(),
    street2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.number(),
      variantId: z.number().optional(),
      quantity: z.number().min(1),
      customizationData: z.any().optional(),
      previewImageUrl: z.string().optional(),
    })
  ),
  couponCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit({
      key: `checkout:${getClientIp(request)}`,
      limit: 20,
      windowMs: 60 * 60 * 1000,
    });

    if (rateLimit.limited) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const session = await auth();
    const body = await request.json();
    const validatedData = createOrderAndIntentSchema.parse(body);

    const priced = await priceCheckout({
      items: validatedData.items,
      shippingCountry: validatedData.shipping.country,
      couponCode: validatedData.couponCode,
    });

    const shippingData = validatedData.shipping;
    const billingData = validatedData.billing.sameAsShipping
      ? shippingData
      : {
          firstName: validatedData.billing.firstName!,
          lastName: validatedData.billing.lastName!,
          company: validatedData.billing.company,
          street: validatedData.billing.street!,
          street2: validatedData.billing.street2,
          city: validatedData.billing.city!,
          state: validatedData.billing.state,
          postalCode: validatedData.billing.postalCode!,
          country: validatedData.billing.country!,
          phone: shippingData.phone,
        };

    let userId: string;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      const guestUser = await prisma.user.upsert({
        where: { email: shippingData.email },
        update: {},
        create: {
          email: shippingData.email,
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          role: "customer",
        },
      });
      userId = guestUser.id;
    }

    const order = await prisma.$transaction(async (tx) => {
      const shippingAddress = await tx.address.create({
        data: {
          userId,
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          company: shippingData.company,
          street: shippingData.street,
          street2: shippingData.street2,
          city: shippingData.city,
          state: shippingData.state,
          postalCode: shippingData.postalCode,
          country: shippingData.country,
          phone: shippingData.phone,
          isDefault: false,
        },
      });

      const billingAddress = await tx.address.create({
        data: {
          userId,
          firstName: billingData.firstName,
          lastName: billingData.lastName,
          company: billingData.company,
          street: billingData.street,
          street2: billingData.street2,
          city: billingData.city,
          state: billingData.state,
          postalCode: billingData.postalCode,
          country: billingData.country,
          phone: billingData.phone,
          isDefault: false,
        },
      });

      return tx.order.create({
        data: {
          userId,
          orderNumber: generateOrderNumber(),
          status: "PENDING",
          subtotal: priced.subtotal,
          shippingCost: priced.shippingCost,
          tax: priced.tax,
          discount: priced.discount,
          total: priced.total,
          shippingAddressId: shippingAddress.id,
          billingAddressId: billingAddress.id,
          paymentStatus: "UNPAID",
          items: {
            create: priced.lines.map((line) => ({
              productId: line.product.id,
              variantId: line.variant?.id,
              quantity: line.quantity,
              price: line.unitPrice,
              customizationData: line.customizationData,
              previewImageUrl: line.previewImageUrl,
            })),
          },
        },
      });
    });

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: priced.total,
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          subtotal: priced.subtotal.toString(),
          shipping: priced.shippingCost.toString(),
          tax: priced.tax.toString(),
          discount: priced.discount.toString(),
        },
      },
      { idempotencyKey: order.id }
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: paymentIntent.id },
    });
    await incrementCouponUsage(priced.couponId);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        subtotal: priced.subtotal,
        shipping: priced.shippingCost,
        tax: priced.tax,
        discount: priced.discount,
        total: priced.total,
      },
    });
  } catch (error) {
    console.error("Create order and intent error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to initialize checkout" },
      { status: 500 }
    );
  }
}
