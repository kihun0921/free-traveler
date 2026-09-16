---
name: traveler-project-pipeline
description: Free Traveler(SCR-001~005) 구현 Task를 생성·상세화·검증하는 파이프라인. `/gen-tasklist`, `/gen-task-details`, `/audit-tasks` 슬래시 커맨드가 이 Skill의 규칙을 따른다. Task List/상세 문서를 만들거나 검증할 때, 또는 "Traveler Task 생성"·"Task 상세화"·"Task 감사" 요청 시 사용한다.
---

# Traveler Project Pipeline

Free Traveler 구현 작업을 **Task List → Task 상세 → 감사** 3단계로 생성·검증하는 Skill이다. `HARNESS_SCHEMA`는 **`traveler-screen-route-v1`**이며, 이 스키마의 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다. 이 값들은 루트 `CLAUDE.md`의 Harness Marker(`HARNESS_SCHEMA=traveler-screen-route-v1`, `DESIGN_PATH`, `SCREEN_CONTRACT`, `PROJECT_SCOPE`, `PLAYWRIGHT_ENABLED/SCOPE`, `AUTO_MERGE=false`, `AWS_ENABLED=false`)와 정확히 일치해야 한다.

## 0. 정본 입력 파일 (읽기 전용, 이 Skill이 직접 수정하지 않음)

| 파일 | 역할 |
|---|---|
| `CLAUDE.md` | Harness Marker와 23개 필수 규칙(자동 Merge 금지, RLS 우회 금지, Service Role Key 클라이언트 금지 등) — 이 Skill의 모든 산출물은 이 규칙과 충돌하지 않아야 한다 |
| `docs/06_SRS_UIUX_REVISED.md` | Route→Screen 매핑, DB 6테이블 한도, CON-15~17 |
| `docs/PROJECT_SCOPE.md` | **REQ별 IMPLEMENT/EXCLUDED 상태의 정본**(114건: REQ-FUNC-001~080, REQ-NF-001~034) |
| `design-reference/D-001/DESIGN.md` | 디자인 토큰, Section 계약, Do/Do Not (Status: LOCKED) |
| `design-reference/UI_CONTRACT.md` | Screen별 Section 순서·최소 콘텐츠·Empty State 요구(사람이 읽는 버전) |
| `design-reference/SCREEN_ROUTE_CONTRACT.json` | **Screen 목록의 정본**(schema `traveler-screen-route-v1`), 이 JSON과 `UI_CONTRACT.md`가 충돌하면 JSON이 우선 |
| `package.json`, `src/app/**` | 현재 스택(Next.js App Router)과 실제 파일 트리 — Expected Files 작성 전 반드시 Read/Glob으로 확인 |

이 Skill을 실행하기 전에 항상 `python scripts/validate_inputs.py`를 먼저 실행해 11개 입력 검사를 통과하는지 확인한다(`VALIDATE_INPUTS_PASS`). 실패하면 Task 생성을 진행하지 않는다.

## 1. 핵심 규칙 (모든 커맨드가 반드시 지킨다)

1. **HARNESS_SCHEMA는 `traveler-screen-route-v1`이다.** 이 문자열은 Task 상세 파일의 frontmatter(`schema:`)와 모든 스크립트의 검증 기준에 그대로 사용한다.
2. **Screen 목록의 정본은 `SCREEN_ROUTE_CONTRACT.json`이다.** Task를 만들기 전 이 JSON의 `screens[].id`가 정확히 `SCR-001~005` 5개인지 확인한다.
3. **정확히 5개 Screen 각각에 Page Owner Task를 하나씩 만든다.** 6개 이상 또는 4개 이하를 만들지 않는다.
4. **Expected Files는 실제 `src/app` 트리를 확인한 뒤 쓴다.** Read/Glob으로 현재 파일 존재 여부를 확인하지 않고 경로를 추정하지 않는다.
5. **Page Owner Task와 Component Task를 명확히 구분한다.** `category: PAGE_OWNER`는 화면 조립(Section 배치, 라우팅, 데이터 연결)만 책임지고, `category: COMPONENT`는 개별 UI 조각(Card, Form, Drawer 등)을 책임진다. Page Owner는 하위 Component를 새로 설계·생성하지 않는다.
6. **Page Owner는 같은 Screen의 Component Task에 의존한다.** `depends_on`에 동일 `screen` 값을 가진 `COMPONENT` Task ID를 최소 1개 이상 포함해야 한다.
7. **`src/app/page.tsx` Owner(SCR-001)는 "Next.js Starter 제거" Acceptance Criteria를 반드시 포함한다.** 현재 `src/app/page.tsx`는 `create-next-app` 기본 템플릿이며, AC에 "Next.js/Vercel 기본 템플릿 마크업과 로고, 기본 링크가 남아있지 않다"를 명시한다.
8. **`/travel-tools` Owner(SCR-003)는 항공·숙소·동행 탭을 실제로 조립하는 AC를 가진다.** 탭 3개(`flight`/`hotel`/`mate`)가 모두 렌더링되고 상태가 서로 분리됨을 AC로 명시한다.
9. **`/account` Owner(SCR-005)는 Guest·Member·Admin 상태를 실제로 조립하는 AC를 가진다.** 역할별로 렌더링되는 탭이 다름을 AC로 명시하고, 없는 역할의 탭은 렌더링되지 않음을 검증 항목으로 둔다.
10. **DB는 6개 테이블로 제한한다.** `docs/06_SRS_UIUX_REVISED.md` §3의 `user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting` 외 테이블을 만드는 Task를 생성하지 않는다.
11. **여행지·안전·대표 콘텐츠는 정적 데이터 Task로 만든다.** DB 스키마나 관리자 CMS Task가 아니라 `src/data/*.ts` 작성 Task(`category: DATA`)로 만든다.
12. **항공·숙소 입력값을 서버·DB·URL·로그·분석으로 보내지 않는다.** 관련 Task의 AC에 "Client Component의 브라우저 상태로만 유지, 서버 API/로그/DB/외부 URL query/분석 이벤트에 값이 나타나지 않는다"를 명시한다.
13. **Playwright는 Chromium Smoke Task만 만든다.** 다중 브라우저 매트릭스, 시각적 회귀, 부하 테스트 Task를 만들지 않는다.
14. **자동 Merge·EC2·AWS Task를 만들지 않는다.** Task 제목/설명에 "자동 병합", "Merge Runner", "EC2", "AWS" 키워드가 들어가는 Task를 생성하지 않는다. 배포는 Vercel, 데이터는 Supabase로 고정(`CLAUDE.md`의 `AUTO_MERGE=false`, `AWS_ENABLED=false`와 일치).
15. **114개 Requirement 전부에 IMPLEMENT 또는 EXCLUDED 상태를 기록한다.** `docs/PROJECT_SCOPE.md`의 114건(REQ-FUNC 80 + REQ-NF 34)을 그대로 인용하며, Task 상세의 `requirements:` 필드에 등장하는 IMPLEMENT ID의 합집합이 IMPLEMENT 전체(92건)와 정확히 일치해야 한다.
16. **EXCLUDED는 상세 구현 Task를 만들지 않지만 표에서 삭제하지 않는다.** EXCLUDED 22건은 어떤 Task의 `requirements:`에도 등장해서는 안 되며, `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)에 그대로 남는다.
17. **Task List와 상세 파일은 1:1이어야 한다.** `TASKS/00_TASK_LIST.md`에 있는 모든 구현 Task ID는 `TASKS/TASK-<ID>.md`가 있어야 하고, 그 반대도 성립해야 한다.
18. **상세 생성 후 `python scripts/audit_tasks.py`를 실행한다.** `/gen-task-details` 실행 마지막 단계는 항상 이 스크립트 실행이며, **`AUDIT_FAIL`을 무시하고 완료로 보고하지 않는다.**
19. **Page Owner Acceptance Criteria에 화면별 Section 순서와 최소 콘텐츠 수를 기록한다.** `design-reference/UI_CONTRACT.md`의 표를 AC에 그대로 인용한다.
20. **Page Owner는 큰 빈 영역·Placeholder 문구를 금지하고, Empty State에 안내·이용 방법·CTA를 요구한다.** AC에 "Lorem ipsum/준비 중/정보 확인 필요 금지", "Empty State는 안내 문장+이용 방법+다음 행동 CTA 3요소를 갖춘다"를 명시한다.

## 2. Task 파일 형식 (모든 커맨드·스크립트 공통)

### 2.1 Task List — `TASKS/00_TASK_LIST.md`

16개 컬럼 고정 Markdown 표(현재 실제 산출물이 이 형식을 따른다):

```
| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
```

- `Task ID`: 의미 기반 접두사(`PAGE-`, `COMP-`, `DATA-`, `DB-`, `API-`/`AUTH-`, `SEC-`, `UNIT-`, `TEST-`, `E2E-`, `CI-`, `RELEASE-`).
- `Category`: `PAGE_OWNER` \| `COMPONENT` \| `DATA` \| `DB` \| `AUTH` \| `API` \| `SEC` \| `UNIT_TEST` \| `RLS_TEST` \| `E2E_TEST` \| `CI` \| `RELEASE_CHECK`.
- `Requirement Ref`: 이 Task가 다루는 IMPLEMENT REQ ID(쉼표 구분, `REQ-FUNC-XXX` 전체 표기). Section 계약 전용 Task는 `-(Section 계약: ...)`.
- `Depends On` / `Expected Files`: 쉼표 구분 목록, 없으면 `-`.
- §5(문서 하단)에 **NON_IMPLEMENTATION 표**를 두어 EXCLUDED 22건의 사유·후속 방향을 기록한다.

### 2.2 Task 상세 — `TASKS/TASK-<Task ID>.md`

```markdown
---
schema: traveler-screen-route-v1
task_id: PAGE-SCR001
seq: 1
title: ...
category: PAGE_OWNER
implementation_status: IMPLEMENT
screen: SCR-001
route: `/`
page_entry: `src/app/page.tsx`
priority: P0
depends_on: [COMP-SCR001-HERO, ...]
requirements: [REQ-FUNC-001, REQ-FUNC-002, ...]
status: TODO
---

## Context
## Project Scope
## Requirement Ref
## Screen / Route / Page Entry
## Design Ref
## Depends On
## Expected Files
## Functional AC
## Visual AC
## Security/Privacy AC
## Test Cases
## Verify
## Definition of Done
## Forbidden
```

13개 절(Context 포함)을 모두 갖춘다. `scripts/gen_task_details.py`가 `TASKS/00_TASK_LIST.md`를 파싱해 이 형식으로 자동 생성한다.

## 3. 워크플로

1. `python scripts/validate_inputs.py` — 입력 검사 11개. `VALIDATE_INPUTS_PASS`가 아니면 중단.
2. `/gen-tasklist` — `TASKS/00_TASK_LIST.md` 생성/갱신(§2.1 형식). 예상 45~80개(개수 자체는 완료 조건이 아니다 — §1의 규칙 충족이 완료 조건이다).
3. `/gen-task-details` — `python scripts/gen_task_details.py` 실행(중복 ID/빈 필수 열/끊긴 Depends On을 먼저 검사한 뒤, 이미 존재하는 파일은 건너뛰고 없는 파일만 생성) → 마지막에 `python scripts/audit_tasks.py` 자동 실행 → **FAIL이면 완료로 보고하지 않고 최소 수정 후 재실행**.
4. `/audit-tasks` — `python scripts/audit_tasks.py`를 언제든 재실행(18개 검사, `TASKS/TASK_MANIFEST.csv` + `TASKS/TASK_AUDIT_REPORT.md` 갱신). `AUDIT_FAIL`은 절대 무시하지 않는다.

## 4. 이 Skill이 절대 하지 않는 것

- 실제 구현 코드 작성(컴포넌트/페이지 소스 작성) — Task 정의·감사까지만.
- `TaskCreate` 등 별도 Task 관리 도구로 실제 작업 Task를 생성 — 이 파이프라인은 문서(`TASKS/*.md`, `TASKS/*.csv`)로만 관리한다.
- EXCLUDED Requirement를 구현 대상으로 복원.
- 5개 초과 Page Owner 또는 6개 초과 DB 테이블 생성.
- Task Audit(`scripts/audit_tasks.py`)의 FAIL을 무시하거나, FAIL 상태에서 작업을 완료로 보고.
