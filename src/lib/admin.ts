export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email?.endsWith("@admin.traveler.local"));
}
