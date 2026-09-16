---
description: TASKS/00_TASK_LIST.md의 각 구현 Task에 대해 TASKS/TASK-<Task ID>.md 상세 파일을 생성한다. traveler-project-pipeline Skill의 규칙을 따른다.
---

`traveler-project-pipeline` Skill을 로드하고 그 규칙을 따른다. **실제 구현 코드(컴포넌트/페이지 소스)는 작성하지 않는다** — 이 커맨드의 산출물은 `TASKS/TASK-<ID>.md` 문서뿐이다. `TASKS/00_TASK_LIST.md`가 없으면 먼저 `/gen-tasklist`를 실행하라고 안내하고 중단한다.

## 실행 순서 (실제 파일을 읽고 실행한다 — 내용을 추정하지 않는다)

1. `TASKS/00_TASK_LIST.md`를 Read로 열어 모든 Task 행(Seq/Task ID/제목/Category/Implementation Status/Requirement Ref/Screen/Route/Page Entry/Depends On/Expected Files/Functional AC/Visual AC/Security-Privacy AC/Verify/Priority)을 확인한다.
2. `TASKS/` 디렉터리를 Glob(`TASKS/TASK-*.md`)으로 확인해 이미 존재하는 상세 파일을 파악한다.
3. `python scripts/gen_task_details.py`를 실행한다. 이 스크립트는:
   - Task List를 파싱하고 **중복 Task ID, 빈 필수 열, 존재하지 않는 Depends On 참조**를 먼저 검사한다(`VALIDATION_FAIL`이면 아무 파일도 만들지 않는다).
   - 검사를 통과하면 `TASKS/00_TASK_LIST.md`의 각 행에 대해 `TASKS/TASK-<Task ID>.md`를 생성한다.
   - **이미 존재하는 상세 파일은 다시 만들지 않는다**(멱등 — 중복 파일 생성 금지).
4. 스크립트가 `VALIDATION_FAIL`을 출력하면, 원인이 된 `TASKS/00_TASK_LIST.md`의 해당 행을 Read/Edit로 최소 수정(예: 끊긴 Depends On을 실제 존재하는 Task ID로 교정)한 뒤 스크립트를 다시 실행한다. 스스로 판단하기 어려운 수정은 사용자에게 보고하고 확인받는다.
5. 생성된 상세 파일 중 `PAGE_OWNER` 카테고리 파일을 Read로 열어 다음이 실제로 들어있는지 확인한다(스크립트 템플릿이 이미 채워 넣지만, 반드시 재확인한다):
   - `design-reference/UI_CONTRACT.md`의 해당 Screen Section 순서·최소 콘텐츠·Empty State 요구 인용
   - "Lorem ipsum, 준비 중, 정보 확인 필요, 텍스트 없는 빈 Card, 의미 없는 빈 여백을 두지 않는다"
   - "데이터가 없는 목록형 Section은 안내 문장 + 이용 방법 + 다음 행동 CTA 3요소를 갖춘 Empty State로 표시한다"
   - `PAGE-SCR001`: "Next.js/Vercel create-next-app 기본 템플릿 마크업·로고·기본 링크가 남아있지 않다"
   - `PAGE-SCR003`: "항공/숙소/동행 구하기 3개 탭이 모두 렌더링되고, 탭별 입력·검증·완료 상태가 서로 독립적으로 유지된다"
   - `PAGE-SCR005`: "Guest/Member/Admin 역할에 따라 렌더링되는 탭이 다르며, 해당 역할에 없는 탭은 렌더링되지 않는다"
6. **모든 파일 생성이 끝나면 반드시 `python scripts/audit_tasks.py`를 실행한다.** 이 단계는 절대 건너뛰지 않는다.
7. `audit_tasks.py`의 결과가 `AUDIT_FAIL`이면:
   - **완료로 보고하지 않는다.** FAIL 항목과 원인이 된 Task ID를 그대로 사용자에게 보고한다.
   - 원인이 상세 파일의 사소한 표기 문제(예: 필수 문구 누락)면 해당 `TASKS/TASK-<ID>.md`만 최소 수정한다.
   - 원인이 `TASKS/00_TASK_LIST.md`의 데이터 자체(순환 의존성, 존재하지 않는 참조 등)면 그 표를 최소 수정한 뒤 `scripts/gen_task_details.py`와 `scripts/audit_tasks.py`를 다시 실행한다.
   - `AUDIT_PASS`가 나올 때까지 이 과정을 반복하며, 원인을 알 수 없으면 임의로 무시하지 않고 사용자에게 판단을 요청한다.
8. `AUDIT_PASS`가 확인되면 생성/수정된 파일 목록과 감사 결과(몇 개 검사 중 몇 개 통과)를 보고한다.

## 금지

- 실제 컴포넌트/페이지 구현 코드를 작성하지 않는다(AC와 Expected Files 목록까지만).
- `TASKS/00_TASK_LIST.md`에 없는 새 Task ID를 이 커맨드에서 임의로 만들지 않는다(신규 Task가 필요하면 먼저 `/gen-tasklist`를 다시 실행해 목록에 반영).
- EXCLUDED Requirement를 어떤 Task 상세의 `requirements:`에도 넣지 않는다.
- **`scripts/audit_tasks.py`의 FAIL을 무시하거나, FAIL 상태에서 작업을 완료로 보고하지 않는다.**
