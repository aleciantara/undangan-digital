import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InvitationRenderer } from "@/components/templates/invitation-renderer";
import { ScheduledGate } from "@/components/invitation/scheduled-gate";
import { isInvitationOpen } from "@/lib/invitation-access";
import { serializeGuest, serializeInvitation } from "@/lib/serialize-invitation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tamu?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const inv = await prisma.invitation.findUnique({ where: { slug } });
  if (!inv) return { title: "Undangan tidak ditemukan" };
  return {
    title: `Undangan Pernikahan ${inv.groomName} & ${inv.brideName}`,
    description: `Dengan penuh suka cita, kami mengundang kehadiran Bapak/Ibu/Saudara/i pada pernikahan ${inv.groomName} & ${inv.brideName}`,
    openGraph: {
      images: inv.coverPhotoUrl ? [inv.coverPhotoUrl] : [],
    },
  };
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tamu } = await searchParams;

  const invitation = await prisma.invitation.findUnique({
    where: { slug, isPublished: true },
    include: {
      events: { orderBy: { order: "asc" } },
      wishes: { where: { isApproved: true, isHidden: false }, orderBy: { createdAt: "desc" }, take: 30 },
      photos: { orderBy: { order: "asc" } },
    },
  });

  if (!invitation) notFound();

  const guest = tamu
    ? await prisma.guest.findUnique({
        where: { token: tamu },
        include: { rsvps: true },
      })
    : null;

  if (!isInvitationOpen(invitation)) {
    return (
      <>
        <TrackOpen invitationId={invitation.id} guestToken={tamu} />
        <ScheduledGate
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          opensAt={invitation.opensAt!.toISOString()}
          accentColor={invitation.accentColor}
        />
      </>
    );
  }

  const serialized = serializeInvitation(invitation);

  return (
    <>
      <TrackOpen invitationId={invitation.id} guestToken={tamu} />
      <InvitationRenderer
        invitation={serialized}
        guest={guest ? serializeGuest(guest) : null}
      />
    </>
  );
}

function TrackOpen({ invitationId, guestToken }: { invitationId: string; guestToken?: string }) {
  const token = guestToken ?? "";
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({invitationId:'${invitationId}',guestToken:'${token}'})});`,
      }}
    />
  );
}
