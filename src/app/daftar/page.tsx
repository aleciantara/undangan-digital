import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-chalk/50 px-4">
      <Suspense fallback={<div className="text-stone-500">Memuat...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
