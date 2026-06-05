import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { JavaneseClassicTemplate } from "./javanese-classic";

type Props = {
  invitation: SerializedInvitation;
  guest: SerializedGuest | null;
};

export function InvitationRenderer({ invitation, guest }: Props) {
  switch (invitation.templateId) {
    case "javanese-classic":
    default:
      return <JavaneseClassicTemplate invitation={invitation} guest={guest} />;
  }
}
