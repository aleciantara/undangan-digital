export type InviteVersePresetId =
  | "islam"
  | "kristen"
  | "katolik"
  | "hindu"
  | "buddha"
  | "konghucu"
  | "custom";

export const INVITE_VERSE_PRESETS: {
  id: InviteVersePresetId;
  label: string;
  title: string;
  text: string;
}[] = [
  {
    id: "islam",
    label: "Islam",
    title: "Walimatul Urs",
    text: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan putra-putri kami.",
  },
  {
    id: "kristen",
    label: "Kristen",
    title: "Undangan Pernikahan",
    text: "Dengan kasih dan berkat Tuhan Yesus Kristus, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa restu pada pernikahan putra-putri kami.",
  },
  {
    id: "katolik",
    label: "Katolik",
    title: "Undangan Sakramen Pernikahan",
    text: "Dengan memohon berkat Tuhan Yang Maha Esa, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa pada perayaan sakramen pernikahan putra-putri kami.",
  },
  {
    id: "hindu",
    label: "Hindu",
    title: "Undangan Pawiwahan",
    text: "Om Swastyastu. Dengan rahmat Ida Sang Hyang Widhi Wasa, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa restu pada upacara pawiwahan putra-putri kami.",
  },
  {
    id: "buddha",
    label: "Buddha",
    title: "Undangan Pernikahan",
    text: "Om Swastyastu. Dengan berkah Sang Hyang Adi Buddha, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa restu pada pernikahan putra-putri kami.",
  },
  {
    id: "konghucu",
    label: "Konghucu",
    title: "Undangan Pernikahan",
    text: "Dengan memohon berkat Tian dan kasih sayang leluhur, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa restu pada pernikahan putra-putri kami.",
  },
  {
    id: "custom",
    label: "Kustom",
    title: "Walimatul Urs",
    text: "",
  },
];

export function getInviteVersePreset(id: string | null | undefined) {
  return INVITE_VERSE_PRESETS.find((p) => p.id === id) ?? INVITE_VERSE_PRESETS[0];
}

export function resolveInviteVerse(invitation: {
  inviteVerseTitle?: string | null;
  inviteVersePreset?: string | null;
  inviteVerseText?: string | null;
}): { title: string; text: string; preset: InviteVersePresetId } {
  const presetId = (invitation.inviteVersePreset ?? "islam") as InviteVersePresetId;
  const preset = getInviteVersePreset(presetId);
  const customText = invitation.inviteVerseText?.trim();

  if (presetId === "custom" && customText) {
    return {
      title: invitation.inviteVerseTitle?.trim() || preset.title,
      text: customText,
      preset: presetId,
    };
  }

  if (customText) {
    return {
      title: invitation.inviteVerseTitle?.trim() || preset.title,
      text: customText,
      preset: presetId,
    };
  }

  return {
    title: invitation.inviteVerseTitle?.trim() || preset.title,
    text: preset.text,
    preset: presetId,
  };
}

export const DEFAULT_GIFT_MESSAGE =
  "Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan hadiah terindah bagi kami. Tanpa mengurangi rasa hormat, kami tidak membuka nomor rekening maupun alamat pengiriman hadiah fisik.";
