import { headers } from "next/headers";

export async function verifyRequestOrigin(
  allowedOrigins: string[] = [],
): Promise<boolean> {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const referer = headersList.get("referer");

  if (!origin && !referer) {
    return false;
  }

  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  if (!requestOrigin) {
    return false;
  }

  const expectedOrigin = process.env.NEXT_PUBLIC_APP_URL || "";
  const isValidOrigin = requestOrigin === expectedOrigin;

  if (allowedOrigins.length > 0) {
    return isValidOrigin || allowedOrigins.includes(requestOrigin);
  }

  return isValidOrigin;
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateString(
  value: unknown,
  options: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  } = {},
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  if (options.minLength && value.length < options.minLength) {
    return false;
  }

  if (options.maxLength && value.length > options.maxLength) {
    return false;
  }

  if (options.pattern && !options.pattern.test(value)) {
    return false;
  }

  return true;
}

export function validateInteger(
  value: unknown,
  options: {
    min?: number;
    max?: number;
  } = {},
): boolean {
  if (!Number.isInteger(value)) {
    return false;
  }

  const numValue = value as number;

  if (options.min !== undefined && numValue < options.min) {
    return false;
  }

  if (options.max !== undefined && numValue > options.max) {
    return false;
  }

  return true;
}

export function validateDate(
  value: string,
  options: {
    minDate?: Date;
    maxDate?: Date;
  } = {},
): boolean {
  try {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return false;
    }

    if (options.minDate && date < options.minDate) {
      return false;
    }

    if (options.maxDate && date > options.maxDate) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
