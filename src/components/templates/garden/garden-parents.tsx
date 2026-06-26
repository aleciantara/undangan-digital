"use client";

type Props = {
  groomParents?: string | null;
  brideParents?: string | null;
  accentColor: string;
  primaryColor: string;
};

export function GardenParents({ groomParents, brideParents, accentColor, primaryColor }: Props) {
  if (!groomParents && !brideParents) return null;

  return (
    <div className="garden-parents">
      {groomParents && (
        <div
          className="garden-parents__panel garden-parents__panel--groom garden-card-paper garden-card-paper--tinted"
          style={{ "--panel-color": primaryColor } as React.CSSProperties}
        >
          <p className="garden-parents__label">Mempelai pria</p>
          <p className="garden-parents__name font-invitation">{groomParents}</p>
        </div>
      )}
      {brideParents && (
        <div
          className="garden-parents__panel garden-parents__panel--bride garden-card-paper"
          style={{ "--panel-color": accentColor } as React.CSSProperties}
        >
          <p className="garden-parents__label">Mempelai wanita</p>
          <p className="garden-parents__name font-invitation">{brideParents}</p>
        </div>
      )}
    </div>
  );
}
