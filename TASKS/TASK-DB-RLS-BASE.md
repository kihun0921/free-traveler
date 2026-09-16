---
schema: traveler-screen-route-v1
task_id: DB-RLS-BASE
seq: 52
title: RLS 정책
category: DB
implementation_status: IMPLEMENT
screen: -
route: -
page_entry: -
priority: P0
depends_on: [DB-SCHEMA-BASE]
requirements: [REQ-FUNC-044, REQ-NF-013]
status: TODO
---

# DB-RLS-BASE — RLS 정책

## Context

- Category: **DB** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 52)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: TEST-RLS-BASIC

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-044, REQ-NF-013)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-044, REQ-NF-013

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | - |
| Route | - |
| Page Entry | -(Page Entry 없음 — 화면 조립 Task 아님) |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)

## Depends On

- DB-SCHEMA-BASE

## Expected Files

- `supabase/migrations/0002_rls.sql`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] 본인 글/요청, 대상 작성자, Admin만 비공개 데이터 열람
- [ ] 그 외 403/빈 결과

## Visual AC

- 이 Task는 시각적 요구사항이 없음(비-UI Task)

## Security/Privacy AC

- [ ] 권한별 부정 접근 테스트 전부 차단

## Test Cases

- [ ] TEST-RLS-BASIC

## Verify

TEST-RLS-BASIC

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
- 허용된 6개 테이블(app_setting, mate_application, mate_post, report, user_block, user_profile) 외 신규 테이블 생성
- `AUDIT_LOG` 등 EXCLUDED 처리된 엔터티 재도입
