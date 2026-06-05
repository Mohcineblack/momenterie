import { getPresignedProductionUrl } from "../presign";

// Mock the S3 client and presigner
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({})),
  GetObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("https://presigned.example.com/file.pdf?token=abc123"),
}));

describe("getPresignedProductionUrl", () => {
  beforeEach(() => {
    process.env.R2_ENDPOINT = "https://test.r2.cloudflarestorage.com";
    process.env.R2_ACCESS_KEY_ID = "test-key-id";
    process.env.R2_SECRET_ACCESS_KEY = "test-secret-key";
  });

  afterEach(() => {
    delete process.env.R2_ENDPOINT;
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
  });

  it("returns a presigned URL for r2:// input", async () => {
    const result = await getPresignedProductionUrl(
      "r2://momenterie-production/orders/abc123/item-1.pdf"
    );
    expect(result).toBe("https://presigned.example.com/file.pdf?token=abc123");

    const { GetObjectCommand } = require("@aws-sdk/client-s3");
    expect(GetObjectCommand).toHaveBeenCalledWith({
      Bucket: "momenterie-production",
      Key: "orders/abc123/item-1.pdf",
    });

    const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        input: {
          Bucket: "momenterie-production",
          Key: "orders/abc123/item-1.pdf",
        },
      }),
      { expiresIn: 24 * 60 * 60 }
    );
  });

  it("returns https:// URLs as-is (pass-through)", async () => {
    const url = "https://cdn.example.com/file.pdf";
    const result = await getPresignedProductionUrl(url);
    expect(result).toBe(url);
  });

  it("throws for empty input", async () => {
    await expect(getPresignedProductionUrl("")).rejects.toThrow(
      /productionFileUrl is required/
    );
  });

  it("throws for invalid URL format", async () => {
    await expect(
      getPresignedProductionUrl("file:///local/path.pdf")
    ).rejects.toThrow(/Invalid production file URL format/);
  });

  it("throws for malformed r2:// URL without key", async () => {
    await expect(
      getPresignedProductionUrl("r2://bucket-only")
    ).rejects.toThrow(/Invalid production file URL format/);
  });
});
