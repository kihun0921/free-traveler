---
description: prepare-task가 READY_TO_IMPLEMENT로 판정한 Task 하나를 실제로 구현한다. 기본적으로 Commit·Push·PR은 수행하지 않는다.
---

`traveler-project-pipeline` Skill과 루트 `CLAUDE.md`의 23개 규칙을 로드한다. 이 커맨드는 **이번 파이프라인에서 실제 구현 코드를 작성하는 유일한 단계**다. Task는 정확히 **하나**만 구현한다 — 여러 Task를 한 번에 구현하지 않는다.

## 0. 착수 전제: `/prepare-task`가 `READY_TO_IMPLEMENT`를 출력한 Task만 구현한다

1. 사용자가 지정한 `WAVE_ID`/`TASK_ID`에 대해 `/prepare-task <WAVE_ID> <TASK_ID>`를 방금 실행한 결과가 있는지 확인한다.
   - 이번 대화에서 아직 실행하지 않았다면 **먼저 `/prepare-task`를 실행**한다.
   - 결과가 `READY_TO_IMPLEMENT`가 아니면(`BLOCKED_INPUT`/`BLOCKED_DIRTY_TREE`/`BLOCKED_DEPENDENCY`/`BLOCKED_SCOPE`) **구현을 시작하지 않고** 그 판정과 이유를 그대로 보고한 뒤 중단한다.
2. `TASKS/TASK-<TASK_ID>.md`를 Read로 다시 열어 Context, Requirement Ref, Depends On, Expected Files, Functional/Visual/Security-Privacy AC, Test Cases, Verify, Definition of Done, Forbidden 절을 전부 확인한다.

## 1. Expected Files 안에서만 작업한다

- `## Expected Files`에 나열된 경로 목록을 그대로 작업 대상으로 고정한다.
- 이 목록에 없는 파일은 생성·수정·삭제하지 않는다. 구현 중 목록 밖 파일이 필요하다고 판단되면, 임의로 추가하지 않고 **작업을 멈추고 사용자에게 보고**한다(Task 정의 자체를 먼저 갱신해야 하는 상황이므로 `/gen-tasklist`/`/gen-task-details`로 되돌아가야 한다).
- `(신규)`로 표시된 파일은 새로 만들고, `(수정)`으로 표시된 파일만 기존 내용을 편집한다.

## 2. Functional / Visual / Security-Privacy AC를 그대로 따른다

- `## Functional AC`, `## Visual AC`, `## Security/Privacy AC`의 각 체크박스 항목을 구현 목표로 삼는다.
- `design-reference/D-001/DESIGN.md`(디자인 토큰, Do/Do Not)와 `design-reference/UI_CONTRACT.md`(Section 순서·최소 콘텐츠·Empty State 요구)를 Read로 열어 AC 문구가 요구하는 실제 값(색상 토큰, Section 순서, 최소 개수 등)을 그대로 반영한다.
- Lorem ipsum, `준비 중`, `정보 확인 필요`, 텍스트 없는 빈 Card는 만들지 않는다. 데이터가 없는 목록형 Section은 안내 문장 + 이용 방법 + 다음 행동 CTA 3요소를 갖춘 완성형 Empty State로 구현한다.

## 3. Page Owner Task는 실제 Page Entry를 조립한다

- `category: PAGE_OWNER`인 Task는 `page_entry`(예: `src/app/page.tsx`)에 **Depends On에 나열된 Component/Data/API Task의 산출물을 실제로 import하고 배치**한다.
- 이 단계에서 새 하위 Component를 설계·생성하지 않는다. 필요한 Component가 아직 없다면(해당 Depends On Task가 미구현 상태), 임의로 인라인 구현하지 않고 그 사실을 보고한 뒤 중단한다(`BLOCKED_DEPENDENCY`와 동일한 상황이며, `/prepare-task`가 이미 걸러냈어야 한다).
- `PAGE-SCR001`을 구현/완료할 때는 `create-next-app` 기본 템플릿 마크업·로고·기본 링크를 반드시 제거한다.
- `PAGE-SCR003`은 항공·숙소·동행 3개 탭을 모두 실제로 조립하고, 탭별 입력·검증·완료 상태를 서로 독립적으로 유지한다.
- `PAGE-SCR005`는 Guest/Member/Admin 역할별로 실제로 다른 내용을 렌더링하고, 역할에 없는 탭은 DOM에 렌더링하지 않는다.

## 4. 관련 Unit Test를 실행한다

- Task의 `## Verify`/`## Test Cases`에 Unit Test(예: `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`, `TEST-RLS-BASIC`)가 포함되어 있으면, 관련 테스트 파일을 실행한다(예: `npx vitest run <관련 파일>`).
- 이 Task가 새 로직(날짜 검증, 연락처 탐지, 상태 전이 등)을 추가/변경했다면, 대응하는 Unit Test가 아직 없을 경우 Expected Files 범위 안에서(해당 테스트 파일이 Expected Files에 있을 때만) 테스트를 작성하고 실행한다. Expected Files 밖의 새 테스트 파일이 필요하면 임의로 만들지 않고 보고한다.
- 테스트가 실패하면 구현을 완료로 보고하지 않고, AC 재확인 → 수정 → 재실행을 반복한다.

## 5. Playwright Smoke는 Page Owner 또는 E2E Task일 때만 실행한다

- 이번 Task의 `category`가 `PAGE_OWNER` 또는 `E2E_TEST`인 경우에만 관련 Playwright Smoke를 실행한다(`E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 중 이 Task의 Screen과 관련된 것).
- 그 외 Category(`COMPONENT`, `DATA`, `DB`, `AUTH`, `API`, `SEC`, `UNIT_TEST`, `RLS_TEST`, `CI`, `RELEASE_CHECK`)에서는 Playwright를 실행하지 않는다.
- 실행할 때는 **Chromium 단일 브라우저**로만 실행한다(`playwright test --project=chromium` 또는 동등 설정). Firefox/WebKit 프로젝트를 새로 추가하거나 실행하지 않는다.

## 6. 추가하지 않는 것

- **AWS·EC2**: 어떤 형태로도 코드·설정·의존성에 추가하지 않는다. 컴퓨트는 Vercel, 데이터는 Supabase로 고정한다.
- **ORM(Prisma 등)**: DB 접근은 Supabase JS SDK(`@supabase/supabase-js`)의 쿼리 빌더로만 구현한다. 스키마 정의 언어나 별도 마이그레이션 프레임워크를 추가하지 않는다.
- **자동 Merge 기능**: GitHub Actions나 스크립트에 자동 병합/Merge Runner 로직을 추가하지 않는다(`CLAUDE.md`의 `AUTO_MERGE=false`).
- 이 중 하나가 Task를 만족시키는 유일한 방법처럼 보이면, 구현을 멈추고 그 사실을 보고한다(Task 정의 자체가 이 프로젝트 경계를 벗어난 것이므로 임의로 우회하지 않는다).

## 7. Diff 확인

- 구현이 끝나면 `git status --porcelain`과 `git diff --stat`으로 변경된 파일 목록을 확인한다.
- 변경된 파일이 `## Expected Files` 목록과 **정확히 일치**하는지 대조한다. 목록 밖 파일이 의도치 않게 변경되어 있으면(예: lockfile 자동 갱신, 포맷터의 부수 효과) 그 사실과 원인을 보고에 포함한다.

## 8. 완료 보고

작업이 끝나면 다음을 보고한다:

- **변경 파일**: Expected Files 기준 (신규)/(수정) 목록과 실제 diff 요약.
- **검증**: 실행한 Unit Test 결과(통과/실패), Playwright 실행 여부와 결과(해당하는 경우), AC 체크리스트 중 충족/미충족 항목.
- **남은 제약**: 이번 Task 범위 밖으로 미룬 것, `Definition of Done`의 `python scripts/audit_tasks.py` 재확인 필요 여부, 후속 Task가 의존하는 사항.

## Commit·Push·PR 정책

- **기본적으로 이 커맨드는 Commit, Push, Pull Request를 자동으로 수행하지 않는다.** 구현과 검증까지만 수행하고 Working Tree는 커밋되지 않은 상태로 남긴다.
- **사용자가 명시적으로 커밋을 요청한 경우에만**, 이번에 구현한 **Task 하나 단위로** `git add`(Expected Files만) + `git commit`을 수행할 수 있다. 이때도:
  - Push는 하지 않는다.
  - PR 생성은 하지 않는다.
  - 여러 Task를 하나의 커밋으로 묶지 않는다.
  - 커밋 메시지에 Task ID와 제목을 포함한다.
- 사용자가 Push나 PR까지 요청하면, 이 커맨드의 범위를 벗어난 것이므로 별도로 명확히 확인받은 뒤에만 진행한다(자동으로 이어서 실행하지 않는다).
