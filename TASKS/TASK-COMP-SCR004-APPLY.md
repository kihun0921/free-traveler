---
schema: traveler-screen-route-v1
task_id: COMP-SCR004-APPLY
seq: 31
title: 참가 요청 제출·승인·거절
category: COMPONENT
implementation_status: IMPLEMENT
screen: SCR-004
route: `/mates`
page_entry: -
priority: P0
depends_on: [COMP-SCR004-DETAIL, API-MATE-APPLICATIONS, AUTH-SUPABASE-SETUP]
requirements: [REQ-FUNC-034, REQ-FUNC-036]
status: DONE
---

# COMP-SCR004-APPLY — 참가 요청 제출·승인·거절

## Context

- Category: **COMPONENT** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 31)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: UNIT-MATE-STATE, E2E-MATE-AUTH

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-034, REQ-FUNC-036)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-034, REQ-FUNC-036

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-004 |
| Route | `/mates` |
| Page Entry | -(Page Entry 없음 — 화면 조립 Task 아님) |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)
- 해당 Screen: `SCR-004` — `UI_CONTRACT.md`의 `SCR-004` 표를 그대로 인용해 AC를 검증한다.

## Depends On

- COMP-SCR004-DETAIL
- API-MATE-APPLICATIONS
- AUTH-SUPABASE-SETUP

## Expected Files

- `src/components/mates/ApplyPanel.tsx`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] 500자 이내 비공개 메시지 제출
- [ ] 작성자 뷰에서 승인/거절 버튼
- [ ] 비로그인·미성년 시 인증 유도

## Visual AC

- [ ] Toast로 접수 확인(`COMP-GLOBAL-TOAST`)

## Security/Privacy AC

- [ ] 중복 PENDING/ACCEPTED 차단(API 레벨), 비작성자 승인 시도 403

## Test Cases

- [ ] UNIT-MATE-STATE: Functional AC의 각 경계값·오류 조건을 개별 테스트 케이스로 작성
- [ ] E2E-MATE-AUTH: Playwright(Chromium)로 핵심 흐름 1개 이상 자동화

## Verify

UNIT-MATE-STATE, E2E-MATE-AUTH

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
