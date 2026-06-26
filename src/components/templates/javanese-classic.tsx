import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { Countdown } from "@/components/invitation/countdown";
import { EventCard } from "@/components/invitation/event-card";
import { RsvpSection } from "@/components/invitation/rsvp-section";
import { WishesSection } from "@/components/invitation/wishes-section";
import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { Heart } from "lucide-react";

type Props = {
  invitation: SerializedInvitation;
  guest: SerializedGuest | null;
};

export function JavaneseClassicTemplate({ invitation, guest }: Props) {
  const { primaryColor, accentColor } = invitation;
  const nextEvent = invitation.events[0];
  const displayGroom = invitation.groomFullName ?? invitation.groomName;
  const displayBride = invitation.brideFullName ?? invitation.brideName;

  return (
    <InvitationExperience
      slug={invitation.slug}
      groomName={invitation.groomName}
      brideName={invitation.brideName}
      recipientName={guest?.name ?? "Tamu Undangan"}
      accentColor={accentColor}
      music={
        invitation.musicUrl
          ? {
              url: invitation.musicUrl,
              title: invitation.musicTitle,
              autoplay: invitation.musicAutoplay,
              startSec: invitation.musicStartSec,
              accentColor,
            }
          : null
      }
    >
      <div
        className="invitation-shell batik-pattern min-h-screen"
        style={
          {
            "--inv-primary": primaryColor,
            "--inv-accent": accentColor,
          } as React.CSSProperties
        }
      >
        <header className="relative overflow-hidden px-4 pb-16 pt-20 text-center sm:pt-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at top, ${accentColor}40, transparent 60%)`,
            }}
          />
          <p className="animate-fade-in text-xs uppercase tracking-[0.35em] text-inv-muted">
            Undangan Pernikahan
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-inv-cream-muted" />
            <Heart className="h-5 w-5" style={{ color: accentColor }} fill={accentColor} />
            <span className="h-px w-12 bg-inv-cream-muted" />
          </div>
          <h1 className="font-invitation mt-6 text-4xl font-semibold leading-tight text-inv-ink sm:text-5xl md:text-6xl">
            {invitation.groomName}
            <span className="mx-3 block text-2xl font-normal text-inv-soft sm:inline sm:text-3xl">
              &
            </span>
            {invitation.brideName}
          </h1>
          {nextEvent && (
            <p className="mt-4 text-sm text-inv-soft">
              {displayGroom} & {displayBride}
            </p>
          )}
        </header>

        <section className="mx-auto max-w-2xl px-4 pb-12 text-center">
          <p className="font-invitation text-lg leading-relaxed text-inv-soft">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk
            hadir pada acara pernikahan putra-putri kami.
          </p>
          {(invitation.groomParents || invitation.brideParents) && (
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {invitation.groomParents && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-inv-faint">Keluarga mempelai pria</p>
                  <p className="font-invitation mt-2 text-lg text-inv-ink">{invitation.groomParents}</p>
                </div>
              )}
              {invitation.brideParents && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-inv-faint">Keluarga mempelai wanita</p>
                  <p className="font-invitation mt-2 text-lg text-inv-ink">{invitation.brideParents}</p>
                </div>
              )}
            </div>
          )}
          {invitation.loveStory && (
            <p className="mt-8 rounded-2xl border border-inv bg-inv-surface px-6 py-5 text-sm leading-relaxed text-stone-700">
              {invitation.loveStory}
            </p>
          )}
        </section>

        {nextEvent && (
          <section className="mx-auto max-w-xl px-4 pb-16">
            <Countdown targetDate={nextEvent.date} />
          </section>
        )}

        {invitation.events.length > 0 && (
          <section className="mx-auto max-w-2xl px-4 pb-20">
            <h2 className="font-invitation mb-8 text-center text-2xl font-semibold text-inv-ink">
              Rangkaian Acara
            </h2>
            <div className="space-y-6">
              {invitation.events.map((event) => (
                <EventCard key={event.id} event={event} accentColor={accentColor} />
              ))}
            </div>
          </section>
        )}

        {invitation.photos.length > 0 && (
          <section className="mx-auto max-w-4xl px-4 pb-20">
            <h2 className="font-invitation mb-6 text-center text-2xl font-semibold text-inv-ink">
              Galeri
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {invitation.photos.map((photo) => (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-xl bg-inv-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.caption ?? ""} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-xl px-4 pb-20">
          <h2 className="font-invitation mb-6 text-center text-2xl font-semibold text-batik-dark">
            Konfirmasi Kehadiran
          </h2>
          <RsvpSection
            invitationId={invitation.id}
            seatQuota={invitation.seatQuota}
            events={invitation.events}
            guest={guest}
          />
        </section>

        <section className="mx-auto max-w-xl px-4 pb-24">
          <h2 className="font-invitation mb-6 text-center text-2xl font-semibold text-batik-dark">
            Ucapan & Doa
          </h2>
          <WishesSection
            invitationId={invitation.id}
            initialWishes={invitation.wishes}
            defaultGuestName={guest?.name ?? ""}
          />
        </section>

        <footer className="border-t border-inv py-8 text-center text-xs text-inv-faint">
          <p>Undangan Digital — motif Jawa Klasik</p>
        </footer>
      </div>
    </InvitationExperience>
  );
}
