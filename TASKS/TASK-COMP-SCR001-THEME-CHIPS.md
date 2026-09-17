---
schema: traveler-screen-route-v1
task_id: COMP-SCR001-THEME-CHIPS
seq: 9
title: ?¬í–‰ ?™ê¸°Â·?Œë§ˆ Chip(Section4)
category: COMPONENT
implementation_status: IMPLEMENT
screen: SCR-001
route: `/`
page_entry: -
priority: P1
depends_on: [COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-OVERSEAS-GRID]
requirements: []
status: DONE
---

# COMP-SCR001-THEME-CHIPS ???¬í–‰ ?™ê¸°Â·?Œë§ˆ Chip(Section4)

## Context

- Category: **COMPONENT** / Implementation Status: **IMPLEMENT** / Priority: **P1**
- ??Task??`TASKS/00_TASK_LIST.md`(Seq 9)?ì„œ ?Œìƒ?˜ì—ˆ?¼ë©°, ?¼ìš°??ë§¤í•‘?€ `docs/06_SRS_UIUX_REVISED.md` Â§2ë¥??°ë¥¸??
- Verify ë°©ë²•: Manual Check

## Project Scope

??Task???¹ì • REQ-FUNC/REQ-NF IDê°€ ?„ë‹ˆ??`design-reference/SCREEN_ROUTE_CONTRACT.json`??Section ê³„ì•½??ì¶©ì¡±?˜ê¸° ?„í•œ Task?´ë‹¤(Requirement Ref: Section ê³„ì•½ ?„ìš©).

## Requirement Ref

-(Section ê³„ì•½ ?„ìš©)

## Screen / Route / Page Entry

| ??ª© | ê°?|
|---|---|
| Screen | SCR-001 |
| Route | `/` |
| Page Entry | -(Page Entry ?†ìŒ ???”ë©´ ì¡°ë¦½ Task ?„ë‹˜) |

## Design Ref

- `design-reference/D-001/DESIGN.md` ???”ì??? í°, Do/Do Not, Section ê³„ì¸µÂ·ë¦¬ë“¬ ê·œì¹™(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` ??Screenë³?Section ?œì„œÂ·ìµœì†Œ ì½˜í…ì¸ Â·Empty State ?”êµ¬
- `design-reference/SCREEN_ROUTE_CONTRACT.json` ??Screen/Route/Section ?•ë³¸(schema `traveler-screen-route-v1`)
- ?´ë‹¹ Screen: `SCR-001` ??`UI_CONTRACT.md`??`SCR-001` ?œë? ê·¸ë?ë¡??¸ìš©??ACë¥?ê²€ì¦í•œ??

## Depends On

- COMP-SCR001-DOMESTIC-GRID
- COMP-SCR001-OVERSEAS-GRID

## Expected Files

- `src/components/destinations/ThemeChips.tsx`(? ê·œ)

> **??ëª©ë¡ ë°–ì˜ ?Œì¼?€ ?˜ì •?˜ì? ?ŠëŠ”??** ì¶”ê? ?Œì¼???„ìš”?˜ë©´ `TASKS/00_TASK_LIST.md`ë¥?ë¨¼ì? ê°±ì‹ ??????ë¬¸ì„œë¥??¤ì‹œ ?ì„±?œë‹¤.

## Functional AC

- [ ] ?Œë§ˆ 6ê°??ì—°/?„ì‹¬/ë¯¸ì‹/?´ì–‘/?¡í‹°ë¹„í‹°/ê°€ì¡±ì—¬?? ? íƒ ????Gridë¥?ê°™ì? ?”ë©´?ì„œ ?„í„°ë§?

## Visual AC

- [ ] Chip ëª©ë¡ ?¨í„´(Card Grid ë°˜ë³µ ê¸ˆì?), Desktop/Mobile ëª¨ë‘ wrap

## Security/Privacy AC

- ??Task???¹í™”??ë³´ì•ˆ/ê°œì¸?•ë³´ ?”êµ¬?¬í•­ ?†ìŒ(?„ì—­ SEC-BASELINEÂ·DB-RLS-BASEë¥??°ë¦„)

## Test Cases

- [ ] Manual Check: ë¡œì»¬/?„ë¦¬ë·?ë°°í¬?ì„œ Functional/Visual ACë¥??¬ëŒ??ì§ì ‘ ?•ì¸?˜ê³  ?¤í¬ë¦°ìƒ· ?ëŠ” ì²´í¬ë¦¬ìŠ¤?¸ë¡œ ê¸°ë¡

## Verify

Manual Check

## Definition of Done

- [ ] Functional AC, Visual AC, Security/Privacy AC ??ª© ?„ë? ì¶©ì¡±
- [ ] Expected Files ëª©ë¡??ëª…ì‹œ???Œì¼ë§??ì„±/?˜ì •??ê·????Œì¼ ë³€ê²??†ìŒ)
- [ ] Test Cases??ëª…ì‹œ??ë°©ë²•?¼ë¡œ ?•ì¸ ?„ë£Œ(Unit/E2E???µê³¼, Manual/Release Check??ì²´í¬ë¦¬ìŠ¤??ê¸°ë¡)
- [ ] `design-reference/D-001/DESIGN.md`??Do/Do Not ?„ë°˜ ?†ìŒ(Lorem ipsumÂ·ì¤€ë¹?ì¤‘Â·ì •ë³??•ì¸ ?„ìš”Â·ë¹?CardÂ·?ˆì•½/ê²°ì œ UIÂ·ë³„ì /ë§¤ë„ˆ?¨ë„ ?†ìŒ)
- [ ] `python scripts/audit_tasks.py` ?¬ì‹¤??????Task?€ ê´€?¨ëœ FAIL ??ª© ?†ìŒ

## Forbidden

- EC2Â·AWS ??ë¯¸ìŠ¹???¸í”„???¬ìš©/?¸ê¸‰
- ?ˆì•½Â·ê²°ì œÂ·ì²´í¬?„ì›ƒ UI, ê°€ê²???$) ?œê¸°
- ë³„ì Â·ë¦¬ë·°Â·?˜ì¹˜??? ë¢°??ë°°ì?(?? ë§¤ë„ˆ?¨ë„)
- Expected Files ëª©ë¡ ë°??Œì¼ ?ì„±Â·?˜ì •
- ?ë™ Merge/Merge Runner êµ¬ì„±
