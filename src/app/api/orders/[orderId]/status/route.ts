import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      userId: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      paymentIntentId: true,
      updatedAt: true,
    },
  });

  if (!order) {
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  }

  const clientSecret = request.nextUrl.searchParams.get("payment_intent_client_secret");
  const clientSecretMatches =
    Boolean(order.paymentIntentId) &&
    Boolean(clientSecret) &&
    clientSecret!.startsWith(`${order.paymentIntentId}_secret_`);

  if (!clientSecretMatches && (!session?.user?.id || session.user.id !== order.userId)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.paymentIntentId,
      updatedAt: order.updatedAt,
    },
  });
}
