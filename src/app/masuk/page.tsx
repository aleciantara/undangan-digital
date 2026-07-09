import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";

const googleOAuthEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim()
);

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-chalk/50 px-4">
      <Suspense fallback={<div className="text-stone-500">Memuat...</div>}>
        <AuthForm mode="login" googleOAuthEnabled={googleOAuthEnabled} />
      </Suspense>
    </div>
  );
}
