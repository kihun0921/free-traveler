---
schema: traveler-screen-route-v1
task_id: COMP-SCR005-ADMIN
seq: 38
title: Admin: 신고 상태·외부 URL 설정
category: COMPONENT
implementation_status: IMPLEMENT
screen: SCR-005
route: `/account`
page_entry: -
priority: P0
depends_on: [API-BLOCK-REPORT, API-ADMIN-SETTINGS]
requirements: [REQ-FUNC-041, REQ-FUNC-077]
status: TODO
---

# COMP-SCR005-ADMIN — Admin: 신고 상태·외부 URL 설정

## Context

- Category: **COMPONENT** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 38)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: Manual Check

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-041, REQ-FUNC-077)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-041, REQ-FUNC-077

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-005 |
| Route | `/account` |
| Page Entry | -(Page Entry 없음 — 화면 조립 Task 아님) |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)
- 해당 Screen: `SCR-005` — `UI_CONTRACT.md`의 `SCR-005` 표를 그대로 인용해 AC를 검증한다.

## Depends On

- API-BLOCK-REPORT
- API-ADMIN-SETTINGS

## Expected Files

- `src/components/account/AdminPanel.tsx`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] 신고 목록 OPEN/RESOLVED/DISMISSED 필터+상태 변경
- [ ] 항공·호텔 외부 URL 입력(HTTPS 허용목록만 저장)

## Visual AC

- [ ] 표/리스트 기반, Dashboard·차트 없음
- [ ] Admin 외 역할에는 렌더링되지 않음

## Security/Privacy AC

- [ ] HTTP/`javascript:`/`data:` URL 저장 차단
- [ ] Admin 역할 서버 재검증

## Test Cases

- [ ] Manual Check: 로컬/프리뷰 배포에서 Functional/Visual AC를 사람이 직접 확인하고 스크린샷 또는 체크리스트로 기록

## Verify

Manual Check

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
