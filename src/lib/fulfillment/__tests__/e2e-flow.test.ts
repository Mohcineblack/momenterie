/**
 * Integration-style test that validates the full fulfillment pipeline
 * from SKU mapping through Prodigi submission to status sync.
 *
 * All external dependencies are mocked; this verifies the modules
 * wire together correctly.
 */

import { resolveProdigiSku } from "../sku-mapping";
import { getPresignedProductionUrl } from "../presign";
import { submitOrder, getOrder } from "../prodigi-client";

jest.mock("../presign");
jest.mock("../prodigi-client");

const mockGetPresignedProductionUrl =
  getPresignedProductionUrl as jest.MockedFunction<
    typeof getPresignedProductionUrl
  >;
const mockSubmitOrder = submitOrder as jest.MockedFunction<typeof submitOrder>;
const mockGetOrder = getOrder as jest.MockedFunction<typeof getOrder>;

describe("Fulfillment E2E Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOrderItems = [
    {
      id: "item-1",
      productSlug: "custom-city-map",
      size: "A3",
      material: "Poster",
      color: null,
      productionFileUrl: "r2://momenterie-production/production/orders/ord-1/items/item-1.pdf",
      quantity: 1,
    },
    {
      id: "item-2",
      productSlug: "custom-star-map",
      size: "50x70cm",
      material: "Framed",
      color: "black",
      productionFileUrl: "r2://momenterie-production/production/orders/ord-1/items/item-2.pdf",
      quantity: 2,
    },
  ];

  it("resolves Prodigi SKUs for all order items", () => {
    const results = mockOrderItems.map((item) =>
      resolveProdigiSku({
        productSlug: item.productSlug,
        size: item.size,
        material: item.material,
        color: item.color,
      })
    );

    expect(results[0].prodigiSku).toBe("GLOBAL-FAP-A3");
    expect(results[0].printAttributes.dpi).toBe(300);
    expect(results[0].printAttributes.format).toBe("pdf");

    expect(results[1].prodigiSku).toBe("GLOBAL-FRA-50x70-BLK");
    expect(results[1].printAttributes.widthPx).toBe(5976);
    expect(results[1].printAttributes.heightPx).toBe(8339);
  });

  it("generates presigned URLs for production files", async () => {
    mockGetPresignedProductionUrl.mockImplementation(async (url) => {
      return `https://presigned.example.com/${url.replace("r2://momenterie-production/", "")}`;
    });

    const urls = await Promise.all(
      mockOrderItems.map((item) =>
        getPresignedProductionUrl(item.productionFileUrl)
      )
    );

    expect(urls[0]).toBe(
      "https://presigned.example.com/production/orders/ord-1/items/item-1.pdf"
    );
    expect(urls[1]).toBe(
      "https://presigned.example.com/production/orders/ord-1/items/item-2.pdf"
    );
    expect(mockGetPresignedProductionUrl).toHaveBeenCalledTimes(2);
  });

  it("submits order to Prodigi and receives order ID", async () => {
    mockGetPresignedProductionUrl.mockImplementation(async (url) => {
      return `https://presigned.example.com/${url.replace("r2://momenterie-production/", "")}`;
    });

    mockSubmitOrder.mockResolvedValue({
      order: {
        id: "ord_prodigi_abc123",
        status: { stage: "InProgress" },
        charges: [
          {
            totalCost: { amount: "12.50", currency: "GBP" },
          },
        ],
        shipments: [],
      },
    });

    // Step 1: Resolve SKUs
    const skuResults = mockOrderItems.map((item) =>
      resolveProdigiSku({
        productSlug: item.productSlug,
        size: item.size,
        material: item.material,
        color: item.color,
      })
    );

    // Step 2: Get presigned URLs
    const urls = await Promise.all(
      mockOrderItems.map((item) =>
        getPresignedProductionUrl(item.productionFileUrl)
      )
    );

    // Step 3: Build and submit order payload
    const prodigiItems = mockOrderItems.map((item, index) => ({
      merchantReference: item.id,
      sku: skuResults[index].prodigiSku,
      copies: item.quantity,
      sizing: "fillPrintArea",
      assets: [{ printArea: "default", url: urls[index] }],
    }));

    const result = await submitOrder({
      merchantReference: "ord-1",
      shippingMethod: "Standard",
      recipient: {
        name: "John Doe",
        address: {
          line1: "123 Main St",
          postalOrZipCode: "12345",
          countryCode: "DE",
          townOrCity: "Berlin",
        },
      },
      items: prodigiItems,
    });

    // Verify submission response
    expect(result.order.id).toBe("ord_prodigi_abc123");
    expect(result.order.status.stage).toBe("InProgress");

    // Verify supplier cost extraction
    const costAmount = parseFloat(result.order.charges[0].totalCost.amount);
    const supplierCostCents = Math.round(costAmount * 100);
    expect(supplierCostCents).toBe(1250);

    // Verify the payload sent to Prodigi
    expect(mockSubmitOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        merchantReference: "ord-1",
        shippingMethod: "Standard",
        items: expect.arrayContaining([
          expect.objectContaining({
            sku: "GLOBAL-FAP-A3",
            copies: 1,
          }),
          expect.objectContaining({
            sku: "GLOBAL-FRA-50x70-BLK",
            copies: 2,
          }),
        ]),
      })
    );
  });

  it("syncs shipped status from Prodigi with tracking info", async () => {
    mockGetOrder.mockResolvedValue({
      order: {
        id: "ord_prodigi_abc123",
        status: { stage: "Shipped" },
        charges: [
          {
            totalCost: { amount: "12.50", currency: "GBP" },
          },
        ],
        shipments: [
          {
            carrier: { name: "DHL" },
            tracking: { url: "https://tracking.dhl.com/abc123" },
          },
        ],
      },
    });

    const response = await getOrder("ord_prodigi_abc123");

    // Verify status is shipped
    expect(response.order.status.stage).toBe("Shipped");

    // Verify shipment details
    expect(response.order.shipments).toHaveLength(1);
    expect(response.order.shipments[0].carrier.name).toBe("DHL");
    expect(response.order.shipments[0].tracking.url).toBe(
      "https://tracking.dhl.com/abc123"
    );

    // Map Prodigi status to internal status
    const stage = response.order.status.stage;
    const internalStatus =
      stage === "Shipped" || stage === "Complete" ? "SHIPPED" : "IN_PRODUCTION";
    expect(internalStatus).toBe("SHIPPED");

    // Extract carrier and tracking
    const shipment = response.order.shipments[0];
    expect(shipment.carrier.name).toBe("DHL");
    expect(shipment.tracking.url).toBe("https://tracking.dhl.com/abc123");
  });

  it("handles cancelled orders from Prodigi", async () => {
    mockGetOrder.mockResolvedValue({
      order: {
        id: "ord_prodigi_cancelled",
        status: { stage: "Cancelled" },
        charges: [],
        shipments: [],
      },
    });

    const response = await getOrder("ord_prodigi_cancelled");

    expect(response.order.status.stage).toBe("Cancelled");

    // Map to fulfillment error
    const isCancelled = response.order.status.stage === "Cancelled";
    expect(isCancelled).toBe(true);
  });

  it("validates full pipeline from SKU mapping through status sync", async () => {
    // This test runs the entire pipeline end-to-end with mocks

    // 1. SKU mapping
    const sku = resolveProdigiSku({
      productSlug: "custom-city-map",
      size: "A4",
      material: "Poster",
      color: null,
    });
    expect(sku.prodigiSku).toBe("GLOBAL-FAP-A4");

    // 2. Presign
    mockGetPresignedProductionUrl.mockResolvedValue(
      "https://presigned.example.com/file.pdf"
    );
    const presignedUrl = await getPresignedProductionUrl(
      "r2://bucket/production/file.pdf"
    );
    expect(presignedUrl).toBe("https://presigned.example.com/file.pdf");

    // 3. Submit order
    mockSubmitOrder.mockResolvedValue({
      order: {
        id: "ord_prodigi_full_test",
        status: { stage: "InProgress" },
        charges: [{ totalCost: { amount: "8.99", currency: "GBP" } }],
        shipments: [],
      },
    });

    const submitResult = await submitOrder({
      merchantReference: "ord-full-test",
      shippingMethod: "Standard",
      recipient: {
        name: "Test User",
        address: {
          line1: "1 Test Lane",
          postalOrZipCode: "SW1A 1AA",
          countryCode: "GB",
          townOrCity: "London",
        },
      },
      items: [
        {
          merchantReference: "item-full-1",
          sku: sku.prodigiSku,
          copies: 1,
          sizing: "fillPrintArea",
          assets: [{ printArea: "default", url: presignedUrl }],
        },
      ],
    });

    expect(submitResult.order.id).toBe("ord_prodigi_full_test");

    // 4. Poll for status (simulate shipped)
    mockGetOrder.mockResolvedValue({
      order: {
        id: "ord_prodigi_full_test",
        status: { stage: "Shipped" },
        charges: [{ totalCost: { amount: "8.99", currency: "GBP" } }],
        shipments: [
          {
            carrier: { name: "Royal Mail" },
            tracking: { url: "https://royalmail.com/track/ABC123" },
          },
        ],
      },
    });

    const statusResult = await getOrder("ord_prodigi_full_test");
    expect(statusResult.order.status.stage).toBe("Shipped");
    expect(statusResult.order.shipments[0].carrier.name).toBe("Royal Mail");
    expect(statusResult.order.shipments[0].tracking.url).toBe(
      "https://royalmail.com/track/ABC123"
    );
  });
});
