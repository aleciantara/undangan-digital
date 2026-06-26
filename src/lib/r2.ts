import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const PLACEHOLDER_RE = /^(your-|xxxxxxxx|re_x+$)/i;

function isRealEnvValue(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  return !PLACEHOLDER_RE.test(value.trim());
}

export function isR2Configured(): boolean {
  return (
    isRealEnvValue(process.env.R2_ACCOUNT_ID) &&
    isRealEnvValue(process.env.R2_ACCESS_KEY_ID) &&
    isRealEnvValue(process.env.R2_SECRET_ACCESS_KEY) &&
    isRealEnvValue(process.env.R2_BUCKET_NAME) &&
    isRealEnvValue(process.env.R2_PUBLIC_URL)
  );
}

function getR2Client(): S3Client {
  if (!isR2Configured()) {
    throw new Error("R2 storage belum dikonfigurasi");
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  const publicUrl = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");
  return `${publicUrl}/${key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    })
  );
}

/** Extract object key from a public R2 URL, or null if external. */
export function keyFromPublicUrl(url: string): string | null {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!base || !url.startsWith(base + "/")) return null;
  return url.slice(base.length + 1);
}
