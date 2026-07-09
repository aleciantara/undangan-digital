import { auth } from "@/lib/auth";
import { hasRole } from "@/lib/plans";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { AppUserRole } from "@/types/auth";

export async function getSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/masuk");
  }
  return session;
}

export async function requireSessionApi() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireRole(...roles: AppUserRole[]) {
  const session = await requireSession();
  if (!hasRole(session.user.role, ...roles)) {
    redirect("/dashboard");
  }
  return session;
}

export async function requireRoleApi(...roles: AppUserRole[]) {
  const { session, error } = await requireSessionApi();
  if (error) return { session: null, error };
  if (!hasRole(session!.user.role, ...roles)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session, error: null };
}
