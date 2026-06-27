import { resolveInviteVerse } from "@/lib/invite-verse-presets";
import { RaoulReveal } from "./raoul-reveal";

type Props = {
  inviteVerseTitle?: string | null;
  inviteVersePreset?: string | null;
  inviteVerseText?: string | null;
  accentColor: string;
  primaryColor: string;
};

export function RaoulInviteVerse({
  inviteVerseTitle,
  inviteVersePreset,
  inviteVerseText,
  accentColor,
  primaryColor,
}: Props) {
  const verse = resolveInviteVerse({
    inviteVerseTitle,
    inviteVersePreset,
    inviteVerseText,
  });

  return (
    <div
      className="raoul-verse px-4 py-12 sm:py-16"
      style={{ "--verse-accent": accentColor, "--verse-primary": primaryColor } as React.CSSProperties}
    >
      <RaoulReveal variant="up">
        <div className="raoul-verse__panel raoul-verse__panel--foil mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-12">
          <p className="raoul-verse__eyebrow">{verse.title}</p>
          <p className="raoul-verse__text font-invitation">{verse.text}</p>
        </div>
      </RaoulReveal>
    </div>
  );
}
