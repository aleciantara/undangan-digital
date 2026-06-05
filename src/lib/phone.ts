/** Normalize Indonesian mobile numbers to 62xxxxxxxxxx for comparison. */
export function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  while (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length < 9) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return `62${digits}`;
}

export function isValidIndonesianPhone(phone: string): boolean {
  const n = normalizePhone(phone);
  return n.length >= 10 && n.length <= 15;
}
