"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type EnvelopeStep = "back" | "flip" | "open" | "pull" | "exit";

type Props = {
  groomName: string;
  brideName: string;
  recipientName: string;
  accentColor: string;
  onOpen: () => void;
  onComplete: () => void;
};

const FLIP_MS = 1000;
const OPEN_MS = 1000;
const PULL_MS = 1100;

export function EnvelopeCover({
  groomName,
  brideName,
  recipientName,
  accentColor,
  onOpen,
  onComplete,
}: Props) {
  const [step, setStep] = useState<EnvelopeStep>("back");
  const startedRef = useRef(false);

  const isFlapOpen = step === "open" || step === "pull" || step === "exit";

  const runSequence = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    onOpen();

    setStep("flip");
    window.setTimeout(() => setStep("open"), FLIP_MS);
    window.setTimeout(() => setStep("pull"), FLIP_MS + OPEN_MS);
    window.setTimeout(() => {
      setStep("exit");
      onComplete();
    }, FLIP_MS + OPEN_MS + PULL_MS);
  }, [onOpen, onComplete]);

  useEffect(() => {
    return () => {
      startedRef.current = false;
    };
  }, []);

  const hint =
    step === "back"
      ? "Ketuk amplop untuk membuka undangan"
      : step === "flip"
        ? ""
        : "";

  return (
    <div
      className={`env-overlay fixed inset-0 z-50 flex flex-col items-center justify-center px-4 ${step === "exit" ? "env-overlay--exit" : ""}`}
    >
      <div className="env-marble pointer-events-none absolute inset-0" />

      <p className="relative mb-8 text-center text-xs uppercase tracking-[0.35em] text-stone-500">
        Undangan Pernikahan
      </p>

      <button
        type="button"
        onClick={runSequence}
        disabled={step !== "back"}
        className="env-tap relative rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 disabled:cursor-default"
        aria-label="Buka undangan"
      >
        <div className={`env-scene ${isFlapOpen ? "env-scene--opening" : ""}`}>
          <div
            className={`env-flipper env-flipper--${step}`}
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
      </button>

      <p
        className={`relative mt-10 min-h-[1.25rem] text-center text-sm text-stone-500 transition-opacity duration-300 ${step === "back" ? "animate-pulse" : "opacity-0"}`}
      >
        {hint}
      </p>
    </div>
  );
}
