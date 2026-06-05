/** Build wa.me link for Indonesian numbers (08xx → 628xx). */
export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) return null;

  let intl = digits;
  if (digits.startsWith("0")) intl = `62${digits.slice(1)}`;
  else if (!digits.startsWith("62")) intl = `62${digits}`;

  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

export function buildGuestInviteMessage(
  guestName: string,
  groomName: string,
  brideName: string,
  inviteUrl: string
): string {
  return `Yth. ${guestName},\n\nKami mengundang Anda pada pernikahan ${groomName} & ${brideName}.\n\nBuka undangan:\n${inviteUrl}\n\nMerupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir. Terima kasih.`;
}
