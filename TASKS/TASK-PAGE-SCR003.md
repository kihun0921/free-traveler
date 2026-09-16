---
schema: traveler-screen-route-v1
task_id: PAGE-SCR003
seq: 3
title: SCR-003 `/travel-tools` Page Owner
category: PAGE_OWNER
implementation_status: IMPLEMENT
screen: SCR-003
route: `/travel-tools`
page_entry: `src/app/travel-tools/page.tsx`
priority: P0
depends_on: [COMP-SCR003-INTRO-TABS, COMP-SCR003-FLIGHT-FORM, COMP-SCR003-HOTEL-FORM, COMP-SCR003-TIPS, COMP-SCR003-MATE-WRITE, COMP-GLOBAL-HEADER-FOOTER, API-OUTBOUND-VALIDATION, API-CONTACT-DETECTION, AUTH-SUPABASE-SETUP]
requirements: [REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-054, REQ-FUNC-080]
status: TODO
---

# PAGE-SCR003 — SCR-003 `/travel-tools` Page Owner

## Context

- Category: **PAGE_OWNER** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 3)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-054, REQ-FUNC-080)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-054, REQ-FUNC-080

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-003 |
| Route | `/travel-tools` |
| Page Entry | `src/app/travel-tools/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)
- 해당 Screen: `SCR-003` — `UI_CONTRACT.md`의 `SCR-003` 표를 그대로 인용해 AC를 검증한다.

## Depends On

- COMP-SCR003-INTRO-TABS
- COMP-SCR003-FLIGHT-FORM
- COMP-SCR003-HOTEL-FORM
- COMP-SCR003-TIPS
- COMP-SCR003-MATE-WRITE
- COMP-GLOBAL-HEADER-FOOTER
- API-OUTBOUND-VALIDATION
- API-CONTACT-DETECTION
- AUTH-SUPABASE-SETUP

> 이 Task는 위 Depends On의 Component/Data/API Task가 만든 결과물을 **Route Page(`src/app/travel-tools/page.tsx`)로 조립하는 것만** 범위로 한다. 새로운 하위 Component/Data/API Task를 이 문서 안에서 추가로 만들지 않는다.

## Expected Files

- `src/app/travel-tools/page.tsx`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] Section 순서 고정: Intro→탭(항공/숙소/동행 구하기)→여행정보 Form→입력 요약·외부 이동→찾기 Tip 3개→동행 작성 또는 로그인 안내·안전 안내
- [ ] 항공/숙소 탭 데이터 출처=사용자 입력(브라우저 상태만), 동행 탭 제출 데이터 출처=`API-MATE-POSTS`

## Visual AC

- [ ] 항공·숙소·동행 구하기 3개 탭이 모두 실제로 렌더링되고 탭별 입력·검증·완료 상태가 서로 독립적으로 유지됨(탭 전환 시 값 유지, 오류 상태 비전파)
- [ ] 비로그인·미성년 시 동행 탭은 안내 카드로 대체(빈 화면 아님)
- [ ] Lorem ipsum·준비 중·정보 확인 필요 금지
- [ ] Loading: `항공편/호텔 보러 가기` 클릭 시 URL 검증 동안 버튼 disabled+진행 표시, 동행 글 제출 중에도 동일 처리(중복 클릭 방지)
- [ ] Error: URL 미설정·허용목록 밖·제출 실패 시 critical 토큰 오류 문구+재시도 버튼 제공, 입력값은 유지되고 동일 탭에서 벗어나지 않음

## Security/Privacy AC

- [ ] 항공·숙소 입력값(국가·지역·날짜)은 서버 API·DB·외부 URL query·서버 로그 어디에도 전달되지 않고 브라우저 상태로만 유지
- [ ] 외부 이동은 `noopener,noreferrer` 새 탭
- [ ] 동행 작성 시 공개 연락처 패턴 탐지 후 제출 차단

## Test Cases

- [ ] E2E-TRAVEL-TOOLS: Playwright(Chromium)로 핵심 흐름 1개 이상 자동화
- [ ] UNIT-TRAVEL-DATES: Functional AC의 각 경계값·오류 조건을 개별 테스트 케이스로 작성
- [ ] UNIT-CONTACT-DETECTION: Functional AC의 각 경계값·오류 조건을 개별 테스트 케이스로 작성

## Verify

E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION

## Definition of Done

- [ ] Functional AC, Visual AC, Security/Privacy AC 항목 전부 충족
- [ ] Expected Files 목록에 명시된 파일만 생성/수정됨(그 외 파일 변경 없음)
- [ ] Test Cases에 명시된 방법으로 확인 완료(Unit/E2E는 통과, Manual/Release Check는 체크리스트 기록)
- [ ] `design-reference/D-001/DESIGN.md`의 Do/Do Not 위반 없음(Lorem ipsum·준비 중·정보 확인 필요·빈 Card·예약/결제 UI·별점/매너온도 없음)
- [ ] `python scripts/audit_tasks.py` 재실행 시 이 Task와 관련된 FAIL 항목 없음

## Forbidden

- EC2·AWS 등 미승인 인프라 사용/언급
- 예약·결제·체크아웃 UI, 가격(₩/$) 표기
- 별점·리뷰·수치형 신뢰도 배지(예: 매너온도)
- Expected Files 목록 밖 파일 생성·수정
- 자동 Merge/Merge Runner 구성
- 이 Task 안에서 새 Component 하위 파일을 직접 설계·생성(조립만 담당 — Depends On의 Component/Data/API Task 산출물을 조합)
- Section 순서 변경 또는 임의 Section 추가/삭제
- Lorem ipsum, `준비 중`, `정보 확인 필요` 문구 사용
