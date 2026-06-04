/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock @trigger.dev/sdk so task() returns an object whose .run we can call directly
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
jest.mock("@/lib/fulfillment/sku-mapping");
jest.mock("@/lib/fulfillment/presign");

import { prisma } from "@/lib/prisma";
import { submitOrder } from "@/lib/fulfillment/prodigi-client";
import { resolveProdigiSku } from "@/lib/fulfillment/sku-mapping";
import { getPresignedProductionUrl } from "@/lib/fulfillment/presign";
import { submitToProdigiTask } from "@/trigger/order-tasks";

const mockPrisma = prisma as any;
const mockSubmitOrder = submitOrder as jest.Mock;
const mockResolveProdigiSku = resolveProdigiSku as jest.Mock;
const mockGetPresignedUrl = getPresignedProductionUrl as jest.Mock;

// Access the run function directly from our mocked task
const runTask = (submitToProdigiTask as any).run as (
  payload: { orderId: string }
) => Promise<any>;

describe("submitToProdigiTask", () => {
  const mockOrder = {
    id: "order-123",
    prodigiOrderId: null,
    status: "IN_PRODUCTION",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main St",
      street2: "Apt 4",
      postalCode: "12345",
      country: "US",
      city: "Springfield",
      state: "IL",
    },
    items: [
      {
        id: "item-1",
        quantity: 1,
        productionFileUrl:
          "r2://bucket/production/orders/order-123/items/item-1.pdf",
        variant: {
          size: "A3",
          material: "Poster",
          color: null,
        },
        product: {
          slug: "custom-city-map",
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
    mockPrisma.order.update.mockResolvedValue({});
    mockResolveProdigiSku.mockReturnValue({
      prodigiSku: "GLOBAL-FAP-A3",
      printAttributes: {
        widthPx: 3579,
        heightPx: 5031,
        dpi: 300,
        format: "pdf",
        bleedMm: 3,
      },
    });
    mockGetPresignedUrl.mockResolvedValue(
      "https://presigned.example.com/file.pdf"
    );
  });

  it("submits order to Prodigi and stores prodigiOrderId", async () => {
    mockSubmitOrder.mockResolvedValue({
      order: {
        id: "prd_abc123",
        status: { stage: "InProgress" },
        charges: [{ totalCost: { amount: "12.50", currency: "GBP" } }],
        shipments: [],
      },
    });

    const result = await runTask({ orderId: "order-123" });

    expect(mockPrisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: "order-123" },
      include: {
        items: { include: { variant: true, product: true } },
        shippingAddress: true,
      },
    });

    expect(mockResolveProdigiSku).toHaveBeenCalledWith({
      productSlug: "custom-city-map",
      size: "A3",
      material: "Poster",
      color: null,
    });

    expect(mockGetPresignedUrl).toHaveBeenCalledWith(
      "r2://bucket/production/orders/order-123/items/item-1.pdf"
    );

    expect(mockSubmitOrder).toHaveBeenCalledWith({
      merchantReference: "order-123",
      shippingMethod: "Standard",
      recipient: {
        name: "John Doe",
        address: {
          line1: "123 Main St",
          line2: "Apt 4",
          postalOrZipCode: "12345",
          countryCode: "US",
          townOrCity: "Springfield",
          stateOrCounty: "IL",
        },
      },
      items: [
        {
          merchantReference: "item-1",
          sku: "GLOBAL-FAP-A3",
          copies: 1,
          sizing: "fillPrintArea",
          assets: [
            {
              printArea: "default",
              url: "https://presigned.example.com/file.pdf",
            },
          ],
        },
      ],
    });

    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-123" },
      data: {
        prodigiOrderId: "prd_abc123",
        supplierCostCents: 1250,
      },
    });

    expect(result).toEqual({ success: true, prodigiOrderId: "prd_abc123" });
  });

  it("returns early if prodigiOrderId is already set (idempotency guard)", async () => {
    mockPrisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      prodigiOrderId: "prd_existing",
    });

    const result = await runTask({ orderId: "order-123" });

    expect(mockSubmitOrder).not.toHaveBeenCalled();
    expect(result).toEqual({ skipped: true, prodigiOrderId: "prd_existing" });
  });

  it("stores fulfillmentError on submission failure and re-throws", async () => {
    const apiError = new Error("Invalid SKU provided");
    mockSubmitOrder.mockRejectedValue(apiError);

    await expect(runTask({ orderId: "order-123" })).rejects.toThrow(
      "Invalid SKU provided"
    );

    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-123" },
      data: {
        fulfillmentError: "Invalid SKU provided",
      },
    });
  });

  it("throws clear error for unmapped SKU (no variant)", async () => {
    mockPrisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      items: [
        {
          id: "item-no-variant",
          quantity: 1,
          productionFileUrl: "r2://bucket/file.pdf",
          variant: null,
          product: { slug: "custom-city-map" },
        },
      ],
    });

    await expect(runTask({ orderId: "order-123" })).rejects.toThrow(
      "has no variant"
    );
  });

  it("throws if order is not found", async () => {
    mockPrisma.order.findUnique.mockResolvedValue(null);

    await expect(runTask({ orderId: "nonexistent" })).rejects.toThrow(
      "Order nonexistent not found"
    );
  });
});
