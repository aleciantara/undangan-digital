import { eventsWithDresscode } from "@/lib/dresscode-colors";
import type { SerializedEvent } from "@/lib/invitation-types";

export type InvitationNumberedSection =
  | "events"
  | "dresscode"
  | "gallery"
  | "video"
  | "gift"
  | "rsvp"
  | "wishes";

export type SectionNumberMap = Partial<Record<InvitationNumberedSection, string>>;

type SectionNumberInput = {
  events: SerializedEvent[];
  photos: unknown[];
  prewedVideoUrl?: string | null;
  liveStreamUrl?: string | null;
  giftEnabled?: boolean;
};

/** Assigns sequential section numbers (01, 02, …) based on which blocks are visible. */
export function buildInvitationSectionNumbers(input: SectionNumberInput): SectionNumberMap {
  const visible: InvitationNumberedSection[] = [];

  if (input.events.length > 0) visible.push("events");
  if (eventsWithDresscode(input.events).length > 0) visible.push("dresscode");
  if (input.photos.length > 0) visible.push("gallery");
  if (input.prewedVideoUrl || input.liveStreamUrl) visible.push("video");
  if (input.giftEnabled) visible.push("gift");
  visible.push("rsvp", "wishes");

  const result: SectionNumberMap = {};
  visible.forEach((key, index) => {
    result[key] = String(index + 1).padStart(2, "0");
  });
  return result;
}
