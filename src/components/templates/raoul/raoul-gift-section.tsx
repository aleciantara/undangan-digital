"use client";

import { GiftSectionGrid } from "@/components/invitation/gift-section-grid";
import {
  DEFAULT_GIFT_INTRO,
  giftAddressFromInvitation,
  giftBankFromInvitation,
  hasAnyGiftContent,
} from "@/lib/gift-types";
import type { SerializedInvitation } from "@/lib/invitation-types";
import { RaoulReveal } from "./raoul-reveal";
import { RaoulSectionHeading } from "./raoul-section-heading";

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

export function RaoulGiftSection({ invitation, accentColor, primaryColor, sectionIndex }: Props) {
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
    <div className="raoul-gift px-4 py-16 sm:py-20">
      <RaoulSectionHeading
        index={sectionIndex}
        accentColor={accentColor}
        primaryColor={primaryColor}
        align="center"
      >
        {invitation.giftTitle?.trim() || "Kirim Kado"}
      </RaoulSectionHeading>
      <RaoulReveal variant="up">
        <div className="raoul-panel mx-auto mt-10 max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
          <GiftSectionGrid
            theme="raoul"
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            intro={intro}
            groomBank={groomBank}
            brideBank={brideBank}
            groomAddress={groomAddress}
            brideAddress={brideAddress}
          />
        </div>
      </RaoulReveal>
    </div>
  );
}
