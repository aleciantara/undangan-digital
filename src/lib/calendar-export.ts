import type { SerializedEvent } from "@/lib/invitation-types";

function formatIcsUtc(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildGoogleCalendarUrl(
  event: SerializedEvent,
  options?: { coupleNames?: string }
): string {
  const start = new Date(event.date);
  const end = event.endTime
    ? new Date(event.endTime)
    : new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const title = options?.coupleNames
    ? `${event.name} — ${options.coupleNames}`
    : event.name;

  const details = [event.venue, event.address, event.dresscodeAttire || event.dresscode]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatIcsUtc(start.toISOString())}/${formatIcsUtc(end.toISOString())}`,
    location: `${event.venue}, ${event.address}`,
    details,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsFileContent(
  event: SerializedEvent,
  options?: { coupleNames?: string }
): string {
  const start = new Date(event.date);
  const end = event.endTime
    ? new Date(event.endTime)
    : new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const title = options?.coupleNames
    ? `${event.name} — ${options.coupleNames}`
    : event.name;

  const description = [event.venue, event.address, event.dresscodeAttire || event.dresscode]
    .filter(Boolean)
    .join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Undangan Digital//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@undangan-digital`,
    `DTSTAMP:${formatIcsUtc(new Date().toISOString())}`,
    `DTSTART:${formatIcsUtc(start.toISOString())}`,
    `DTEND:${formatIcsUtc(end.toISOString())}`,
    `SUMMARY:${escapeIcs(title)}`,
    `LOCATION:${escapeIcs(`${event.venue}, ${event.address}`)}`,
    description ? `DESCRIPTION:${escapeIcs(description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadIcsFile(event: SerializedEvent, options?: { coupleNames?: string }) {
  const content = buildIcsFileContent(event, options);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.name.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
