"use client";

import { parseMusicUrl } from "@/lib/music-embed";
import { loadYoutubeIframeApi, type YTPlayer } from "@/lib/youtube-iframe-api";
import type { MusicPlayerHandle } from "@/components/invitation/music-player-handle";
import { Music, Pause, Play } from "lucide-react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

type Props = {
  url: string;
  title?: string | null;
  autoplay?: boolean;
  startSec?: number;
  accentColor?: string;
  startOnGesture?: boolean;
  showControls?: boolean;
};

export const MusicPlayer = forwardRef<MusicPlayerHandle, Props>(function MusicPlayer(
  {
    url,
    title,
    autoplay = true,
    startSec = 0,
    accentColor = "#D4AF37",
    startOnGesture = false,
    showControls = true,
  },
  ref
) {
  const parsed = parseMusicUrl(url);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const ytInitGenRef = useRef(0);
  const pendingGesturePlayRef = useRef(false);
  const spotifyRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);

  const startAt = Math.max(0, Math.floor(startSec));
  const videoId = parsed?.kind === "youtube" ? parsed.videoId : null;
  const shouldAutoplayOnReady = autoplay && !startOnGesture;

  useEffect(() => {
    setMounted(true);
  }, []);

  const tryYoutubePlay = useCallback(
    (player: YTPlayer, unmute = true) => {
      player.seekTo(startAt, true);
      if (unmute) player.unMute();
      player.playVideo();
    },
    [startAt]
  );

  const playFromUserGesture = useCallback(() => {
    pendingGesturePlayRef.current = true;

    if (parsed?.kind === "youtube") {
      const player = ytPlayerRef.current;
      if (player) {
        tryYoutubePlay(player);
        pendingGesturePlayRef.current = false;
      }
      return;
    }

    if (parsed?.kind === "audio") {
      const audio = audioRef.current;
      if (!audio) return;
      if (startAt > 0) audio.currentTime = startAt;
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      pendingGesturePlayRef.current = false;
      return;
    }

    if (parsed?.kind === "spotify") {
      setSpotifyOpen(true);
      setPlaying(true);
      pendingGesturePlayRef.current = false;
    }
  }, [parsed?.kind, startAt, tryYoutubePlay]);

  useImperativeHandle(ref, () => ({ playFromUserGesture }), [playFromUserGesture]);

  useEffect(() => {
    if (!mounted || !videoId || !ytContainerRef.current) return;

    const gen = ++ytInitGenRef.current;
    let player: YTPlayer | null = null;
    let cancelled = false;

    loadYoutubeIframeApi()
      .then((YT) => {
        if (cancelled || gen !== ytInitGenRef.current || !ytContainerRef.current) return;

        player = new YT.Player(ytContainerRef.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            start: startAt,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            loop: 1,
            playlist: videoId,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled || gen !== ytInitGenRef.current) return;
              ytPlayerRef.current = event.target;

              if (pendingGesturePlayRef.current) {
                tryYoutubePlay(event.target);
                pendingGesturePlayRef.current = false;
                return;
              }

              if (!shouldAutoplayOnReady) return;
              tryYoutubePlay(event.target);
            },
            onStateChange: (event) => {
              if (cancelled || gen !== ytInitGenRef.current) return;
              const { ENDED, PLAYING, PAUSED } = YT.PlayerState;
              if (event.data === ENDED) {
                event.target.seekTo(startAt, true);
                event.target.playVideo();
              } else if (event.data === PLAYING) {
                setPlaying(true);
              } else if (event.data === PAUSED) {
                setPlaying(false);
              }
            },
          },
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      const p = player;
      const destroyGen = gen;
      window.setTimeout(() => {
        if (destroyGen !== ytInitGenRef.current) return;
        try {
          p?.destroy();
        } catch {
          // ignore
        }
        if (ytPlayerRef.current === p) ytPlayerRef.current = null;
      }, 300);
    };
  }, [mounted, videoId, startAt, tryYoutubePlay, shouldAutoplayOnReady]);

  useEffect(() => {
    if (!parsed || parsed.kind !== "audio" || startOnGesture) return;
    const audio = audioRef.current;
    if (!audio || !autoplay) return;

    const tryPlay = () => {
      if (startAt > 0) audio.currentTime = startAt;
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };

    audio.addEventListener("canplay", tryPlay, { once: true });
    return () => audio.removeEventListener("canplay", tryPlay);
  }, [url, autoplay, startAt, parsed, startOnGesture]);

  if (!parsed || !mounted) return null;

  function toggleYoutube() {
    const player = ytPlayerRef.current;
    if (!player) return;
    if (playing) player.pauseVideo();
    else tryYoutubePlay(player);
  }

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (startAt > 0) audio.currentTime = startAt;
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  function handleMainClick() {
    if (parsed!.kind === "youtube") {
      toggleYoutube();
      return;
    }
    if (parsed!.kind === "audio") {
      toggleAudio();
      return;
    }
    setSpotifyOpen((open) => !open);
    setPlaying((p) => !p);
  }

  const displayTitle = title ?? parsed.label;

  return (
    <>
      {parsed.kind === "youtube" && (
        <div
          ref={ytContainerRef}
          className="pointer-events-none fixed overflow-hidden opacity-0"
          style={{ width: 200, height: 200, left: -9999, top: 0 }}
          aria-hidden
        />
      )}

      {parsed.kind === "audio" && (
        <audio
          ref={audioRef}
          src={parsed.embedUrl}
          loop
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}

      {parsed.kind === "spotify" && spotifyOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[min(100vw-2rem,360px)] overflow-hidden rounded-2xl border border-white/40 bg-white shadow-2xl">
          <iframe
            ref={spotifyRef}
            src={`${parsed.embedUrl}${parsed.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
            title={displayTitle}
            width="100%"
            height={152}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block border-0"
          />
        </div>
      )}

      {showControls && (
        <button
          type="button"
          onClick={handleMainClick}
          className="fixed bottom-6 right-6 z-40 flex max-w-[min(100vw-3rem,320px)] items-center gap-2 rounded-full border border-white/40 bg-white/90 py-2.5 pl-2 pr-4 text-sm font-medium text-batik-dark shadow-lg backdrop-blur transition hover:bg-white"
          aria-label={playing ? "Jeda musik" : "Putar musik"}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accentColor}30`, color: accentColor }}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </span>
          <span className="flex min-w-0 items-center gap-1 truncate">
            <Music className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <span className="truncate">{displayTitle}</span>
          </span>
        </button>
      )}
    </>
  );
});
