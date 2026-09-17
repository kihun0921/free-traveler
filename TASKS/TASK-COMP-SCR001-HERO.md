---
schema: traveler-screen-route-v1
task_id: COMP-SCR001-HERO
seq: 6
title: ?�행지 검??Hero(Section1)
category: COMPONENT
implementation_status: IMPLEMENT
screen: SCR-001
route: `/`
page_entry: -
priority: P0
depends_on: [DATA-DESTINATIONS]
requirements: [REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-010, REQ-FUNC-067, REQ-NF-004]
status: DONE
---

# COMP-SCR001-HERO ???�행지 검??Hero(Section1)

## Context

- Category: **COMPONENT** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- ??Task??`TASKS/00_TASK_LIST.md`(Seq 6)?�서 ?�생?�었?�며, ?�우??매핑?� `docs/06_SRS_UIUX_REVISED.md` §2�??�른??
- Verify 방법: Manual Check

## Project Scope

??Task가 ?�루??Requirement(REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-010, REQ-FUNC-067, REQ-NF-004)??`docs/PROJECT_SCOPE.md` 기�? **IMPLEMENT**?�다. EXCLUDED Requirement????Task??범위???�함?��? ?�으�? EXCLUDED 목록?� `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)�?참조?�다.

## Requirement Ref

REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-010, REQ-FUNC-067, REQ-NF-004

## Screen / Route / Page Entry

| ??�� | �?|
|---|---|
| Screen | SCR-001 |
| Route | `/` |
| Page Entry | -(Page Entry ?�음 ???�면 조립 Task ?�님) |

## Design Ref

- `design-reference/D-001/DESIGN.md` ???�자???�큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` ??Screen�?Section ?�서·최소 콘텐츠·Empty State ?�구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` ??Screen/Route/Section ?�본(schema `traveler-screen-route-v1`)
- ?�당 Screen: `SCR-001` ??`UI_CONTRACT.md`??`SCR-001` ?��? 그�?�??�용??AC�?검증한??

## Depends On

- DATA-DESTINATIONS

## Expected Files

- `src/components/destinations/Hero.tsx`(?�규)

> **??목록 밖의 ?�일?� ?�정?��? ?�는??** 추�? ?�일???�요?�면 `TASKS/00_TASK_LIST.md`�?먼�? 갱신??????문서�??�시 ?�성?�다.

## Functional AC

- [ ] ?�합 검???�행지+?�전?�보)+?�터(�??/?�시/계절/?�마/기간, AND 조건)+�?결과 ??조건 ?�화 ?�내·초기??
- [ ] ?�터 ?�태 URL query ?�기???�용 ?�터�?

## Visual AC

- [ ] 1440?�서 Hero가 ?�체 ?�이�?차�??��? ?�고 ?�음 Section ?�작??보임
- [ ] Mobile ?�체??pill 검???�력

## Security/Privacy AC

- [ ] ?�터/검?�어�??�버 로그???�문 ?�?�하지 ?�음(분석 ?�벤?�는 ?�용 ?�성�?

## Test Cases

- [ ] Manual Check: 로컬/?�리�?배포?�서 Functional/Visual AC�??�람??직접 ?�인?�고 ?�크린샷 ?�는 체크리스?�로 기록

## Verify

Manual Check

## Definition of Done

- [ ] Functional AC, Visual AC, Security/Privacy AC ??�� ?��? 충족
- [ ] Expected Files 목록??명시???�일�??�성/?�정??�????�일 변�??�음)
- [ ] Test Cases??명시??방법?�로 ?�인 ?�료(Unit/E2E???�과, Manual/Release Check??체크리스??기록)
- [ ] `design-reference/D-001/DESIGN.md`??Do/Do Not ?�반 ?�음(Lorem ipsum·준�?중·정�??�인 ?�요·�?Card·?�약/결제 UI·별점/매너?�도 ?�음)
- [ ] `python scripts/audit_tasks.py` ?�실??????Task?� 관?�된 FAIL ??�� ?�음

## Forbidden

- EC2·AWS ??미승???�프???�용/?�급
- ?�약·결제·체크?�웃 UI, 가�???$) ?�기
- 별점·리뷰·?�치???�뢰??배�?(?? 매너?�도)
- Expected Files 목록 �??�일 ?�성·?�정
- ?�동 Merge/Merge Runner 구성
