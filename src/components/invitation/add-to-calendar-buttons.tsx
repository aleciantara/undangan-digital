"use client";

import { buildGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar-export";
import type { SerializedEvent } from "@/lib/invitation-types";

type Props = {
  event: SerializedEvent;
  coupleNames?: string;
  className?: string;
  linkClassName?: string;
};

export function AddToCalendarButtons({
  event,
  coupleNames,
  className = "",
  linkClassName = "",
}: Props) {
  const googleUrl = buildGoogleCalendarUrl(event, { coupleNames });

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        Google Calendar
      </a>
      <button
        type="button"
        onClick={() => downloadIcsFile(event, { coupleNames })}
        className={linkClassName}
      >
        Unduh .ics
      </button>
    </div>
  );
}
