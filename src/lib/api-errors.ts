export function parseApiError(
  data: { error?: unknown; message?: unknown; fields?: Record<string, string[]> },
  fallback = "Terjadi kesalahan. Coba lagi."
): string {
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  if (data.fields) {
    const first = Object.values(data.fields).flat()[0];
    if (first) return first;
  }
  return fallback;
}

export function hasBodyKey(body: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(body, key);
}
