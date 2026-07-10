"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type EnvelopeStep = "back" | "flip" | "open" | "pull" | "exit";

type Props = {
  groomName: string;
  brideName: string;
  recipientName: string;
  accentColor: string;
  onOpen?: () => void;
  onComplete?: () => void;
  /** fullscreen overlay for invitations; embedded for landing/demo */
  variant?: "overlay" | "embedded";
  /** replay animation after sequence (default true when embedded) */
  loop?: boolean;
  hintText?: string;
  headerText?: string;
  /** click for invitations; hover for landing demo */
  activateOn?: "click" | "hover";
  /** landing: bare on page; invitations: themed styling on fullscreen */
  embedTheme?: "default" | "phantom" | "raoul" | "himmel";
  /** themed envelope on fullscreen overlay (invitation templates) */
  envelopeTheme?: "default" | "phantom" | "raoul" | "himmel";
};

const FLIP_MS = 1000;
const OPEN_MS = 1000;
const PULL_MS = 1100;
const RESET_MS = 1400;

export function EnvelopeCover({
  groomName,
  brideName,
  recipientName,
  accentColor,
  onOpen,
  onComplete,
  variant = "overlay",
  loop,
  hintText = "Ketuk amplop untuk membuka undangan",
  headerText = "Undangan Pernikahan",
  activateOn = "click",
  embedTheme = "default",
  envelopeTheme,
}: Props) {
  const [step, setStep] = useState<EnvelopeStep>("back");
  const [instantReset, setInstantReset] = useState(false);
  const startedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const runSequenceRef = useRef<() => void>(() => {});
  const timersRef = useRef<number[]>([]);

  const isEmbedded = variant === "embedded";
  const isPhantom =
    (isEmbedded && embedTheme === "phantom") ||
    (!isEmbedded && (envelopeTheme === "phantom" || embedTheme === "phantom"));
  const isRaoul =
    (isEmbedded && embedTheme === "raoul") ||
    (!isEmbedded && (envelopeTheme === "raoul" || embedTheme === "raoul"));
  const isHimmel =
    (isEmbedded && embedTheme === "himmel") ||
    (!isEmbedded && (envelopeTheme === "himmel" || embedTheme === "himmel"));
  const isThemed = isPhantom || isRaoul || isHimmel;
  const shouldLoop = loop ?? isEmbedded;

  const isFlapOpen = step === "open" || step === "pull" || step === "exit";

  const resetEnvelope = useCallback(() => {
    setInstantReset(true);
    setStep("back");
    startedRef.current = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setInstantReset(false));
    });
    if (activateOn === "hover" && isHoveredRef.current) {
      timersRef.current.push(window.setTimeout(() => runSequenceRef.current(), 350));
    }
  }, [activateOn]);

  const runSequence = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    onOpen?.();

    setStep("flip");
    timersRef.current.push(window.setTimeout(() => setStep("open"), FLIP_MS));
    timersRef.current.push(window.setTimeout(() => setStep("pull"), FLIP_MS + OPEN_MS));
    timersRef.current.push(
      window.setTimeout(() => {
        setStep("exit");
        onComplete?.();
        if (shouldLoop) {
          timersRef.current.push(window.setTimeout(resetEnvelope, RESET_MS));
        }
      }, FLIP_MS + OPEN_MS + PULL_MS)
    );
  }, [onOpen, onComplete, shouldLoop, resetEnvelope]);

  useEffect(() => {
    runSequenceRef.current = runSequence;
  }, [runSequence]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      startedRef.current = false;
    };
  }, []);

  const hint = step === "back" ? hintText : "";
  const isHoverActivated = activateOn === "hover";

  const wrapperClass =
    variant === "overlay"
      ? `env-overlay fixed inset-0 z-50 flex flex-col items-center justify-center px-4 ${isPhantom ? "env-theme-phantom" : ""} ${isRaoul ? "env-theme-raoul" : ""} ${isHimmel ? "env-theme-himmel" : ""} ${step === "exit" && !shouldLoop ? "env-overlay--exit" : ""}`
      : isPhantom
          ? "env-embedded-bare env-theme-phantom relative flex flex-col items-center justify-center py-4 sm:py-6"
          : isRaoul
            ? "env-embedded-bare env-theme-raoul relative flex flex-col items-center justify-center py-4 sm:py-6"
            : isHimmel
              ? "env-embedded-bare env-theme-himmel relative flex flex-col items-center justify-center py-4 sm:py-6"
            : "env-embedded relative flex min-h-[min(420px,70vw)] flex-col items-center justify-center overflow-hidden rounded-[2rem] px-4 py-10 sm:rounded-[3rem] sm:py-12";

  return (
    <div className={wrapperClass}>
      {!isThemed && (
        <div className={`env-marble pointer-events-none absolute inset-0 ${isEmbedded ? "rounded-[2rem] sm:rounded-[3rem]" : ""}`} />
      )}

      <p
        className={`relative mb-6 text-center text-xs uppercase tracking-[0.35em] sm:mb-8 ${
          isRaoul
            ? "text-[#8a7a5a]"
            : isHimmel
              ? "text-[#6b8ab0]"
            : isPhantom
              ? "text-[#c9929a]"
                : isEmbedded
                  ? "text-brand-muted"
                  : "text-stone-500"
        }`}
      >
        {headerText}
      </p>

      <div
        role={isHoverActivated ? "group" : undefined}
        onMouseEnter={
          isHoverActivated
            ? () => {
                isHoveredRef.current = true;
                if (step === "back") runSequence();
              }
            : undefined
        }
        onMouseLeave={isHoverActivated ? () => { isHoveredRef.current = false; } : undefined}
        onClick={!isHoverActivated && step === "back" ? runSequence : undefined}
        onKeyDown={
          !isHoverActivated && step === "back"
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  runSequence();
                }
              }
            : undefined
        }
        tabIndex={isHoverActivated ? undefined : step === "back" ? 0 : -1}
        className={`env-tap relative z-10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amaranth/40 ${
          isHoverActivated ? "cursor-default" : step !== "back" ? "cursor-default" : "cursor-pointer"
        }`}
        aria-label={isHoverActivated ? undefined : "Buka undangan"}
      >
        <div className={`env-scene ${isFlapOpen ? "env-scene--opening" : ""} ${isEmbedded ? "env-scene--embedded" : ""}`}>
          <div
            className={`env-flipper env-flipper--${step} ${instantReset ? "env-flipper--instant" : ""}`}
            data-step={step}
          >
            {/* ── Back of envelope ── */}
            <div className="env-face env-face--back">
              <div className="env-paper env-paper--back">
                <div className="env-back-address">
                  <p className="env-back-label">Kepada Yth.</p>
                  <p className="env-back-recipient font-invitation">{recipientName}</p>
                </div>

                <div className="env-stamp-cluster">
                  <div className="env-postmark" aria-hidden>
                    <span className="env-postmark__ring">UNDANGAN DIGITAL</span>
                    <Heart className="env-postmark__icon h-3 w-3" fill="currentColor" />
                  </div>
                  <div className="env-stamp" aria-hidden>
                    <div
                      className="env-stamp__art"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}, color-mix(in srgb, ${accentColor} 60%, #fff))`,
                      }}
                    >
                      <Heart className="h-5 w-5 text-white/90" fill="white" />
                    </div>
                    <span className="env-stamp__value">♥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Front of envelope ── */}
            <div className="env-face env-face--front">
              <div
                className={`env-pocket env-pocket--${step}`}
                style={{ "--env-accent": accentColor } as React.CSSProperties}
              >
                <div className="env-paper env-paper--front">
                  <div className="env-front-body" />
                </div>

                <div className="env-pocket-liner" aria-hidden />

                {(step === "flip" || step === "open" || step === "pull" || step === "exit") && (
                  <div className="env-card-slot">
                    <div className="env-letter">
                      <Heart
                        className="env-letter__heart h-4 w-4"
                        style={{ color: accentColor }}
                        fill={accentColor}
                      />
                      <p className="env-letter__name font-invitation font-semibold text-stone-800">{groomName}</p>
                      <p className="env-letter__amp font-invitation text-stone-500">&</p>
                      <p className="env-letter__name font-invitation font-semibold text-stone-800">{brideName}</p>
                    </div>
                  </div>
                )}

                <div className="env-pocket-flaps" aria-hidden>
                  <div className="env-flap-side env-flap-side--left" />
                  <div className="env-flap-side env-flap-side--right" />
                  <div className="env-flap-bottom" />
                </div>

                <div className="env-flap-closed" />
                <div className="env-flap-open" />

                <div
                  className="env-wax-seal"
                  aria-hidden
                  style={{ "--env-accent": accentColor } as React.CSSProperties}
                >
                  <Heart className="env-wax-seal__icon" fill="currentColor" stroke="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p
        className={`relative z-10 mt-8 min-h-[1.25rem] text-center text-sm transition-opacity duration-300 sm:mt-10 ${
          isRaoul
            ? "text-[#7a6e58]"
            : isHimmel
              ? "text-[#6b8ab0]"
            : isPhantom
              ? "text-[#8a6a72]"
                : isEmbedded
                  ? "text-brand-muted"
                  : "text-stone-500"
        } ${step === "back" ? (isHoverActivated ? "" : "animate-pulse") : "opacity-0"}`}
      >
        {hint}
      </p>
    </div>
  );
}
