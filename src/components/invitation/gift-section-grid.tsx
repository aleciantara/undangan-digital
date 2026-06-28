"use client";

import type { GiftAddressInfo, GiftBankInfo } from "@/lib/gift-types";
import { hasGiftAddress, hasGiftBank } from "@/lib/gift-types";

type Props = {
  theme: "raoul" | "phantom" | "himmel";
  groomName: string;
  brideName: string;
  intro: string;
  groomBank: GiftBankInfo;
  brideBank: GiftBankInfo;
  groomAddress: GiftAddressInfo;
  brideAddress: GiftAddressInfo;
};

function BankCard({
  theme,
  label,
  info,
}: {
  theme: "raoul" | "phantom" | "himmel";
  label: string;
  info: GiftBankInfo;
}) {
  if (!hasGiftBank(info)) return null;

  return (
    <div className={`${theme}-gift__card`}>
      <p className={`${theme}-gift__card-label`}>{label}</p>
      {info.accountName?.trim() && (
        <p className={`${theme}-gift__row`}>
          <span className={`${theme}-gift__key`}>Nama</span>
          <span className={`${theme}-gift__val font-invitation`}>{info.accountName}</span>
        </p>
      )}
      {info.bank?.trim() && (
        <p className={`${theme}-gift__row`}>
          <span className={`${theme}-gift__key`}>Bank</span>
          <span className={`${theme}-gift__val`}>{info.bank}</span>
        </p>
      )}
      {info.accountNumber?.trim() && (
        <p className={`${theme}-gift__row`}>
          <span className={`${theme}-gift__key`}>No. rekening</span>
          <span className={`${theme}-gift__val font-mono tracking-wide`}>{info.accountNumber}</span>
        </p>
      )}
    </div>
  );
}

function AddressCard({
  theme,
  fallbackLabel,
  info,
}: {
  theme: "raoul" | "phantom" | "himmel";
  fallbackLabel: string;
  info: GiftAddressInfo;
}) {
  if (!hasGiftAddress(info)) return null;

  return (
    <div className={`${theme}-gift__card`}>
      <p className={`${theme}-gift__card-label`}>{info.title?.trim() || fallbackLabel}</p>
      {info.fullAddress?.trim() && (
        <p className={`${theme}-gift__address font-invitation`}>{info.fullAddress}</p>
      )}
    </div>
  );
}

export function GiftSectionGrid({
  theme,
  groomName,
  brideName,
  intro,
  groomBank,
  brideBank,
  groomAddress,
  brideAddress,
}: Props) {
  const showBanks = hasGiftBank(groomBank) || hasGiftBank(brideBank);
  const showAddresses = hasGiftAddress(groomAddress) || hasGiftAddress(brideAddress);

  return (
    <div className={`${theme}-gift__body`}>
      {intro && <p className={`${theme}-gift__intro font-invitation`}>{intro}</p>}

      {showBanks && (
        <div className={`${theme}-gift__grid`}>
          <BankCard theme={theme} label={`Rekening ${groomName}`} info={groomBank} />
          <BankCard theme={theme} label={`Rekening ${brideName}`} info={brideBank} />
        </div>
      )}

      {showAddresses && (
        <div className={`${theme}-gift__grid ${showBanks ? "mt-4" : ""}`}>
          <AddressCard
            theme={theme}
            fallbackLabel={`Rumah ${groomName}`}
            info={groomAddress}
          />
          <AddressCard
            theme={theme}
            fallbackLabel={`Rumah ${brideName}`}
            info={brideAddress}
          />
        </div>
      )}
    </div>
  );
}
