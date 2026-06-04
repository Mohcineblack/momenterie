import { POST } from "../route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

jest.mock("@/trigger/order-tasks", () => ({
  submitToProdigiTask: {
    trigger: jest.fn().mockResolvedValue({ id: "run-123" }),
  },
}));

function makeRequest(orderId: string) {
  const request = new Request(`http://localhost/api/admin/orders/${orderId}/resubmit`, {
    method: "POST",
  });
  return request as any;
}

function makeParams(orderId: string) {
  return { params: Promise.resolve({ orderId }) };
}

describe("POST /api/admin/orders/[orderId]/resubmit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 for non-admin user", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const response = await POST(makeRequest("order-1"), makeParams("order-1"));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 401 for non-admin role", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "user" },
    });

    const response = await POST(makeRequest("order-1"), makeParams("order-1"));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 404 when order not found", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
    });
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await POST(makeRequest("order-1"), makeParams("order-1"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe("Order not found");
  });

  it("returns 400 when order not in correct status", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
    });
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({
      id: "order-1",
      status: "PENDING",
      paymentStatus: "PAID",
      items: [{ id: "item-1", productionFileUrl: "r2://bucket/key" }],
    });

    const response = await POST(makeRequest("order-1"), makeParams("order-1"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("IN_PRODUCTION or later");
  });

  it("returns 400 when payment is not PAID", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
    });
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({
      id: "order-1",
      status: "IN_PRODUCTION",
      paymentStatus: "UNPAID",
      items: [{ id: "item-1", productionFileUrl: "r2://bucket/key" }],
    });

    const response = await POST(makeRequest("order-1"), makeParams("order-1"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("payment must be PAID");
  });

  it("returns 400 when items are missing production files", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
    });
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({
      id: "order-1",
      status: "IN_PRODUCTION",
      paymentStatus: "PAID",
      items: [
        { id: "item-1", productionFileUrl: "r2://bucket/key" },
        { id: "item-2", productionFileUrl: null },
      ],
    });

    const response = await POST(makeRequest("order-1"), makeParams("order-1"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("missing production files");
  });

  it("returns 200 and triggers resubmission for valid request", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
    });
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({
      id: "order-1",
      status: "IN_PRODUCTION",
      paymentStatus: "PAID",
      fulfillmentError: "Previous error",
      prodigiOrderId: "ord_old_123",
      items: [{ id: "item-1", productionFileUrl: "r2://bucket/key.pdf" }],
    });
    (prisma.order.update as jest.Mock).mockResolvedValue({});

    const { submitToProdigiTask } = require("@/trigger/order-tasks");

    const response = await POST(makeRequest("order-1"), makeParams("order-1"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Order re-submitted to Prodigi");

    // Verify order was cleared
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-1" },
      data: {
        fulfillmentError: null,
        prodigiOrderId: null,
      },
    });

    // Verify task was triggered
    expect(submitToProdigiTask.trigger).toHaveBeenCalledWith(
      { orderId: "order-1" },
      expect.objectContaining({
        idempotencyKey: expect.stringContaining("resubmit-prodigi-order-1-"),
      })
    );
  });

  it("restores previous state when trigger call fails", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
    });
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({
      id: "order-1",
      status: "IN_PRODUCTION",
      paymentStatus: "PAID",
      fulfillmentError: "Previous error",
      prodigiOrderId: "ord_old_123",
      items: [{ id: "item-1", productionFileUrl: "r2://bucket/key.pdf" }],
    });
    (prisma.order.update as jest.Mock).mockResolvedValue({});

    const { submitToProdigiTask } = require("@/trigger/order-tasks");
    submitToProdigiTask.trigger.mockRejectedValueOnce(
      new Error("Trigger.dev service unavailable")
    );

    const response = await POST(makeRequest("order-1"), makeParams("order-1"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Failed to trigger resubmission task");

    // Verify order was first cleared, then restored
    expect(prisma.order.update).toHaveBeenCalledTimes(2);
    expect(prisma.order.update).toHaveBeenNthCalledWith(1, {
      where: { id: "order-1" },
      data: {
        fulfillmentError: null,
        prodigiOrderId: null,
      },
    });
    expect(prisma.order.update).toHaveBeenNthCalledWith(2, {
      where: { id: "order-1" },
      data: {
        prodigiOrderId: "ord_old_123",
        fulfillmentError: "Resubmit trigger failed: Trigger.dev service unavailable",
      },
    });
  });
});
