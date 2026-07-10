"use client";

import { useDesktopPortraitColumn } from "@/components/invitation/invitation-column-context";
import type { ResponsiveSlotMedia } from "@/lib/responsive-media";

type ImgProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet"
>;

type Props = ImgProps & {
  media: ResponsiveSlotMedia;
};

/** Picks portrait on mobile; landscape on desktop unless inside desktop portrait column mode. */
export function ResponsiveMediaImage({ media, className, decoding = "async", ...props }: Props) {
  const desktopPortraitColumn = useDesktopPortraitColumn();

  if (media.landscape && !desktopPortraitColumn) {
    return (
      <picture>
        <source media="(min-width: 768px)" srcSet={media.landscape} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.portrait} alt={props.alt ?? ""} className={className} decoding={decoding} {...props} />
      </picture>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={media.portrait} alt={props.alt ?? ""} className={className} decoding={decoding} {...props} />
  );
}
