"use client";

import { EnvelopeCover } from "@/components/invitation/envelope-cover";
import { InvitationScrollProvider } from "@/components/invitation/invitation-scroll-context";
import { InvitationMusicPlayer } from "@/components/invitation/invitation-music-player";
import type { MusicPlayerHandle } from "@/components/invitation/music-player-handle";
import { useImagePreload } from "@/hooks/use-image-preload";
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
  envelopeTheme?: "default" | "phantom" | "raoul" | "himmel";
  headerText?: string;
  hintText?: string;
  music?: MusicConfig | null;
  /** Critical above-the-fold image URLs to warm while the envelope animates. */
  preloadImages?: string[];
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
  envelopeTheme = "default",
  headerText,
  hintText,
  music,
  preloadImages,
  children,
}: Props) {
  const musicRef = useRef<MusicPlayerHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("envelope");
  const [mounted, setMounted] = useState(false);
  const [envelopeDone, setEnvelopeDone] = useState(false);

  const preloadReady = useImagePreload(preloadImages ?? [], { enabled: mounted });

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
    setEnvelopeDone(true);
  }, []);

  // Reveal once the envelope finishes AND the critical images are warm. A short
  // fallback ensures a slow image never traps the guest on the spinner.
  useEffect(() => {
    if (!envelopeDone || phase === "open") return;
    if (preloadReady) {
      setPhase("open");
      return;
    }
    const fallback = window.setTimeout(() => setPhase("open"), 2500);
    return () => window.clearTimeout(fallback);
  }, [envelopeDone, preloadReady, phase]);

  if (!mounted) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          envelopeTheme === "phantom"
            ? "env-overlay env-theme-phantom"
            : envelopeTheme === "raoul"
              ? "env-overlay env-theme-raoul"
              : envelopeTheme === "himmel"
                ? "env-overlay env-theme-himmel"
                : "env-marble"
        }`}
      >
        <p
          className={`text-sm ${
            envelopeTheme === "phantom"
              ? "text-[#8a6a72]"
              : envelopeTheme === "raoul"
                ? "text-[#7a6e58]"
                : envelopeTheme === "himmel"
                  ? "text-[#6b8ab0]"
                  : "text-stone-500"
          }`}
        >
          Memuat undangan…
        </p>
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
          envelopeTheme={envelopeTheme}
          headerText={headerText}
          hintText={hintText}
          onOpen={handleEnvelopeOpen}
          onComplete={handleEnvelopeComplete}
        />
      )}

      {envelopeDone && phase !== "open" && (
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center ${
            envelopeTheme === "phantom"
              ? "env-overlay env-theme-phantom"
              : envelopeTheme === "raoul"
                ? "env-overlay env-theme-raoul"
                : envelopeTheme === "himmel"
                  ? "env-overlay env-theme-himmel"
                  : "env-marble"
          }`}
          aria-live="polite"
        >
          <span
            className="h-9 w-9 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ color: accentColor }}
            role="status"
            aria-label="Memuat undangan"
          />
        </div>
      )}

      <InvitationScrollProvider scrollRef={scrollRef} revealsActive={phase === "open"}>
        <div
          ref={scrollRef}
          className={
            phase === "open"
              ? envelopeTheme === "phantom"
                ? "invitation-content--phantom-reveal invitation-content--snap-mobile"
                : envelopeTheme === "raoul"
                  ? "invitation-content--raoul-reveal invitation-content--snap-mobile"
                  : envelopeTheme === "himmel"
                    ? "invitation-content--himmel-reveal"
                    : "invitation-content--revealed"
              : "pointer-events-none fixed inset-0 overflow-hidden opacity-0"
          }
          aria-hidden={phase !== "open"}
        >
          {children}
        </div>
      </InvitationScrollProvider>
    </>
  );
}
