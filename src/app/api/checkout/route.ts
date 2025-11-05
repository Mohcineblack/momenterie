import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

const checkoutSchema = z.object({
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
      id: z.string(),
      productId: z.number(),
      productName: z.string(),
      productSlug: z.string(),
      variantId: z.number().optional(),
      variantName: z.string().optional(),
      quantity: z.number().min(1),
      basePrice: z.number(),
      variantPrice: z.number(),
      customizationData: z.any(),
      previewImageUrl: z.string().optional(),
    })
  ),
  subtotal: z.number(),
  shippingCost: z.number(),
  tax: z.number(),
  total: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    // Validate input
    const validatedData = checkoutSchema.parse(body);

    // Determine shipping and billing addresses
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

    // Get or create user
    let userId: string;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Create guest user
      const guestUser = await prisma.user.create({
        data: {
          email: shippingData.email,
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          role: "customer",
        },
      });
      userId = guestUser.id;
    }

    // Create addresses
    const shippingAddress = await prisma.address.create({
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

    const billingAddress = await prisma.address.create({
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

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        status: "pending",
        subtotal: validatedData.subtotal,
        shippingCost: validatedData.shippingCost,
        tax: validatedData.tax,
        total: validatedData.total,
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        paymentStatus: "unpaid",
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.basePrice + item.variantPrice,
            customizationData: item.customizationData,
            previewImageUrl: item.previewImageUrl,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process checkout",
      },
      { status: 500 }
    );
  }
}
