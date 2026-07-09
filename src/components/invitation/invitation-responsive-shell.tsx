"use client";

import { InvitationColumnProvider } from "@/components/invitation/invitation-column-context";

type Props = {
  backdropUrl: string | null;
  enabled: boolean;
  children: React.ReactNode;
};

/** Desktop: full landscape image on the left, invitation column on the right (no overlap). */
export function InvitationResponsiveShell({ backdropUrl, enabled, children }: Props) {
  if (!enabled || !backdropUrl) {
    return <InvitationColumnProvider active={false}>{children}</InvitationColumnProvider>;
  }

  return (
    <InvitationColumnProvider active>
      <div className="invitation-responsive-shell">
        <div className="invitation-responsive-shell__backdrop" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={backdropUrl} alt="" className="invitation-responsive-shell__backdrop-img" />
        </div>
        <div className="invitation-responsive-shell__column">{children}</div>
      </div>
    </InvitationColumnProvider>
  );
}
