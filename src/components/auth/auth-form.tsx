"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

type AuthFormProps = {
  mode: "login" | "register";
};

const ERROR_MESSAGES: Record<string, string> = {
  config: "Konfigurasi auth belum benar. Pastikan AUTH_SECRET & AUTH_URL ada di .env.local, lalu restart npm run dev.",
  CredentialsSignin: "Email atau password salah",
  credentials: "Email atau password salah",
  unknown: "Terjadi kesalahan. Coba lagi.",
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(ERROR_MESSAGES[err] ?? ERROR_MESSAGES.unknown);
  }, [searchParams]);

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
        const data = await res.json();
        if (!res.ok) {
          const msg =
            data.error?.email?.[0] ??
            data.error?.password?.[0] ??
            data.error?.name?.[0] ??
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
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
      <h1 className="text-center font-serif text-2xl text-stone-800">
        {isLogin ? "Masuk" : "Daftar"}
      </h1>
      <p className="mt-2 text-center text-sm text-stone-500">
        {isLogin ? "Kelola undangan pernikahan kamu" : "Buat akun Undangan Digital"}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
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
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
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
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
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
          disabled={loading}
          className="w-full rounded-lg bg-amber-800 py-2.5 font-medium text-white transition hover:bg-amber-900 disabled:opacity-60"
        >
          {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        {isLogin ? (
          <>
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-medium text-amber-800 hover:underline">
              Daftar
            </Link>
          </>
        ) : (
          <>
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-medium text-amber-800 hover:underline">
              Masuk
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
