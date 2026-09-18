---
schema: traveler-screen-route-v1
task_id: PAGE-SCR002
seq: 2
title: SCR-002 `/about` Page Owner
category: PAGE_OWNER
implementation_status: IMPLEMENT
screen: SCR-002
route: `/about`
page_entry: `src/app/about/page.tsx`
priority: P0
depends_on: [COMP-SCR002-HERO, COMP-SCR002-STATS, COMP-SCR002-INTRO-PHILOSOPHY, COMP-SCR002-TIMELINE, COMP-SCR002-COUNTRY-CHIPS, COMP-SCR002-GALLERY, COMP-SCR002-RECOMMENDED, COMP-GLOBAL-HEADER-FOOTER, DATA-REPRESENTATIVE]
requirements: [REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-063]
status: DONE
---

# PAGE-SCR002 — SCR-002 `/about` Page Owner

## Context

- Category: **PAGE_OWNER** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 2)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: E2E-PUBLIC-SMOKE, Manual Check

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-063)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-063

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-002 |
| Route | `/about` |
| Page Entry | `src/app/about/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)
- 해당 Screen: `SCR-002` — `UI_CONTRACT.md`의 `SCR-002` 표를 그대로 인용해 AC를 검증한다.

## Depends On

- COMP-SCR002-HERO
- COMP-SCR002-STATS
- COMP-SCR002-INTRO-PHILOSOPHY
- COMP-SCR002-TIMELINE
- COMP-SCR002-COUNTRY-CHIPS
- COMP-SCR002-GALLERY
- COMP-SCR002-RECOMMENDED
- COMP-GLOBAL-HEADER-FOOTER
- DATA-REPRESENTATIVE

> 이 Task는 위 Depends On의 Component/Data/API Task가 만든 결과물을 **Route Page(`src/app/about/page.tsx`)로 조립하는 것만** 범위로 한다. 새로운 하위 Component/Data/API Task를 이 문서 안에서 추가로 만들지 않는다.

## Expected Files

- `src/app/about/page.tsx`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] Section 순서 고정: Profile Hero→여행 지표→소개·철학→Timeline→방문 국가→Gallery→기억에 남는 여행지+CTA
- [ ] 전 Section 데이터 출처는 `DATA-REPRESENTATIVE` 정적 데이터 단일 소스

## Visual AC

- [ ] 최소 콘텐츠: Timeline 6개 이상, 방문 국가 30개국 이상(4권역), Gallery 사진 8장 이상, 추천 여행지 4개
- [ ] Desktop/Mobile 반응형 밀도(Gallery/Chip 1열 축소)
- [ ] Lorem ipsum·준비 중·정보 확인 필요 금지, 빈 Card 없음(정적 데이터이므로 Empty State 없음)
- [ ] Loading: Gallery·Timeline 이미지 로딩 중 blur-up 또는 스켈레톤 처리, 실패 시 대체 아이콘+alt 텍스트 유지(깨진 이미지 아이콘 노출 금지)
- [ ] Error: 정적 데이터이므로 별도 런타임 Error 상태는 없음(데이터 자체 누락은 `RELEASE-CONTENT-QA`에서 게시 전 차단)

## Security/Privacy AC

- [ ] 이미지 alt·출처·라이선스 메타 필수(라이선스 승인 워크플로 없이 alt+출처 URL만)

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
