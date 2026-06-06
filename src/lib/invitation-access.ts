/** Whether a published invitation is open for guests (past opensAt, if set). */
export function isInvitationOpen(invitation: {
  isPublished: boolean;
  opensAt: Date | null;
}): boolean {
  if (!invitation.isPublished) return false;
  if (!invitation.opensAt) return true;
  return invitation.opensAt.getTime() <= Date.now();
}
