/**
 * Dev-mode fulfillment: bypasses Trigger.dev and submits orders directly
 * to Prodigi sandbox with a placeholder asset.
 */
import { prisma } from "@/lib/prisma";
import { submitOrder } from "@/lib/fulfillment/prodigi-client";
import { resolveProdigiSku } from "@/lib/fulfillment/sku-mapping";

const PLACEHOLDER_ASSET =
  "https://pwintyimages.blob.core.windows.net/samples/stars/test-sample-grey.png";

export async function devFulfillOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true, variant: true } },
      shippingAddress: true,
    },
  });

  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.prodigiOrderId) {
    console.log("[dev-fulfill] Already submitted:", order.prodigiOrderId);
    return;
  }

  const addr = order.shippingAddress;

  const items = order.items.map((item) => {
    let sku = "GLOBAL-FAP-A4";
    try {
      if (item.variant) {
        ({ prodigiSku: sku } = resolveProdigiSku({
          productSlug: item.product.slug,
          size: item.variant.size,
          material: item.variant.material,
          color: item.variant.color,
        }));
      }
    } catch {
      // fallback to default SKU
    }

    return {
      merchantReference: item.id,
      sku,
      copies: item.quantity,
      sizing: "fillPrintArea",
      assets: [{ printArea: "default", url: PLACEHOLDER_ASSET }],
    };
  });

  try {
    const result = await submitOrder({
      merchantReference: order.id,
      shippingMethod: "Standard",
      recipient: {
        name: `${addr.firstName} ${addr.lastName}`.trim(),
        address: {
          line1: addr.street,
          line2: addr.street2 || undefined,
          postalOrZipCode: addr.postalCode,
          countryCode: addr.country,
          townOrCity: addr.city,
          stateOrCounty: addr.state || undefined,
        },
      },
      items,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        prodigiOrderId: result.order.id,
        status: "IN_PRODUCTION",
      },
    });

    console.log("[dev-fulfill] Submitted to Prodigi:", result.order.id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    await prisma.order.update({
      where: { id: order.id },
      data: { fulfillmentError: msg },
    });
    console.error("[dev-fulfill] Prodigi submission failed:", msg);
  }
}
