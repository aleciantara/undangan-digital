"use client";

import { parseYoutubeVideoId, youtubeEmbedUrl } from "@/lib/music-embed";
import { RaoulReveal } from "./raoul-reveal";
import { RaoulSectionHeading } from "./raoul-section-heading";

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
    <div className="raoul-video__block">
      <p className="raoul-video__label">{title}</p>
      <div className="raoul-video__frame">
        <iframe
          src={youtubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="raoul-video__iframe"
        />
      </div>
    </div>
  );
}

export function RaoulVideoSection({ prewed, live, accentColor, primaryColor, sectionIndex }: Props) {
  const hasPrewed = prewed.url && parseYoutubeVideoId(prewed.url);
  const hasLive = live.url && parseYoutubeVideoId(live.url);
  if (!hasPrewed && !hasLive) return null;

  return (
    <div className="raoul-video px-4 py-16 sm:py-20">
      <RaoulSectionHeading index={sectionIndex} accentColor={accentColor} primaryColor={primaryColor} align="center">
        Video
      </RaoulSectionHeading>
      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-10">
        {hasPrewed && (
          <RaoulReveal variant="up">
            <VideoEmbed url={prewed.url!} title={prewed.title ?? "Pre-Wedding Film"} />
          </RaoulReveal>
        )}
        {hasLive && (
          <RaoulReveal variant="up" delay={hasPrewed ? 100 : 0}>
            <VideoEmbed url={live.url!} title={live.title ?? "Siaran Langsung"} />
          </RaoulReveal>
        )}
      </div>
    </div>
  );
}
