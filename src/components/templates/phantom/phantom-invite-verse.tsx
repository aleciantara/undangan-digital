import { resolveInviteVerse } from "@/lib/invite-verse-presets";
import { PhantomReveal } from "@/components/templates/phantom/phantom-reveal";

type Props = {
  inviteVerseTitle?: string | null;
  inviteVersePreset?: string | null;
  inviteVerseText?: string | null;
  accentColor: string;
  primaryColor: string;
};

export function PhantomInviteVerse({
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
      className="phantom-verse px-4 py-12 sm:py-16"
      style={{ "--verse-accent": accentColor, "--verse-primary": primaryColor } as React.CSSProperties}
    >
      <PhantomReveal variant="up">
        <div className="phantom-verse__panel mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-12">
          <p className="phantom-verse__eyebrow">{verse.title}</p>
          <p className="phantom-verse__text font-invitation">{verse.text}</p>
        </div>
      </PhantomReveal>
    </div>
  );
}
