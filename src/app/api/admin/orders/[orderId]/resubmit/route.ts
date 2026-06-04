import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submitToProdigiTask } from "@/trigger/order-tasks";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Validate order state
    const validStatuses = ["IN_PRODUCTION", "SHIPPED", "DELIVERED"];
    if (!validStatuses.includes(order.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Order status must be IN_PRODUCTION or later. Current: ${order.status}`,
        },
        { status: 400 }
      );
    }

    if (order.paymentStatus !== "PAID") {
      return NextResponse.json(
        {
          success: false,
          error: `Order payment must be PAID. Current: ${order.paymentStatus}`,
        },
        { status: 400 }
      );
    }

    // Verify all items have production files
    const itemsMissingFiles = order.items.filter(
      (item) => !item.productionFileUrl
    );
    if (itemsMissingFiles.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `${itemsMissingFiles.length} item(s) missing production files`,
        },
        { status: 400 }
      );
    }

    // Clear fulfillment error and prodigiOrderId for clean re-submission
    await prisma.order.update({
      where: { id: orderId },
      data: {
        fulfillmentError: null,
        prodigiOrderId: null,
      },
    });

    // Trigger the submit-to-prodigi task
    await submitToProdigiTask.trigger(
      { orderId },
      { idempotencyKey: `resubmit-prodigi-${orderId}-${Date.now()}` }
    );

    return NextResponse.json({
      success: true,
      message: "Order re-submitted to Prodigi",
    });
  } catch (error: unknown) {
    console.error("Error re-submitting order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to re-submit order" },
      { status: 500 }
    );
  }
}
