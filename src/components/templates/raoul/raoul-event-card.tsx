import { AddToCalendarButtons } from "@/components/invitation/add-to-calendar-buttons";
import { formatEventTime } from "@/lib/format";
import type { SerializedEvent } from "@/lib/invitation-types";

type Props = {
  event: SerializedEvent;
  accentColor: string;
  primaryColor: string;
  index: number;
  coupleNames?: string;
};

function parseDateParts(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString("id-ID", { month: "long" });
  const year = d.getFullYear();
  const weekday = d.toLocaleDateString("id-ID", { weekday: "long" });
  return { day, month, year, weekday };
}

export function RaoulEventCard({ event, accentColor, primaryColor, index, coupleNames }: Props) {
  const { day, month, year, weekday } = parseDateParts(event.date);
  const time = formatEventTime(event.date);

  return (
    <article
      className="raoul-event"
      style={
        {
          "--event-accent": accentColor,
          "--event-primary": primaryColor,
        } as React.CSSProperties
      }
    >
      <header className="raoul-event__header">
        <span className="raoul-event__index font-mono">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3 className="raoul-event__title font-invitation">{event.name}</h3>
          {event.nameEn && <p className="raoul-event__subtitle">{event.nameEn}</p>}
        </div>
      </header>

      <div className="raoul-event__body">
        <div className="raoul-event__date">
          <p className="raoul-event__weekday">{weekday}</p>
          <p className="raoul-event__day font-invitation">{day}</p>
          <p className="raoul-event__month">
            {month} {year}
          </p>
          <p className="raoul-event__time">{time} WIB</p>
        </div>

        <div className="raoul-event__detail">
          <p className="raoul-event__venue font-invitation">{event.venue}</p>
          <p className="raoul-event__address">{event.address}</p>

          {event.notes && <p className="raoul-event__notes">{event.notes}</p>}

          <div className="raoul-event__actions">
            <AddToCalendarButtons
              event={event}
              coupleNames={coupleNames}
              linkClassName="raoul-event__link"
            />
            {event.mapsUrl && (
              <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="raoul-event__link">
                Maps →
              </a>
            )}
            {event.wazeUrl && (
              <a href={event.wazeUrl} target="_blank" rel="noopener noreferrer" className="raoul-event__link">
                Waze →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
