"use client";

import { useEffect, useState } from "react";

type Options = {
  /** Only begin preloading once true (e.g. after mount / while the envelope shows). */
  enabled?: boolean;
  /** Safety cap so a hung/slow image never blocks the reveal forever. */
  timeoutMs?: number;
};

/**
 * Preloads a set of image URLs (via the browser image cache) and reports when
 * they've all settled. Used to warm the hero + first sections while the envelope
 * animation plays, so the invitation reveals without a loading hitch.
 */
export function useImagePreload(
  urls: string[],
  { enabled = true, timeoutMs = 8000 }: Options = {},
): boolean {
  const key = urls.join("|");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const list = key ? key.split("|").filter(Boolean) : [];
    if (list.length === 0) {
      setReady(true);
      return;
    }

    let settled = false;
    let loaded = 0;
    const finish = () => {
      if (!settled) {
        settled = true;
        setReady(true);
      }
    };
    const bump = () => {
      loaded += 1;
      if (loaded >= list.length) finish();
    };

    const imgs = list.map((src) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
      return img;
    });

    const timer = window.setTimeout(finish, timeoutMs);

    return () => {
      window.clearTimeout(timer);
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [key, enabled, timeoutMs]);

  return ready;
}
