import { GET } from "@/app/api/orders/[orderId]/status/route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

const mockAuth = auth as unknown as jest.Mock;
const prismaMock = prisma as typeof prisma & {
  order: typeof prisma.order & { findUnique: jest.Mock };
};

describe("GET /api/orders/[orderId]/status", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const order = {
    id: "order-1",
    userId: "user-1",
    orderNumber: "MOM-1",
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentIntentId: "pi_123",
    updatedAt: new Date("2026-06-04T00:00:00.000Z"),
  };

  it("rejects anonymous reads without a matching PaymentIntent client secret", async () => {
    mockAuth.mockResolvedValue(null);
    prismaMock.order.findUnique.mockResolvedValue(order as any);

    const response = await GET(
      new NextRequest("http://localhost/api/orders/order-1/status"),
      { params: Promise.resolve({ orderId: "order-1" }) }
    );

    expect(response.status).toBe(401);
  });

  it("allows guest reads with the matching PaymentIntent client secret", async () => {
    mockAuth.mockResolvedValue(null);
    prismaMock.order.findUnique.mockResolvedValue(order as any);

    const response = await GET(
      new NextRequest(
        "http://localhost/api/orders/order-1/status?payment_intent_client_secret=pi_123_secret_test"
      ),
      { params: Promise.resolve({ orderId: "order-1" }) }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.orderId).toBe("order-1");
  });

  it("allows the owning user to read without a client secret", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "customer" } } as any);
    prismaMock.order.findUnique.mockResolvedValue(order as any);

    const response = await GET(
      new NextRequest("http://localhost/api/orders/order-1/status"),
      { params: Promise.resolve({ orderId: "order-1" }) }
    );

    expect(response.status).toBe(200);
  });
});
