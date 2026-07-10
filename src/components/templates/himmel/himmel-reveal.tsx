"use client";

import {
  InvitationReveal,
  type InvitationRevealVariant,
} from "@/components/invitation/invitation-reveal";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: InvitationRevealVariant;
  delay?: number;
};

export function HimmelReveal(props: Props) {
  return <InvitationReveal theme="himmel" {...props} />;
}
