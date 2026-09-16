---
description: Free Traveler 구현 Task List(TASKS/00_TASK_LIST.md)를 생성하거나 갱신한다. traveler-project-pipeline Skill의 규칙을 따른다.
---

`traveler-project-pipeline` Skill을 로드하고 그 규칙(HARNESS_SCHEMA `traveler-screen-route-v1`, §1의 20개 핵심 규칙)을 그대로 따른다. **실제 구현 코드(컴포넌트/페이지 소스)는 작성하지 않는다** — 이 커맨드의 산출물은 `TASKS/00_TASK_LIST.md` 문서뿐이다.

## 실행 순서 (모두 실제 파일을 Read/Glob으로 확인하고, 내용을 추정하지 않는다)

1. `python scripts/validate_inputs.py`를 실행한다. `VALIDATE_INPUTS_PASS`가 아니면 원인을 그대로 보고하고 중단한다.
2. `design-reference/SCREEN_ROUTE_CONTRACT.json`을 Read로 열어 5개 Screen(SCR-001~005)의 `route`/`filePath`/`tabs`/`roles`/`sections`를 확인한다.
3. `docs/PROJECT_SCOPE.md`를 Read로 열어 REQ-FUNC-001~080, REQ-NF-001~034(총 114건)의 IMPLEMENT/EXCLUDED 상태를 확인한다.
4. `docs/06_SRS_UIUX_REVISED.md` §3에서 DB 6개 테이블 목록(`user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting`)을 확인한다.
5. `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`를 Read로 열어 Section 계약과 Do/Do Not을 확인한다.
6. 현재 `src/app` 파일 트리를 Glob(`src/app/**`)으로 실제 확인한다(추정하지 않는다). 이미 `TASKS/00_TASK_LIST.md`가 있으면 Read로 먼저 열어 현재 내용을 확인하고, 처음부터 다시 쓰지 않고 필요한 부분만 갱신한다.

## Task List 구성 원칙

- **Page Owner Task 5개**: SCR-001~005 각 1개. 화면 조립·Section 배치·라우팅·데이터 연결만 책임진다.
  - `PAGE-SCR001`(`src/app/page.tsx`)은 "Next.js Starter 제거"를 Functional/Visual AC에 포함한다.
  - `PAGE-SCR003`(`src/app/travel-tools/page.tsx`)은 항공·숙소·동행 3탭 조립을 포함한다.
  - `PAGE-SCR005`(`src/app/account/page.tsx`)은 Guest·Member·Admin 3역할 조립을 포함한다.
- **Component Task**: Screen별 Section/Drawer/Card/Form 단위로 분해한다. 각 Component Task는 정확히 하나의 `Screen`에 속한다. SCR-003(항공/숙소/동행 작성), SCR-004(목록/필터/상세/참가/신고/차단), SCR-005(Auth/Profile/My Activity/Admin)는 원칙대로 각각 분리한다.
- **Data Task**: 여행지·안전정보·대표 소개는 DB가 아니라 `src/data/*.ts` 정적 데이터 Task(`Category: DATA`)로 만든다.
- **DB Task**: Schema·RLS·Access·Seed를 4개의 별도 Task로 만든다(`DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-ACCESS`, `DB-SEED-BASE`). 6개 테이블 한도를 넘지 않는다.
- **Auth/API Task**: Supabase Auth 연동, 동행글/참가요청/차단·신고/관리자 설정 API, 외부 URL 검증, 연락처 탐지 로직을 분리한다.
- **Test Task**: Playwright는 **Chromium** 기준 핵심 흐름 5~7개를 2~3개 Task로 묶는다. Unit Test는 날짜 검증·연락처 탐지·동행 상태 전이를 각각 분리한다. 다중 브라우저·부하 테스트 Task는 만들지 않는다.
- **CI/Release Task**: GitHub Actions Lint/Typecheck/Unit/Build 게이트, Vercel/Supabase 배포 확인, 성능·접근성·SEO·비용 수동 점검을 Task로 둔다. EC2·AWS·자동 Merge Runner Task는 절대 만들지 않는다.
- 항공·숙소 입력값을 서버/DB/URL/로그/분석으로 보내지 않는다는 제약을 관련 Task의 Functional AC/Security AC에 반영한다.
- 예상 Task 총수는 45~80개이지만, 개수 자체를 목표로 채우거나 줄이지 않는다 — Skill §1의 규칙(1:1 매핑, Requirement 커버리지, 6테이블 한도, 의존성 무순환 등) 충족이 기준이다.

## Requirement 배분

- `docs/PROJECT_SCOPE.md`의 IMPLEMENT 92건이 Task들의 `Requirement Ref` 칼럼에 정확히 한 번 이상씩 등장하도록 배분한다(중복 배분은 허용하되 누락은 금지).
- EXCLUDED 22건은 어떤 Task의 `Requirement Ref`에도 넣지 않고, 문서 §5(NON_IMPLEMENTATION)에 사유·후속 방향과 함께 기록한다.

## 출력

`TASKS/00_TASK_LIST.md`를 `traveler-project-pipeline` Skill §2.1 형식(16개 컬럼)으로 작성 또는 갱신한다. 문서 상단에 다음 집계를 포함한다:

- Task 총수, Category별 건수, Screen별 Page Owner/Component 건수
- Requirement 커버리지: IMPLEMENT 92건 중 배분된 건수/누락 건수, EXCLUDED 22건 목록
- DB 테이블 수(6 이하 확인)

작성 후 표의 `Depends On` 열에 존재하지 않는 Task ID나 순환 참조가 없는지 직접 대조한다(다음 단계인 `/gen-task-details`가 `scripts/gen_task_details.py`로 다시 검증하지만, 이 단계에서도 눈으로 먼저 확인한다).

## 금지

- `TASKS/TASK-*.md` 상세 파일을 생성하지 않는다(`/gen-task-details`의 역할).
- 실제 컴포넌트/페이지 구현 코드를 작성하지 않는다.
- EXCLUDED Requirement를 `Requirement Ref`에 배분하지 않는다.
