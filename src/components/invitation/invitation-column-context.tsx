"use client";

import { createContext, useContext } from "react";

const InvitationColumnContext = createContext(false);

export function InvitationColumnProvider({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <InvitationColumnContext.Provider value={active}>{children}</InvitationColumnContext.Provider>
  );
}

/** True when invitation runs in a narrow portrait column on desktop (landscape side fill). */
export function useDesktopPortraitColumn() {
  return useContext(InvitationColumnContext);
}
