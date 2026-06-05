import type { Coupon, Prisma, Product, ProductVariant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateShippingCost, calculateTax } from "@/lib/utils";

export interface CheckoutLineInput {
  productId: number;
  variantId?: number;
  quantity: number;
  customizationData?: unknown;
  previewImageUrl?: string;
}

export interface PricedCheckoutLine {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  customizationData: Prisma.InputJsonValue;
  previewImageUrl?: string;
  unitPrice: number;
  lineTotal: number;
}

export interface PricedCheckout {
  lines: PricedCheckoutLine[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  couponId?: number;
}

export async function priceCheckout(input: {
  items: CheckoutLineInput[];
  shippingCountry: string;
  couponCode?: string;
}): Promise<PricedCheckout> {
  if (input.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const lines = await Promise.all(
    input.items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const variant =
        item.variantId === undefined
          ? null
          : product.variants.find((candidate) => candidate.id === item.variantId) ??
            null;

      if (item.variantId !== undefined && !variant) {
        throw new Error(
          `Variant ${item.variantId} does not belong to product ${item.productId}`
        );
      }

      const unitPrice = product.basePrice + (variant?.priceModifier ?? 0);

      if (unitPrice < 0) {
        throw new Error(`Product ${item.productId} has an invalid price`);
      }

      return {
        product,
        variant,
        quantity: item.quantity,
        customizationData: toInputJsonValue(item.customizationData),
        previewImageUrl: item.previewImageUrl,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    })
  );

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const coupon = input.couponCode
    ? await validateCoupon(input.couponCode, subtotal)
    : null;
  const discount = coupon ? calculateCouponDiscount(coupon, subtotal) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingCost = calculateShippingCost(
    input.shippingCountry,
    discountedSubtotal
  );
  const tax = calculateTax(discountedSubtotal, input.shippingCountry);
  const total = discountedSubtotal + shippingCost + tax;

  return {
    lines,
    subtotal,
    shippingCost,
    tax,
    discount,
    total,
    couponId: coupon?.id,
  };
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  if (value === undefined) {
    return {};
  }

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  const now = new Date();

  if (!coupon.active) {
    throw new Error("Coupon is inactive");
  }

  if (coupon.validFrom > now) {
    throw new Error("Coupon is not active yet");
  }

  if (coupon.validUntil && coupon.validUntil < now) {
    throw new Error("Coupon has expired");
  }

  if (coupon.minPurchase !== null && subtotal < coupon.minPurchase) {
    throw new Error("Minimum purchase not met for coupon");
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  return coupon;
}

function calculateCouponDiscount(coupon: Coupon, subtotal: number) {
  if (coupon.discountType === "percentage") {
    const rawDiscount = Math.round(subtotal * (coupon.discountValue / 100));
    return coupon.maxDiscount === null
      ? rawDiscount
      : Math.min(rawDiscount, coupon.maxDiscount);
  }

  if (coupon.discountType === "fixed") {
    return Math.min(subtotal, coupon.discountValue);
  }

  throw new Error("Invalid coupon type");
}

export async function incrementCouponUsage(couponId: number | undefined) {
  if (!couponId) return;

  await prisma.coupon.update({
    where: { id: couponId },
    data: { usageCount: { increment: 1 } },
  });
}
