import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: Props) {
  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full backdrop-blur-xl transition-colors",
        overlay
          ? "border-b border-white/10 bg-brand-ink/20"
          : "border-b border-brand-brook/30 bg-brand-chalk/90"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link
          href="/"
          className={cn(
            "group flex items-center gap-2.5 font-invitation text-xl font-semibold tracking-tight",
            overlay ? "text-white" : "text-brand-ink"
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-amaranth/90 shadow-lg shadow-brand-amaranth/30 transition group-hover:scale-105">
            <Heart className="h-4 w-4 text-white" fill="currentColor" />
          </span>
          Undangan Digital
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-3">
          <Link
            href="/masuk"
            className={cn(
              "rounded-full px-4 py-2 font-medium transition",
              overlay
                ? "text-brand-chalk/90 hover:bg-white/10 hover:text-white"
                : "text-brand-muted hover:text-brand-amaranth"
            )}
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className={cn(
              "rounded-full px-4 py-2 font-medium shadow-sm transition",
              overlay
                ? "bg-white text-brand-amaranth hover:bg-brand-chalk"
                : "bg-brand-amaranth text-white hover:bg-brand-amaranth-dark"
            )}
          >
            Daftar
          </Link>
        </nav>
      </div>
    </header>
  );
}
