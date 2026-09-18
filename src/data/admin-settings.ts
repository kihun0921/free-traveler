export interface AdminSettings {
  outbound_url_allowlist: string[];
}

export const ADMIN_SETTINGS: AdminSettings = {
  outbound_url_allowlist: [
    "skyscanner.co.kr",
    "*.skyscanner.co.kr",
    "booking.com",
    "*.booking.com",
    "agoda.com",
    "*.agoda.com",
  ],
};
