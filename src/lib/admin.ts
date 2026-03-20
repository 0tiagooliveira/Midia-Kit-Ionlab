export const ADMIN_EMAILS = [
  'marketing.ionlab@gmail.com',
  'tiago336699@gmail.com'
] as const;

export function isAllowedAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return ADMIN_EMAILS.includes(email.trim().toLowerCase() as (typeof ADMIN_EMAILS)[number]);
}
