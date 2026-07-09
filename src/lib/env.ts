const REQUIRED_AUTH_VARS = ["AUTH_SECRET", "DATABASE_URL"] as const;

export function getAuthEnvStatus() {
  const missing = REQUIRED_AUTH_VARS.filter((key) => !process.env[key]?.trim());
  const authUrl = process.env.AUTH_URL?.trim();
  const authUrlWarning =
    authUrl &&
    process.env.NEXT_PUBLIC_APP_URL?.trim() &&
    authUrl !== process.env.NEXT_PUBLIC_APP_URL.trim()
      ? "AUTH_URL and NEXT_PUBLIC_APP_URL should match"
      : null;

  return {
    ok: missing.length === 0,
    missing,
    authUrl: authUrl ?? null,
    authUrlWarning,
    googleOAuthConfigured: Boolean(
      process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim()
    ),
  };
}

export function assertAuthEnv() {
  const status = getAuthEnvStatus();
  if (!status.ok && process.env.NODE_ENV === "development") {
    console.error(
      "[auth] Missing required environment variables:",
      status.missing.join(", "),
      "\nCopy .env.example to .env.local and set AUTH_SECRET, DATABASE_URL, AUTH_URL."
    );
  }
  return status;
}
