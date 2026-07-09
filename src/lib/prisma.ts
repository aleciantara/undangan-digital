import { Pool as PgPool, type PoolConfig } from "pg";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import ws from "ws";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: PgPool | undefined;
};

const CONNECTION_ERROR_HINTS = [
  "Server has closed the connection",
  "Connection terminated",
  "Can't reach database server",
  "ECONNRESET",
  "ECONNREFUSED",
  "Connection timed out",
];

export function isDbConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return CONNECTION_ERROR_HINTS.some((hint) => error.message.includes(hint));
}

export function getDbConnectionHelp(): string {
  return [
    "Database tidak dapat dihubungi.",
    "1) Buka dashboard Neon dan pastikan branch tidak archived.",
    "2) Jalankan: npm run db:check",
    "3) Jika masih gagal, coba hotspot HP (port 5432 mungkin diblokir WiFi).",
    "4) Lalu: npx prisma migrate deploy && npm run db:seed",
    "5) Cek /api/auth/health",
  ].join(" ");
}

function normalizeDatabaseUrl(connectionString: string): string {
  const url = connectionString
    .replace(/([?&])channel_binding=require(&)?/g, "$1")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");

  const params = new URLSearchParams(url.includes("?") ? url.split("?")[1] : "");
  if (!params.has("sslmode")) {
    params.set("sslmode", "require");
  }
  params.set("uselibpqcompat", "true");
  params.delete("channel_binding");

  const base = url.includes("?") ? url.slice(0, url.indexOf("?")) : url;
  return `${base}?${params.toString()}`;
}

function usesNeon(connectionString: string) {
  return connectionString.includes("neon.tech");
}

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return normalizeDatabaseUrl(connectionString);
}

function createPrismaClient() {
  const connectionString = getConnectionString();

  if (usesNeon(connectionString)) {
    neonConfig.webSocketConstructor = ws;
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  const poolConfig: PoolConfig = {
    connectionString,
    max: 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 15_000,
  };
  const pool = new PgPool(poolConfig);
  pool.on("error", (err) => {
    console.error("[prisma pool]", err.message);
  });
  globalForPrisma.pool = pool;
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export async function resetPrismaClient() {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = undefined;
  }
  if (globalForPrisma.pool) {
    await globalForPrisma.pool.end().catch(() => undefined);
    globalForPrisma.pool = undefined;
  }
}

export async function withDbRetry<T>(operation: (client: PrismaClient) => Promise<T>): Promise<T> {
  try {
    return await operation(getPrisma());
  } catch (error) {
    if (!isDbConnectionError(error)) throw error;
    await resetPrismaClient();
    return operation(getPrisma());
  }
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    return Reflect.get(client, prop, receiver);
  },
});
