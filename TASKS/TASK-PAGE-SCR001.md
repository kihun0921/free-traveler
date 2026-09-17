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
status: DONE
---

# PAGE-SCR001 ??SCR-001 `/` 메인 Page Owner

## Context

- Category: **PAGE_OWNER** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- ??Task??`TASKS/00_TASK_LIST.md`(Seq 1)?�서 ?�생?�었?�며, ?�우??매핑?� `docs/06_SRS_UIUX_REVISED.md` §2�??�른??
- Verify 방법: E2E-PUBLIC-SMOKE, Manual Check

## Project Scope

??Task가 ?�루??Requirement(REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-050, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-069)??`docs/PROJECT_SCOPE.md` 기�? **IMPLEMENT**?�다. EXCLUDED Requirement????Task??범위???�함?��? ?�으�? EXCLUDED 목록?� `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)�?참조?�다.

## Requirement Ref

REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-050, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-069

## Screen / Route / Page Entry

| ??�� | �?|
|---|---|
| Screen | SCR-001 |
| Route | `/` |
| Page Entry | `src/app/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` ???�자???�큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` ??Screen�?Section ?�서·최소 콘텐츠·Empty State ?�구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` ??Screen/Route/Section ?�본(schema `traveler-screen-route-v1`)
- ?�당 Screen: `SCR-001` ??`UI_CONTRACT.md`??`SCR-001` ?��? 그�?�??�용??AC�?검증한??

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

> ??Task????Depends On??Component/Data/API Task가 만든 결과물을 **Route Page(`src/app/page.tsx`)�?조립?�는 것만** 범위�??�다. ?�로???�위 Component/Data/API Task�???문서 ?�에??추�?�?만들지 ?�는??

## Expected Files

- `src/app/page.tsx`(?�정 ???�재 create-next-app 기본 ?�플�??�거 ?�요)

> **??목록 밖의 ?�일?� ?�정?��? ?�는??** 추�? ?�일???�요?�면 `TASKS/00_TASK_LIST.md`�?먼�? 갱신??????문서�??�시 ?�성?�다.

## Functional AC

- [ ] Section ?�서 고정: Hero?�국??6?�해??6?�여???�기 6?�국가�?주의?�항 6?�최�??�행글 3(?�는 ?�성??Empty State)?�free_traveler ?�개
- [ ] Section�??�이??출처: �?��/?�외=`DATA-DESTINATIONS`, ?�전=`DATA-SAFETY`, ?�개=`DATA-REPRESENTATIVE`, ?�행글=`API-MATE-POSTS`(?�기?�용)
- [ ] ?�행지/?�전 Drawer??SCR-001 ?�에???�림(별도 ?�우???�님)

## Visual AC

- [ ] Next.js/Vercel create-next-app 기본 ?�플�?마크?�·로고·기�?링크 ?�전 ?�거
- [ ] 최소 콘텐�? �?�� Card 6, ?�외 Card 6, ?�마 Chip 6, ?�전 Card 6, ?�행글 3
- [ ] Desktop 1440(3~4??/Mobile 390(1?? 반응??콘텐�?밀??준??- [ ] Lorem ipsum·준�?중·정�??�인 ?�요·?�용 ?�는 Card 금�?
- [ ] 최근 ?�행글 0�????�내 문장+?�용 방법+?�성 CTA�?갖춘 ?�성??Empty State
- [ ] Loading: ?�행글 미리보기(`API-MATE-POSTS`) 조회 중에???�켈?�톤 Card ?�시(?�피?�만 ?�는 �??�면 금�?, `design-reference/D-001/DESIGN.md` §14)
- [ ] Error: ?�행글 미리보기 조회 ?�패 ??critical ?�큰 ?�류 문구+?�시???�공(무한 로딩 금�?)

## Security/Privacy AC

- [ ] 즐겨찾기??localStorage�??�용(?�버 미전??
- [ ] ?�전?�보 stale 배�???코랄�?분리??amber ?�큰

## Test Cases

- [ ] E2E-PUBLIC-SMOKE: Playwright(Chromium)�??�심 ?�름 1�??�상 ?�동??- [ ] Manual Check: 로컬/?�리�?배포?�서 Functional/Visual AC�??�람??직접 ?�인?�고 ?�크린샷 ?�는 체크리스?�로 기록

## Verify

E2E-PUBLIC-SMOKE, Manual Check

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
- ??Task ?�에????Component ?�위 ?�일??직접 ?�계·?�성(조립�??�당 ??Depends On??Component/Data/API Task ?�출물을 조합)
- Section ?�서 변�??�는 ?�의 Section 추�?/??��
- Lorem ipsum, `준�?�?, `?�보 ?�인 ?�요` 문구 ?�용
