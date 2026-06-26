import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { RsvpSection } from "@/components/invitation/rsvp-section";
import { WishesSection } from "@/components/invitation/wishes-section";
import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { resolveGardenMedia } from "@/lib/garden-placeholders";
import { GardenCountdown } from "@/components/templates/garden/garden-countdown";
import { GardenEventCard } from "@/components/templates/garden/garden-event-card";
import { GardenGallery } from "@/components/templates/garden/garden-gallery";
import { GardenHero } from "@/components/templates/garden/garden-hero";
import { GardenInviteVerse } from "@/components/templates/garden/garden-invite-verse";
import { GardenPhotoShowcase } from "@/components/templates/garden/garden-photo-showcase";
import { GardenPlaceholderNote } from "@/components/templates/garden/garden-placeholder-note";
import { GardenReveal } from "@/components/templates/garden/garden-reveal";
import { GardenRomanticQuote } from "@/components/templates/garden/garden-romantic-quote";
import { GardenSectionHeading } from "@/components/templates/garden/garden-section-heading";

type Props = {
  invitation: SerializedInvitation;
  guest: SerializedGuest | null;
};

export function BotanicalGardenTemplate({ invitation, guest }: Props) {
  const { primaryColor, accentColor } = invitation;
  const nextEvent = invitation.events[0];
  const displayGroom = invitation.groomFullName ?? invitation.groomName;
  const displayBride = invitation.brideFullName ?? invitation.brideName;

  const { coverUrl, galleryPhotos, isPlaceholderMedia } = resolveGardenMedia({
    coverPhotoUrl: invitation.coverPhotoUrl,
    photos: invitation.photos,
  });

  return (
    <InvitationExperience
      slug={invitation.slug}
      groomName={invitation.groomName}
      brideName={invitation.brideName}
      recipientName={guest?.name ?? "Tamu Undangan"}
      accentColor={accentColor}
      envelopeTheme="garden"
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
        className="garden-invite garden-invite--clean invitation-shell invitation-shell--garden min-h-screen"
        style={
          {
            "--inv-primary": primaryColor,
            "--inv-accent": accentColor,
          } as React.CSSProperties
        }
      >
        <GardenHero
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          displayGroom={displayGroom}
          displayBride={displayBride}
          accentColor={accentColor}
          primaryColor={primaryColor}
          coverPhotoUrl={coverUrl}
          galleryPhotos={galleryPhotos}
        />

        <GardenRomanticQuote
          slug={invitation.slug}
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          accentColor={accentColor}
          loveStory={invitation.loveStory}
        />

        <GardenPhotoShowcase
          photos={galleryPhotos}
          coverPhotoUrl={coverUrl}
          accentColor={accentColor}
          primaryColor={primaryColor}
          groomName={invitation.groomName}
          brideName={invitation.brideName}
        />

        <GardenPlaceholderNote show={isPlaceholderMedia} />

        <GardenInviteVerse
          groomParents={invitation.groomParents}
          brideParents={invitation.brideParents}
          accentColor={accentColor}
          primaryColor={primaryColor}
        />

        {nextEvent && (
          <section className="garden-glass-section garden-countdown-band px-4 py-16 sm:py-20">
            <GardenReveal variant="up">
              <div className="garden-card-glass-wrap mx-auto max-w-4xl">
                <div className="garden-card-glass garden-countdown-glass px-5 py-9 sm:px-10 sm:py-12">
                  <GardenCountdown
                    targetDate={nextEvent.date}
                    accentColor={accentColor}
                    primaryColor={primaryColor}
                  />
                </div>
              </div>
            </GardenReveal>
          </section>
        )}

        {invitation.events.length > 0 && (
          <section className="garden-glass-section relative mx-auto px-4 pb-24 sm:px-6">
            <div className="mx-auto max-w-4xl">
            <GardenSectionHeading index="01" accentColor={accentColor} primaryColor={primaryColor}>
              Rangkaian Acara
            </GardenSectionHeading>
            <div className="space-y-5">
              {invitation.events.map((event, i) => (
                <GardenReveal key={event.id} variant="up" delay={i * 80}>
                  <GardenEventCard
                    event={event}
                    accentColor={accentColor}
                    primaryColor={primaryColor}
                    index={i}
                  />
                </GardenReveal>
              ))}
            </div>
            </div>
          </section>
        )}

        <GardenGallery
          photos={galleryPhotos}
          coverPhotoUrl={coverUrl}
          accentColor={accentColor}
          primaryColor={primaryColor}
        />

        <section className="garden-glass-section relative mx-auto max-w-2xl px-4 pb-24 sm:px-6">
          <GardenSectionHeading index="02" accentColor={accentColor} primaryColor={primaryColor}>
            Konfirmasi Kehadiran
          </GardenSectionHeading>
          <GardenReveal variant="up">
            <div className="garden-card-glass-wrap">
              <div className="garden-interactive garden-card-glass px-5 py-8 sm:px-8 sm:py-10">
              <RsvpSection
                invitationId={invitation.id}
                seatQuota={invitation.seatQuota}
                events={invitation.events}
                guest={guest}
              />
              </div>
            </div>
          </GardenReveal>
        </section>

        <section className="garden-glass-section relative mx-auto max-w-2xl px-4 pb-28 sm:px-6">
          <GardenSectionHeading index="03" accentColor={accentColor} primaryColor={primaryColor}>
            Ucapan & Doa
          </GardenSectionHeading>
          <GardenReveal variant="up" delay={80}>
            <div className="garden-card-glass-wrap">
              <div className="garden-interactive garden-card-glass px-5 py-8 sm:px-8 sm:py-10">
              <WishesSection
                invitationId={invitation.id}
                initialWishes={invitation.wishes}
                defaultGuestName={guest?.name ?? ""}
              />
              </div>
            </div>
          </GardenReveal>
        </section>

        <footer
          className="garden-footer px-4 py-20 text-center"
          style={{ "--ft-accent": accentColor, "--ft-primary": primaryColor } as React.CSSProperties}
        >
          <p className="garden-footer__names font-invitation">
            {invitation.groomName} & {invitation.brideName}
          </p>
          <p className="garden-footer__thanks">Terima kasih atas doa restunya</p>
        </footer>
      </div>
    </InvitationExperience>
  );
}
