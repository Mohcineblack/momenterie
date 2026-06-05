import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

try {
  await client.send(new CreateBucketCommand({ Bucket: R2_BUCKET_NAME }));
  console.log(`Bucket created: ${R2_BUCKET_NAME}`);
} catch (e) {
  if (e.Code === "BucketAlreadyOwnedByYou" || e.Code === "BucketAlreadyExists") {
    console.log(`Bucket already exists: ${R2_BUCKET_NAME}`);
  } else {
    console.error("Error:", e.Code || e.message);
    process.exit(1);
  }
}
