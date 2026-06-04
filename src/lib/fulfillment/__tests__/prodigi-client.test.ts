import {
  submitOrder,
  getOrder,
  ProdigiApiError,
} from "@/lib/fulfillment/prodigi-client";
import type { ProdigiOrderPayload } from "@/lib/fulfillment/prodigi-client";

// Mock prodigi-config to return test values
jest.mock("@/lib/fulfillment/prodigi-config", () => ({
  getProdigiApiBase: () => "https://api.sandbox.prodigi.com",
  getProdigiApiKey: () => "test-api-key-123",
  PRODIGI_API_BASE: "https://api.sandbox.prodigi.com",
}));

const mockFetch = global.fetch as jest.Mock;

describe("prodigi-client", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("submitOrder", () => {
    const payload: ProdigiOrderPayload = {
      merchantReference: "order-123",
      shippingMethod: "Standard",
      recipient: {
        name: "John Doe",
        address: {
          line1: "123 Main St",
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
          assets: [{ printArea: "default", url: "https://example.com/file.pdf" }],
        },
      ],
    };

    it("sends correct request and returns order response", async () => {
      const mockResponse = {
        order: {
          id: "prd_order_abc123",
          status: { stage: "InProgress" },
          charges: [{ totalCost: { amount: "12.50", currency: "GBP" } }],
          shipments: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await submitOrder(payload);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.sandbox.prodigi.com/v4.0/Orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-api-key-123",
          },
          body: JSON.stringify(payload),
        }
      );

      expect(result).toEqual(mockResponse);
      expect(result.order.id).toBe("prd_order_abc123");
    });

    it("throws ProdigiApiError on non-ok response", async () => {
      const errorBody = {
        statusCode: 400,
        errors: [{ description: "Invalid SKU" }],
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => errorBody,
      });

      await expect(submitOrder(payload)).rejects.toThrow(ProdigiApiError);
      await expect(submitOrder(payload)).rejects.toThrow("Invalid SKU");
    });

    it("handles error response with no errors array", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ statusCode: 500 }),
      });

      await expect(submitOrder(payload)).rejects.toThrow(ProdigiApiError);
    });
  });

  describe("getOrder", () => {
    it("sends correct GET request and returns status response", async () => {
      const mockResponse = {
        order: {
          id: "prd_order_abc123",
          status: { stage: "Shipped" },
          charges: [{ totalCost: { amount: "15.00", currency: "GBP" } }],
          shipments: [
            {
              carrier: { name: "Royal Mail" },
              tracking: { url: "https://tracking.example.com/123" },
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await getOrder("prd_order_abc123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.sandbox.prodigi.com/v4.0/Orders/prd_order_abc123",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer test-api-key-123",
          },
        }
      );

      expect(result.order.status.stage).toBe("Shipped");
      expect(result.order.shipments[0].carrier.name).toBe("Royal Mail");
    });

    it("throws ProdigiApiError on non-ok response", async () => {
      const errorBody = {
        statusCode: 404,
        errors: [{ description: "Order not found" }],
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => errorBody,
      });

      await expect(getOrder("prd_nonexistent")).rejects.toThrow(
        ProdigiApiError
      );
      await expect(getOrder("prd_nonexistent")).rejects.toThrow(
        "Order not found"
      );
    });
  });
});
