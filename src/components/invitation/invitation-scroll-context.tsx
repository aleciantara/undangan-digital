"use client";

import { createContext, useContext, type RefObject } from "react";

type InvitationScrollContextValue = {
  scrollRef: RefObject<HTMLElement | null>;
  revealsActive: boolean;
};

const InvitationScrollContext = createContext<InvitationScrollContextValue | null>(null);

export function InvitationScrollProvider({
  children,
  scrollRef,
  revealsActive,
}: {
  children: React.ReactNode;
  scrollRef: RefObject<HTMLElement | null>;
  revealsActive: boolean;
}) {
  return (
    <InvitationScrollContext.Provider value={{ scrollRef, revealsActive }}>
      {children}
    </InvitationScrollContext.Provider>
  );
}

export function useInvitationScroll() {
  return useContext(InvitationScrollContext);
}
