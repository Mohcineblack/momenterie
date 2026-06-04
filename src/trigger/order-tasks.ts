import { task, schedules } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { renderProductionPdf } from "@/lib/render";
import { uploadProductionFile } from "@/lib/render/r2";

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

      await notifyPrintPartner.trigger(
        { orderId: item.orderId },
        { idempotencyKey: `notify-print-partner-${item.orderId}` }
      );
    }
  },
});

export const notifyPrintPartner = task({
  id: "notify-print-partner",
  run: async (_payload: { orderId: string }) => {
    return;
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
