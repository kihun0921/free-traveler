---
description: 지정한 Wave/Task가 지금 착수 가능한지 8개 항목으로 점검하고 READY_TO_IMPLEMENT/BLOCKED_* 중 하나를 출력한다. 코드를 수정하지 않는다.
---

`traveler-project-pipeline` Skill을 로드한다. 이 커맨드는 **읽기·판정 전용**이며 어떤 소스 코드·Task 문서·설정 파일도 수정하지 않는다. 산출물은 터미널에 출력하는 판정 보고서뿐이다.

## 입력

사용자가 `/prepare-task <WAVE_ID> <TASK_ID>` 형태로 두 값을 전달한다(예: `/prepare-task W01 PAGE-SCR001`). 순서·이름이 다르게 와도(`WAVE_ID=W01 TASK_ID=PAGE-SCR001`) 두 값을 각각 추출한다.

- **WAVE_ID**: 착수하려는 Wave 식별자.
- **TASK_ID**: 착수하려는 Task ID(`TASKS/00_TASK_LIST.md`의 `Task ID` 열 값).
- **선택된 상세 Task 파일**: `TASKS/TASK-<TASK_ID>.md`.

두 값 중 하나라도 없으면 즉시 `BLOCKED_INPUT`으로 판정하고 나머지 검사를 진행하지 않는다.

## 검사 1~8 (모두 실제 파일/명령 결과를 읽고 판정한다 — 추정하지 않는다)

1. **Working Tree 상태** — `git status --porcelain`을 실행한다. 추적되지 않았거나 커밋되지 않은 변경이 있으면 기록한다(변경이 이번에 착수할 Task와 무관해 보이면 특히 위험 신호로 표시).
2. **Task가 현재 Wave에 포함되는지** — `TASKS/WAVE_PLAN.md`를 Read로 연다. 이 파일에서 `## Wave <WAVE_ID>`(또는 동등한 헤딩) 섹션을 찾고, 그 안에 `TASK_ID`가 나열되어 있는지 확인한다.
   - `TASKS/WAVE_PLAN.md` 자체가 없으면: Wave 소속을 확인할 방법이 없으므로 이 검사는 **실패**로 처리한다(추정으로 통과시키지 않는다).
   - 파일은 있지만 해당 Wave 섹션이나 Task ID가 없으면 **실패**로 처리한다.
3. **Depends On 완료 여부** — `TASKS/TASK-<TASK_ID>.md`의 frontmatter `depends_on` 목록을 읽는다. 목록에 있는 각 Task ID에 대해 `TASKS/TASK-<그 ID>.md`를 Read로 열어 frontmatter `status` 값을 확인한다. 하나라도 `status: DONE`(또는 그에 준하는 완료 표기)이 아니면 실패로 기록하고 미완료 Task ID를 나열한다.
4. **Expected Files** — 상세 Task 파일의 `## Expected Files` 절을 읽는다. 각 경로에 대해 Read/Glob으로 실제 존재 여부를 확인하고, 파일 옆에 적힌 `(신규)`/`(수정)` 표기가 실제 상태와 일치하는지 대조한다(예: `(신규)`인데 파일이 이미 존재하면 불일치로 기록). 이 목록 밖에서 착수 전에 이미 손댄 흔적(검사 1의 dirty 파일 중 Expected Files에 없는 것)이 있으면 함께 기록한다.
5. **SRS·Scope·Design·Screen Ref** — 다음을 모두 Read로 열어 실제로 존재·일치하는지 확인한다:
   - `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md` — 상세 Task의 `## Requirement Ref`에 나열된 각 REQ ID가 `docs/PROJECT_SCOPE.md`에서 실제로 **IMPLEMENT**로 기록되어 있는지.
   - `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md` — 상세 Task의 `## Design Ref`가 실제 경로를 가리키는지.
   - `design-reference/SCREEN_ROUTE_CONTRACT.json` — 상세 Task의 `screen`/`route`/`page_entry` frontmatter 값이 이 JSON의 해당 Screen 정의와 일치하는지.
   - 위 문서 중 하나라도 열리지 않거나(파일 없음) Ref가 실제 값과 불일치하면 실패로 기록한다.
6. **필요한 환경변수 이름** — 상세 Task의 Category와 Expected Files를 근거로 필요한 환경변수 이름만 나열한다(값은 절대 출력하지 않는다). 예: Category가 `AUTH`/`API`/`DB`이면 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`; SCR-003 항공/숙소 관련 Task면 `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`. 이 항목은 통과/실패가 아니라 **참고 정보**로 보고서에만 싣는다.
7. **Secret 하드코딩 위험** — Expected Files 중 이미 존재하는 파일(`(수정)` 대상)을 Read로 열어 `sk-`, `service_role`, `SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"]`, `AKIA[0-9A-Z]{16}`, 그 외 실제 키처럼 보이는 하드코딩 패턴이 있는지 스캔한다. 상세 Task 문서 자체(AC/설명)에 실제 키 형태의 문자열이 적혀 있는지도 함께 확인한다. 하나라도 발견되면 실패로 기록하고 해당 파일·라인 위치(가능하면)를 남긴다. 아직 없는 파일(`(신규)`)은 "생성 전 — 해당 없음"으로 표시한다.
8. **EXCLUDED 범위 침범 여부** — 상세 Task의 `requirements` frontmatter 목록과 `docs/PROJECT_SCOPE.md`의 EXCLUDED 목록을 대조한다. 겹치는 REQ ID가 있으면 실패로 기록한다. 또한 상세 Task 본문(Definition of Done/Forbidden 절 제외)에 EC2·AWS·자동 병합·매너온도·별점·예약·결제 같은 금지 키워드가 실제 구현 지시로 등장하는지도 확인한다(등장하면 실패).

## 판정 규칙 — 우선순위대로 하나의 최종 상태를 고른다

검사 결과를 전부 보고서에 남긴 뒤, 다음 우선순위로 **첫 번째로 해당하는 조건**을 최종 판정으로 삼는다(여러 문제가 동시에 있어도 최종 상태는 하나만 출력한다):

1. **`BLOCKED_INPUT`** — WAVE_ID/TASK_ID 누락, `TASKS/TASK-<TASK_ID>.md` 없음, `TASKS/WAVE_PLAN.md` 없음 또는 해당 Wave/Task 미기재(검사 2), SRS·Scope·Design·Screen Ref 문서 자체가 없거나 열리지 않음(검사 5의 "파일 없음" 케이스).
2. **`BLOCKED_DIRTY_TREE`** — 검사 1에서 이번 Task와 무관한 미커밋 변경이 발견됨.
3. **`BLOCKED_DEPENDENCY`** — 검사 3에서 완료되지 않은 Depends On이 하나 이상 있음.
4. **`BLOCKED_SCOPE`** — 검사 5의 "REQ가 IMPLEMENT가 아님"·"Screen/Route 불일치" 결과, 검사 7의 Secret 하드코딩 위험, 검사 8의 EXCLUDED 침범·금지 키워드 중 하나라도 있음.
5. **`READY_TO_IMPLEMENT`** — 위 네 가지 중 어느 것도 해당하지 않음. 이 경우 검사 4(Expected Files 현황)와 검사 6(필요 환경변수 이름)을 착수 참고 정보로 함께 출력한다.

## 출력 형식

1. 검사 1~8 각각을 `[OK]`/`[FAIL]`/`[INFO]`로 표시하고 근거(읽은 파일, 값)를 한 줄씩 남긴다.
2. 마지막 줄에 다음 5개 중 정확히 하나만 출력한다:

```
READY_TO_IMPLEMENT
BLOCKED_INPUT
BLOCKED_DEPENDENCY
BLOCKED_DIRTY_TREE
BLOCKED_SCOPE
```

3. `BLOCKED_*`인 경우, 무엇을 해결해야 다음 판정이 `READY_TO_IMPLEMENT`로 바뀌는지 한두 문장으로 덧붙인다(예: "TASKS/WAVE_PLAN.md를 만들고 W01에 PAGE-SCR001을 등록해야 한다").

## 금지

- 이 커맨드는 어떤 파일도 생성·수정·삭제하지 않는다(`TASKS/WAVE_PLAN.md`가 없어도 대신 만들지 않고 `BLOCKED_INPUT`으로만 보고한다).
- Git 상태를 변경하는 명령(`git add`, `git commit`, `git stash` 등)을 실행하지 않는다. `git status`처럼 상태를 조회만 하는 명령만 사용한다.
- 실제 Secret 값(환경변수 값, 키 문자열 전체)을 출력하지 않는다 — 검사 6·7은 이름/위치만 보고한다.
- 구현 코드를 작성하지 않는다.
