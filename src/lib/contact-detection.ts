export function extractEmails(text: string): string[] {
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
  return Array.from(new Set(text.match(emailRegex) || []));
}

export function extractPhones(text: string): string[] {
  const phoneRegex = /\+?[\d\s\-()]{10,}/g;
  const matches = text.match(phoneRegex) || [];
  return Array.from(new Set(matches.filter((m) => /\d/.test(m))));
}

export function hasContactInfo(text: string): boolean {
  return extractEmails(text).length > 0 || extractPhones(text).length > 0;
}

export interface ContactDetectionResult {
  hasContacts: boolean;
  emails: string[];
  phones: string[];
  sanitized: string;
}

export function detectAndSanitizeContacts(text: string): ContactDetectionResult {
  const emails = extractEmails(text);
  const phones = extractPhones(text);

  let sanitized = text;
  for (const email of emails) {
    sanitized = sanitized.replace(new RegExp(email, "g"), "[email]");
  }
  for (const phone of phones) {
    sanitized = sanitized.replace(new RegExp(phone, "g"), "[phone]");
  }

  return {
    hasContacts: emails.length > 0 || phones.length > 0,
    emails,
    phones,
    sanitized,
  };
}
