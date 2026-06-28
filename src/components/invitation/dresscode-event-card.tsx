import {
  eventDresscodeAttire,
  parseDresscodeColorLabel,
  parseDresscodeColors,
} from "@/lib/dresscode-colors";
import type { SerializedEvent } from "@/lib/invitation-types";

type Props = {
  theme: "raoul" | "phantom" | "himmel";
  event: SerializedEvent;
  accentColor: string;
  primaryColor: string;
  index: number;
};

export function DresscodeEventCard({ theme, event, accentColor, primaryColor, index }: Props) {
  const attire = eventDresscodeAttire(event);
  const colors = parseDresscodeColors(event.dresscodeColor);
  const colorLabel = parseDresscodeColorLabel(event.dresscodeColor);

  return (
    <article
      className={`${theme}-dresscode`}
      style={
        {
          "--dresscode-accent": accentColor,
          "--dresscode-primary": primaryColor,
        } as React.CSSProperties
      }
    >
      <header className={`${theme}-dresscode__header`}>
        <span className={`${theme}-dresscode__index font-mono`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className={`${theme}-dresscode__event font-invitation`}>{event.name}</h3>
      </header>

      {(colors.length > 0 || colorLabel) && (
        <div className={`${theme}-dresscode__palette`}>
          <p className={`${theme}-dresscode__palette-label`}>Warna</p>
          <div className={`${theme}-dresscode__colors`}>
            {colors.map((color) => (
              <span key={color} className={`${theme}-dresscode__swatch-wrap`}>
                <span
                  className={`${theme}-dresscode__swatch`}
                  style={{ backgroundColor: color }}
                  title={color}
                  aria-label={`Warna ${color}`}
                />
                <span className={`${theme}-dresscode__hex font-mono`}>{color}</span>
              </span>
            ))}
            {colorLabel && <span className={`${theme}-dresscode__color-label`}>{colorLabel}</span>}
          </div>
        </div>
      )}

      {attire && (
        <div className={`${theme}-dresscode__attire-wrap`}>
          <p className={`${theme}-dresscode__attire-label`}>Pakaian</p>
          <p className={`${theme}-dresscode__attire font-invitation`}>{attire}</p>
        </div>
      )}
    </article>
  );
}
