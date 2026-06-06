import { Countdown } from "@/components/invitation/countdown";
import { Heart } from "lucide-react";

type Props = {
  groomName: string;
  brideName: string;
  opensAt: string;
  accentColor?: string;
};

export function ScheduledGate({ groomName, brideName, opensAt, accentColor = "#D4AF37" }: Props) {
  return (
    <div className="batik-pattern flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-batik-brown/80">Undangan Pernikahan</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <span className="h-px w-12 bg-batik-brown/30" />
        <Heart className="h-5 w-5" style={{ color: accentColor }} fill={accentColor} />
        <span className="h-px w-12 bg-batik-brown/30" />
      </div>
      <h1 className="font-invitation mt-6 text-3xl font-semibold text-batik-dark sm:text-4xl">
        {groomName} & {brideName}
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-batik-brown/80">
        Undangan ini akan dibuka pada waktu yang ditentukan. Mohon tunggu sebentar.
      </p>
      <div className="mt-12 w-full max-w-xl">
        <Countdown targetDate={opensAt} label="Undangan dibuka dalam" />
      </div>
    </div>
  );
}
