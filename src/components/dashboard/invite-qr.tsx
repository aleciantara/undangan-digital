"use client";

import QRCode from "react-qr-code";

type Props = { url: string; size?: number };

export function InviteQr({ url, size = 128 }: Props) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3">
      <QRCode value={url} size={size} className="h-auto w-full max-w-[128px]" />
    </div>
  );
}
