import Link from "next/link";
import { Heart } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-invitation text-lg font-semibold text-batik-dark">
          <Heart className="h-5 w-5 text-gold-500" fill="currentColor" />
          Undangan Digital
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/masuk" className="text-stone-600 hover:text-batik-brown">
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="rounded-lg bg-batik-brown px-3 py-1.5 font-medium text-white hover:bg-batik-dark"
          >
            Daftar
          </Link>
        </nav>
      </div>
    </header>
  );
}
