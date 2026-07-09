import "next-auth";
import type { DefaultSession } from "next-auth";
import type { AppPlan, AppUserRole } from "./auth";

declare module "next-auth" {
  interface User {
    role?: AppUserRole;
    plan?: AppPlan;
  }

  interface Session {
    user: {
      id: string;
      role: AppUserRole;
      plan: AppPlan;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppUserRole;
    plan?: AppPlan;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AppUserRole;
    plan?: AppPlan;
  }
}
