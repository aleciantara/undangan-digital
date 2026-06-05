import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AuthErrorPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const code = error === "Configuration" ? "config" : error ?? "unknown";
  redirect(`/masuk?error=${code}`);
}
