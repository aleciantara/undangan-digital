"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

type AuthFormProps = {
  mode: "login" | "register";
  googleOAuthEnabled?: boolean;
};

const ERROR_MESSAGES: Record<string, string> = {
  config:
    "Konfigurasi auth belum benar. Pastikan AUTH_SECRET, DATABASE_URL & AUTH_URL ada di .env.local (sesuai URL browser), lalu restart npm run dev. Cek /api/auth/health untuk detail.",
  CredentialsSignin: "Email atau password salah",
  credentials: "Email atau password salah",
  OAuthAccountNotLinked:
    "Email sudah terdaftar dengan password. Masuk dengan email/password atau hubungkan akun Google.",
  unknown: "Terjadi kesalahan. Coba lagi.",
};

async function parseJsonResponse(res: Response) {
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("non-json");
  }
  return res.json();
}

export function AuthForm({ mode, googleOAuthEnabled = false }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(ERROR_MESSAGES[err] ?? ERROR_MESSAGES.unknown);
  }, [searchParams]);

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError(ERROR_MESSAGES.unknown);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        let data: {
          error?: { email?: string[]; password?: string[]; name?: string[] } | string;
        };
        try {
          data = await parseJsonResponse(res);
        } catch {
          setError(ERROR_MESSAGES.config);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const msg =
            (data.error && typeof data.error === "object" ? data.error.email?.[0] : null) ??
            (data.error && typeof data.error === "object" ? data.error.password?.[0] : null) ??
            (data.error && typeof data.error === "object" ? data.error.name?.[0] : null) ??
            (typeof data.error === "string" ? data.error : null) ??
            "Gagal mendaftar";
          setError(msg);
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error === "Configuration"
            ? ERROR_MESSAGES.config
            : ERROR_MESSAGES[result.error] ?? "Email atau password salah"
        );
        setLoading(false);
        return;
      }

      if (!result?.ok) {
        setError("Email atau password salah");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(ERROR_MESSAGES.config);
      setLoading(false);
    }
  }

  const isLogin = mode === "login";
  const isBusy = loading || googleLoading;

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-brand-brook/30 bg-white p-8 shadow-sm">
      <h1 className="font-invitation text-center text-2xl text-brand-ink">
        {isLogin ? "Masuk" : "Daftar"}
      </h1>
      <p className="mt-2 text-center text-sm text-brand-muted">
        {isLogin ? "Kelola undangan pernikahan kamu" : "Buat akun Undangan Digital"}
      </p>

      {googleOAuthEnabled && (
        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white py-2.5 font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? "Memproses..." : "Masuk dengan Google"}
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-stone-500">atau</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`space-y-4 ${googleOAuthEnabled ? "mt-4" : "mt-8"}`}>
        {!isLogin && (
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-stone-700">
              Nama
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              autoComplete="name"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-brand-amaranth focus:ring-1 focus:ring-brand-amaranth/30"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={isLogin ? "admin@undangandigital.com" : undefined}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-brand-amaranth focus:ring-1 focus:ring-brand-amaranth/30"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-brand-amaranth focus:ring-1 focus:ring-brand-amaranth/30"
          />
          {!isLogin && (
            <p className="mt-1 text-xs text-stone-500">Minimal 8 karakter</p>
          )}
          {isLogin && (
            <p className="mt-1 text-xs text-stone-500">
              Seed: admin@undangandigital.com / Admin123! (setelah npm run db:seed)
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isBusy}
          className="w-full rounded-lg bg-brand-amaranth py-2.5 font-medium text-white transition hover:bg-brand-amaranth-dark disabled:opacity-60"
        >
          {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        {isLogin ? (
          <>
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-medium text-brand-amaranth hover:underline">
              Daftar
            </Link>
          </>
        ) : (
          <>
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-medium text-brand-amaranth hover:underline">
              Masuk
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
