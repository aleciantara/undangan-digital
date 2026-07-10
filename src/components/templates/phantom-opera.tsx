import { FooterPhotoSection } from "@/components/invitation/footer-photo-section";
import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { InvitationResponsiveShell } from "@/components/invitation/invitation-responsive-shell";
import { RsvpSection } from "@/components/invitation/rsvp-section";
import { WishesSection } from "@/components/invitation/wishes-section";
import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";
import { resolvePhantomMedia } from "@/lib/phantom-media";
import { PhantomCountdown } from "@/components/templates/phantom/phantom-countdown";
import { PhantomReveal } from "@/components/templates/phantom/phantom-reveal";
import { PhantomCoupleShowcase } from "@/components/templates/phantom/phantom-couple-showcase";
import { PhantomEventCard } from "@/components/templates/phantom/phantom-event-card";
import { PhantomDresscodeSection } from "@/components/templates/phantom/phantom-dresscode-section";
import { eventsWithDresscode } from "@/lib/dresscode-colors";
import { buildInvitationSectionNumbers } from "@/lib/invitation-section-numbers";
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

  const media = resolvePhantomMedia({
    coverPhotoUrl: invitation.coverPhotoUrl,
    photos: invitation.photos,
    landscapeBackdropFill: invitation.landscapeBackdropFill,
  });

  const {
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

  const preloadImages = [
    heroBg.portrait,
    heroBg.landscape,
    coupleBg.portrait,
    coupleBg.landscape,
  ].filter((url): url is string => Boolean(url));

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
      preloadImages={preloadImages}
    >
      <InvitationResponsiveShell
        backdropUrl={landscapeBackdropUrl}
        enabled={useLandscapeBackdrop}
      >
      <div
        className={`phantom-invite invitation-shell invitation-shell--phantom invitation-shell--snap-mobile min-h-screen font-[family-name:var(--font-cormorant)] ${useLandscapeBackdrop ? "invitation-shell--desktop-portrait-column" : ""}`}
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
            groomParents={invitation.groomParents}
            brideParents={invitation.brideParents}
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
              <PhantomReveal variant="up">
                <div className="phantom-panel mx-auto max-w-4xl px-5 py-9 sm:px-10 sm:py-12">
                  <PhantomCountdown
                    targetDate={nextEvent.date}
                    label="Menuju malam yang dinanti"
                    accentColor={accentColor}
                    primaryColor={primaryColor}
                  />
                </div>
              </PhantomReveal>
            </div>
          )}
        </PhantomSection>

        {invitation.events.length > 0 && (
          <PhantomSection className="px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-4xl">
              <PhantomSectionHeading
                index={sectionNo.events}
                accentColor={accentColor}
                primaryColor={primaryColor}
              >
                Rangkaian Acara
              </PhantomSectionHeading>
              <div className="space-y-5">
                {invitation.events.map((event, i) => (
                  <PhantomReveal key={event.id} variant="up" delay={i * 80}>
                    <PhantomEventCard
                      event={event}
                      accentColor={accentColor}
                      primaryColor={primaryColor}
                      index={i}
                      coupleNames={coupleNames}
                    />
                  </PhantomReveal>
                ))}
              </div>
            </div>
          </PhantomSection>
        )}

        {eventsWithDresscode(invitation.events).length > 0 && (
          <PhantomSection className="px-4 sm:px-6">
            <PhantomDresscodeSection
              events={invitation.events}
              accentColor={accentColor}
              primaryColor={primaryColor}
              sectionIndex={sectionNo.dresscode}
            />
          </PhantomSection>
        )}

        <PhantomSection>
          <PhantomGallery
            photos={galleryPhotos}
            accentColor={accentColor}
            primaryColor={primaryColor}
            sectionIndex={sectionNo.gallery}
          />
        </PhantomSection>

        {(invitation.prewedVideoUrl || invitation.liveStreamUrl) && (
          <PhantomSection>
            <PhantomVideoSection
              prewed={{ url: invitation.prewedVideoUrl, title: invitation.prewedVideoTitle }}
              live={{ url: invitation.liveStreamUrl, title: invitation.liveStreamTitle }}
              accentColor={accentColor}
              primaryColor={primaryColor}
              sectionIndex={sectionNo.video}
            />
          </PhantomSection>
        )}

        {invitation.giftEnabled && (
          <PhantomSection>
            <PhantomGiftSection
              invitation={invitation}
              accentColor={accentColor}
              primaryColor={primaryColor}
              sectionIndex={sectionNo.gift}
            />
          </PhantomSection>
        )}

        <PhantomSection
          bgImage={accentBg}
          scrim="medium"
          blendTop
          blendBottom
          stickyBg
          className="px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-2xl">
            <PhantomSectionHeading
              index={sectionNo.rsvp}
              accentColor={accentColor}
              primaryColor={primaryColor}
            >
              Konfirmasi Kehadiran
            </PhantomSectionHeading>
            <PhantomReveal variant="up">
              <div className="phantom-panel phantom-interactive px-5 py-8 sm:px-8 sm:py-10">
                <RsvpSection
                  invitationId={invitation.id}
                  events={invitation.events}
                  guest={guest}
                />
              </div>
            </PhantomReveal>
          </div>
        </PhantomSection>

        <PhantomSection className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <PhantomSectionHeading
              index={sectionNo.wishes}
              accentColor={accentColor}
              primaryColor={primaryColor}
            >
              Ucapan & Doa
            </PhantomSectionHeading>
            <PhantomReveal variant="up" delay={80}>
              <div className="phantom-panel phantom-interactive px-5 py-8 sm:px-8 sm:py-10">
                <WishesSection
                  invitationId={invitation.id}
                  initialWishes={invitation.wishes}
                  defaultGuestName={guest?.name ?? ""}
                />
              </div>
            </PhantomReveal>
          </div>
        </PhantomSection>

        <FooterPhotoSection theme="phantom" bgImage={footerBg} scrim="heavy" blendTop>
          <PhantomReveal variant="up">
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
          </PhantomReveal>
        </FooterPhotoSection>
      </div>
      </InvitationResponsiveShell>
    </InvitationExperience>
  );
}
