import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI Guide",
  description: "Platform design tokens and reusable components",
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
