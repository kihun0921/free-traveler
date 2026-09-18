---
schema: traveler-screen-route-v1
task_id: PAGE-SCR004
seq: 4
title: SCR-004 `/mates` Page Owner
category: PAGE_OWNER
implementation_status: IMPLEMENT
screen: SCR-004
route: `/mates`
page_entry: `src/app/mates/page.tsx`
priority: P0
depends_on: [COMP-SCR004-INTRO, COMP-SCR004-FILTER, COMP-SCR004-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT-BLOCK, COMP-SCR004-STEPS, COMP-SCR004-SAFETY-CTA, COMP-GLOBAL-HEADER-FOOTER, API-MATE-POSTS, API-MATE-APPLICATIONS, API-BLOCK-REPORT]
requirements: [REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-036, REQ-FUNC-039, REQ-FUNC-040]
status: DONE
---

# PAGE-SCR004 — SCR-004 `/mates` Page Owner

## Context

- Category: **PAGE_OWNER** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 4)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: E2E-MATE-AUTH, Manual Check

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-036, REQ-FUNC-039, REQ-FUNC-040)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-036, REQ-FUNC-039, REQ-FUNC-040

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-004 |
| Route | `/mates` |
| Page Entry | `src/app/mates/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)
- 해당 Screen: `SCR-004` — `UI_CONTRACT.md`의 `SCR-004` 표를 그대로 인용해 AC를 검증한다.

## Depends On

- COMP-SCR004-INTRO
- COMP-SCR004-FILTER
- COMP-SCR004-LIST
- COMP-SCR004-DETAIL
- COMP-SCR004-APPLY
- COMP-SCR004-REPORT-BLOCK
- COMP-SCR004-STEPS
- COMP-SCR004-SAFETY-CTA
- COMP-GLOBAL-HEADER-FOOTER
- API-MATE-POSTS
- API-MATE-APPLICATIONS
- API-BLOCK-REPORT

> 이 Task는 위 Depends On의 Component/Data/API Task가 만든 결과물을 **Route Page(`src/app/mates/page.tsx`)로 조립하는 것만** 범위로 한다. 새로운 하위 Component/Data/API Task를 이 문서 안에서 추가로 만들지 않는다.

## Expected Files

- `src/app/mates/page.tsx`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] Section 순서 고정: Intro→Filter·결과 요약→동행 목록→상세→신청 방법 3단계→안전·신고·차단 안내+CTA
- [ ] 목록/상세 데이터 출처=`API-MATE-POSTS`, 참가·신고·차단 출처=`API-MATE-APPLICATIONS`/`API-BLOCK-REPORT`

## Visual AC

- [ ] 목록 Card 최대 8개 우선 노출
- [ ] Desktop 목록+상세 좌우 분할/Mobile 목록→상세 Drawer
- [ ] Lorem ipsum·준비 중·정보 확인 필요 금지
- [ ] 검색 결과 0건 시 조건 초기화 버튼+이용 방법+작성 CTA를 갖춘 완성형 Empty State
- [ ] Loading: 동행글 목록(`API-MATE-POSTS`) 조회 중 스켈레톤 Card, 참가 요청/신고/차단 제출 중 버튼 disabled+진행 표시
- [ ] Error: 목록 조회·참가 요청·신고·차단 제출 실패 시 critical 토큰 오류 문구+재시도 제공(빈 화면·무한 로딩 금지)

## Security/Privacy AC

- [ ] 목록·상세 어디에도 전화번호·이메일·메신저 ID 미노출
- [ ] 차단 관계 상호 미노출
- [ ] 비로그인·미성년의 참가/신고/작성 시도는 인증 유도로 차단

## Test Cases

- [ ] E2E-MATE-AUTH: Playwright(Chromium)로 핵심 흐름 1개 이상 자동화
- [ ] Manual Check: 로컬/프리뷰 배포에서 Functional/Visual AC를 사람이 직접 확인하고 스크린샷 또는 체크리스트로 기록

## Verify

E2E-MATE-AUTH, Manual Check

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
