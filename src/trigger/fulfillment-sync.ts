import { schedules } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";
import { getOrder } from "@/lib/fulfillment/prodigi-client";

/**
 * Polls Prodigi every 30 minutes for status updates on orders
 * that are currently IN_PRODUCTION and have a prodigiOrderId.
 */
export const syncFulfillmentStatus = schedules.task({
  id: "sync-fulfillment-status",
  cron: "*/30 * * * *",
  run: async () => {
    const orders = await prisma.order.findMany({
      where: {
        prodigiOrderId: { not: null },
        status: "IN_PRODUCTION",
      },
    });

    for (const order of orders) {
      if (!order.prodigiOrderId) continue;

      try {
        const response = await getOrder(order.prodigiOrderId);
        const stage = response.order.status.stage;

        if (stage === "Complete" || stage === "Shipped") {
          // Extract shipment info
          let carrier: string | null = null;
          let trackingUrl: string | null = null;

          if (
            response.order.shipments &&
            response.order.shipments.length > 0
          ) {
            const shipment = response.order.shipments[0];
            carrier = shipment.carrier?.name || null;
            trackingUrl = shipment.tracking?.url || null;
          }

          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "SHIPPED",
              carrier,
              trackingUrl,
              shippedAt: new Date(),
            },
          });
        } else if (stage === "Cancelled") {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              fulfillmentError: "Order was cancelled by Prodigi",
            },
          });
        }
        // InProgress -> no-op, order stays IN_PRODUCTION
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unknown error polling Prodigi";
        console.error(
          `Failed to sync order ${order.id} (Prodigi: ${order.prodigiOrderId}): ${errorMessage}`
        );
      }
    }
  },
});
