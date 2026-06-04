// Run: node scripts/test-r2.mjs
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error("Missing R2 env vars");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const key = `_smoke-test/${Date.now()}.txt`;

try {
  await client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: Buffer.from("momenterie r2 smoke test"),
    ContentType: "text/plain",
  }));
  console.log(`OK  uploaded  → ${key}`);

  await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
  console.log(`OK  deleted   → ${key}`);
  console.log("R2 bucket reachable.");
} catch (err) {
  console.error("R2 error:", err.message ?? err);
  process.exit(1);
}
