import { GardenParents } from "@/components/templates/garden/garden-parents";
import { GardenReveal } from "@/components/templates/garden/garden-reveal";

type Props = {
  groomParents?: string | null;
  brideParents?: string | null;
  accentColor: string;
  primaryColor: string;
};

export function PhantomInviteVerse({
  groomParents,
  brideParents,
  accentColor,
  primaryColor,
}: Props) {
  return (
    <div
      className="phantom-verse px-4 py-12 sm:py-16"
      style={{ "--verse-accent": accentColor, "--verse-primary": primaryColor } as React.CSSProperties}
    >
      <GardenReveal variant="up">
        <div className="phantom-verse__panel mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-12">
          <p className="phantom-verse__eyebrow">Walimatul Urs</p>
          <p className="phantom-verse__text font-invitation">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i
            untuk hadir pada acara pernikahan putra-putri kami — sebuah malam penuh musik, cinta, dan keajaiban.
          </p>
        </div>
      </GardenReveal>

      <GardenReveal variant="up" delay={120}>
        <div className="phantom-parents-wrap mx-auto max-w-3xl">
          <GardenParents
            groomParents={groomParents}
            brideParents={brideParents}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />
        </div>
      </GardenReveal>
    </div>
  );
}
