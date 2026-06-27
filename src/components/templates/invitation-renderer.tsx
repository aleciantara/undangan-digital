import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { PhantomOperaTemplate } from "./phantom-opera";
import { RaoulOperaTemplate } from "./raoul-opera";

type Props = {
  invitation: SerializedInvitation;
  guest: SerializedGuest | null;
};

export function InvitationRenderer({ invitation, guest }: Props) {
  switch (invitation.templateId) {
    case "phantom-opera-daylight":
      return <RaoulOperaTemplate invitation={invitation} guest={guest} />;
    case "phantom-opera":
    default:
      return <PhantomOperaTemplate invitation={invitation} guest={guest} />;
  }
}
