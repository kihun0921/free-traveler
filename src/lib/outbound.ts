import { ADMIN_SETTINGS } from "@/data/admin-settings";

export class OutboundValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OutboundValidationError";
  }
}

export function validateOutboundUrl(url: string): boolean {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    const allowlist = ADMIN_SETTINGS.outbound_url_allowlist || [];
    const isAllowed = allowlist.some((domain: string) => {
      if (domain === hostname) return true;
      if (domain.startsWith("*.")) {
        const wildcard = domain.substring(2);
        return hostname.endsWith(`.${wildcard}`) || hostname === wildcard;
      }
      return false;
    });

    if (!isAllowed) {
      throw new OutboundValidationError(
        `URL is not in allowlist: ${hostname}`
      );
    }

    return true;
  } catch (error) {
    if (error instanceof OutboundValidationError) throw error;
    throw new OutboundValidationError(`Invalid URL: ${url}`);
  }
}

export function redirectToOutbound(url: string, destination?: string): void {
  validateOutboundUrl(url);

  const redirectUrl = new URL(url);
  redirectUrl.searchParams.delete("destination");
  redirectUrl.searchParams.delete("date");
  redirectUrl.searchParams.delete("start_date");
  redirectUrl.searchParams.delete("end_date");
  redirectUrl.password = "";

  // 새 탭에서 열어 사용자가 입력한 조건(Free Traveler 화면)을 잃지 않게 한다.
  window.open(redirectUrl.toString(), "_blank", "noopener,noreferrer");
}
