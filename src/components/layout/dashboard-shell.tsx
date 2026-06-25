import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Heart, LayoutDashboard, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
  userName?: string | null;
  userRole?: "USER" | "ADMIN";
};

export function DashboardShell({ children, userName, userRole }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-brand-brook/30 bg-brand-chalk/60 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-invitation font-semibold text-brand-ink">
            <Heart className="h-5 w-5 text-brand-rose" fill="currentColor" />
            Dashboard
          </Link>
          <div className="flex items-center gap-4">
            {userName && (
              <span className="hidden items-center gap-2 text-sm text-brand-muted sm:inline-flex">
                Halo, {userName}
                {userRole && (
                  <span
                    className={
                      userRole === "ADMIN"
                        ? "rounded-full bg-brand-rose/20 px-2 py-0.5 text-xs font-medium text-brand-amaranth"
                        : "rounded-full bg-brand-brook/30 px-2 py-0.5 text-xs font-medium text-brand-muted"
                    }
                  >
                    {userRole}
                  </span>
                )}
              </span>
            )}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-ink hover:bg-white hover:shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              Undangan saya
            </Link>
            <Link
              href="/dashboard/buat"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-amaranth hover:bg-white hover:shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Buat undangan
            </Link>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
