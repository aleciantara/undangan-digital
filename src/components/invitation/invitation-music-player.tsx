"use client";

import dynamic from "next/dynamic";
import type { MusicPlayerHandle } from "@/components/invitation/music-player-handle";
import { forwardRef } from "react";

const MusicPlayer = dynamic(
  () => import("@/components/invitation/music-player").then((m) => m.MusicPlayer),
  { ssr: false }
);

type Props = {
  url: string;
  title?: string | null;
  autoplay?: boolean;
  startSec?: number;
  accentColor?: string;
  startOnGesture?: boolean;
  showControls?: boolean;
};

export const InvitationMusicPlayer = forwardRef<MusicPlayerHandle, Props>(
  function InvitationMusicPlayer(props, ref) {
    return <MusicPlayer {...props} ref={ref} />;
  }
);
