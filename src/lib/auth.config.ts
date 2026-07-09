import type { NextAuthConfig } from "next-auth";
import { assertAuthEnv } from "@/lib/env";

assertAuthEnv();

/**
 * Shared config for middleware (edge) and auth.ts (Node).
 * Must include secret + JWT callbacks — no Prisma here.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/masuk",
    error: "/masuk",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role ?? "USER";
        token.plan = user.plan ?? "FREE";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
        session.user.plan = (token.plan as "FREE" | "PRO" | "PREMIUM") ?? "FREE";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
