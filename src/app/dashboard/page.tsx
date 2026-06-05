import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const invitations = await prisma.invitation.findMany({
    where: { userId: session!.user!.id },
    include: {
      events: { orderBy: { order: "asc" } },
      _count: { select: { guests: true, wishes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-invitation text-2xl font-semibold text-batik-dark">Undangan saya</h1>
          <p className="mt-1 text-sm text-stone-600">{invitations.length} undangan</p>
        </div>
        <Link href="/dashboard/buat">
          <Button>
            <Plus className="h-4 w-4" />
            Buat undangan
          </Button>
        </Link>
      </div>

      {invitations.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="py-12 text-center">
            <p className="text-stone-600">Belum ada undangan. Mulai buat undangan pertama kamu.</p>
            <Link href="/dashboard/buat" className="mt-4 inline-block">
              <Button>Buat undangan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ul className="mt-8 grid gap-4">
          {invitations.map((inv) => (
            <li key={inv.id}>
              <Card className="transition hover:shadow-md">
                <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-invitation text-xl font-semibold text-batik-dark">
                        {inv.groomName} & {inv.brideName}
                      </h2>
                      <Badge
                        className={
                          inv.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-stone-100 text-stone-600"
                        }
                      >
                        {inv.isPublished ? "Terbit" : "Draft"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">
                      /undangan/{inv.slug} · {inv._count.guests} tamu · {inv._count.wishes} ucapan ·{" "}
                      {inv.events.length} acara
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/${inv.id}`}>
                      <Button variant="outline" size="sm">
                        Kelola
                      </Button>
                    </Link>
                    {inv.isPublished && (
                      <Link href={`/undangan/${inv.slug}`} target="_blank">
                        <Button variant="secondary" size="sm">
                          <ExternalLink className="h-4 w-4" />
                          Lihat
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
