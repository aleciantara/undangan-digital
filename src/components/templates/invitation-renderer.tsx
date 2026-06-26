import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { BotanicalGardenTemplate } from "./botanical-garden";
import { JavaneseClassicTemplate } from "./javanese-classic";
import { PhantomOperaTemplate } from "./phantom-opera";

type Props = {
  invitation: SerializedInvitation;
  guest: SerializedGuest | null;
};

export function InvitationRenderer({ invitation, guest }: Props) {
  switch (invitation.templateId) {
    case "botanical-garden":
      return <BotanicalGardenTemplate invitation={invitation} guest={guest} />;
    case "javanese-classic":
      return <JavaneseClassicTemplate invitation={invitation} guest={guest} />;
    case "phantom-opera":
      return <PhantomOperaTemplate invitation={invitation} guest={guest} />;
    default:
      return <BotanicalGardenTemplate invitation={invitation} guest={guest} />;
  }
}
