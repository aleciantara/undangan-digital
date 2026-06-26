import {
  canUseLocalMediaStorage,
  deleteFromLocal,
  keyFromLocalUrl,
  uploadToLocal,
} from "@/lib/local-media";
import { deleteFromR2, isR2Configured, keyFromPublicUrl, uploadToR2 } from "@/lib/r2";

export function isMediaUploadAvailable(): boolean {
  return isR2Configured() || canUseLocalMediaStorage(isR2Configured());
}

export async function uploadMedia(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  if (isR2Configured()) {
    return uploadToR2(key, body, contentType);
  }
  if (canUseLocalMediaStorage(isR2Configured())) {
    return uploadToLocal(key, body);
  }
  throw new Error("Media storage is not configured");
}

export async function deleteMedia(url: string): Promise<void> {
  const r2Key = keyFromPublicUrl(url);
  if (r2Key && isR2Configured()) {
    await deleteFromR2(r2Key);
    return;
  }

  const localKey = keyFromLocalUrl(url);
  if (localKey && canUseLocalMediaStorage(isR2Configured())) {
    await deleteFromLocal(localKey);
  }
}
