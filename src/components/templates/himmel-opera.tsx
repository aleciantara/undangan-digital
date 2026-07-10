import { FooterPhotoSection } from "@/components/invitation/footer-photo-section";
import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { InvitationResponsiveShell } from "@/components/invitation/invitation-responsive-shell";
import { RsvpSection } from "@/components/invitation/rsvp-section";
import { WishesSection } from "@/components/invitation/wishes-section";
import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { resolveHimmelMedia } from "@/lib/himmel-media";
import { eventsWithDresscode } from "@/lib/dresscode-colors";
import { buildInvitationSectionNumbers } from "@/lib/invitation-section-numbers";
import { HimmelAtmosphere } from "@/components/templates/himmel/himmel-atmosphere-lazy";
import { HimmelCoupleShowcase } from "@/components/templates/himmel/himmel-couple-showcase";
import { HimmelCountdown } from "@/components/templates/himmel/himmel-countdown";
import { HimmelDresscodeSection } from "@/components/templates/himmel/himmel-dresscode-section";
import { HimmelEventCard } from "@/components/templates/himmel/himmel-event-card";
import { HimmelGallery } from "@/components/templates/himmel/himmel-gallery";
import { HimmelGiftSection } from "@/components/templates/himmel/himmel-gift-section";
import { HimmelHero } from "@/components/templates/himmel/himmel-hero";
import { HimmelInviteShell } from "@/components/templates/himmel/himmel-invite-shell";
import { HimmelInviteVerse } from "@/components/templates/himmel/himmel-invite-verse";
import { HimmelQuote } from "@/components/templates/himmel/himmel-quote";
import { HimmelReveal } from "@/components/templates/himmel/himmel-reveal";
import { HimmelSection } from "@/components/templates/himmel/himmel-section";
import { HimmelSectionHeading } from "@/components/templates/himmel/himmel-section-heading";
import { HimmelVideoSection } from "@/components/templates/himmel/himmel-video-section";

type Props = {
  invitation: SerializedInvitation;
  guest: SerializedGuest | null;
};

export function HimmelFrierenTemplate({ invitation, guest }: Props) {
  const { primaryColor, accentColor } = invitation;
  const nextEvent = invitation.events[0];
  const displayGroom = invitation.groomFullName ?? invitation.groomName;
  const displayBride = invitation.brideFullName ?? invitation.brideName;

  const media = resolveHimmelMedia({
    coverPhotoUrl: invitation.coverPhotoUrl,
    photos: invitation.photos,
    landscapeBackdropFill: invitation.landscapeBackdropFill,
  });

  const {
    heroMode,
    heroBg,
    coupleBg,
    accentBg,
    footerBg,
    groomPhoto,
    bridePhoto,
    galleryPhotos,
    useLandscapeBackdrop,
    landscapeBackdropUrl,
  } = media;

  const sectionNo = buildInvitationSectionNumbers({
    events: invitation.events,
    photos: galleryPhotos,
    prewedVideoUrl: invitation.prewedVideoUrl,
    liveStreamUrl: invitation.liveStreamUrl,
    giftEnabled: invitation.giftEnabled,
  });

  const afterCoupleTone = invitation.events.length > 0 ? "pearl" : "ivory";
  const coupleNames = `${invitation.groomName} & ${invitation.brideName}`;

  const preloadImages = [
    heroBg?.portrait,
    heroBg?.landscape,
    coupleBg?.portrait,
    coupleBg?.landscape,
  ].filter((url): url is string => Boolean(url));

  return (
    <InvitationExperience
      slug={invitation.slug}
      groomName={invitation.groomName}
      brideName={invitation.brideName}
      recipientName={guest?.name ?? "Tamu Undangan"}
      accentColor={accentColor}
      envelopeTheme="himmel"
      headerText="Himmel & Frieren"
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
      preloadImages={preloadImages}
    >
      <InvitationResponsiveShell
        backdropUrl={landscapeBackdropUrl}
        enabled={useLandscapeBackdrop}
      >
      <HimmelInviteShell
        className={`himmel-invite invitation-shell invitation-shell--himmel min-h-screen font-[family-name:var(--font-playfair)] ${useLandscapeBackdrop ? "invitation-shell--desktop-portrait-column" : ""}`}
        style={
          {
            "--inv-primary": primaryColor,
            "--inv-accent": accentColor,
          } as React.CSSProperties
        }
      >
        <HimmelAtmosphere />

        <HimmelHero
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          displayGroom={displayGroom}
          displayBride={displayBride}
          accentColor={accentColor}
          primaryColor={primaryColor}
          heroMode={heroMode}
          heroBg={heroBg}
        />

        <HimmelSection tone="dark" blendTop blendFrom="navy" blendBottom blendTo="navy">
          <HimmelCoupleShowcase
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            groomPhoto={groomPhoto}
            bridePhoto={bridePhoto}
            groomParents={invitation.groomParents}
            brideParents={invitation.brideParents}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />
        </HimmelSection>

        <HimmelSection
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
          <HimmelQuote
            slug={invitation.slug}
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            accentColor={accentColor}
            loveStory={invitation.loveStory}
          />

          <HimmelInviteVerse
            inviteVerseTitle={invitation.inviteVerseTitle}
            inviteVersePreset={invitation.inviteVersePreset}
            inviteVerseText={invitation.inviteVerseText}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />

          {nextEvent && (
            <div className="px-4 py-14 sm:py-20">
              <HimmelReveal variant="up">
                <div className="himmel-panel himmel-surface mx-auto max-w-4xl px-5 py-9 sm:px-10 sm:py-12">
                  <HimmelCountdown
                    targetDate={nextEvent.date}
                    label="Menuju hari yang dinanti"
                    accentColor={accentColor}
                    primaryColor={primaryColor}
                  />
                </div>
              </HimmelReveal>
            </div>
          )}
        </HimmelSection>

        {invitation.events.length > 0 && (
          <HimmelSection tone="pearl" meadowSeed={221} blendTop blendFrom={afterCoupleTone} blendBottom blendTo="ivory" className="px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-4xl">
              <HimmelSectionHeading index={sectionNo.events} accentColor={accentColor} primaryColor={primaryColor}>
                Rangkaian Acara
              </HimmelSectionHeading>
              <div className="space-y-5">
                {invitation.events.map((event, i) => (
                  <HimmelReveal key={event.id} variant="up" delay={i * 80}>
                    <HimmelEventCard
                      event={event}
                      accentColor={accentColor}
                      primaryColor={primaryColor}
                      index={i}
                      coupleNames={coupleNames}
                    />
                  </HimmelReveal>
                ))}
              </div>
            </div>
          </HimmelSection>
        )}

        {eventsWithDresscode(invitation.events).length > 0 && (
          <HimmelSection tone="ivory" meadowSeed={112} blendTop blendFrom="ivory" blendBottom blendTo="ivory">
            <HimmelDresscodeSection
              events={invitation.events}
              accentColor={accentColor}
              primaryColor={primaryColor}
              sectionIndex={sectionNo.dresscode}
            />
          </HimmelSection>
        )}

        <HimmelSection tone="ivory" meadowSeed={113} blendTop blendFrom="ivory" blendBottom blendTo="ivory">
          <HimmelGallery
            photos={galleryPhotos}
            accentColor={accentColor}
            primaryColor={primaryColor}
            sectionIndex={sectionNo.gallery}
          />
        </HimmelSection>

        {(invitation.prewedVideoUrl || invitation.liveStreamUrl) && (
          <HimmelSection tone="ivory" meadowSeed={114}>
            <HimmelVideoSection
              prewed={{ url: invitation.prewedVideoUrl, title: invitation.prewedVideoTitle }}
              live={{ url: invitation.liveStreamUrl, title: invitation.liveStreamTitle }}
              accentColor={accentColor}
              primaryColor={primaryColor}
              sectionIndex={sectionNo.video}
            />
          </HimmelSection>
        )}

        {invitation.giftEnabled && (
          <HimmelSection tone="pearl" meadowSeed={224}>
            <HimmelGiftSection
              invitation={invitation}
              accentColor={accentColor}
              primaryColor={primaryColor}
              sectionIndex={sectionNo.gift}
            />
          </HimmelSection>
        )}

        <HimmelSection
          bgImage={accentBg}
          scrim="light"
          blendTop
          blendBottom
          blendFrom={invitation.giftEnabled ? "pearl" : "ivory"}
          blendTo="pearl"
          stickyBg
        >
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
            <HimmelSectionHeading index={sectionNo.rsvp} accentColor={accentColor} primaryColor={primaryColor}>
              Konfirmasi Kehadiran
            </HimmelSectionHeading>
            <HimmelReveal variant="up">
              <div className="himmel-panel himmel-surface himmel-interactive px-5 py-8 sm:px-8 sm:py-10">
                <RsvpSection
                  invitationId={invitation.id}
                  events={invitation.events}
                  guest={guest}
                />
              </div>
            </HimmelReveal>
          </div>
        </HimmelSection>

        <HimmelSection tone="pearl" meadowSeed={225} blendTop blendFrom="pearl" blendBottom blendTo="pearl" className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <HimmelSectionHeading index={sectionNo.wishes} accentColor={accentColor} primaryColor={primaryColor}>
              Ucapan & Doa
            </HimmelSectionHeading>
            <HimmelReveal variant="up" delay={80}>
              <div className="himmel-panel himmel-surface himmel-interactive mt-4 px-5 py-8 sm:mt-6 sm:px-8 sm:py-10">
                <WishesSection
                  invitationId={invitation.id}
                  initialWishes={invitation.wishes}
                  defaultGuestName={guest?.name ?? ""}
                />
              </div>
            </HimmelReveal>
          </div>
        </HimmelSection>

        <FooterPhotoSection theme="himmel" bgImage={footerBg} scrim="heavy" blendTop>
          <HimmelReveal variant="up">
            <footer
              className="himmel-footer text-center"
              style={{ "--ft-accent": accentColor, "--ft-primary": primaryColor } as React.CSSProperties}
            >
              <p className="himmel-footer__ornament" aria-hidden>
                ✿
              </p>
              <p className="himmel-footer__names font-invitation">
                {invitation.groomName} & {invitation.brideName}
              </p>
              <p className="himmel-footer__thanks">Terima kasih atas doa restunya</p>
              <p className="himmel-footer__tagline font-invitation italic">
                Anywhere you go, let me go too
              </p>
            </footer>
          </HimmelReveal>
        </FooterPhotoSection>
      </HimmelInviteShell>
      </InvitationResponsiveShell>
    </InvitationExperience>
  );
}
