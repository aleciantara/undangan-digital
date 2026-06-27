import { FooterPhotoSection } from "@/components/invitation/footer-photo-section";
import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { RsvpSection } from "@/components/invitation/rsvp-section";
import { WishesSection } from "@/components/invitation/wishes-section";
import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { resolvePhantomMedia } from "@/lib/phantom-media";
import { GardenCountdown } from "@/components/templates/garden/garden-countdown";
import { GardenReveal } from "@/components/templates/garden/garden-reveal";
import { PhantomCoupleShowcase } from "@/components/templates/phantom/phantom-couple-showcase";
import { PhantomEventCard } from "@/components/templates/phantom/phantom-event-card";
import { PhantomDresscodeSection } from "@/components/templates/phantom/phantom-dresscode-section";
import { eventsWithDresscode } from "@/lib/dresscode-colors";
import { PhantomGallery } from "@/components/templates/phantom/phantom-gallery";
import { PhantomGiftSection } from "@/components/templates/phantom/phantom-gift-section";
import { PhantomHero } from "@/components/templates/phantom/phantom-hero";
import { PhantomInviteVerse } from "@/components/templates/phantom/phantom-invite-verse";
import { PhantomQuote } from "@/components/templates/phantom/phantom-quote";
import { PhantomSection } from "@/components/templates/phantom/phantom-section";
import { PhantomSectionHeading } from "@/components/templates/phantom/phantom-section-heading";
import { PhantomVideoSection } from "@/components/templates/phantom/phantom-video-section";

type Props = {
  invitation: SerializedInvitation;
  guest: SerializedGuest | null;
};

export function PhantomOperaTemplate({ invitation, guest }: Props) {
  const { primaryColor, accentColor } = invitation;
  const nextEvent = invitation.events[0];
  const displayGroom = invitation.groomFullName ?? invitation.groomName;
  const displayBride = invitation.brideFullName ?? invitation.brideName;
  const coupleNames = `${invitation.groomName} & ${invitation.brideName}`;

  const { heroBg, coupleBg, accentBg, footerBg, groomPhoto, bridePhoto, galleryPhotos } =
    resolvePhantomMedia({
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
      envelopeTheme="phantom"
      headerText="A Night at the Opera"
      hintText="Ketuk amplop untuk membuka undangan"
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
        className="phantom-invite invitation-shell invitation-shell--phantom invitation-shell--snap-mobile min-h-screen font-[family-name:var(--font-cormorant)]"
        style={
          {
            "--inv-primary": primaryColor,
            "--inv-accent": accentColor,
          } as React.CSSProperties
        }
      >
        <PhantomHero
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          displayGroom={displayGroom}
          displayBride={displayBride}
          accentColor={accentColor}
          primaryColor={primaryColor}
          heroBg={heroBg}
        />

        {/* Groom & bride portraits on solid velvet */}
        <PhantomSection>
          <PhantomCoupleShowcase
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            groomPhoto={groomPhoto}
            bridePhoto={bridePhoto}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />
        </PhantomSection>

        {/* Couple scene ambient bg — quote through countdown */}
        <PhantomSection
          bgImage={coupleBg}
          scrim="light"
          blendTop
          blendBottom
          stickyBg
          lazyBg={false}
          bgPosition="center 30%"
        >
          <PhantomQuote
            slug={invitation.slug}
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            accentColor={accentColor}
            loveStory={invitation.loveStory}
          />

          <PhantomInviteVerse
            inviteVerseTitle={invitation.inviteVerseTitle}
            inviteVersePreset={invitation.inviteVersePreset}
            inviteVerseText={invitation.inviteVerseText}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />

          {nextEvent && (
            <div className="px-4 py-14 sm:py-20">
              <GardenReveal variant="up">
                <div className="phantom-panel mx-auto max-w-4xl px-5 py-9 sm:px-10 sm:py-12">
                  <GardenCountdown
                    targetDate={nextEvent.date}
                    label="Menuju malam yang dinanti"
                    accentColor={accentColor}
                    primaryColor={primaryColor}
                  />
                </div>
              </GardenReveal>
            </div>
          )}
        </PhantomSection>

        {invitation.events.length > 0 && (
          <PhantomSection className="px-4 pb-20 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <PhantomSectionHeading index="01" accentColor={accentColor} primaryColor={primaryColor}>
                Rangkaian Acara
              </PhantomSectionHeading>
              <div className="space-y-5">
                {invitation.events.map((event, i) => (
                  <GardenReveal key={event.id} variant="up" delay={i * 80}>
                    <PhantomEventCard
                      event={event}
                      accentColor={accentColor}
                      primaryColor={primaryColor}
                      index={i}
                      coupleNames={coupleNames}
                    />
                  </GardenReveal>
                ))}
              </div>
            </div>
          </PhantomSection>
        )}

        {eventsWithDresscode(invitation.events).length > 0 && (
          <PhantomSection className="px-4 pb-20 sm:px-6">
            <PhantomDresscodeSection
              events={invitation.events}
              accentColor={accentColor}
              primaryColor={primaryColor}
            />
          </PhantomSection>
        )}

        <PhantomSection>
          <PhantomGallery
            photos={galleryPhotos}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />
        </PhantomSection>

        {(invitation.prewedVideoUrl || invitation.liveStreamUrl) && (
          <PhantomSection>
            <PhantomVideoSection
              prewed={{ url: invitation.prewedVideoUrl, title: invitation.prewedVideoTitle }}
              live={{ url: invitation.liveStreamUrl, title: invitation.liveStreamTitle }}
              accentColor={accentColor}
              primaryColor={primaryColor}
            />
          </PhantomSection>
        )}

        {invitation.giftEnabled && (
          <PhantomSection>
            <PhantomGiftSection
              invitation={invitation}
              accentColor={accentColor}
              primaryColor={primaryColor}
            />
          </PhantomSection>
        )}

        <PhantomSection
          bgImage={accentBg}
          scrim="medium"
          blendTop
          blendBottom
          stickyBg
          className="px-4 pb-20 sm:px-6"
        >
          <div className="mx-auto max-w-2xl">
            <PhantomSectionHeading index="03" accentColor={accentColor} primaryColor={primaryColor}>
              Konfirmasi Kehadiran
            </PhantomSectionHeading>
            <GardenReveal variant="up">
              <div className="phantom-panel phantom-interactive px-5 py-8 sm:px-8 sm:py-10">
                <RsvpSection
                  invitationId={invitation.id}
                  seatQuota={invitation.seatQuota}
                  events={invitation.events}
                  guest={guest}
                />
              </div>
            </GardenReveal>
          </div>
        </PhantomSection>

        <PhantomSection className="px-4 pb-28 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <PhantomSectionHeading index="04" accentColor={accentColor} primaryColor={primaryColor}>
              Ucapan & Doa
            </PhantomSectionHeading>
            <GardenReveal variant="up" delay={80}>
              <div className="phantom-panel phantom-interactive px-5 py-8 sm:px-8 sm:py-10">
                <WishesSection
                  invitationId={invitation.id}
                  initialWishes={invitation.wishes}
                  defaultGuestName={guest?.name ?? ""}
                />
              </div>
            </GardenReveal>
          </div>
        </PhantomSection>

        <FooterPhotoSection theme="phantom" bgImage={footerBg} scrim="heavy" blendTop>
          <GardenReveal variant="up">
            <footer
              className="phantom-footer text-center"
              style={{ "--ft-accent": accentColor, "--ft-primary": primaryColor } as React.CSSProperties}
            >
              <p className="phantom-footer__ornament" aria-hidden>
                ❧
              </p>
              <p className="phantom-footer__names font-invitation">
                {invitation.groomName} & {invitation.brideName}
              </p>
              <p className="phantom-footer__thanks">Terima kasih atas doa restunya</p>
              <p className="phantom-footer__tagline font-invitation italic">Till the end of time</p>
            </footer>
          </GardenReveal>
        </FooterPhotoSection>
      </div>
    </InvitationExperience>
  );
}
