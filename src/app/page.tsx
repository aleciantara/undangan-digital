import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarHeart, MessageCircleHeart, Palette, Share2 } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Motif Indonesia",
    desc: "Batik Parang, Ulos, Songket, dan tema modern elegan.",
  },
  {
    icon: CalendarHeart,
    title: "Multi-acara",
    desc: "Akad, resepsi, siraman, pengajian — dalam satu undangan.",
  },
  {
    icon: MessageCircleHeart,
    title: "RSVP & ucapan",
    desc: "Tamu konfirmasi kehadiran dan kirim doa langsung.",
  },
  {
    icon: Share2,
    title: "Bagikan mudah",
    desc: "Link personal & WhatsApp untuk setiap tamu.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SiteHeader />

      <section className="batik-pattern relative overflow-hidden px-4 py-20 text-center sm:py-28">
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-batik-brown/70">Platform undangan pernikahan</p>
          <h1 className="font-invitation mt-4 text-4xl font-semibold leading-tight text-batik-dark sm:text-5xl md:text-6xl">
            Undangan digital yang indah & berakar budaya
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-stone-600">
            Buat undangan pernikahan dengan motif khas Indonesia, kelola tamu, dan terima RSVP dalam satu dashboard.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/daftar">
              <Button size="lg">Mulai gratis</Button>
            </Link>
            <Link href="/masuk">
              <Button size="lg" variant="outline">
                Sudah punya akun
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="font-invitation text-center text-2xl font-semibold text-batik-dark">Fitur utama</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <f.icon className="h-8 w-8 text-batik-brown" />
              <h3 className="mt-4 font-semibold text-stone-800">{f.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Undangan Digital
      </footer>
    </div>
  );
}
