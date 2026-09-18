import { describe, it, expect } from "vitest";

function validateTravelDates(departDate: string, returnDate: string): { valid: boolean; error?: string } {
  const today = new Date().toISOString().split("T")[0];
  
  if (!departDate || !returnDate) {
    return { valid: false, error: "출발일과 귀국일을 입력해주세요" };
  }
  
  if (departDate < today) {
    return { valid: false, error: "출발일은 오늘 이후여야 합니다" };
  }
  
  if (returnDate <= departDate) {
    return { valid: false, error: "귀국일은 출발일보다 늦어야 합니다" };
  }
  
  return { valid: true };
}

function validateHotelDates(checkInDate: string, checkOutDate: string): { valid: boolean; error?: string } {
  const today = new Date().toISOString().split("T")[0];
  
  if (!checkInDate || !checkOutDate) {
    return { valid: false, error: "체크인과 체크아웃 날짜를 입력해주세요" };
  }
  
  if (checkInDate < today) {
    return { valid: false, error: "체크인일은 오늘 이후여야 합니다" };
  }
  
  if (checkOutDate <= checkInDate) {
    return { valid: false, error: "체크아웃일은 체크인일보다 늦어야 합니다" };
  }
  
  return { valid: true };
}

describe("Travel Dates Validation", () => {
  describe("Flight dates", () => {
    it("should reject past departure date", () => {
      const result = validateTravelDates("2020-01-01", "2020-01-05");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("오늘");
    });

    it("should reject reversed dates", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      
      const today = new Date().toISOString().split("T")[0];
      const result = validateTravelDates(tomorrowStr, today);
      expect(result.valid).toBe(false);
    });

    it("should reject same departure and return date", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      
      const result = validateTravelDates(tomorrowStr, tomorrowStr);
      expect(result.valid).toBe(false);
    });

    it("should accept valid future dates", () => {
      const departure = new Date();
      departure.setDate(departure.getDate() + 1);
      const departStr = departure.toISOString().split("T")[0];
      
      const returnDate = new Date(departure);
      returnDate.setDate(returnDate.getDate() + 5);
      const returnStr = returnDate.toISOString().split("T")[0];
      
      const result = validateTravelDates(departStr, returnStr);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe("Hotel dates", () => {
    it("should reject past check-in date", () => {
      const result = validateHotelDates("2020-01-01", "2020-01-05");
      expect(result.valid).toBe(false);
    });

    it("should reject same check-in and check-out", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      
      const result = validateHotelDates(tomorrowStr, tomorrowStr);
      expect(result.valid).toBe(false);
    });

    it("should accept valid hotel dates", () => {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 1);
      const checkInStr = checkIn.toISOString().split("T")[0];
      
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 2);
      const checkOutStr = checkOut.toISOString().split("T")[0];
      
      const result = validateHotelDates(checkInStr, checkOutStr);
      expect(result.valid).toBe(true);
    });
  });
});
