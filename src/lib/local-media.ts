import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

function localUploadRoot(): string {
  return path.join(process.cwd(), "public", "uploads");
}

/**
 * Local disk storage — default when R2 is not set up.
 * Works on Laragon, VPS, Docker, etc. Not for Vercel/serverless (no persistent disk).
 */
export function canUseLocalMediaStorage(r2Configured = false): boolean {
  if (process.env.ALLOW_LOCAL_MEDIA_UPLOAD === "false") return false;
  if (process.env.ALLOW_LOCAL_MEDIA_UPLOAD === "true") return true;
  if (process.env.VERCEL) return false;
  if (!r2Configured) return true;
  return process.env.NODE_ENV === "development";
}

export async function uploadToLocal(key: string, body: Buffer): Promise<string> {
  const filePath = path.join(localUploadRoot(), key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, body);
  return `/uploads/${key}`;
}

export async function deleteFromLocal(key: string): Promise<void> {
  const filePath = path.join(localUploadRoot(), key);
  await unlink(filePath).catch(() => undefined);
}

/** `/uploads/...` or full app URL → object key under uploads/ */
export function keyFromLocalUrl(url: string): string | null {
  const pathname = url.startsWith("/") ? url : tryPathname(url);
  if (!pathname?.startsWith("/uploads/")) return null;
  return pathname.slice("/uploads/".length);
}

function tryPathname(url: string): string | null {
  try {
    return new URL(url).pathname;
  } catch {
    return null;
  }
}
