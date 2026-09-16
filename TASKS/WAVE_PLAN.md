# Free Traveler — Wave Plan (TASKS/WAVE_PLAN.md)

- **생성 스크립트:** `scripts/build_waves.py` — 이후 `/run-wave`, `/prepare-task`가 이 파일을 Wave 소속 정본으로 읽는다.
- Wave ID는 배치 결과에 따라 동적으로 생성되었으며 W00~W10으로 미리 고정되지 않았다.
- 각 Wave는 `TASKS/00_TASK_LIST.md`의 Depends On 순서를 위반하지 않는다(선행 Task가 후행 Wave에 배치된 경우 없음 — 검증 결과는 실행 로그 참고).
- 한 Wave 내부에서도 Task ID 순으로 한 개씩 순차 구현한다(§ 각 Wave의 Task 목록은 이미 이 순서로 정렬됨).

## Wave W01

- **그룹:** Airbnb 스타일 공통 UI, 정적 데이터, Layout
- **Task 수:** 7
- **Task 목록(Task ID 순 실행):**
  - COMP-GLOBAL-ERROR-PAGES
  - COMP-GLOBAL-FAVORITE-TOGGLE
  - COMP-GLOBAL-HEADER-FOOTER
  - COMP-GLOBAL-POLICY-PAGES
  - COMP-GLOBAL-SHARE-BUTTON
  - COMP-GLOBAL-TOAST
  - DATA-DESTINATIONS

## Wave W02

- **그룹:** Airbnb 스타일 공통 UI, 정적 데이터, Layout / Supabase Auth, 6개 Table, 기본 RLS
- **Task 수:** 4
- **Task 목록(Task ID 순 실행):**
  - DATA-REPRESENTATIVE
  - DATA-SAFETY
  - DATA-CONTENT-VALIDATION
  - DB-SCHEMA-BASE

## Wave W03

- **그룹:** Supabase Auth, 6개 Table, 기본 RLS
- **Task 수:** 7
- **Task 목록(Task ID 순 실행):**
  - DB-RLS-BASE
  - DB-ACCESS
  - API-ADMIN-SETTINGS
  - AUTH-SUPABASE-SETUP
  - API-MATE-POSTS
  - DB-SEED-BASE
  - SEC-BASELINE

## Wave W04

- **그룹:** Supabase Auth, 6개 Table, 기본 RLS / SCR-001 메인 Component와 Page Owner
- **Task 수:** 4
- **Task 목록(Task ID 순 실행):**
  - COMP-SCR001-ABOUT-TEASER
  - COMP-SCR001-HERO
  - COMP-SCR001-MATE-PREVIEW
  - TEST-RLS-BASIC

## Wave W05

- **그룹:** SCR-001 메인 Component와 Page Owner
- **Task 수:** 7
- **Task 목록(Task ID 순 실행):**
  - COMP-SCR001-SAFETY-DRAWER
  - COMP-SCR001-DEST-DRAWER
  - COMP-SCR001-DOMESTIC-GRID
  - COMP-SCR001-OVERSEAS-GRID
  - COMP-SCR001-SAFETY-GRID
  - COMP-SCR001-THEME-CHIPS
  - PAGE-SCR001
- **Page Owner(이 화면의 마지막 통합 Task):** PAGE-SCR001
- **Preview Checkpoint: required** — 이 Wave에 Page Owner가 포함되어 있으므로, 사람이 Vercel Preview에서 확인하기 전에는 다음 Wave를 자동으로 시작하지 않는다.

## Wave W06

- **그룹:** SCR-002 대표 소개 Component와 Page Owner
- **Task 수:** 7
- **Task 목록(Task ID 순 실행):**
  - COMP-SCR002-COUNTRY-CHIPS
  - COMP-SCR002-GALLERY
  - COMP-SCR002-HERO
  - COMP-SCR002-INTRO-PHILOSOPHY
  - COMP-SCR002-RECOMMENDED
  - COMP-SCR002-STATS
  - COMP-SCR002-TIMELINE

## Wave W07

- **그룹:** SCR-002 대표 소개 Component와 Page Owner / SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner
- **Task 수:** 4
- **Task 목록(Task ID 순 실행):**
  - API-OUTBOUND-VALIDATION
  - COMP-SCR003-FLIGHT-FORM
  - COMP-SCR003-INTRO-TABS
  - PAGE-SCR002
- **Page Owner(이 화면의 마지막 통합 Task):** PAGE-SCR002
- **Preview Checkpoint: required** — 이 Wave에 Page Owner가 포함되어 있으므로, 사람이 Vercel Preview에서 확인하기 전에는 다음 Wave를 자동으로 시작하지 않는다.

## Wave W08

- **그룹:** SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner
- **Task 수:** 5
- **Task 목록(Task ID 순 실행):**
  - API-CONTACT-DETECTION
  - COMP-SCR003-HOTEL-FORM
  - COMP-SCR003-MATE-WRITE
  - COMP-SCR003-TIPS
  - PAGE-SCR003
- **Page Owner(이 화면의 마지막 통합 Task):** PAGE-SCR003
- **Preview Checkpoint: required** — 이 Wave에 Page Owner가 포함되어 있으므로, 사람이 Vercel Preview에서 확인하기 전에는 다음 Wave를 자동으로 시작하지 않는다.

## Wave W09

- **그룹:** SCR-004 동행 목록·상세·신청 Component와 Page Owner
- **Task 수:** 7
- **Task 목록(Task ID 순 실행):**
  - API-MATE-APPLICATIONS
  - COMP-SCR004-FILTER
  - COMP-SCR004-INTRO
  - COMP-SCR004-LIST
  - COMP-SCR004-DETAIL
  - COMP-SCR004-SAFETY-CTA
  - COMP-SCR004-STEPS

## Wave W10

- **그룹:** SCR-004 동행 목록·상세·신청 Component와 Page Owner
- **Task 수:** 4
- **Task 목록(Task ID 순 실행):**
  - API-BLOCK-REPORT
  - COMP-SCR004-APPLY
  - COMP-SCR004-REPORT-BLOCK
  - PAGE-SCR004
- **Page Owner(이 화면의 마지막 통합 Task):** PAGE-SCR004
- **Preview Checkpoint: required** — 이 Wave에 Page Owner가 포함되어 있으므로, 사람이 Vercel Preview에서 확인하기 전에는 다음 Wave를 자동으로 시작하지 않는다.

## Wave W11

- **그룹:** SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner
- **Task 수:** 5
- **Task 목록(Task ID 순 실행):**
  - COMP-SCR005-ADMIN
  - COMP-SCR005-AUTH
  - COMP-SCR005-MY-ACTIVITY
  - COMP-SCR005-PROFILE
  - PAGE-SCR005
- **Page Owner(이 화면의 마지막 통합 Task):** PAGE-SCR005
- **Preview Checkpoint: required** — 이 Wave에 Page Owner가 포함되어 있으므로, 사람이 Vercel Preview에서 확인하기 전에는 다음 Wave를 자동으로 시작하지 않는다.

## Wave W12

- **그룹:** Unit·Playwright·접근성·CI
- **Task 수:** 7
- **Task 목록(Task ID 순 실행):**
  - COMP-GLOBAL-A11Y
  - COMP-GLOBAL-SEO
  - E2E-PUBLIC-SMOKE
  - E2E-TRAVEL-TOOLS
  - UNIT-CONTACT-DETECTION
  - UNIT-MATE-STATE
  - UNIT-TRAVEL-DATES

## Wave W13

- **그룹:** Unit·Playwright·접근성·CI / Vercel Preview와 Release 확인
- **Task 수:** 4
- **Task 목록(Task ID 순 실행):**
  - CI-LINT-TYPECHECK-UNIT
  - E2E-MATE-AUTH
  - RELEASE-A11Y-MANUAL
  - RELEASE-PERFORMANCE-CHECK

## Wave W14

- **그룹:** Vercel Preview와 Release 확인
- **Task 수:** 4
- **Task 목록(Task ID 순 실행):**
  - RELEASE-CONTENT-QA
  - RELEASE-COST-CHECK
  - RELEASE-SEO-CHECK
  - RELEASE-VERCEL-SUPABASE-CHECK

