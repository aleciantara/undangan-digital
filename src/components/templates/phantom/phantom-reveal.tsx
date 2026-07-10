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

export function PhantomReveal(props: Props) {
  return <InvitationReveal theme="phantom" {...props} />;
}
