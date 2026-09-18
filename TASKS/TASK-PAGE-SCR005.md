---
schema: traveler-screen-route-v1
task_id: PAGE-SCR005
seq: 5
title: SCR-005 `/account` Page Owner
category: PAGE_OWNER
implementation_status: IMPLEMENT
screen: SCR-005
route: `/account`
page_entry: `src/app/account/page.tsx`
priority: P0
depends_on: [COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-MY-ACTIVITY, COMP-SCR005-ADMIN, COMP-GLOBAL-HEADER-FOOTER, AUTH-SUPABASE-SETUP, API-MATE-POSTS, API-BLOCK-REPORT, API-ADMIN-SETTINGS]
requirements: [REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-038, REQ-FUNC-041, REQ-FUNC-066, REQ-FUNC-077]
status: DONE
---

# PAGE-SCR005 — SCR-005 `/account` Page Owner

## Context

- Category: **PAGE_OWNER** / Implementation Status: **IMPLEMENT** / Priority: **P0**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq 5)에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: E2E-MATE-AUTH, Manual Check

## Project Scope

이 Task가 다루는 Requirement(REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-038, REQ-FUNC-041, REQ-FUNC-066, REQ-FUNC-077)는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다.

## Requirement Ref

REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-038, REQ-FUNC-041, REQ-FUNC-066, REQ-FUNC-077

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-005 |
| Route | `/account` |
| Page Entry | `src/app/account/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)
- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)
- 해당 Screen: `SCR-005` — `UI_CONTRACT.md`의 `SCR-005` 표를 그대로 인용해 AC를 검증한다.

## Depends On

- COMP-SCR005-AUTH
- COMP-SCR005-PROFILE
- COMP-SCR005-MY-ACTIVITY
- COMP-SCR005-ADMIN
- COMP-GLOBAL-HEADER-FOOTER
- AUTH-SUPABASE-SETUP
- API-MATE-POSTS
- API-BLOCK-REPORT
- API-ADMIN-SETTINGS

> 이 Task는 위 Depends On의 Component/Data/API Task가 만든 결과물을 **Route Page(`src/app/account/page.tsx`)로 조립하는 것만** 범위로 한다. 새로운 하위 Component/Data/API Task를 이 문서 안에서 추가로 만들지 않는다.

## Expected Files

- `src/app/account/page.tsx`(신규)

> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다.

## Functional AC

- [ ] 역할별 Section 순서: Guest=로그인 Intro→로그인/가입/재설정 Card→로그인 후 가능 기능→보안 안내
- [ ] Member=프로필 Intro→프로필·성인확인·내 활동(내 글/참가요청/즐겨찾기/차단)→다음 행동
- [ ] Admin=관리 Intro→신고 상태 변경·외부 URL 설정→도움말
- [ ] 데이터 출처=`AUTH-SUPABASE-SETUP`(세션), `API-MATE-POSTS`/`API-BLOCK-REPORT`(내 활동), `API-ADMIN-SETTINGS`(관리자)

## Visual AC

- [ ] Guest/Member/Admin 3역할이 실제로 서로 다른 콘텐츠를 렌더링하고, 역할에 없는 관리 영역(예: Guest에게 관리자 탭)은 DOM에 렌더링되지 않음
- [ ] 목록형 Section(내 글/참가요청/차단목록/신고목록) 데이터 없을 때 안내+이용 방법+CTA를 갖춘 완성형 Empty State
- [ ] Lorem ipsum·준비 중·정보 확인 필요 금지
- [ ] Dashboard·통계 차트 없음(리스트/표 기반)
- [ ] Loading: 로그인/가입/재설정 제출과 내 활동 목록 조회 중 버튼 disabled+진행 표시 또는 스켈레톤, 관리자 신고 상태 변경·외부 URL 저장 중에도 동일 처리
- [ ] Error: 인증 실패·목록 조회 실패·설정 저장 실패 시 critical 토큰 오류 문구+재시도 제공

## Security/Privacy AC

- [ ] 역할·권한은 서버(RLS)에서도 재검증(클라이언트 숨김만으로 끝내지 않음)
- [ ] 외부 URL 저장은 HTTPS 허용목록만

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
