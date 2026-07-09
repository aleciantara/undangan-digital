"use client";

import { GiftSectionGrid } from "@/components/invitation/gift-section-grid";
import {
  DEFAULT_GIFT_INTRO,
  giftAddressFromInvitation,
  giftBankFromInvitation,
  hasAnyGiftContent,
} from "@/lib/gift-types";
import type { SerializedInvitation } from "@/lib/invitation-types";
import { HimmelReveal } from "./himmel-reveal";
import { HimmelSectionHeading } from "./himmel-section-heading";

type Props = {
  invitation: Pick<
    SerializedInvitation,
    | "groomName"
    | "brideName"
    | "giftTitle"
    | "giftMessage"
    | "giftGroomAccountName"
    | "giftGroomBank"
    | "giftGroomAccountNumber"
    | "giftBrideAccountName"
    | "giftBrideBank"
    | "giftBrideAccountNumber"
    | "giftGroomAddressTitle"
    | "giftGroomAddressFull"
    | "giftBrideAddressTitle"
    | "giftBrideAddressFull"
  >;
  accentColor: string;
  primaryColor: string;
  sectionIndex?: string;
};

export function HimmelGiftSection({ invitation, accentColor, primaryColor, sectionIndex }: Props) {
  const { groom: groomBank, bride: brideBank } = giftBankFromInvitation(invitation);
  const { groom: groomAddress, bride: brideAddress } = giftAddressFromInvitation(invitation);
  const intro = invitation.giftMessage?.trim() || DEFAULT_GIFT_INTRO;

  const details = {
    giftEnabled: true,
    giftTitle: invitation.giftTitle,
    giftMessage: invitation.giftMessage,
    groomBank,
    brideBank,
    groomAddress,
    brideAddress,
  };

  if (!hasAnyGiftContent(details) && !intro) return null;

  return (
    <div className="himmel-gift px-4 py-16 sm:py-20">
      <HimmelSectionHeading
        index={sectionIndex}
        accentColor={accentColor}
        primaryColor={primaryColor}
        align="center"
      >
        {invitation.giftTitle?.trim() || "Kirim Kado"}
      </HimmelSectionHeading>
      <HimmelReveal variant="up">
        <div className="himmel-panel mx-auto mt-10 max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
          <GiftSectionGrid
            theme="himmel"
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            intro={intro}
            groomBank={groomBank}
            brideBank={brideBank}
            groomAddress={groomAddress}
            brideAddress={brideAddress}
          />
        </div>
      </HimmelReveal>
    </div>
  );
}
