import { test, expect, type Page } from "@playwright/test";

/**
 * E2E-PUBLIC-SMOKE — 로그인 없이 가능한 공개 Smoke(Chromium 단일).
 * 대상 Task: PAGE-SCR001, PAGE-SCR002, PAGE-SCR003(항공/숙소 탭 + 비로그인 동행 안내).
 *
 * Selector 우선순위: role → label → test id. 텍스트 위치/CSS 구조는 사용하지 않는다.
 * 외부 사이트(항공/숙소)는 실제로 열어 그 사이트의 내용을 검사하지 않는다 —
 * 버튼 클릭 후 뜨는 팝업의 URL(href)과 화면에 남는 안내 문구만 확인한다.
 */

const FLIGHT_OUTBOUND_URL =
  process.env.FLIGHT_OUTBOUND_URL || "https://www.google.com/travel/flights";
const HOTEL_OUTBOUND_URL =
  process.env.HOTEL_OUTBOUND_URL || "https://www.booking.com/";

function originOf(url: string): string {
  return new URL(url).origin;
}

/** 버튼/링크를 클릭해 뜨는 새 탭(팝업)의 URL만 확인하고, 그 탭의 콘텐츠는 검사하지 않은 채 즉시 닫는다. */
async function clickAndCaptureOutboundPopup(
  page: Page,
  trigger: ReturnType<Page["getByRole"]>,
) {
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    trigger.click(),
  ]);
  const popupUrl = popup.url();
  await popup.close();
  return popupUrl;
}

test.describe("E2E-PUBLIC-SMOKE", () => {
  test("E2E-001 메인 페이지의 추천 여행지와 주요 CTA", async ({ page }) => {
    await page.goto("/");

    // Hero(SCR-001-S1)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // 국내 인기 여행지(SCR-001-S2) — 최소 1개 이상의 여행지 Card
    await expect(
      page.getByRole("heading", { name: "국내 인기 여행지" }),
    ).toBeVisible();
    const domesticCards = page.getByTestId("destination-card-domestic");
    await expect(domesticCards.first()).toBeVisible();
    expect(await domesticCards.count()).toBeGreaterThan(0);

    // 해외 인기 여행지(SCR-001-S3) — 최소 1개 이상의 여행지 Card
    await expect(
      page.getByRole("heading", { name: "해외 인기 여행지" }),
    ).toBeVisible();
    const overseasCards = page.getByTestId("destination-card-overseas");
    await expect(overseasCards.first()).toBeVisible();
    expect(await overseasCards.count()).toBeGreaterThan(0);

    // 주요 CTA: 전역 내비의 "여행 준비" 링크가 /travel-tools로 연결된다(COMP-GLOBAL-HEADER-FOOTER).
    const travelToolsNav = page.getByRole("link", { name: "여행 준비" });
    await expect(travelToolsNav).toBeVisible();
    await expect(travelToolsNav).toHaveAttribute("href", "/travel-tools");
  });

  test("E2E-002 대표 소개의 free_traveler, 50회 이상, 30개국 이상", async ({
    page,
  }) => {
    await page.goto("/about");

    // 대표명(SCR-002-S1 Hero)
    await expect(
      page.getByRole("heading", { name: /free_traveler/ }),
    ).toBeVisible();

    // 여행 지표(SCR-002-S2) — 50+ Trips / 30+ Countries
    const tripsStat = page.getByTestId("stat-trips");
    const countriesStat = page.getByTestId("stat-countries");
    await expect(tripsStat).toBeVisible();
    await expect(countriesStat).toBeVisible();
    await expect(tripsStat).toContainText("50");
    await expect(countriesStat).toContainText("30");
  });

  test("E2E-003 여행 도구의 항공 외부 이동 안내와 href", async ({ page }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: "항공편" }).click();

    await page.getByLabel("국가").selectOption({ index: 1 });
    await page.getByLabel("지역").selectOption({ index: 1 });
    await page.getByLabel("출발일").fill(futureDate(7));
    await page.getByLabel("귀국일").fill(futureDate(10));

    // 비전달 고지(REQ-FUNC-015)
    await expect(
      page.getByText("입력값은 외부 사이트로 전달되지 않습니다"),
    ).toBeVisible();

    const outboundButton = page.getByRole("button", {
      name: "항공편 보러 가기",
    });
    await expect(outboundButton).toBeVisible();

    const popupUrl = await clickAndCaptureOutboundPopup(page, outboundButton);
    expect(originOf(popupUrl)).toBe(originOf(FLIGHT_OUTBOUND_URL));
  });

  test("E2E-004 여행 도구의 숙소 외부 이동 안내와 href", async ({ page }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: "숙소" }).click();

    await page.getByLabel("국가").selectOption({ index: 1 });
    await page.getByLabel("지역").selectOption({ index: 1 });
    await page.getByLabel("체크인").fill(futureDate(7));
    await page.getByLabel("체크아웃").fill(futureDate(10));

    // 비전달 고지(REQ-FUNC-023)
    await expect(
      page.getByText("입력값은 외부 사이트로 전달되지 않습니다"),
    ).toBeVisible();

    const outboundButton = page.getByRole("button", { name: "호텔 보러 가기" });
    await expect(outboundButton).toBeVisible();

    const popupUrl = await clickAndCaptureOutboundPopup(page, outboundButton);
    expect(originOf(popupUrl)).toBe(originOf(HOTEL_OUTBOUND_URL));
  });

  test("E2E-005 비로그인 동행글 작성의 로그인 안내", async ({ page }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: "동행 구하기" }).click();

    // 비로그인/미성년: 빈 화면이 아니라 로그인 안내 카드가 보여야 한다(REQ-FUNC-027).
    await expect(page.getByRole("heading", { name: /로그인/ })).toBeVisible();

    const loginLink = page.getByRole("link", { name: /로그인/ });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", "/account");
  });
});

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}
