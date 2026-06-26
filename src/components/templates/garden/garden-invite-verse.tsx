import { GardenParents } from "@/components/templates/garden/garden-parents";
import { GardenReveal } from "@/components/templates/garden/garden-reveal";

type Props = {
  groomParents?: string | null;
  brideParents?: string | null;
  accentColor: string;
  primaryColor: string;
};

export function GardenInviteVerse({
  groomParents,
  brideParents,
  accentColor,
  primaryColor,
}: Props) {
  return (
    <section
      className="garden-verse"
      style={{ "--verse-accent": accentColor, "--verse-primary": primaryColor } as React.CSSProperties}
    >
      <GardenReveal variant="up">
        <div className="garden-card-paper garden-verse__paper mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-12">
          <p className="garden-verse__eyebrow">Walimatul Urs</p>
          <p className="garden-verse__text font-invitation">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i
            untuk hadir pada acara pernikahan putra-putri kami.
          </p>
        </div>
      </GardenReveal>

      <GardenReveal variant="up" delay={120}>
        <GardenParents
          groomParents={groomParents}
          brideParents={brideParents}
          accentColor={accentColor}
          primaryColor={primaryColor}
        />
      </GardenReveal>
    </section>
  );
}
