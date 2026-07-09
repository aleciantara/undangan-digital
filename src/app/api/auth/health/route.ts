import { NextResponse } from "next/server";
import { getAuthEnvStatus } from "@/lib/env";
import { getDbConnectionHelp, isDbConnectionError, withDbRetry } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const env = getAuthEnvStatus();
  let database = false;
  let databaseError: string | null = null;
  let migrationHint: string | null = null;

  const databaseUrl = process.env.DATABASE_URL ?? "";
  const usesPooler = databaseUrl.includes("-pooler");

  if (env.ok) {
    try {
      await withDbRetry((db) => db.$queryRaw`SELECT 1`);
      database = true;

      try {
        await withDbRetry((db) => db.$queryRaw`SELECT "plan" FROM "User" LIMIT 1`);
      } catch (err) {
        if (err instanceof Error && err.message.includes('column "plan" does not exist')) {
          migrationHint = 'Jalankan: npx prisma migrate dev --name add-user-plan';
        }
      }
    } catch (err) {
      databaseError =
        process.env.NODE_ENV === "development" && err instanceof Error
          ? err.message
          : "Database connection failed";
      if (isDbConnectionError(err)) {
        migrationHint = getDbConnectionHelp();
      }
    }
  }

  const ok = env.ok && database && !migrationHint;

  return NextResponse.json(
    {
      ok,
      checks: {
        secret: Boolean(process.env.AUTH_SECRET?.trim()),
        databaseUrl: Boolean(process.env.DATABASE_URL?.trim()),
        database,
        usesPooler,
        authUrl: env.authUrl,
        googleOAuth: env.googleOAuthConfigured,
      },
      missing: env.missing,
      warnings: [
        ...(env.authUrlWarning ? [env.authUrlWarning] : []),
        ...(!usesPooler && databaseUrl
          ? ["DATABASE_URL sebaiknya pakai Neon Pooler (-pooler) untuk Next.js dev/server"]
          : []),
      ],
      databaseError,
      migrationHint,
    },
    { status: ok ? 200 : 503 }
  );
}
