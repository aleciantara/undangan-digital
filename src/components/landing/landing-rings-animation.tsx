"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type Phase = "idle" | "hover" | "linked";

export function LandingRingsAnimation() {
  const [phase, setPhase] = useState<Phase>("idle");
  const linked = phase === "linked";

  const handleClick = useCallback(() => {
    setPhase((p) => (p === "linked" ? "idle" : "linked"));
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setPhase((p) => (p === "linked" ? "linked" : "hover"))}
      onMouseLeave={() => setPhase((p) => (p === "linked" ? "linked" : "idle"))}
      className={`landing-rings group relative flex h-52 w-56 items-center justify-center sm:h-60 sm:w-64 ${
        linked ? "landing-rings--linked" : ""
      } ${phase === "hover" && !linked ? "landing-rings--hover" : ""}`}
      aria-label={linked ? "Cincin terhubung — ketuk untuk lepas" : "Ketuk untuk menyatukan cincin"}
    >
      <span className="landing-rings__spark landing-rings__spark--1" aria-hidden />
      <span className="landing-rings__spark landing-rings__spark--2" aria-hidden />
      <span className="landing-rings__spark landing-rings__spark--3" aria-hidden />

      <div className="landing-rings__frame relative z-10 h-full w-full">
        <Image
          src="/landing/rings.png"
          alt=""
          fill
          sizes="(max-width: 640px) 224px, 256px"
          className="landing-rings__img object-contain"
          aria-hidden
        />
        <span className="landing-rings__diamond-glow" aria-hidden />
      </div>

      <p
        className={`absolute -bottom-1 left-1/2 w-max -translate-x-1/2 text-center text-xs transition-opacity duration-300 ${
          linked ? "text-brand-chalk/90 opacity-100" : "text-brand-chalk/50 opacity-0 group-hover:opacity-100"
        }`}
      >
        {linked ? "Terikat selamanya ✦" : "Ketuk cincinnya"}
      </p>
    </button>
  );
}
