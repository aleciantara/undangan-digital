import Link from "next/link";
import { Heart } from "lucide-react";
import { landingCopy } from "@/lib/landing-copy";
import { getLandingPhotoCredits } from "@/lib/landing-images";

export function LandingFooter() {
  const { footer } = landingCopy;
  const credits = getLandingPhotoCredits();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-ink px-4 py-16 text-center text-brand-chalk/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-rose/50 to-transparent" />

      <Heart className="mx-auto h-6 w-6 text-brand-rose" fill="currentColor" />
      <p className="font-invitation mt-4 text-2xl text-white">{footer.brand}</p>
      <p className="mt-2 text-sm">
        © {year} — {footer.copyright}
      </p>
      <p className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-brand-chalk/50">
        {footer.photoCreditPrefix}{" "}
        {credits.map((c, i) => (
          <span key={c.username}>
            {i > 0 && (i === credits.length - 1 ? " & " : ", ")}
            <Link
              href={`https://unsplash.com/@${c.username}?utm_source=undangan-digital&utm_medium=referral`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-rose hover:underline"
            >
              {c.name}
            </Link>
          </span>
        ))}{" "}
        {footer.photoCreditSuffix}
      </p>
    </footer>
  );
}
