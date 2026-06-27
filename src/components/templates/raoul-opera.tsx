import { FooterPhotoSection } from "@/components/invitation/footer-photo-section";
import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { RsvpSection } from "@/components/invitation/rsvp-section";
import { WishesSection } from "@/components/invitation/wishes-section";
import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { resolveRaoulMedia } from "@/lib/raoul-media";
import { RaoulAtmosphere } from "@/components/templates/raoul/raoul-atmosphere";
import { RaoulCoupleShowcase } from "@/components/templates/raoul/raoul-couple-showcase";
import { RaoulCountdown } from "@/components/templates/raoul/raoul-countdown";
import { RaoulEventCard } from "@/components/templates/raoul/raoul-event-card";
import { RaoulDresscodeSection } from "@/components/templates/raoul/raoul-dresscode-section";
import { eventsWithDresscode } from "@/lib/dresscode-colors";
import { RaoulGallery } from "@/components/templates/raoul/raoul-gallery";
import { RaoulGiftSection } from "@/components/templates/raoul/raoul-gift-section";
import { RaoulHero } from "@/components/templates/raoul/raoul-hero";
import { RaoulInviteVerse } from "@/components/templates/raoul/raoul-invite-verse";
import { RaoulQuote } from "@/components/templates/raoul/raoul-quote";
import { RaoulReveal } from "@/components/templates/raoul/raoul-reveal";
import { RaoulSection } from "@/components/templates/raoul/raoul-section";
import { RaoulSectionHeading } from "@/components/templates/raoul/raoul-section-heading";
import { RaoulVideoSection } from "@/components/templates/raoul/raoul-video-section";

type Props = {
  invitation: SerializedInvitation;
  guest: SerializedGuest | null;
};

export function RaoulOperaTemplate({ invitation, guest }: Props) {
  const { primaryColor, accentColor } = invitation;
  const nextEvent = invitation.events[0];
  const displayGroom = invitation.groomFullName ?? invitation.groomName;
  const displayBride = invitation.brideFullName ?? invitation.brideName;

  const { heroBg, coupleBg, accentBg, footerBg, groomPhoto, bridePhoto, galleryPhotos } =
    resolveRaoulMedia({
      coverPhotoUrl: invitation.coverPhotoUrl,
      photos: invitation.photos,
    });

  const afterCoupleTone = invitation.events.length > 0 ? "pearl" : "ivory";
  const coupleNames = `${invitation.groomName} & ${invitation.brideName}`;

  return (
    <InvitationExperience
      slug={invitation.slug}
      groomName={invitation.groomName}
      brideName={invitation.brideName}
      recipientName={guest?.name ?? "Tamu Undangan"}
      accentColor={accentColor}
      envelopeTheme="raoul"
      headerText="A Morning at the Opera"
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
        className="raoul-invite invitation-shell invitation-shell--raoul invitation-shell--snap-mobile min-h-screen font-[family-name:var(--font-playfair)]"
        style={
          {
            "--inv-primary": primaryColor,
            "--inv-accent": accentColor,
          } as React.CSSProperties
        }
      >
        <RaoulAtmosphere />

        <RaoulHero
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          displayGroom={displayGroom}
          displayBride={displayBride}
          accentColor={accentColor}
          primaryColor={primaryColor}
          heroBg={heroBg}
        />

        <RaoulSection tone="dark" blendTop blendFrom="navy" blendBottom blendTo="navy">
          <RaoulCoupleShowcase
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            groomPhoto={groomPhoto}
            bridePhoto={bridePhoto}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />
        </RaoulSection>

        <RaoulSection
          bgImage={coupleBg}
          scrim="light"
          blendTop
          blendBottom
          blendFrom="navy"
          blendTo={afterCoupleTone}
          stickyBg
          lazyBg={false}
          bgPosition="center 30%"
        >
          <RaoulQuote
            slug={invitation.slug}
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            accentColor={accentColor}
            loveStory={invitation.loveStory}
          />

          <RaoulInviteVerse
            inviteVerseTitle={invitation.inviteVerseTitle}
            inviteVersePreset={invitation.inviteVersePreset}
            inviteVerseText={invitation.inviteVerseText}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />

          {nextEvent && (
            <div className="px-4 py-14 sm:py-20">
              <RaoulReveal variant="up">
                <div className="raoul-panel mx-auto max-w-4xl px-5 py-9 sm:px-10 sm:py-12">
                  <RaoulCountdown
                    targetDate={nextEvent.date}
                    label="Menuju hari yang dinanti"
                    accentColor={accentColor}
                    primaryColor={primaryColor}
                  />
                </div>
              </RaoulReveal>
            </div>
          )}
        </RaoulSection>

        {invitation.events.length > 0 && (
          <RaoulSection tone="pearl" blendTop blendFrom={afterCoupleTone} blendBottom blendTo="ivory" className="px-4 pb-20 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <RaoulSectionHeading index="01" accentColor={accentColor} primaryColor={primaryColor}>
                Rangkaian Acara
              </RaoulSectionHeading>
              <div className="space-y-5">
                {invitation.events.map((event, i) => (
                  <RaoulReveal key={event.id} variant="up" delay={i * 80}>
                    <RaoulEventCard
                      event={event}
                      accentColor={accentColor}
                      primaryColor={primaryColor}
                      index={i}
                      coupleNames={coupleNames}
                    />
                  </RaoulReveal>
                ))}
              </div>
            </div>
          </RaoulSection>
        )}

        {eventsWithDresscode(invitation.events).length > 0 && (
          <RaoulSection
            tone="ivory"
            blendTop
            blendFrom="pearl"
            blendBottom
            blendTo="ivory"
          >
            <RaoulDresscodeSection
              events={invitation.events}
              accentColor={accentColor}
              primaryColor={primaryColor}
            />
          </RaoulSection>
        )}

        <RaoulSection
          tone="ivory"
          blendTop
          blendFrom={afterCoupleTone}
          blendBottom
          blendTo="ivory"
        >
          <RaoulGallery
            photos={galleryPhotos}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />
        </RaoulSection>

        {(invitation.prewedVideoUrl || invitation.liveStreamUrl) && (
          <RaoulSection tone="ivory">
            <RaoulVideoSection
              prewed={{ url: invitation.prewedVideoUrl, title: invitation.prewedVideoTitle }}
              live={{ url: invitation.liveStreamUrl, title: invitation.liveStreamTitle }}
              accentColor={accentColor}
              primaryColor={primaryColor}
            />
          </RaoulSection>
        )}

        {invitation.giftEnabled && (
          <RaoulSection tone="pearl">
            <RaoulGiftSection
              invitation={invitation}
              accentColor={accentColor}
              primaryColor={primaryColor}
            />
          </RaoulSection>
        )}

        <RaoulSection
          bgImage={accentBg}
          scrim="light"
          blendTop
          blendBottom
          blendFrom="ivory"
          blendTo="pearl"
          stickyBg
          className="pb-20"
        >
          <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 sm:pt-14">
            <RaoulSectionHeading index="03" accentColor={accentColor} primaryColor={primaryColor}>
              Konfirmasi Kehadiran
            </RaoulSectionHeading>
            <RaoulReveal variant="up">
              <div className="raoul-panel raoul-interactive px-5 py-8 sm:px-8 sm:py-10">
                <RsvpSection
                  invitationId={invitation.id}
                  seatQuota={invitation.seatQuota}
                  events={invitation.events}
                  guest={guest}
                />
              </div>
            </RaoulReveal>
          </div>
        </RaoulSection>

        <RaoulSection tone="pearl" blendTop blendFrom="pearl" blendBottom blendTo="pearl" className="px-4 pb-28 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <RaoulSectionHeading index="04" accentColor={accentColor} primaryColor={primaryColor}>
              Ucapan & Doa
            </RaoulSectionHeading>
            <RaoulReveal variant="up" delay={80}>
              <div className="raoul-panel raoul-interactive px-5 py-8 sm:px-8 sm:py-10">
                <WishesSection
                  invitationId={invitation.id}
                  initialWishes={invitation.wishes}
                  defaultGuestName={guest?.name ?? ""}
                />
              </div>
            </RaoulReveal>
          </div>
        </RaoulSection>

        <FooterPhotoSection theme="raoul" bgImage={footerBg} scrim="heavy" blendTop>
          <RaoulReveal variant="up">
            <footer
              className="raoul-footer text-center"
              style={{ "--ft-accent": accentColor, "--ft-primary": primaryColor } as React.CSSProperties}
            >
              <p className="raoul-footer__ornament" aria-hidden>
                MERCI
              </p>
              <p className="raoul-footer__names font-invitation">
                {invitation.groomName} & {invitation.brideName}
              </p>
              <p className="raoul-footer__thanks">Terima kasih atas doa restunya</p>
              <p className="raoul-footer__tagline font-invitation italic">
                Anywhere you go, let me go too
              </p>
            </footer>
          </RaoulReveal>
        </FooterPhotoSection>
      </div>
    </InvitationExperience>
  );
}
