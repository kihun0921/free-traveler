# Free Traveler — Project Rules (CLAUDE.md)

이 문서는 이 저장소(`traveler/app`)에서 작업하는 모든 Agent가 지켜야 하는 규칙을 담고 있다. 다른 규칙 파일을 참조(import)하지 않으며, 필요한 규칙은 모두 이 문서 안에 직접 기록한다.

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

## 필수 규칙

1. **작업 전 확인:** 작업을 시작하기 전 `package.json`(현재 의존성·스크립트)과 현재 설치된 Next.js 버전의 문서(`node_modules/next/dist/docs/`가 있으면 그것을 우선 확인)를 확인한다. 기억이나 학습 데이터에 있는 옛 Next.js API를 그대로 가정하지 않는다.
2. **SRS 정본은 `docs/06_SRS_UIUX_REVISED.md`다.** Route/Screen/DB 범위에 대해 이 문서와 다른 추정을 하지 않는다.
3. **Scope 분류 정본은 `docs/PROJECT_SCOPE.md`다.** 모든 REQ-FUNC/REQ-NF의 IMPLEMENT/EXCLUDED 상태는 이 문서를 따른다.
4. **디자인 정본은 `design-reference/D-001/DESIGN.md`다.** 색상·타이포·spacing·radius·Do/Do Not은 이 문서만 따른다(`design-reference/vendor/`는 구조 참고용일 뿐 정본이 아니다).
5. **Screen 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다.** Screen은 정확히 5개(`SCR-001`~`SCR-005`)이며, 이 JSON과 다른 Screen/Route를 임의로 만들지 않는다.
6. **`/run-wave WXX`를 표준 개발 명령으로 사용한다.** 임의의 다른 방식으로 여러 Task를 한꺼번에 착수하지 않는다.
7. **Wave 내부 Task는 Depends On 순서로 한 번에 하나만 구현한다.** 선행 Task가 끝나지 않은 상태에서 후행 Task를 먼저 건드리지 않는다.
8. **현재 Task의 Expected Files 밖 파일은 수정하지 않는다.** 추가 파일이 필요하면 Task 정의를 먼저 갱신한다.
9. **Page Owner Task는 Page Entry에서 Component를 실제로 조립한다.** Page Owner Task 안에서 새 하위 Component를 설계·생성하지 않는다(조립만 한다).
10. **SCR-001 완료 시 Next.js Starter를 제거한다.** `create-next-app` 기본 템플릿 마크업·로고·기본 링크가 남아 있으면 완료로 보지 않는다.
11. **SCR-003은 항공·숙소·동행 탭을 모두 조립한다.** 세 탭은 입력·검증·완료 상태를 서로 독립적으로 유지한다.
12. **항공·숙소 입력값은 서버·DB·URL·로그·분석으로 보내지 않는다.** Client Component의 로컬 상태에만 유지한다(브라우저 메모리 한정).
13. **Supabase 쓰기는 Auth·동행·신고·설정 범위로 제한한다.** 여행지·안전·대표 콘텐츠에는 Supabase 쓰기를 만들지 않는다(정적 데이터).
14. **RLS를 우회하는 Client 코드를 작성하지 않는다.** 클라이언트에서 역할/권한을 감추는 것만으로 끝내지 말고, 서버(RLS)에서도 항상 재검증한다.
15. **Service Role Key를 Client에서 사용하지 않는다.** 서비스 역할 키는 서버 전용 Supabase Client(`src/lib/supabase/server.ts`)에서만 참조하고, 클라이언트 번들에 포함되지 않아야 한다.
16. **여행지·안전·대표는 정적 Data를 사용한다.** `src/data/destinations.ts`, `src/data/safety.ts`, `src/data/about.ts` 외의 방식(DB, 외부 CMS)으로 이 콘텐츠를 구현하지 않는다.
17. **Prisma·ORM·AWS·EC2를 추가하지 않는다.** DB 접근은 Supabase JS SDK로 직접 하고, 인프라는 Vercel+Supabase로 고정한다.
18. **Playwright는 핵심 Smoke만 작성한다.** `chromium-smoke` 범위(Chromium 단일 브라우저, 핵심 흐름)를 넘는 다중 브라우저 매트릭스·시각적 회귀·부하 테스트를 추가하지 않는다.
19. **EXCLUDED 기능을 임의로 구현하지 않는다.** `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 Requirement는 구현 대상에 포함하지 않는다.
20. **destructive Git 명령을 임의로 사용하지 않는다.** `git reset --hard`, `git push --force`, `git clean -f`, 브랜치 강제 삭제 등은 사용자가 명시적으로 요청한 경우에만 사용한다.
21. **자동 PR·자동 Merge를 실행하지 않는다.** PR 생성과 `main` Merge는 항상 사람이 검토하고 수동으로 실행한다(`AUTO_MERGE=false`).
22. **사람의 Preview 확인 후 다음 화면 Wave로 진행한다.** 한 Wave의 화면 결과를 사람이 Preview로 확인하기 전에 다음 화면 Wave를 임의로 시작하지 않는다.
23. **작업 완료 시 변경 파일·검증 결과·남은 제한사항을 보고한다.** 무엇을 바꿨는지, 어떤 검증(Unit/Playwright/Manual)을 했는지, 아직 해결되지 않은 제한사항이 있는지 항상 명시적으로 보고한다.

## Task 완료 순서

1. **Task 읽기** — 해당 `TASKS/TASK-<ID>.md`의 Context, Requirement Ref, Depends On, Expected Files, AC를 전부 읽는다.
2. **입력 확인** — Design Ref(`design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`), Screen Contract, Depends On Task의 산출물이 실제로 존재하는지 확인한다.
3. **구현** — Expected Files 목록 안에서만 코드를 작성/수정한다.
4. **관련 포맷·Unit Test** — 관련 Lint/포맷터를 실행하고, 해당 Task에 명시된 Unit Test(있는 경우)를 작성·실행한다.
5. **필요 시 Playwright** — Task의 Verify에 E2E가 포함된 경우에만 `chromium-smoke` 범위로 실행한다.
6. **Diff 확인** — 변경된 파일이 Expected Files와 정확히 일치하는지 diff로 재확인한다.
7. **완료 보고** — 변경 파일 목록, 실행한 검증과 결과, 남아 있는 제한사항(있다면)을 보고한다.
