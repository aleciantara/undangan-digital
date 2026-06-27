import {
  eventDresscodeAttire,
  parseDresscodeColorLabel,
  parseDresscodeColors,
} from "@/lib/dresscode-colors";

type Props = {
  dresscode?: string | null;
  dresscodeColor?: string | null;
  dresscodeAttire?: string | null;
  labelClassName?: string;
  textClassName?: string;
};

export function DresscodeDisplay({
  dresscode,
  dresscodeColor,
  dresscodeAttire,
  labelClassName = "",
  textClassName = "",
}: Props) {
  const attire = eventDresscodeAttire({ dresscode, dresscodeAttire });
  const colors = parseDresscodeColors(dresscodeColor);
  const colorLabel = parseDresscodeColorLabel(dresscodeColor);

  if (!attire && colors.length === 0 && !colorLabel) return null;

  return (
    <div className={textClassName}>
      <span className={labelClassName}>Dress code</span>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <span
            key={color}
            className="inline-block h-5 w-5 shrink-0 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: color }}
            title={color}
            aria-label={`Warna dress code ${color}`}
          />
        ))}
        {colorLabel && <span>{colorLabel}</span>}
        {attire && <span>{attire}</span>}
      </div>
    </div>
  );
}
