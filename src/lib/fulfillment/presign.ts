import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const PRESIGN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 hours

function getR2Client(): S3Client {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY are required"
    );
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Given a production file URL (r2://bucket/key format), returns a presigned
 * HTTPS URL that Prodigi can use to fetch the asset.
 *
 * If the URL is already an https:// URL, it is returned as-is (pass-through).
 *
 * @throws Error if the URL format is invalid or R2 credentials are missing
 */
export async function getPresignedProductionUrl(
  productionFileUrl: string
): Promise<string> {
  if (!productionFileUrl) {
    throw new Error("productionFileUrl is required");
  }

  // Pass-through for already-public HTTPS URLs
  if (productionFileUrl.startsWith("https://")) {
    return productionFileUrl;
  }

  // Parse r2://bucket/key format
  const r2Match = productionFileUrl.match(/^r2:\/\/([^/]+)\/(.+)$/);
  if (!r2Match) {
    throw new Error(
      `Invalid production file URL format: "${productionFileUrl}". Expected "r2://<bucket>/<key>" or "https://..."`
    );
  }

  const [, bucket, key] = r2Match;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const client = getR2Client();
  return getSignedUrl(client, command, { expiresIn: PRESIGN_EXPIRY_SECONDS });
}
