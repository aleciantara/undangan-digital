import { formatEventDate, formatEventTime } from "@/lib/format";
import type { SerializedEvent } from "@/lib/invitation-types";
import { Calendar, MapPin, Navigation, Shirt } from "lucide-react";

type Props = { event: SerializedEvent; accentColor: string };

export function EventCard({ event, accentColor }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-batik-brown/15 bg-white/90 shadow-md backdrop-blur">
      <div className="h-1.5" style={{ backgroundColor: accentColor }} />
      <div className="p-6 sm:p-8">
        <h3 className="font-invitation text-2xl font-semibold text-batik-dark">{event.name}</h3>
        {event.nameEn && (
          <p className="mt-1 text-sm italic text-batik-brown/70">{event.nameEn}</p>
        )}

        <div className="mt-5 space-y-3 text-sm text-stone-700">
          <div className="flex gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-batik-brown" />
            <div>
              <p className="font-medium">{formatEventDate(event.date)}</p>
              <p className="text-batik-brown/80">Pukul {formatEventTime(event.date)} WIB</p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-batik-brown" />
            <div>
              <p className="font-medium">{event.venue}</p>
              <p className="text-batik-brown/80">{event.address}</p>
            </div>
          </div>

          {event.dresscode && (
            <div className="flex gap-3">
              <Shirt className="mt-0.5 h-4 w-4 shrink-0 text-batik-brown" />
              <p>Dress code: {event.dresscode}</p>
            </div>
          )}

          {event.notes && <p className="rounded-lg bg-batik-cream/50 px-3 py-2 text-batik-brown">{event.notes}</p>}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {event.mapsUrl && (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-batik-brown/20 px-3 py-2 text-sm font-medium text-batik-brown transition hover:bg-batik-cream"
            >
              <MapPin className="h-4 w-4" />
              Google Maps
            </a>
          )}
          {event.wazeUrl && (
            <a
              href={event.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-batik-brown/20 px-3 py-2 text-sm font-medium text-batik-brown transition hover:bg-batik-cream"
            >
              <Navigation className="h-4 w-4" />
              Waze
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
