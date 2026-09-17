---
description: 배포 전 최종 게이트. Task/Wave 상태, Page Owner 완료, CI, Playwright, Supabase, Vercel Preview, EXCLUDED 목록을 확인해 RELEASE_READY 또는 RELEASE_BLOCKED를 출력한다.
---

`traveler-project-pipeline` Skill과 루트 `CLAUDE.md`의 23개 규칙을 로드한다. 이 커맨드는 **읽기·판정 전용**이며, `TASKS/RELEASE_CHECK_REPORT.md`(보고서) 외의 어떤 파일도 만들거나 수정하지 않는다. 구현 코드를 작성하지 않는다.

## 0. 선행: Task 파이프라인 자체의 정합성

배포 여부를 판단하기 전에 파이프라인 산출물 자체가 무결한지 먼저 확인한다.

1. `python scripts/audit_tasks.py`를 실행한다.
2. 결과가 `AUDIT_FAIL`이면, 아래 7개 검사를 진행할 필요 없이 즉시 **`RELEASE_BLOCKED`**로 종료하고 `TASKS/TASK_AUDIT_REPORT.md`의 실패 항목을 그대로 인용한다(Task/Wave 정의 자체가 깨진 상태에서 배포 여부를 판단하지 않는다).
3. `AUDIT_PASS`면 아래 7개 검사를 계속한다.

## 1. Task·Wave 상태

- `TASKS/WAVE_STATE.json`을 Read로 연다. 파일이 없으면 실행 기록이 전혀 없다는 뜻이므로 **실패**로 기록한다.
- 있으면 모든 Wave의 모든 Task가 `DONE`인지 확인한다. `BLOCKED`나 `IN_PROGRESS`로 남아 있는 Task가 하나라도 있으면 실패로 기록하고 해당 Task ID와 상태를 나열한다.
- `TASKS/00_TASK_LIST.md`의 전체 Task ID 집합과 `TASKS/WAVE_STATE.json`에 기록된 Task ID 집합이 일치하는지도 대조한다(계획에는 있지만 실행 기록에 없는 Task가 있으면 실패).

## 2. 5개 Page Owner DONE

- `TASKS/TASK-PAGE-SCR001.md`, `TASK-PAGE-SCR002.md`, `TASK-PAGE-SCR003.md`, `TASK-PAGE-SCR004.md`, `TASK-PAGE-SCR005.md`를 각각 Read로 열어 frontmatter `status: DONE`인지 확인한다.
- 5개 중 하나라도 `DONE`이 아니면 실패로 기록하고 어느 Screen이 미완료인지 명시한다.

## 3. CI PASS

- `TASKS/TASK-CI-LINT-TYPECHECK-UNIT.md`의 frontmatter `status`가 `DONE`인지 확인한다.
- `gh` CLI를 사용할 수 있으면 `gh run list --branch <현재 브랜치> --limit 1`로 최신 워크플로 실행 결과(`conclusion`)를 추가로 확인해 `success`인지 교차 확인한다. `gh`를 쓸 수 없거나 워크플로가 아직 없으면(`.github/workflows/` 없음) 이 사실을 그대로 기록하고 **실패**로 처리한다(추정으로 통과시키지 않는다).

## 4. Playwright Smoke PASS

- `TASK-E2E-PUBLIC-SMOKE.md`, `TASK-E2E-TRAVEL-TOOLS.md`, `TASK-E2E-MATE-AUTH.md` 3개의 frontmatter `status`가 모두 `DONE`인지 확인한다.
- 셋 중 하나라도 `DONE`이 아니면 실패로 기록한다. Chromium 외 브라우저가 실행 대상에 포함되어 있지 않은지도 함께 확인한다(`scripts/audit_tasks.py` 검사 #15 결과를 `TASKS/TASK_AUDIT_REPORT.md`에서 재인용).

## 5. Supabase 6개 Table·기본 RLS 확인 기록

- `TASK-DB-SCHEMA-BASE.md`, `TASK-DB-RLS-BASE.md`, `TASK-DB-ACCESS.md`, `TASK-DB-SEED-BASE.md`, `TASK-TEST-RLS-BASIC.md`의 frontmatter `status`가 모두 `DONE`인지 확인한다.
- `TASKS/TASK_AUDIT_REPORT.md`에서 검사 #11(DB Schema·RLS·Access·Seed Task 존재)과 #12(DB Table 범위가 6개를 넘지 않음) 결과가 `PASS`인지 재인용한다.
- 실제 Supabase 프로젝트에 테이블 6개(`user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting`)가 존재하고 RLS가 켜져 있다는 **확인 기록**(예: `docs/release/deploy-checklist.md` 또는 `TASK-RELEASE-VERCEL-SUPABASE-CHECK.md`의 체크 결과)이 있는지 찾는다. 그런 기록이 없으면, Task 문서상 `DONE`이더라도 실제 확인 기록이 없다는 사실을 별도로 남기고 이 항목은 **실패**로 처리한다(문서 상태만으로 실제 DB 상태를 단정하지 않는다).

## 6. Vercel Preview Checkpoint

- `TASKS/WAVE_STATE.json`에서 Preview 대기 중인 Wave가 있는지 확인한다(`checkpoint_required: true`이면서 `checkpoint_result`가 아직 없는 Wave — `/run-wave`가 `WAITING_FOR_PREVIEW`로 보고하는 것과 같은 조건). 하나라도 있으면(즉, 사람이 아직 Preview를 확인하지 않은 Wave가 있으면) **실패**로 기록한다.
- `TASK-RELEASE-VERCEL-SUPABASE-CHECK.md`의 frontmatter `status`가 `DONE`인지 확인한다.
- `.vercel/` 디렉터리 또는 Vercel 프로젝트 연결 흔적이 저장소에 있는지 Glob으로 확인한다(연결 자체가 안 되어 있으면 Preview URL이 존재할 수 없으므로 실패로 기록).

## 7. EXCLUDED 목록

- `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 Read로 열어 EXCLUDED 22건이 그대로 남아 있는지 확인한다(삭제되지 않았는지).
- `TASKS/TASK_AUDIT_REPORT.md`에서 검사 #17(REQ-FUNC 80 + REQ-NF 34가 Task 또는 EXCLUDED 표에 존재)과 #18(EXCLUDED 상세 구현 파일이 생성되지 않음)이 `PASS`인지 재인용한다.
- 둘 중 하나라도 `PASS`가 아니면(또는 §0에서 이미 `AUDIT_FAIL`이었다면) 이 항목은 실패로 기록한다.

## 판정

- 0~7번 검사를 모두 `[OK]`/`[FAIL]`로 표시하고 근거를 남긴다.
- **하나라도 `[FAIL]`이면 최종 판정은 `RELEASE_BLOCKED`다.** 어떤 검사도 임의로 건너뛰거나 "괜찮을 것"이라고 추정해 통과시키지 않는다.
- 7개(+선행 검사) 전부 `[OK]`일 때만 **`RELEASE_READY`**로 판정한다.

## 출력

1. 터미널에 검사별 `[OK]`/`[FAIL]` 목록과 마지막 줄에 `RELEASE_READY` 또는 `RELEASE_BLOCKED`를 출력한다.
2. 같은 내용을 `TASKS/RELEASE_CHECK_REPORT.md`에 표 형식으로 기록(갱신)한다. 이 파일은 보고서이며 구현 코드가 아니므로 이 커맨드가 직접 쓸 수 있는 유일한 파일이다.
3. `RELEASE_BLOCKED`인 경우, 각 `[FAIL]` 항목에 대해 무엇을 해결해야 하는지(예: 어떤 Task를 `DONE`으로 만들어야 하는지, 어떤 확인 기록을 추가해야 하는지) 한 줄씩 덧붙인다. 이 문서는 그 해결책을 스스로 실행하지 않는다.

## 금지

- `TASKS/RELEASE_CHECK_REPORT.md` 외의 파일을 생성·수정하지 않는다.
- 실제 배포(Vercel 배포 트리거, Merge, Push, Tag 생성 등)를 수행하지 않는다 — 이 커맨드는 배포 여부를 "판단"만 한다.
- 확인 기록이 없는 항목을 문서 상태만 보고 통과로 추정하지 않는다.
- `RELEASE_BLOCKED` 사유를 축소·생략해서 보고하지 않는다.
