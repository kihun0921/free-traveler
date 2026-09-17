---
schema: traveler-screen-route-v1
task_id: DB-SEED-BASE
seq: 54
title: 로컬/QA용 Seed 데이터
category: DB
implementation_status: IMPLEMENT
screen: -
route: -
page_entry: -
priority: P1
depends_on: [DB-SCHEMA-BASE]
requirements: []
status: DONE
---

# DB-SEED-BASE — 로컬/QA용 Seed 데이터

## Context

- Category: **DB** / Implementation Status: **IMPLEMENT** / Priority: **P1**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 54)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: E2E-MATE-AUTH

## Project Scope

이 Task는 특정 REQ-FUNC/REQ-NF ID가 아니라 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 Section 계약을 충족하기 위한 Task이다(Requirement Ref: Section 계약 전용).

## Requirement Ref

-(Section 계약 전용)

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

- `supabase/seed.sql`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] E2E/Manual QA에 필요한 최소 mate_post/user_profile 샘플 데이터(연락처 패턴 미포함 예시 포함)

## Visual AC

- 이 Task는 시각적 요구사항이 없음(비-UI Task)

## Security/Privacy AC

- [ ] 실 개인정보 미포함(가상 데이터만)

## Test Cases

- [ ] E2E-MATE-AUTH: Playwright(Chromium)로 핵심 흐름 1개 이상 자동화

## Verify

E2E-MATE-AUTH

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
