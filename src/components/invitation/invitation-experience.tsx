"use client";

import { EnvelopeCover } from "@/components/invitation/envelope-cover";
import { InvitationMusicPlayer } from "@/components/invitation/invitation-music-player";
import type { MusicPlayerHandle } from "@/components/invitation/music-player-handle";
import { useCallback, useEffect, useRef, useState } from "react";

type MusicConfig = {
  url: string;
  title?: string | null;
  autoplay?: boolean;
  startSec?: number;
  accentColor?: string;
};

type Props = {
  slug: string;
  groomName: string;
  brideName: string;
  recipientName: string;
  accentColor: string;
  music?: MusicConfig | null;
  children: React.ReactNode;
};

type Phase = "envelope" | "open";

function storageKey(slug: string) {
  return `invitation-open:${slug}`;
}

export function InvitationExperience({
  slug,
  groomName,
  brideName,
  recipientName,
  accentColor,
  music,
  children,
}: Props) {
  const musicRef = useRef<MusicPlayerHandle>(null);
  const [phase, setPhase] = useState<Phase>("envelope");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(storageKey(slug)) === "1") {
      setPhase("open");
    }
  }, [slug]);

  const handleEnvelopeOpen = useCallback(() => {
    if (music?.autoplay !== false) {
      musicRef.current?.playFromUserGesture();
    }
    sessionStorage.setItem(storageKey(slug), "1");
  }, [music?.autoplay, slug]);

  const handleEnvelopeComplete = useCallback(() => {
    setPhase("open");
  }, []);

  if (!mounted) {
    return (
      <div className="env-marble flex min-h-screen items-center justify-center">
        <p className="text-sm text-stone-500">Memuat undangan…</p>
      </div>
    );
  }

  return (
    <>
      {music && (
        <InvitationMusicPlayer
          ref={musicRef}
          url={music.url}
          title={music.title}
          autoplay={music.autoplay ?? true}
          startSec={music.startSec ?? 0}
          accentColor={music.accentColor ?? accentColor}
          startOnGesture
          showControls={phase === "open"}
        />
      )}

      {phase === "envelope" && (
        <EnvelopeCover
          groomName={groomName}
          brideName={brideName}
          recipientName={recipientName}
          accentColor={accentColor}
          onOpen={handleEnvelopeOpen}
          onComplete={handleEnvelopeComplete}
        />
      )}

      <div
        className={
          phase === "open"
            ? "invitation-content--revealed"
            : "pointer-events-none fixed inset-0 overflow-hidden opacity-0"
        }
        aria-hidden={phase !== "open"}
      >
        {children}
      </div>
    </>
  );
}
