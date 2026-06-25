import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brandColors } from "@/lib/design-tokens";
import { Heart, Plus } from "lucide-react";

function ColorSwatch({
  name,
  hex,
  token,
  usage,
  textClass = "text-brand-ink",
}: {
  name: string;
  hex: string;
  token: string;
  usage: string;
  textClass?: string;
}) {
  const lightSwatches = new Set(["#FAF8F5", "#FAF6F0", "#8FB5A0", "#D2E9D8", "#C992A8"]);
  const isLight = lightSwatches.has(hex.toUpperCase());

  return (
    <div className="overflow-hidden rounded-xl border border-brand-brook/30 bg-white shadow-sm">
      <div
        className={`flex h-24 items-end p-3 ${isLight ? textClass : "text-white"}`}
        style={{ backgroundColor: hex }}
      >
        <span className="font-mono text-xs font-medium opacity-90">{hex}</span>
      </div>
      <div className="p-4">
        <p className="font-medium text-brand-ink">{name}</p>
        <p className="mt-0.5 font-mono text-xs text-brand-muted">{token}</p>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted">{usage}</p>
      </div>
    </div>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-invitation scroll-mt-24 text-2xl font-semibold text-brand-ink">
      {children}
    </h2>
  );
}

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-rose">Design system</p>
        <h1 className="font-invitation mt-2 text-4xl font-semibold text-brand-ink">UI Guide</h1>
        <p className="mt-3 max-w-2xl text-brand-muted">
          Platform colors and reusable components for the landing page, dashboard, and auth flows.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2 text-sm">
          {[
            ["#colors", "Colors"],
            ["#typography", "Typography"],
            ["#buttons", "Buttons"],
            ["#forms", "Forms"],
            ["#badges", "Badges"],
            ["#cards", "Cards"],
            ["#patterns", "Patterns"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-brand-brook/40 px-3 py-1 text-brand-ink transition hover:bg-brand-chalk"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Platform colors */}
        <section className="mt-16">
          <SectionTitle id="colors">Platform colors</SectionTitle>
          <p className="mt-2 text-sm text-brand-muted">
            Used on landing page, dashboard, and auth. Tuned for readability — not a 1:1 copy of reference swatches.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brandColors.map((c) => (
              <ColorSwatch
                key={c.token}
                name={c.name}
                hex={c.hex}
                token={c.token}
                usage={c.usage}
              />
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mt-16">
          <SectionTitle id="typography">Typography</SectionTitle>
          <Card className="mt-6">
            <CardContent className="space-y-6 py-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">font-invitation</p>
                <p className="font-invitation mt-2 text-3xl font-semibold text-brand-ink">
                  Playfair Display — Undangan Digital
                </p>
                <p className="mt-1 text-sm text-brand-muted">Headings, hero copy, invitation titles</p>
              </div>
              <div className="border-t border-brand-brook/20 pt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">font-sans (Geist)</p>
                <p className="mt-2 text-base text-brand-ink">
                  Body text, form labels, dashboard UI. Secondary copy uses{" "}
                  <span className="text-brand-muted">brand-muted</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Buttons */}
        <section className="mt-16">
          <SectionTitle id="buttons">Button</SectionTitle>
          <p className="mt-2 text-sm text-brand-muted">
            <code className="rounded bg-brand-chalk px-1.5 py-0.5 text-xs">@/components/ui/button</code>
          </p>
          <Card className="mt-6">
            <CardContent className="space-y-8 py-6">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-brand-muted">Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-brand-muted">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-brand-muted">With icon</p>
                <Button>
                  <Plus className="h-4 w-4" />
                  Buat undangan
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Forms */}
        <section className="mt-16">
          <SectionTitle id="forms">Form controls</SectionTitle>
          <Card className="mt-6 max-w-md">
            <CardContent className="space-y-4 py-6">
              <div>
                <Label htmlFor="guide-name">Label</Label>
                <Input id="guide-name" placeholder="Nama tamu" />
              </div>
              <div>
                <Label htmlFor="guide-email">Email</Label>
                <Input id="guide-email" type="email" placeholder="nama@email.com" />
              </div>
              <div>
                <Label htmlFor="guide-message">Textarea</Label>
                <Textarea id="guide-message" placeholder="Ucapan dan doa..." rows={3} />
              </div>
              <Button className="w-full">Kirim</Button>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section className="mt-16">
          <SectionTitle id="badges">Badge</SectionTitle>
          <Card className="mt-6">
            <CardContent className="py-6">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-brand-brook-light text-brand-brook-dark">Terbit</Badge>
                <Badge className="bg-brand-chalk text-brand-muted">Draft</Badge>
                <Badge className="bg-brand-rose/25 text-brand-amaranth">Premium</Badge>
                <Badge className="bg-brand-chalk text-brand-amaranth">12 ucapan</Badge>
                <Badge className="bg-brand-rose/20 text-brand-amaranth">ADMIN</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="mt-16">
          <SectionTitle id="cards">Card</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card with header</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-brand-muted">Default card for dashboard lists and empty states.</p>
              </CardContent>
            </Card>
            <Card className="border-brand-amaranth/20 bg-brand-chalk/50">
              <CardContent className="py-6">
                <Heart className="h-6 w-6 text-brand-rose" fill="currentColor" />
                <p className="mt-3 font-medium text-brand-ink">Tinted card</p>
                <p className="mt-1 text-sm text-brand-muted">Optional brand-chalk background for highlights.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Patterns */}
        <section className="mt-16">
          <SectionTitle id="patterns">Background pattern</SectionTitle>
          <div className="mt-6">
            <div className="brand-pattern flex h-40 items-center justify-center rounded-xl border border-brand-brook/30">
              <span className="rounded-lg bg-white/80 px-3 py-1.5 text-sm font-medium text-brand-ink">
                .brand-pattern
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm text-brand-muted">Soft botanical gradient used on the landing page hero.</p>
        </section>

        <footer className="mt-20 border-t border-brand-brook/20 py-8 text-center text-sm text-brand-muted">
          <Link href="/" className="text-brand-amaranth hover:underline">
            ← Kembali ke beranda
          </Link>
        </footer>
      </div>
    </div>
  );
}
