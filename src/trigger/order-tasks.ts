import { task, schedules } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { renderProductionPdf } from "@/lib/render";
import { uploadProductionFile } from "@/lib/render/r2";
import { submitOrder } from "@/lib/fulfillment/prodigi-client";
import { resolveProdigiSku } from "@/lib/fulfillment/sku-mapping";
import { getPresignedProductionUrl } from "@/lib/fulfillment/presign";

export const sendConfirmationEmail = task({
  id: "send-confirmation-email",
  run: async (payload: { orderId: string }) => {
    const order = await prisma.order.findUnique({
      where: { id: payload.orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order || order.paymentStatus !== "PAID") {
      return;
    }

    await sendOrderConfirmationEmail({
      to: order.user.email!,
      customerName: order.user.name || "Customer",
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      items: order.items.map((item) => ({
        name: item.product.name,
        variant: item.variant?.name || "Standard",
        quantity: item.quantity,
        price: item.price,
        image: item.product.images[0] || "/placeholder.svg",
      })),
      subtotal: order.subtotal,
      shipping: order.shippingCost,
      tax: order.tax,
      total: order.total,
      shippingAddress: order.shippingAddress,
    });
  },
});

export const renderOrderItem = task({
  id: "render-order-item",
  run: async (payload: { orderItemId: string }) => {
    const item = await prisma.orderItem.findUnique({
      where: { id: payload.orderItemId },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!item) {
      throw new Error(`Order item ${payload.orderItemId} not found`);
    }

    const rendered = await renderProductionPdf(item.customizationData);
    const key = `production/orders/${item.orderId}/items/${item.id}.pdf`;
    const productionFileUrl = await uploadProductionFile({
      key,
      body: rendered.buffer,
      contentType: "application/pdf",
    });

    await prisma.orderItem.update({
      where: { id: item.id },
      data: { productionFileUrl },
    });

    const remaining = await prisma.orderItem.count({
      where: {
        orderId: item.orderId,
        productionFileUrl: null,
      },
    });

    if (remaining === 0) {
      await prisma.order.update({
        where: { id: item.orderId },
        data: { status: "IN_PRODUCTION" },
      });

      await submitToProdigiTask.trigger(
        { orderId: item.orderId },
        { idempotencyKey: `submit-to-prodigi-${item.orderId}` }
      );
    }
  },
});

export const submitToProdigiTask = task({
  id: "submit-to-prodigi",
  retry: {
    maxAttempts: 5,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 60_000,
  },
  run: async (payload: { orderId: string }) => {
    const order = await prisma.order.findUnique({
      where: { id: payload.orderId },
      include: {
        items: {
          include: {
            variant: true,
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new Error(`Order ${payload.orderId} not found`);
    }

    // Idempotency guard: if already submitted, skip
    if (order.prodigiOrderId) {
      return { skipped: true, prodigiOrderId: order.prodigiOrderId };
    }

    // Build items array
    const prodigiItems = await Promise.all(
      order.items.map(async (item) => {
        if (!item.variant) {
          throw new Error(
            `Order item ${item.id} has no variant - cannot resolve Prodigi SKU`
          );
        }

        const { prodigiSku } = resolveProdigiSku({
          productSlug: item.product.slug,
          size: item.variant.size,
          material: item.variant.material,
          color: item.variant.color,
        });

        if (!item.productionFileUrl) {
          throw new Error(
            `Order item ${item.id} has no production file URL - cannot submit to Prodigi`
          );
        }

        const assetUrl = await getPresignedProductionUrl(
          item.productionFileUrl
        );

        return {
          merchantReference: item.id,
          sku: prodigiSku,
          copies: item.quantity,
          sizing: "fillPrintArea",
          assets: [{ printArea: "default", url: assetUrl }],
        };
      })
    );

    // Build recipient
    const addr = order.shippingAddress;
    const recipient = {
      name: `${addr.firstName} ${addr.lastName}`.trim(),
      address: {
        line1: addr.street,
        line2: addr.street2 || undefined,
        postalOrZipCode: addr.postalCode,
        countryCode: addr.country,
        townOrCity: addr.city,
        stateOrCounty: addr.state || undefined,
      },
    };

    try {
      const result = await submitOrder({
        merchantReference: order.id,
        shippingMethod: "Standard",
        recipient,
        items: prodigiItems,
      });

      // Extract cost from first charge (total cost in minor units)
      let supplierCostCents: number | null = null;
      if (result.order.charges && result.order.charges.length > 0) {
        const costAmount = parseFloat(
          result.order.charges[0].totalCost.amount
        );
        supplierCostCents = Math.round(costAmount * 100);
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          prodigiOrderId: result.order.id,
          supplierCostCents,
        },
      });

      return { success: true, prodigiOrderId: result.order.id };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown Prodigi API error";

      await prisma.order.update({
        where: { id: order.id },
        data: {
          fulfillmentError: errorMessage,
        },
      });

      throw error;
    }
  },
});

export const expireAbandonedOrders = schedules.task({
  id: "expire-abandoned-orders",
  cron: "*/30 * * * *",
  run: async () => {
    const cutoff = new Date(Date.now() - 60 * 60 * 1000);

    await prisma.order.updateMany({
      where: {
        status: "PENDING",
        paymentStatus: "UNPAID",
        createdAt: { lt: cutoff },
      },
      data: {
        status: "CANCELLED",
        paymentStatus: "CANCELLED",
        notes: "Expired after payment was not completed.",
      },
    });
  },
});
