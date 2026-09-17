---
description: 지정한 Wave의 pending Task를 하나씩 prepare-task→implement-task로 순차 구현한다. --status/--dry-run/--resume 옵션을 지원하며, Branch·PR·Merge·Commit은 자동 수행하지 않는다.
---

`traveler-project-pipeline` Skill과 루트 `CLAUDE.md`의 규칙(특히 6·7·9·21·22)을 로드한다. 이 커맨드는 `/prepare-task`와 `/implement-task`를 **하나의 Wave에 대해 자동으로 반복 호출하는 오케스트레이터**다.

## 입력

```
/run-wave <WAVE_ID> [--dry-run | --resume | --status]
```

- **WAVE_ID**(필수) — `TASKS/WAVE_PLAN.md`/`TASKS/WAVE_STATE.json`에 실제로 존재하는 Wave ID(예: `W05`). 존재하지 않으면 즉시 `WAVE_NOT_FOUND`로 종료한다.
- **옵션**(있으면 최대 1개만 지정, 동시에 여러 개를 주면 `INVALID_INPUT`으로 종료):
  - `--status`: 현재 Wave와 Task 상태만 보여준다. 아무 것도 수정하지 않는다(§2).
  - `--dry-run`: 실행할 Task·Expected Files·최소 검증·Checkpoint 필요 여부만 미리 보여준다. 아무 것도 수정하지 않는다(§3).
  - `--resume`: 이 Wave의 첫 `pending` 또는 `blocked` Task부터 다시 시작한다(§5).
  - (옵션 없음) **기본 동작**: 이 Wave의 `pending` Task를 Task ID 순으로 한 개씩 `prepare` → `implement`한다(§4).

## 상태 파일

- **`TASKS/WAVE_PLAN.md`** — Wave 소속 Task 목록과 순서, Preview Checkpoint 필요 여부의 정본(`scripts/build_waves.py`가 생성). 이 파일이 없으면 어떤 옵션도 실행하지 않고 "WAVE_PLAN 없음"을 보고한 뒤 중단한다(대신 만들지 않는다).
- **`TASKS/WAVE_STATE.json`**(`schema_version: traveler-wave-state-v1`) — 이 커맨드가 실행 중 갱신하는 상태 로그. `scripts/build_waves.py`가 만든 골격(`waves[].wave_id/title/task_ids/status/checkpoint_required/checkpoint_result`)의 각 필드는 그대로 유지하며, 이 커맨드는 다음 필드를 실행 중 추가·갱신한다(없으면 처음 실행 시 새로 만든다):
  - `waves[].taskStatuses`: `{ "<TASK_ID>": "pending" | "in_progress" | "done" | "blocked" }` — Wave에 속한 모든 Task ID를 키로 갖는다. 최초 진입 시 전부 `pending`.
  - `waves[].blockedTaskId` / `waves[].blockedReason` — `status: "blocked"`일 때만 채운다.
  - `waves[].startedAt` / `waves[].completedAt` — ISO 8601.
  - `waves[].status`는 `build_waves.py`가 정의한 4개 값(`pending`/`in_progress`/`blocked`/`completed`)만 사용한다. Preview Checkpoint 대기는 `status: "in_progress"` + `checkpoint_required: true` + `checkpoint_result: null` + 모든 `taskStatuses`가 `done`인 조합으로 표현한다(별도 enum 값을 추가하지 않는다).
- Task 완료 시 `TASKS/WAVE_STATE.json`의 `taskStatuses`와 `TASKS/TASK-<ID>.md`의 frontmatter `status`를 **모두** `DONE`/`done`으로 동기화한다(`/prepare-task`의 Depends On 검사가 후자를 읽으므로 두 곳이 어긋나면 안 된다).

## §0. 공통 선행 확인 (모든 옵션에서 실행, 단 `--status`는 3번을 생략)

1. `TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`을 Read로 열어 WAVE_ID가 둘 다에 존재하는지 확인한다. 없으면 `WAVE_NOT_FOUND`.
2. `TASKS/WAVE_PLAN.md`에 기록된 Wave 순서(`build_waves.py`가 생성한 순서, 예: `W04`의 이전 Wave는 `W03`)에서 이 WAVE_ID의 **바로 앞 Wave**를 찾는다. 이 WAVE_ID가 첫 Wave면 이 검사를 통과로 처리한다.
3. **[규칙 1]** 바로 앞 Wave가 있는데 `TASKS/WAVE_STATE.json`에서 그 Wave의 `status`가 `"completed"`가 아니면, 이 Wave의 어떤 Task도 건드리지 않고 즉시 `PREVIOUS_WAVE_NOT_COMPLETED`(앞 Wave ID와 현재 status 포함)로 종료한다. `--status`/`--dry-run`도 이 검사 자체는 통과 여부를 보고에 포함하지만, 실패해도 **읽기 전용이므로 조회는 계속 보여준다**(§2/§3 참고). 기본 동작과 `--resume`은 이 검사에서 실패하면 즉시 중단한다.

## §1. Task 선택 규칙 (기본 동작·`--resume`·`--dry-run` 공통)

이 Wave의 Task 중 다음을 모두 만족하는 **하나**를 고른다:
- (a) `taskStatuses`에서 아직 `done`이 아님.
- (b) 그 Task의 `TASKS/TASK-<ID>.md` frontmatter `depends_on`에 있는 모든 Task(다른 Wave 소속이어도 포함)가 실제로 `status: DONE`.
- (c) 위 조건을 만족하는 후보가 여러 개면 `TASKS/WAVE_PLAN.md`에 기록된 이 Wave 내부 Task 순서(Task ID 순으로 이미 정렬됨)상 가장 앞선 것을 고른다.

## §2. `--status`

- `TASKS/WAVE_STATE.json`(없으면 "아직 실행 기록 없음")과 `TASKS/WAVE_PLAN.md`를 Read로 열어 다음을 표로 보고한다: 이 Wave의 `status`, `checkpoint_required`/`checkpoint_result`, Task별 `taskStatuses`, `blockedTaskId`/`blockedReason`(있으면), §0-3의 "이전 Wave 완료 여부".
- 아무 것도 실행·수정하지 않는다(완전 읽기 전용).

## §3. `--dry-run`

1. §1의 규칙으로 이 Wave의 Task를 순서대로(앞 Task가 실제로 `done`이라고 가정하지 않고 **현재 실제 상태 그대로**) 나열한다.
2. **구현을 호출하지 않고**, 각 Task에 대해 `/prepare-task <WAVE_ID> <TASK_ID>` 규칙을 실행해 `READY_TO_IMPLEMENT`/`BLOCKED_*` 판정만 얻는다.
3. Task별로 다음을 표로 보고한다: 예상 판정, `## Expected Files` 목록, `## Verify`에 명시된 최소 검증(Unit/E2E/Manual Check 중 무엇), `category: PAGE_OWNER`인 경우 "Browser Checkpoint 필요" 표시.
4. `TASKS/WAVE_STATE.json`을 포함해 어떤 파일도 만들거나 수정하지 않는다(완전한 읽기 전용 시뮬레이션).

## §4. 기본 동작 — pending Task를 한 개씩 prepare→implement

1. `TASKS/WAVE_STATE.json`에 이 Wave의 `taskStatuses`가 없으면 전부 `pending`으로 새로 만들고 `status: "in_progress"`, `startedAt`을 기록한다.
2. §1의 규칙으로 Task 하나를 고른다. 후보가 없고(남은 Task가 전부 `done`) 아직 처리 안 된 Task도 없으면 6번으로 간다.
3. 고른 Task에 `/prepare-task <WAVE_ID> <TASK_ID>` 규칙을 그대로 실행한다.
   - **[규칙 2]** `READY_TO_IMPLEMENT`가 아니면: 이 Task의 `taskStatuses`를 `blocked`로, **Wave 전체의 `status`도 `"blocked"`로 기록**하고 `blockedTaskId`/`blockedReason`(판정 결과와 이유)을 남긴 뒤 **이 Wave 실행을 즉시 멈춘다**(다른 Task로 넘어가지 않는다). §6 종료 보고 형식으로 마무리하고 종료한다.
4. `READY_TO_IMPLEMENT`면 `taskStatuses`를 `in_progress`로 표시하고 `/implement-task` 규칙으로 **이 Task 하나만** 구현한다.
5. **[규칙 3]** 구현이 끝나면 Task의 `## Verify`에 명시된 **최소 검증**을 실행한다(Unit Test가 명시됐으면 관련 `vitest` 파일, `category: PAGE_OWNER`/`E2E_TEST`면 관련 Playwright Chromium Smoke, 그 외 `Manual Check`만 명시된 Task는 자동 실행하지 않고 AC 체크리스트 충족 여부만 기록해 사람의 수동 확인 대상으로 남긴다).
   - **PASS**: `taskStatuses`와 `TASKS/TASK-<ID>.md` frontmatter `status`를 `done`/`DONE`으로 동기화하고, 변경 파일·검증 결과를 기록한다. 2번으로 돌아가 다음 Task를 고른다.
   - **FAIL**: `done`으로 바꾸지 않고 `taskStatuses`를 `blocked`, Wave `status`를 `"blocked"`로 기록하고 실패 사유를 `blockedReason`에 남긴 뒤 **이 Wave 실행을 즉시 멈춘다**(규칙 2와 동일하게 다음 Task로 넘어가지 않는다).
6. 이 Wave의 모든 Task가 `done`이 되면:
   - **[규칙 4]** 이 Wave에 `category: PAGE_OWNER` Task가 있으면(=`TASKS/WAVE_PLAN.md`에 "Preview Checkpoint: required" 표시가 있는 Wave) `checkpoint_required: true`를 유지하고 `checkpoint_result`가 아직 없으므로 **Wave `status`는 `"completed"`로 바꾸지 않은 채 `WAITING_FOR_PREVIEW`로 종료**한다.
   - Page Owner가 없는 Wave(`checkpoint_required: false`)면 `status`를 `"completed"`로 바꾸고 `completedAt`을 기록한 뒤 `WAVE_COMPLETE`로 종료한다.
7. 어느 경우든 **[규칙 5]** 사람이 Preview를 확인했다고 명시적으로 응답하기 전에는, 이 커맨드가 스스로 다음 Wave(`/run-wave <다음 WAVE_ID>`)를 호출하지 않는다.

## §5. `--resume`

1. `TASKS/WAVE_STATE.json`에 이 Wave의 `taskStatuses`가 없으면(=아직 한 번도 시작한 적 없음) "이어서 진행할 실행 기록이 없다"고 보고하고 `/run-wave <WAVE_ID>`(옵션 없이)로 새로 시작하라고 안내한 뒤 종료한다.
2. `status`가 `"completed"`면 이미 끝났다고 보고하고 종료한다(재실행하지 않는다).
3. `checkpoint_required: true`이고 `checkpoint_result`가 아직 없는데 모든 `taskStatuses`가 `done`인 경우(=Preview 대기 중이었던 경우): **[규칙 5]** 사람이 "Preview 확인했다"고 명시적으로 응답하지 않는 한, 자동으로 다음 단계를 진행하지 않고 `WAITING_FOR_PREVIEW` 상태를 그대로 다시 보고하며 멈춘다. 사람이 명시적으로 확인(CONFIRMED) 또는 반려(REJECTED)를 응답하면 `checkpoint_result`에 그 값과 확인 시각을 기록하고, `CONFIRMED`면 `status`를 `"completed"`로 바꿔 `WAVE_COMPLETE`로 종료한다. `REJECTED`면 `status`를 `"blocked"`로 바꾸고 반려 사유를 `blockedReason`에 기록한 뒤 종료한다.
4. 그 외(첫 `pending` 또는 `blocked` Task가 남아 있는 경우): 그 Task부터 §4의 2번으로 돌아가 이어서 진행한다(막혔던 조건이 해소됐는지 `/prepare-task`로 다시 확인한 뒤 진행 — 자동으로 `done`이라고 가정하지 않는다).

## 규칙 요약 (이 문서 전체에서 강제하는 지점)

| # | 규칙 | 강제 지점 |
|---|---|---|
| 1 | 이전 Wave가 `completed`가 아니면 시작하지 않는다 | §0-3 |
| 2 | Task 하나가 blocked면 Wave를 blocked로 기록하고 멈춘다 | §4-3, §4-5 |
| 3 | Task마다 지정된 최소 검증을 실행한다 | §4-5 |
| 4 | Page Owner가 있는 Wave는 Browser Checkpoint를 요구한다 | §4-6 |
| 5 | 사람의 확인 전에는 다음 Wave를 자동 실행하지 않는다 | §4-7, §5-3 |
| 6 | 자동 Commit·Push·PR·Merge를 하지 않는다 | 아래 "금지" |

## 종료 보고 (모든 실행 후 공통 출력 형식)

1. **완료 Task** — 이번 실행에서 `done`으로 바뀐 Task ID 목록(`--status`/`--dry-run`이거나 아무것도 완료되지 않았으면 "없음").
2. **변경 파일** — 완료된 각 Task의 `## Expected Files` 기준 (신규)/(수정) 목록과 실제 diff 요약.
3. **통과한 검사** — Unit/E2E/Manual Check별로 실행·확인된 항목과 결과.
4. **남은 수동 Browser 확인** — `WAITING_FOR_PREVIEW`로 종료했다면 어느 Screen(들)의 Preview를 확인해야 하는지 명시. 없으면 "없음".
5. **다음에 입력할 명령** — 상황별로 정확히 하나 제시:
   - `BLOCKED_*`/`FAIL`로 멈춤: 무엇을 해결해야 `READY_TO_IMPLEMENT`가 되는지 + 해결 후 `/run-wave <WAVE_ID> --resume`.
   - `WAITING_FOR_PREVIEW`: 사람이 Preview 확인 후 `/run-wave <WAVE_ID> --resume`으로 확인 결과를 반영하라고 안내.
   - `WAVE_COMPLETE`: 다음 Wave ID로 `/run-wave <다음 WAVE_ID>`.
   - `PREVIOUS_WAVE_NOT_COMPLETED`: 그 이전 Wave를 먼저 `/run-wave <이전 WAVE_ID>`로 진행하라고 안내.

## 금지

- **[규칙 6]** 자동 Branch 생성·전환, 자동 PR 생성, 자동 Merge(`CLAUDE.md`의 `AUTO_MERGE=false`)를 하지 않는다. 현재 체크아웃된 브랜치에서만 작업한다.
- 자동 Commit도 하지 않는다. Commit은 `/implement-task`의 Commit 정책을 그대로 따르며, 사용자가 명시적으로 요청한 경우에만 Task 하나가 끝날 때마다 그 Task 단위로만 Commit한다(Push·PR 없음, 여러 Task를 묶지 않음).
- `WAITING_FOR_PREVIEW`로 종료된 뒤에는, 사람이 명시적으로 확인 결과를 알려주기 전까지 다음 Wave를 스스로 시작하지 않는다.
- 검증 FAIL이나 `BLOCKED_*`를 건너뛰고 다음 Task로 넘어가지 않는다.
- `--dry-run`/`--status`는 어떤 파일도 생성·수정·삭제하지 않는다(완전 읽기 전용).
