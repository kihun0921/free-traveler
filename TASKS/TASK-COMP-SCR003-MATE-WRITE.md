---
schema: traveler-screen-route-v1
task_id: COMP-SCR003-MATE-WRITE
seq: 26
title: 동행 구하기: 작성 Form/로그인 안내(Section6)
category: COMPONENT
implementation_status: IMPLEMENT
screen: SCR-003
route: `/travel-tools`
page_entry: -
priority: P0
depends_on: [API-MATE-POSTS, API-CONTACT-DETECTION, AUTH-SUPABASE-SETUP, COMP-GLOBAL-POLICY-PAGES]
requirements: [REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080]
status: TODO
---

# COMP-SCR003-MATE-WRITE — 동행 구하기: 작성 Form/로그인 안내(Section6)

## Context

- Category: **COMPONENT** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 26)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: UNIT-CONTACT-DETECTION, E2E-TRAVEL-TOOLS

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-003 |
| Route | `/travel-tools` |
| Page Entry | -(Page Entry 없음 — 화면 조립 Task 아님) |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)
- 해당 Screen: `SCR-003` — `UI_CONTRACT.md`의 `SCR-003` 표를 그대로 인용해 AC를 검증한다.

## Depends On

- API-MATE-POSTS
- API-CONTACT-DETECTION
- AUTH-SUPABASE-SETUP
- COMP-GLOBAL-POLICY-PAGES

## Expected Files

- `src/components/travel-tools/MateWriteForm.tsx`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] 비로그인/미성년: 로그인·성인확인 안내 카드(빈 화면 아님)
- [ ] 로그인+성인확인 완료: 제목/국가/지역/기간/인원/조건/설명/안전수칙 동의 Form
- [ ] 제출 전 전화번호·이메일·메신저 ID 패턴 탐지 시 제출 차단+수정 안내
- [ ] 동의 시 정책 버전·시각 저장

## Visual AC

- [ ] 오류 문구 critical 토큰

## Security/Privacy AC

- [ ] 연락처 탐지 실패율 목표(탐지 95%+/오탐 5%-)를 UNIT-CONTACT-DETECTION으로 검증

## Test Cases

- [ ] UNIT-CONTACT-DETECTION: Functional AC의 각 경계값·오류 조건을 개별 테스트 케이스로 작성
- [ ] E2E-TRAVEL-TOOLS: Playwright(Chromium)로 핵심 흐름 1개 이상 자동화

## Verify

UNIT-CONTACT-DETECTION, E2E-TRAVEL-TOOLS

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
