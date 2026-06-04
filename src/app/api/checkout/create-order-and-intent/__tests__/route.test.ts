import { POST } from "../route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { NextRequest } from "next/server";

jest.mock("@/lib/auth", () => ({ auth: jest.fn().mockResolvedValue(null) }));
jest.mock("@/lib/stripe", () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: "pi_test",
        client_secret: "pi_test_secret",
      }),
    },
  },
}));

const prismaMock = prisma as typeof prisma & {
  $transaction: jest.Mock;
  user: typeof prisma.user & { upsert: jest.Mock };
};

describe("create-order-and-intent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.user.upsert = jest.fn();
    (prisma.product.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      name: "City Map",
      slug: "city-map",
      description: "Map",
      basePrice: 2999,
      categoryId: 1,
      images: [],
      featured: false,
      bestseller: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      variants: [{ id: 2, productId: 1, name: "A3", sku: "A3", priceModifier: 1000 }],
    });
    prismaMock.user.upsert.mockResolvedValue({ id: "guest-1" });
    (prisma.order.update as jest.Mock).mockResolvedValue({});
    prismaMock.$transaction = jest.fn(async (callback) =>
      callback({
        address: {
          create: jest.fn()
            .mockResolvedValueOnce({ id: "ship-1" })
            .mockResolvedValueOnce({ id: "bill-1" }),
        },
        order: {
          create: jest.fn().mockResolvedValue({
            id: "order-1",
            orderNumber: "MOM-1",
          }),
        },
      })
    );
  });

  it("ignores tampered client prices and charges DB prices", async () => {
    const request = new Request("http://localhost/api/checkout/create-order-and-intent", {
      method: "POST",
      body: JSON.stringify({
        shipping: {
          firstName: "Ada",
          lastName: "Lovelace",
          email: "ada@example.com",
          street: "1 Test St",
          city: "Paris",
          postalCode: "75001",
          country: "DE",
        },
        billing: { sameAsShipping: true },
        items: [{
          productId: 1,
          variantId: 2,
          quantity: 1,
          basePrice: 1,
          variantPrice: 0,
          customizationData: {
            productType: "citymap",
            location: { lat: 48.8566, lng: 2.3522, placeName: "Paris" },
          },
        }],
      }),
    });

    const response = await POST(request as NextRequest);
    expect(response.status).toBe(200);
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 5254,
      }),
      { idempotencyKey: "order-1" }
    );
  });
});
