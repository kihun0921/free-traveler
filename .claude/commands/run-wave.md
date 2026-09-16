---
description: 하나의 Wave에 속한 READY Task를 Depends On 순서로 prepare-task→implement-task를 반복 적용해 순차 구현한다. Branch·PR·Merge는 자동 수행하지 않는다.
---

`traveler-project-pipeline` Skill과 루트 `CLAUDE.md`의 23개 규칙(특히 6·7·21·22)을 로드한다. 이 커맨드는 `/prepare-task`와 `/implement-task`를 **하나의 Wave 전체에 대해 자동으로 반복 호출하는 오케스트레이터**다.

## 지원 명령

| 명령 | 동작 |
|---|---|
| `/run-wave W03` | 지정한 Wave의 READY Task를 순서대로 하나씩 구현한다(아래 §1). |
| `/run-wave status` | 아무 것도 구현하지 않고 현재 Wave/Task 상태만 보고한다(§2). |
| `/run-wave resume` | 직전에 중단된 지점부터 이어서 진행한다(§3). |
| `/run-wave dry-run W03` | 구현 없이, 이 Wave의 각 Task가 지금 `READY_TO_IMPLEMENT`인지 `BLOCKED_*`인지만 미리 점검해 보고한다(§4). |

## 상태 파일

- **`TASKS/WAVE_PLAN.md`** — 입력. `## Wave <ID>` 섹션마다 그 Wave에 속한 Task ID 목록을 담는다. 이 파일이 없으면 어떤 서브커맨드도 실행하지 않고, "WAVE_PLAN 없음"을 보고한 뒤 중단한다(이 파일을 대신 만들지 않는다 — 계획은 사람/별도 프로세스가 정의한다).
- **`TASKS/WAVE_STATE.json`** — 이 커맨드가 관리하는 실행 상태 로그(`schema: traveler-wave-state-v1`). 각 Task의 `READY`/`IN_PROGRESS`/`DONE`/`BLOCKED` 상태, 현재 Wave, Preview Checkpoint 대기 여부를 기록한다. 없으면 이 커맨드가 처음 실행될 때 새로 만든다(Task 구현 코드가 아니라 실행 로그이므로 이 커맨드의 관리 대상이다).
- Task 완료 시에는 `TASKS/WAVE_STATE.json`과 `TASKS/TASK-<ID>.md`의 frontmatter `status` 필드를 **모두** `DONE`으로 동기화한다(`/prepare-task`의 Depends On 검사가 후자를 읽으므로 두 곳이 어긋나면 안 된다).

## §1. `/run-wave <WAVE_ID>` 실행 순서

1. `TASKS/WAVE_PLAN.md`를 Read로 열어 `<WAVE_ID>` 섹션의 Task 목록을 확인하고, `TASKS/WAVE_STATE.json`을 Read로 연다(없으면 `currentWave: <WAVE_ID>`, 모든 Task `status: READY`로 새로 만든다).
2. 이 Wave의 Task 중 다음 조건을 모두 만족하는 **하나**를 고른다: (a) 아직 `DONE`이 아님, (b) `TASKS/TASK-<ID>.md`의 `depends_on`에 있는 모든 Task가 `DONE`, (c) 같은 Wave 안에서 Depends On 순서상 더 먼저 와야 하는 다른 Task가 아직 `DONE`이 아니면 건너뜀. 후보가 여러 개면 `TASKS/00_TASK_LIST.md`의 `Seq`가 가장 작은 것을 고른다.
3. 고른 Task ID에 대해 `/prepare-task <WAVE_ID> <TASK_ID>` 규칙을 그대로 실행한다.
   - `READY_TO_IMPLEMENT`가 아니면: `TASKS/WAVE_STATE.json`에 해당 Task를 `BLOCKED`로 기록하고 이유를 남긴다.
     - `BLOCKED_DIRTY_TREE`면 **이 Wave 실행 전체를 즉시 중단**하고 `BLOCKED_DIRTY_TREE`로 종료한다(다른 Task로 넘어가지 않는다 — working tree 문제는 어떤 Task에도 영향을 준다).
     - `BLOCKED_INPUT`/`BLOCKED_DEPENDENCY`/`BLOCKED_SCOPE`면 이 Task는 건너뛰고 2번으로 돌아가 다음 READY 후보를 찾는다. 더 이상 후보가 없으면(남은 Task가 전부 `BLOCKED`) 실행을 멈추고 막힌 Task 목록과 이유를 보고한 뒤 해당 블로킹 상태로 종료한다.
4. `READY_TO_IMPLEMENT`면 `/implement-task` 규칙으로 **이 Task 하나만** 구현한다. 시작 전 `TASKS/WAVE_STATE.json`에 `IN_PROGRESS`로 표시한다.
5. 구현이 끝나면 Task의 `## Verify`에 명시된 검증(Unit Test, 해당하는 경우 Playwright, AC 체크리스트)을 실행한다.
   - **PASS**: `TASKS/WAVE_STATE.json`과 `TASKS/TASK-<ID>.md` frontmatter의 `status`를 `DONE`으로 갱신하고, 변경 파일과 검증 결과를 보고한다.
   - **FAIL**: `DONE`으로 갱신하지 않고, `TASKS/WAVE_STATE.json`에 실패 사유를 남긴 뒤 **이 Wave 실행을 중단**한다(실패를 건너뛰고 다음 Task로 넘어가지 않는다). `IMPLEMENTATION_FAILED`로 종료한다.
6. 5번이 PASS면 2번으로 돌아가 같은 Wave의 다음 READY Task를 계속 처리한다.
7. 이 Wave의 모든 Task가 `DONE`이면 반복을 멈춘다.
8. `TASKS/WAVE_PLAN.md`의 이 Wave 섹션에 Preview Checkpoint 표시(예: "Preview Checkpoint: required" 또는 동등 문구)가 있으면, 7번에서 멈춘 뒤 곧바로 다음 Wave로 진행하지 않고 **`WAITING_FOR_PREVIEW`로 종료**한다(`TASKS/WAVE_STATE.json`에도 이 대기 상태를 기록한다). Preview Checkpoint 표시가 없으면 `WAVE_COMPLETE`로 종료한다.

## §2. `/run-wave status`

- `TASKS/WAVE_STATE.json`(없으면 "아직 실행 기록 없음")과 `TASKS/WAVE_PLAN.md`를 Read로 열어, 현재 Wave, Task별 상태(`READY`/`IN_PROGRESS`/`DONE`/`BLOCKED`) 표, `WAITING_FOR_PREVIEW` 여부를 그대로 보고한다.
- 아무 것도 실행·구현하지 않는다(읽기 전용).

## §3. `/run-wave resume`

1. `TASKS/WAVE_STATE.json`을 Read로 열어 `currentWave`와 마지막 종료 상태를 확인한다. 파일이 없으면 "이어서 진행할 실행 기록이 없다"고 보고하고, 대신 `/run-wave <WAVE_ID>`로 새로 시작하라고 안내한다.
2. 마지막 종료 상태가 `WAITING_FOR_PREVIEW`면: 사람의 Preview 확인 전에는 자동으로 다음 Wave를 시작하지 않는다. 사람이 Preview를 확인했다고 응답하지 않는 한 이 명령은 대기 상태를 그대로 다시 보고하고 멈춘다.
3. 그 외 상태(`BLOCKED_*`, `IMPLEMENTATION_FAILED`, 중간에 멈춘 진행 중 상태)면, `currentWave`에 대해 §1의 2번부터 다시 시작한다(막혔던 조건이 해소되었는지 `/prepare-task`로 다시 확인한 뒤 진행).

## §4. `/run-wave dry-run <WAVE_ID>`

1. §1의 1~2번과 동일하게 이 Wave의 Task 목록과 Depends On 순서를 확인한다.
2. **구현을 호출하지 않고**, 이 Wave의 모든 Task 각각에 대해 `/prepare-task <WAVE_ID> <TASK_ID>` 규칙을 순서대로 실행한다(단, 앞 Task를 `DONE`으로 가정하지 않고 현재 실제 상태 그대로 검사한다).
3. Task별로 `READY_TO_IMPLEMENT`가 될지 어떤 `BLOCKED_*`가 될지와 그 이유를 표로 보고한다. `TASKS/WAVE_STATE.json`을 포함해 어떤 파일도 만들거나 수정하지 않는다(완전한 읽기 전용 시뮬레이션).

## 금지

- **자동 Branch 생성·전환을 하지 않는다.** 현재 체크아웃된 브랜치에서만 작업한다.
- **자동 PR 생성을 하지 않는다.**
- **자동 Merge를 하지 않는다**(`CLAUDE.md`의 `AUTO_MERGE=false`).
- Commit은 `/implement-task`의 Commit 정책을 그대로 따른다 — 사용자가 명시적으로 요청하지 않으면 이 커맨드도 Commit을 만들지 않는다. 사용자가 요청한 경우에만 Task 하나가 끝날 때마다 그 Task 단위로만 Commit한다(Push·PR 없음, 여러 Task를 묶지 않음).
- `WAITING_FOR_PREVIEW`로 종료된 뒤에는, 사람이 명시적으로 다음 진행을 지시하기 전까지 다음 Wave를 스스로 시작하지 않는다.
- 검증 FAIL을 건너뛰고 다음 Task로 넘어가지 않는다.
