"use client";

import { parseYoutubeVideoId, youtubeEmbedUrl } from "@/lib/music-embed";
import { HimmelReveal } from "./himmel-reveal";
import { HimmelSectionHeading } from "./himmel-section-heading";

type VideoBlock = {
  url: string | null;
  title: string | null;
};

type Props = {
  prewed: VideoBlock;
  live: VideoBlock;
  accentColor: string;
  primaryColor: string;
  sectionIndex?: string;
};

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const videoId = parseYoutubeVideoId(url);
  if (!videoId) return null;

  return (
    <div className="himmel-video__block">
      <p className="himmel-video__label">{title}</p>
      <div className="himmel-video__frame">
        <iframe
          src={youtubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="himmel-video__iframe"
        />
      </div>
    </div>
  );
}

export function HimmelVideoSection({ prewed, live, accentColor, primaryColor, sectionIndex }: Props) {
  const hasPrewed = prewed.url && parseYoutubeVideoId(prewed.url);
  const hasLive = live.url && parseYoutubeVideoId(live.url);
  if (!hasPrewed && !hasLive) return null;

  return (
    <div className="himmel-video px-4 py-16 sm:py-20">
      <HimmelSectionHeading index={sectionIndex} accentColor={accentColor} primaryColor={primaryColor} align="center">
        Video
      </HimmelSectionHeading>
      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-10">
        {hasPrewed && (
          <HimmelReveal variant="up">
            <VideoEmbed url={prewed.url!} title={prewed.title ?? "Pre-Wedding Film"} />
          </HimmelReveal>
        )}
        {hasLive && (
          <HimmelReveal variant="up" delay={hasPrewed ? 100 : 0}>
            <VideoEmbed url={live.url!} title={live.title ?? "Siaran Langsung"} />
          </HimmelReveal>
        )}
      </div>
    </div>
  );
}
