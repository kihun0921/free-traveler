import { test, expect, type Page } from "@playwright/test";

/**
 * E2E-MATE-AUTH — 로그인이 필요한 동행·인증 흐름 Smoke(Chromium 단일)의 골격.
 * 대상 Task: PAGE-SCR003(동행 작성), PAGE-SCR004(목록·상세·신청), PAGE-SCR005(계정·내 활동).
 *
 * 이 파일은 AUTH-SUPABASE-SETUP·DB-SEED-BASE·API-MATE-* Task가 구현되기 전까지는
 * 실행 대상이 아니다(골격만 작성). 인증 환경변수가 없으면 이 파일의 모든 Test를
 * 명시적으로 skip한다 — CI에 실제 Supabase Secret이 없을 때는 public-smoke만 돈다.
 *
 * Selector 우선순위: role → label → test id. 텍스트 위치/CSS 구조는 사용하지 않는다.
 */

const E2E_TEST_EMAIL = process.env.E2E_TEST_EMAIL;
const E2E_TEST_PASSWORD = process.env.E2E_TEST_PASSWORD;
const hasAuthEnv = Boolean(E2E_TEST_EMAIL && E2E_TEST_PASSWORD);

async function loginAsSeededMember(page: Page) {
  // AUTH-SUPABASE-SETUP 구현 후 채운다: /account의 로그인 Card(Guest 역할)에서
  // 이메일·비밀번호로 로그인하고, 성인 확인이 완료된 seed 계정으로 세션을 얻는다.
  await page.goto("/account");
  await page.getByLabel("이메일").fill(E2E_TEST_EMAIL!);
  await page.getByLabel("비밀번호").fill(E2E_TEST_PASSWORD!);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("heading", { name: /프로필/ })).toBeVisible();
}

test.describe("E2E-MATE-AUTH", () => {
  test.beforeEach(() => {
    test.skip(
      !hasAuthEnv,
      "E2E_TEST_EMAIL/E2E_TEST_PASSWORD 미설정 — auth-smoke는 skip한다",
    );
  });

  test("E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인", async ({
    page,
  }) => {
    await loginAsSeededMember(page);

    // COMP-SCR003-MATE-WRITE 구현 후 채운다: 동행 구하기 탭에서
    // 제목/국가/지역/기간/인원/조건/설명/안전수칙 동의를 입력하고 제출한다.
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();
    // TODO(API-MATE-POSTS 구현 후): 필수 필드 입력 + 제출.
    await expect(
      page.getByRole("heading", { name: /동행 구하기/ }),
    ).toBeVisible();

    // COMP-SCR004-LIST/DETAIL 구현 후 채운다: /mates 목록에서 방금 작성한 글을 찾아
    // 상세 패널(Desktop 분할/Mobile Drawer)에서 내용이 일치하는지 확인한다.
    await page.goto("/mates");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // TODO: 목록 Card 클릭 → 상세 패널 오픈 → 작성한 글의 제목/조건이 그대로 보이는지 확인.
  });

  test("E2E-007 동행글 신청과 계정 화면의 내 활동 확인", async ({ page }) => {
    await loginAsSeededMember(page);

    // COMP-SCR004-APPLY 구현 후 채운다: seed된 모집중 글 상세에서 참가 메시지를
    // 500자 이내로 제출하고 Toast 접수 확인을 검사한다.
    await page.goto("/mates");
    // TODO: seed mate_post Card 선택 → 참가 요청 제출 → COMP-GLOBAL-TOAST 접수 확인 문구.

    // COMP-SCR005-MY-ACTIVITY 구현 후 채운다: /account의 내 활동 탭에서
    // 방금 제출한 참가 요청이 PENDING 상태로 나타나는지 확인한다.
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: /내 활동/ })).toBeVisible();
    // TODO: 참가 요청 목록에서 PENDING 상태 항목 확인(role/label 기반).
  });
});
