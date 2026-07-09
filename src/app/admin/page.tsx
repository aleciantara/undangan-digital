import { prisma } from "@/lib/prisma";
import { PLAN_LABELS } from "@/lib/plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const [users, invitations, stats] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
        _count: { select: { invitations: true } },
      },
    }),
    prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        slug: true,
        groomName: true,
        brideName: true,
        isPublished: true,
        createdAt: true,
        user: { select: { email: true, name: true } },
      },
    }),
    Promise.all([
      prisma.user.count(),
      prisma.invitation.count(),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.user.count({ where: { plan: "PREMIUM" } }),
    ]),
  ]);

  const [userCount, invitationCount, proCount, premiumCount] = stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-invitation text-2xl font-semibold text-brand-ink">Platform Admin</h1>
        <p className="mt-1 text-sm text-stone-600">Ringkasan pengguna dan undangan (read-only).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total undangan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{invitationCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Paket Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{proCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Paket Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{premiumCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengguna terbaru</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-stone-500">
                <th className="pb-2 pr-4">Nama</th>
                <th className="pb-2 pr-4">Email</th>
                <th className="pb-2 pr-4">Role</th>
                <th className="pb-2 pr-4">Plan</th>
                <th className="pb-2 pr-4">Undangan</th>
                <th className="pb-2">Daftar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-stone-100">
                  <td className="py-2 pr-4">{user.name ?? "—"}</td>
                  <td className="py-2 pr-4">{user.email}</td>
                  <td className="py-2 pr-4">{user.role}</td>
                  <td className="py-2 pr-4">{PLAN_LABELS[user.plan]}</td>
                  <td className="py-2 pr-4">{user._count.invitations}</td>
                  <td className="py-2">{user.createdAt.toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Undangan terbaru</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-stone-500">
                <th className="pb-2 pr-4">Pasangan</th>
                <th className="pb-2 pr-4">Slug</th>
                <th className="pb-2 pr-4">Pemilik</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => (
                <tr key={inv.id} className="border-b border-stone-100">
                  <td className="py-2 pr-4">
                    {inv.groomName} & {inv.brideName}
                  </td>
                  <td className="py-2 pr-4">{inv.slug}</td>
                  <td className="py-2 pr-4">{inv.user.email}</td>
                  <td className="py-2 pr-4">{inv.isPublished ? "Published" : "Draft"}</td>
                  <td className="py-2">{inv.createdAt.toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
