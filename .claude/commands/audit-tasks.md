---
description: TASKS/00_TASK_LIST.md와 TASKS/TASK-*.md를 traveler-project-pipeline의 18개 규칙으로 감사한다.
---

`traveler-project-pipeline` Skill을 로드한다. 이 커맨드는 **읽기·보고 전용**이며 실제 구현 코드는 작성하지 않는다.

## 실행

1. `TASKS/00_TASK_LIST.md`와 `TASKS/TASK-*.md`가 존재하는지 Glob으로 먼저 확인한다. 없으면 `/gen-tasklist`, `/gen-task-details`를 먼저 실행하라고 안내하고 중단한다.
2. `python scripts/audit_tasks.py`를 실행한다. 이 스크립트는 다음 입력을 실제로 읽어 18개 검사를 수행하고 두 산출물을 갱신한다:
   - 입력: `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, `docs/PROJECT_SCOPE.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
   - 산출물: `TASKS/TASK_MANIFEST.csv`(Task 전체 목록), `TASKS/TASK_AUDIT_REPORT.md`(18개 검사 결과)
3. 출력의 마지막 줄이 `AUDIT_PASS (n/18 checks)`인지 `AUDIT_FAIL (n/18 checks passed)`인지 확인한다.

## 18개 검사 항목 (참고용 — 실제 판정은 스크립트 출력이 기준)

1. Task List 구현 ID와 상세 Task 파일 1:1
2. 중복 Task ID 0
3. Depends On 누락 0
4. Dependency Cycle 0
5. Screen 5개 모두 Page Owner 정확히 1개
6. Route·Page Entry·Expected Files 일치(`SCREEN_ROUTE_CONTRACT.json` 대조)
7. Component-only Screen 0
8. SCR-001 Starter 제거 AC 존재
9. SCR-003 세 탭 조립 AC 존재
10. SCR-005 역할별 상태 조립 AC 존재
11. DB Schema·RLS·Access·Seed Task 존재
12. DB Table 범위가 6개 기본 테이블을 크게 넘지 않음
13. 외부 입력 비저장 AC 존재
14. Auth·성인·기본 RLS AC 존재
15. Playwright Chromium Smoke Task 존재
16. AWS·EC2·자동 Merge 구현 Task 0
17. REQ-FUNC 80개와 REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재
18. EXCLUDED 상세 구현 파일이 생성되지 않음

## 결과 처리 — Task Audit 실패를 절대 무시하지 않는다

- **`AUDIT_PASS`인 경우:** 몇 개 검사 중 몇 개를 통과했는지, `TASKS/TASK_MANIFEST.csv`/`TASKS/TASK_AUDIT_REPORT.md`가 갱신되었음을 그대로 보고한다.
- **`AUDIT_FAIL`인 경우:**
  - 이 결과를 절대 숨기거나 무시하지 않고, FAIL 항목 번호·이름·원인이 된 Task ID를 그대로 사용자에게 보고한다.
  - **직접 코드를 작성하지 않고**, 어떤 `TASKS/TASK-<ID>.md` 또는 `TASKS/00_TASK_LIST.md`의 어느 부분을 어떻게 최소 수정해야 하는지만 제안한다.
  - 사용자가 승인하면 해당 파일을 최소 범위로 수정한 뒤 `python scripts/audit_tasks.py`를 다시 실행해 `AUDIT_PASS`로 전환되는지 재확인한다.
  - `AUDIT_FAIL` 상태에서 작업을 "완료"로 보고하지 않는다.

이 커맨드는 `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md` 외의 파일을 생성·수정하지 않는다. Task 상세나 Task List 자체의 수정은 사용자 승인 후 `/gen-task-details` 재실행 또는 직접 편집으로 진행한다.
