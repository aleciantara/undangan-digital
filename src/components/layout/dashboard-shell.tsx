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
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-invitation font-semibold text-batik-dark">
            <Heart className="h-5 w-5 text-gold-500" fill="currentColor" />
            Dashboard
          </Link>
          <div className="flex items-center gap-4">
            {userName && (
              <span className="hidden items-center gap-2 text-sm text-stone-600 sm:inline-flex">
                Halo, {userName}
                {userRole && (
                  <span
                    className={
                      userRole === "ADMIN"
                        ? "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900"
                        : "rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600"
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
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-white hover:shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              Undangan saya
            </Link>
            <Link
              href="/dashboard/buat"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-batik-brown hover:bg-white hover:shadow-sm"
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
