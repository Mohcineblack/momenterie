import { POST } from "../route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { renderOrderItem, sendConfirmationEmail } from "@/trigger/order-tasks";
import type { NextRequest } from "next/server";

jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({ get: jest.fn().mockReturnValue("sig") }),
}));
jest.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));
jest.mock("@/trigger/order-tasks", () => ({
  sendConfirmationEmail: { trigger: jest.fn() },
  renderOrderItem: { trigger: jest.fn() },
}));

const prismaMock = prisma as unknown as {
  stripeWebhookEvent: {
    create: jest.Mock;
    delete: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

describe("stripe webhook idempotency", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.stripeWebhookEvent = {
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    };
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      id: "evt_1",
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_1",
          metadata: { orderId: "order-1" },
        },
      },
    });
    prismaMock.stripeWebhookEvent.create.mockResolvedValue({});
    prismaMock.stripeWebhookEvent.delete.mockResolvedValue({});
    prismaMock.stripeWebhookEvent.update.mockResolvedValue({});
    (prisma.order.findFirst as jest.Mock | undefined) = jest.fn();
    (prisma.order.update as jest.Mock | undefined) = jest.fn();
    (prisma.order.findFirst as jest.Mock).mockResolvedValue({
      id: "order-1",
      orderNumber: "MOM-1",
      paymentStatus: "UNPAID",
      items: [{ id: "item-1" }],
      user: { email: "ada@example.com", name: "Ada" },
      shippingAddress: {},
      billingAddress: {},
    });
    (prisma.order.update as jest.Mock).mockResolvedValue({ id: "order-1" });
  });

  it("returns early when Stripe retries a processed event", async () => {
    prismaMock.stripeWebhookEvent.create.mockRejectedValueOnce({
      code: "P2002",
    });
    prismaMock.stripeWebhookEvent.findUnique.mockResolvedValueOnce({
      eventId: "evt_1",
      processedAt: new Date(),
    });

    const request = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });

    const response = await POST(request as NextRequest);

    expect(response.status).toBe(200);
    expect(prisma.order.update).not.toHaveBeenCalled();
    expect(sendConfirmationEmail.trigger).not.toHaveBeenCalled();
    expect(renderOrderItem.trigger).not.toHaveBeenCalled();
  });

  it("accepts a concurrent duplicate event without double-processing it", async () => {
    prismaMock.stripeWebhookEvent.create.mockRejectedValueOnce({
      code: "P2002",
    });
    prismaMock.stripeWebhookEvent.findUnique.mockResolvedValueOnce({
      eventId: "evt_1",
      processedAt: null,
    });

    const request = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });

    const response = await POST(request as NextRequest);

    expect(response.status).toBe(200);
    expect(prisma.order.update).not.toHaveBeenCalled();
    expect(sendConfirmationEmail.trigger).not.toHaveBeenCalled();
    expect(renderOrderItem.trigger).not.toHaveBeenCalled();
  });

  it("can enqueue tasks on retry after the order was already marked paid", async () => {
    (prisma.order.findFirst as jest.Mock).mockResolvedValue({
      id: "order-1",
      orderNumber: "MOM-1",
      paymentStatus: "PAID",
      items: [{ id: "item-1" }],
      user: { email: "ada@example.com", name: "Ada" },
      shippingAddress: {},
      billingAddress: {},
    });
    const request = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });

    await POST(request as NextRequest);

    expect(prisma.order.update).not.toHaveBeenCalled();
    expect(sendConfirmationEmail.trigger).toHaveBeenCalledTimes(1);
    expect(renderOrderItem.trigger).toHaveBeenCalledTimes(1);
    expect(prismaMock.stripeWebhookEvent.update).toHaveBeenCalledWith({
      where: { eventId: "evt_1" },
      data: { processedAt: expect.any(Date) },
    });
  });

  it("processes a later Stripe retry when the first attempt failed", async () => {
    (sendConfirmationEmail.trigger as jest.Mock)
      .mockRejectedValueOnce(new Error("Trigger missing"))
      .mockResolvedValueOnce(undefined);
    const firstRequest = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });
    const secondRequest = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });

    const firstResponse = await POST(firstRequest as NextRequest);
    (prisma.order.findFirst as jest.Mock).mockResolvedValue({
      id: "order-1",
      orderNumber: "MOM-1",
      paymentStatus: "PAID",
      items: [{ id: "item-1" }],
      user: { email: "ada@example.com", name: "Ada" },
      shippingAddress: {},
      billingAddress: {},
    });
    const secondResponse = await POST(secondRequest as NextRequest);

    expect(firstResponse.status).toBe(500);
    expect(secondResponse.status).toBe(200);
    expect(prisma.order.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.stripeWebhookEvent.delete).toHaveBeenCalledWith({
      where: { eventId: "evt_1" },
    });
    expect(sendConfirmationEmail.trigger).toHaveBeenCalledTimes(2);
    expect(renderOrderItem.trigger).toHaveBeenCalledTimes(1);
  });
});
