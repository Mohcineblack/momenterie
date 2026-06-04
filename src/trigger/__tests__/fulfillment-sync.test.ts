/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock @trigger.dev/sdk
jest.mock("@trigger.dev/sdk", () => ({
  task: (config: any) => ({
    ...config,
    trigger: jest.fn(),
    batchTrigger: jest.fn(),
  }),
  schedules: {
    task: (config: any) => ({
      ...config,
      trigger: jest.fn(),
    }),
  },
}));

jest.mock("@/lib/fulfillment/prodigi-client");

import { prisma } from "@/lib/prisma";
import { getOrder } from "@/lib/fulfillment/prodigi-client";
import { syncFulfillmentStatus } from "@/trigger/fulfillment-sync";

const mockPrisma = prisma as any;
const mockGetOrder = getOrder as jest.Mock;

// Access the run function directly from our mocked scheduled task
const runSync = (syncFulfillmentStatus as any).run as () => Promise<void>;

describe("syncFulfillmentStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates order to SHIPPED with carrier and trackingUrl when Prodigi reports Shipped", async () => {
    const orders = [
      {
        id: "order-1",
        prodigiOrderId: "prd_abc",
        status: "IN_PRODUCTION",
      },
    ];

    mockPrisma.order.findMany.mockResolvedValue(orders);
    mockPrisma.order.update.mockResolvedValue({});

    mockGetOrder.mockResolvedValue({
      order: {
        id: "prd_abc",
        status: { stage: "Shipped" },
        charges: [{ totalCost: { amount: "10.00", currency: "GBP" } }],
        shipments: [
          {
            carrier: { name: "DHL" },
            tracking: { url: "https://tracking.dhl.com/123" },
          },
        ],
      },
    });

    await runSync();

    expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
      where: {
        prodigiOrderId: { not: null },
        status: "IN_PRODUCTION",
      },
    });

    expect(mockGetOrder).toHaveBeenCalledWith("prd_abc");

    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-1" },
      data: {
        status: "SHIPPED",
        carrier: "DHL",
        trackingUrl: "https://tracking.dhl.com/123",
        shippedAt: expect.any(Date),
      },
    });
  });

  it("updates order to SHIPPED when Prodigi reports Complete", async () => {
    const orders = [
      {
        id: "order-2",
        prodigiOrderId: "prd_def",
        status: "IN_PRODUCTION",
      },
    ];

    mockPrisma.order.findMany.mockResolvedValue(orders);
    mockPrisma.order.update.mockResolvedValue({});

    mockGetOrder.mockResolvedValue({
      order: {
        id: "prd_def",
        status: { stage: "Complete" },
        charges: [],
        shipments: [
          {
            carrier: { name: "FedEx" },
            tracking: { url: "https://fedex.com/track/456" },
          },
        ],
      },
    });

    await runSync();

    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-2" },
      data: {
        status: "SHIPPED",
        carrier: "FedEx",
        trackingUrl: "https://fedex.com/track/456",
        shippedAt: expect.any(Date),
      },
    });
  });

  it("sets fulfillmentError when Prodigi reports Cancelled", async () => {
    const orders = [
      {
        id: "order-3",
        prodigiOrderId: "prd_ghi",
        status: "IN_PRODUCTION",
      },
    ];

    mockPrisma.order.findMany.mockResolvedValue(orders);
    mockPrisma.order.update.mockResolvedValue({});

    mockGetOrder.mockResolvedValue({
      order: {
        id: "prd_ghi",
        status: { stage: "Cancelled" },
        charges: [],
        shipments: [],
      },
    });

    await runSync();

    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-3" },
      data: {
        fulfillmentError: "Order was cancelled by Prodigi",
      },
    });
  });

  it("skips orders that are still InProgress (no-op)", async () => {
    const orders = [
      {
        id: "order-4",
        prodigiOrderId: "prd_jkl",
        status: "IN_PRODUCTION",
      },
    ];

    mockPrisma.order.findMany.mockResolvedValue(orders);

    mockGetOrder.mockResolvedValue({
      order: {
        id: "prd_jkl",
        status: { stage: "InProgress" },
        charges: [],
        shipments: [],
      },
    });

    await runSync();

    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });

  it("handles API errors gracefully without throwing", async () => {
    const orders = [
      {
        id: "order-5",
        prodigiOrderId: "prd_mno",
        status: "IN_PRODUCTION",
      },
    ];

    mockPrisma.order.findMany.mockResolvedValue(orders);
    mockGetOrder.mockRejectedValue(new Error("Network timeout"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // Should not throw
    await runSync();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to sync order order-5")
    );
    expect(mockPrisma.order.update).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("processes multiple orders independently", async () => {
    const orders = [
      { id: "order-a", prodigiOrderId: "prd_a", status: "IN_PRODUCTION" },
      { id: "order-b", prodigiOrderId: "prd_b", status: "IN_PRODUCTION" },
    ];

    mockPrisma.order.findMany.mockResolvedValue(orders);
    mockPrisma.order.update.mockResolvedValue({});

    mockGetOrder
      .mockResolvedValueOnce({
        order: {
          id: "prd_a",
          status: { stage: "Shipped" },
          charges: [],
          shipments: [
            {
              carrier: { name: "UPS" },
              tracking: { url: "https://ups.com/1" },
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        order: {
          id: "prd_b",
          status: { stage: "InProgress" },
          charges: [],
          shipments: [],
        },
      });

    await runSync();

    // Only order-a should be updated (Shipped), order-b is InProgress
    expect(mockPrisma.order.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-a" },
      data: {
        status: "SHIPPED",
        carrier: "UPS",
        trackingUrl: "https://ups.com/1",
        shippedAt: expect.any(Date),
      },
    });
  });
});
