import { describe, it, expect } from "vitest";

function detectContacts(text: string): {
  phones: string[];
  emails: string[];
  messengers: string[];
} {
  // Phone pattern: Korean phone numbers like 010-1234-5678, 02-123-4567
  const phonePattern =
    /(\d{2,3}-?\d{3,4}-?\d{4})|(\d{3}-?\d{4}-?\d{4})/g;
  const phones = Array.from(text.matchAll(phonePattern), (m) => m[0]);

  // Email pattern: standard email format
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = Array.from(text.matchAll(emailPattern), (m) => m[0]);

  // Messenger IDs: kakaotalk (톡), line, wechat (위챗), whatsapp
  const messengerPattern =
    /(카카오톡|kakao talk|line|라인|wechat|위챗|whatsapp|왓츠앱)[\s:]*([a-zA-Z0-9._-]+)/gi;
  const messengers = Array.from(
    text.matchAll(messengerPattern),
    (m) => `${m[1]}:${m[2]}`
  );

  return {
    phones: [...new Set(phones)],
    emails: [...new Set(emails)],
    messengers: [...new Set(messengers)],
  };
}

describe("Contact Detection", () => {
  describe("Phone numbers", () => {
    it("should detect Korean landline format (02-123-4567)", () => {
      const result = detectContacts("연락처는 02-123-4567입니다");
      expect(result.phones).toContain("02-123-4567");
    });

    it("should detect mobile format (010-1234-5678)", () => {
      const result = detectContacts("핸드폰: 010-1234-5678");
      expect(result.phones).toContain("010-1234-5678");
    });

    it("should detect without dashes (01012345678)", () => {
      const result = detectContacts("내 번호는 01012345678");
      expect(result.phones.length).toBeGreaterThan(0);
    });

    it("should not detect random numbers", () => {
      const result = detectContacts("3000원 정도의 비용");
      expect(result.phones.length).toBe(0);
    });
  });

  describe("Email addresses", () => {
    it("should detect standard email", () => {
      const result = detectContacts("연락처: test@example.com");
      expect(result.emails).toContain("test@example.com");
    });

    it("should detect gmail", () => {
      const result = detectContacts("user@gmail.com으로 연락주세요");
      expect(result.emails).toContain("user@gmail.com");
    });

    it("should not detect invalid email", () => {
      const result = detectContacts("invalid.email@");
      expect(result.emails.length).toBe(0);
    });
  });

  describe("Messenger IDs", () => {
    it("should detect KakaoTalk", () => {
      const result = detectContacts("카카오톡: myid123");
      expect(
        result.messengers.some((m) =>
          m.toLowerCase().includes("myid123")
        )
      ).toBe(true);
    });

    it("should detect LINE", () => {
      const result = detectContacts("LINE: line_id_here");
      expect(
        result.messengers.some((m) =>
          m.toLowerCase().includes("line_id_here")
        )
      ).toBe(true);
    });

    it("should detect multiple messengers", () => {
      const result = detectContacts(
        "카카오톡: kakao123 또는 라인: line123"
      );
      expect(result.messengers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("False positive prevention", () => {
    it("should not flag generic text as contact", () => {
      const result = detectContacts(
        "안녕하세요, 이것은 일반적인 텍스트입니다."
      );
      expect(result.phones.length + result.emails.length).toBe(0);
    });

    it("should not flag email-like patterns in URLs", () => {
      const result = detectContacts("https://example.com/path");
      // Should not detect as email
      expect(
        result.emails.filter((e) => e.includes("com/path")).length
      ).toBe(0);
    });
  });
});
