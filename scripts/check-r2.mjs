import { S3Client, ListBucketsCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

try {
  const r = await client.send(new ListBucketsCommand({}));
  console.log("Buckets visible:", r.Buckets?.map(b => b.Name));
} catch (e) {
  console.log("ListBuckets:", e.Code || e.message);
}

try {
  await client.send(new HeadBucketCommand({ Bucket: R2_BUCKET_NAME }));
  console.log("Bucket exists:", R2_BUCKET_NAME);
} catch (e) {
  const status = e && e.$metadata && e.$metadata.httpStatusCode;
  console.log(`HeadBucket (${R2_BUCKET_NAME}): HTTP ${status} — ${e.Code || e.message}`);
}
