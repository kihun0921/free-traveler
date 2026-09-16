---
schema: traveler-screen-route-v1
task_id: PAGE-SCR001
seq: 1
title: SCR-001 `/` 메인 Page Owner
category: PAGE_OWNER
implementation_status: IMPLEMENT
screen: SCR-001
route: `/`
page_entry: `src/app/page.tsx`
priority: P0
depends_on: [COMP-SCR001-HERO, COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-OVERSEAS-GRID, COMP-SCR001-THEME-CHIPS, COMP-SCR001-SAFETY-GRID, COMP-SCR001-MATE-PREVIEW, COMP-SCR001-ABOUT-TEASER, COMP-SCR001-DEST-DRAWER, COMP-SCR001-SAFETY-DRAWER, COMP-GLOBAL-HEADER-FOOTER, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE]
requirements: [REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-050, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-069]
status: TODO
---

# PAGE-SCR001 — SCR-001 `/` 메인 Page Owner

## Context

- Category: **PAGE_OWNER** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 1)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: E2E-PUBLIC-SMOKE, Manual Check

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-050, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-069)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-050, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-069

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-001 |
| Route | `/` |
| Page Entry | `src/app/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)
- 해당 Screen: `SCR-001` — `UI_CONTRACT.md`의 `SCR-001` 표를 그대로 인용해 AC를 검증한다.

## Depends On

- COMP-SCR001-HERO
- COMP-SCR001-DOMESTIC-GRID
- COMP-SCR001-OVERSEAS-GRID
- COMP-SCR001-THEME-CHIPS
- COMP-SCR001-SAFETY-GRID
- COMP-SCR001-MATE-PREVIEW
- COMP-SCR001-ABOUT-TEASER
- COMP-SCR001-DEST-DRAWER
- COMP-SCR001-SAFETY-DRAWER
- COMP-GLOBAL-HEADER-FOOTER
- DATA-DESTINATIONS
- DATA-SAFETY
- DATA-REPRESENTATIVE

> 이 Task는 위 Depends On의 Component/Data/API Task가 만든 결과물을 **Route Page(`src/app/page.tsx`)로 조립하는 것만** 범위로 한다. 새로운 하위 Component/Data/API Task를 이 문서 안에서 추가로 만들지 않는다.

## Expected Files

- `src/app/page.tsx`(수정 — 현재 create-next-app 기본 템플릿 제거 필요)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] Section 순서 고정: Hero→국내 6→해외 6→여행 동기 6→국가별 주의사항 6→최근 동행글 3(또는 완성형 Empty State)→free_traveler 소개
- [ ] Section별 데이터 출처: 국내/해외=`DATA-DESTINATIONS`, 안전=`DATA-SAFETY`, 소개=`DATA-REPRESENTATIVE`, 동행글=`API-MATE-POSTS`(읽기전용)
- [ ] 여행지/안전 Drawer는 SCR-001 내에서 열림(별도 라우트 아님)

## Visual AC

- [ ] Next.js/Vercel create-next-app 기본 템플릿 마크업·로고·기본 링크 완전 제거
- [ ] 최소 콘텐츠: 국내 Card 6, 해외 Card 6, 테마 Chip 6, 안전 Card 6, 동행글 3
- [ ] Desktop 1440(3~4열)/Mobile 390(1열) 반응형 콘텐츠 밀도 준수
- [ ] Lorem ipsum·준비 중·정보 확인 필요·내용 없는 Card 금지
- [ ] 최근 동행글 0건 시 안내 문장+이용 방법+작성 CTA를 갖춘 완성형 Empty State
- [ ] Loading: 동행글 미리보기(`API-MATE-POSTS`) 조회 중에는 스켈레톤 Card 표시(스피너만 있는 빈 화면 금지, `design-reference/D-001/DESIGN.md` §14)
- [ ] Error: 동행글 미리보기 조회 실패 시 critical 토큰 오류 문구+재시도 제공(무한 로딩 금지)

## Security/Privacy AC

- [ ] 즐겨찾기는 localStorage만 사용(서버 미전송)
- [ ] 안전정보 stale 배지는 코랄과 분리된 amber 토큰

## Test Cases

- [ ] E2E-PUBLIC-SMOKE: Playwright(Chromium)로 핵심 흐름 1개 이상 자동화
- [ ] Manual Check: 로컬/프리뷰 배포에서 Functional/Visual AC를 사람이 직접 확인하고 스크린샷 또는 체크리스트로 기록

## Verify

E2E-PUBLIC-SMOKE, Manual Check

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
