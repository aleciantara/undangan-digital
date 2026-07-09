import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { loginSchema } from "@/lib/validations";
import { verifyPassword } from "@/lib/password";
import type { Plan, UserRole } from "@/generated/prisma/client";

const googleConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim()
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      id: "credentials",
      name: "Email dan password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) return null;

          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email.toLowerCase().trim() },
          });
          if (!user?.passwordHash) return null;

          const valid = await verifyPassword(parsed.data.password, user.passwordHash);
          if (!valid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
          };
        } catch (err) {
          console.error("[auth authorize]", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      const userId = user?.id ?? token.sub;
      if (userId) {
        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        if (dbUser) {
          token.sub = dbUser.id;
          token.role = dbUser.role;
          token.plan = dbUser.plan;
        } else if (user) {
          token.sub = user.id;
          token.role = (user.role as UserRole) ?? "USER";
          token.plan = (user.plan as Plan) ?? "FREE";
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as UserRole) ?? "USER";
        session.user.plan = (token.plan as Plan) ?? "FREE";
      }
      return session;
    },
  },
});
