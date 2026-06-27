export type GiftBankInfo = {
  accountName: string | null;
  bank: string | null;
  accountNumber: string | null;
};

export type GiftAddressInfo = {
  title: string | null;
  fullAddress: string | null;
};

export type GiftDetails = {
  giftEnabled: boolean;
  giftTitle: string | null;
  giftMessage: string | null;
  groomBank: GiftBankInfo;
  brideBank: GiftBankInfo;
  groomAddress: GiftAddressInfo;
  brideAddress: GiftAddressInfo;
};

export function giftBankFromInvitation(inv: {
  giftGroomAccountName?: string | null;
  giftGroomBank?: string | null;
  giftGroomAccountNumber?: string | null;
  giftBrideAccountName?: string | null;
  giftBrideBank?: string | null;
  giftBrideAccountNumber?: string | null;
}): { groom: GiftBankInfo; bride: GiftBankInfo } {
  return {
    groom: {
      accountName: inv.giftGroomAccountName ?? null,
      bank: inv.giftGroomBank ?? null,
      accountNumber: inv.giftGroomAccountNumber ?? null,
    },
    bride: {
      accountName: inv.giftBrideAccountName ?? null,
      bank: inv.giftBrideBank ?? null,
      accountNumber: inv.giftBrideAccountNumber ?? null,
    },
  };
}

export function giftAddressFromInvitation(inv: {
  giftGroomAddressTitle?: string | null;
  giftGroomAddressFull?: string | null;
  giftBrideAddressTitle?: string | null;
  giftBrideAddressFull?: string | null;
}): { groom: GiftAddressInfo; bride: GiftAddressInfo } {
  return {
    groom: {
      title: inv.giftGroomAddressTitle ?? null,
      fullAddress: inv.giftGroomAddressFull ?? null,
    },
    bride: {
      title: inv.giftBrideAddressTitle ?? null,
      fullAddress: inv.giftBrideAddressFull ?? null,
    },
  };
}

export function hasGiftBank(info: GiftBankInfo): boolean {
  return Boolean(
    info.accountName?.trim() || info.bank?.trim() || info.accountNumber?.trim()
  );
}

export function hasGiftAddress(info: GiftAddressInfo): boolean {
  return Boolean(info.title?.trim() || info.fullAddress?.trim());
}

export function hasAnyGiftContent(details: GiftDetails): boolean {
  return (
    hasGiftBank(details.groomBank) ||
    hasGiftBank(details.brideBank) ||
    hasGiftAddress(details.groomAddress) ||
    hasGiftAddress(details.brideAddress)
  );
}

export const DEFAULT_GIFT_INTRO =
  "Tanpa mengurangi rasa hormat, berikut informasi untuk mengirimkan tanda kasih kepada mempelai.";

function emptyToNull(v: string | undefined | null): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

export function normalizeGiftFields(body: Record<string, unknown>) {
  return {
    giftGroomAccountName: emptyToNull(body.giftGroomAccountName as string),
    giftGroomBank: emptyToNull(body.giftGroomBank as string),
    giftGroomAccountNumber: emptyToNull(body.giftGroomAccountNumber as string),
    giftBrideAccountName: emptyToNull(body.giftBrideAccountName as string),
    giftBrideBank: emptyToNull(body.giftBrideBank as string),
    giftBrideAccountNumber: emptyToNull(body.giftBrideAccountNumber as string),
    giftGroomAddressTitle: emptyToNull(body.giftGroomAddressTitle as string),
    giftGroomAddressFull: emptyToNull(body.giftGroomAddressFull as string),
    giftBrideAddressTitle: emptyToNull(body.giftBrideAddressTitle as string),
    giftBrideAddressFull: emptyToNull(body.giftBrideAddressFull as string),
  };
}
