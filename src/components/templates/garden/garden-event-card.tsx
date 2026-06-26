import { formatEventTime } from "@/lib/format";
import type { SerializedEvent } from "@/lib/invitation-types";

type Props = {
  event: SerializedEvent;
  accentColor: string;
  primaryColor: string;
  index: number;
};

function parseDateParts(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString("id-ID", { month: "long" });
  const year = d.getFullYear();
  const weekday = d.toLocaleDateString("id-ID", { weekday: "long" });
  return { day, month, year, weekday };
}

export function GardenEventCard({ event, accentColor, primaryColor, index }: Props) {
  const { day, month, year, weekday } = parseDateParts(event.date);
  const time = formatEventTime(event.date);

  return (
    <div className="garden-card-glass-wrap">
      <article
        className="garden-event garden-card-glass group"
        style={
          {
            "--event-accent": accentColor,
            "--event-primary": primaryColor,
          } as React.CSSProperties
        }
      >
      <header className="garden-event__header">
        <span className="garden-event__index font-mono">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="garden-event__title font-invitation">{event.name}</h3>
          {event.nameEn && <p className="garden-event__subtitle">{event.nameEn}</p>}
        </div>
      </header>

      <div className="garden-event__body">
        <div className="garden-event__date">
          <p className="garden-event__weekday">{weekday}</p>
          <p className="garden-event__day font-invitation">{day}</p>
          <p className="garden-event__month">
            {month} {year}
          </p>
          <p className="garden-event__time">{time} WIB</p>
        </div>

        <div className="garden-event__detail">
          <p className="garden-event__venue font-invitation">{event.venue}</p>
          <p className="garden-event__address">{event.address}</p>

          {event.dresscode && (
            <p className="garden-event__meta">
              <span className="garden-event__meta-label">Dress code</span>
              {event.dresscode}
            </p>
          )}

          {event.notes && (
            <p className="garden-event__notes">{event.notes}</p>
          )}

          <div className="garden-event__actions">
            {event.mapsUrl && (
              <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="garden-event__link">
                Maps →
              </a>
            )}
            {event.wazeUrl && (
              <a href={event.wazeUrl} target="_blank" rel="noopener noreferrer" className="garden-event__link">
                Waze →
              </a>
            )}
          </div>
        </div>
      </div>
      </article>
    </div>
  );
}
