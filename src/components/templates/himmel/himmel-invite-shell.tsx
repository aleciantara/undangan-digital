"use client";

import { useHimmelScrollPerf } from "@/lib/use-himmel-scroll-perf";
import { useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function HimmelInviteShell({ children, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useHimmelScrollPerf(ref);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
