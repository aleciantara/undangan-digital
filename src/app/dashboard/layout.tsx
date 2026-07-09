import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/masuk");

  return (
    <DashboardShell
      userName={session.user.name}
      userRole={session.user.role ?? "USER"}
      userPlan={session.user.plan ?? "FREE"}
    >
      {children}
    </DashboardShell>
  );
}
