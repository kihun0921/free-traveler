# Free Traveler — Project State (docs/PROJECT_STATE.md)

- **최초 작성일:** 2026-09-16
- **갱신 방법:** 이 문서는 스냅샷이다. `/run-wave`, `/prepare-task`, `/release-check` 실행 후 상태가 바뀌면 이 문서의 해당 필드만 갱신한다(과거 값을 지우지 않고 최신 값으로 덮어쓴다 — 변경 이력이 필요하면 `docs/DECISION_LOG.md`에 별도로 남긴다).
- **확인 시점 기준 실제 저장소 상태를 그대로 기록했다.** 아직 시작하지 않은 항목을 추정으로 채우지 않았다.

| 필드 | 값 |
|---|---|
| **Harness Schema** | `traveler-screen-route-v1` (`design-reference/SCREEN_ROUTE_CONTRACT.json`, `CLAUDE.md`의 `HARNESS_SCHEMA`와 일치) |
| **Design Version** | `D-001` — Status: `LOCKED` (`design-reference/DESIGN_MANIFEST.md`) |
| **Scope Mode** | `LOCKED` — `docs/PROJECT_SCOPE.md` 기준 REQ-FUNC-001~080 + REQ-NF-001~034 = 114건 전수 분류 완료(IMPLEMENT 92 / EXCLUDED 22) |
| **Current Wave** | 없음 — `TASKS/WAVE_PLAN.md`가 아직 존재하지 않아 Wave가 정의되지 않았다 |
| **Current Task** | 없음 — 진행 중인 Task 없음(구현 착수 전) |
| **Completed Tasks** | 0 / 76 — `TASKS/WAVE_STATE.json`이 아직 존재하지 않아 완료 기록이 없다. `TASKS/00_TASK_LIST.md`의 76개 구현 Task 모두 미착수 상태 |
| **Blocked Tasks** | 추적된 것 없음(아직 `/prepare-task`를 실행한 이력 없음). 다만 착수 시 즉시 막힐 것으로 확인된 선행 결핍이 있다 — `docs/ARCHITECTURE.md` §10(착수 차단) 참고: `@supabase/supabase-js`·`vitest`·`@playwright/test` 미설치, `supabase/`·`.github/workflows/`·`playwright.config.ts`·`vitest.config.ts` 없음, `.env*` 전무 |
| **Latest CI** | 없음 — `.github/workflows/` 디렉터리 자체가 없어 실행된 CI가 없다 |
| **Supabase State** | 미연결 — `supabase/` 디렉터리 없음, 프로젝트 URL/키 미발급, `@supabase/supabase-js` 의존성 미설치. 6개 테이블(`user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting`)은 계획만 확정(`docs/06_SRS_UIUX_REVISED.md` §3)되었고 아직 생성되지 않았다 |
| **Vercel Preview URL** | 없음 — `.vercel/` 연결 흔적 없음, Preview 배포 이력 없음 |
| **Screen Checkpoints** | SCR-001 `/`: `PENDING`<br>SCR-002 `/about`: `PENDING`<br>SCR-003 `/travel-tools`: `PENDING`<br>SCR-004 `/mates`: `PENDING`<br>SCR-005 `/account`: `PENDING`<br>FINAL: `PENDING` |
| **Playwright State** | 미구성 — `playwright.config.ts` 없음, `@playwright/test` 미설치. 계획된 범위는 Chromium 전용 Smoke 3개(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`, `TASKS/00_TASK_LIST.md` §4.5) |
| **Deferred Items** | EXCLUDED 22건 — `docs/PROJECT_SCOPE.md` / `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)에 사유·후속 방향과 함께 기록됨(REQ-FUNC 10건: 042·045·055·056·062·071·072·073·075·076, REQ-NF 12건: 007·008·009·010·011·018·020·021·022·029·032·033). 구현 대상으로 복원하지 않는다 |
| **Next Action** | ① `TASKS/WAVE_PLAN.md` 작성(Wave 분할, `docs/DECISION_LOG.md` DEC-010 근거) → ② `docs/ARCHITECTURE.md` §10의 착수 차단 항목(Supabase/Vercel 프로젝트 연결, 필수 패키지 설치, 환경변수 발급) 해소 → ③ `python scripts/validate_inputs.py` 재확인 후 `/run-wave <첫 Wave ID>` 시작 |

## Screen Checkpoint 정의

- `PENDING`: 아직 사람이 Preview로 확인하지 않은 상태(초기값).
- 향후 각 Screen의 Page Owner Task가 `DONE`이 되고 Vercel Preview에서 사람이 실제로 확인하면 `CONFIRMED`로, 확인 중 문제가 발견되면 `REJECTED`(사유와 함께)로 갱신한다.
- `FINAL`은 5개 Screen이 모두 `CONFIRMED`이고 `/release-check`가 `RELEASE_READY`를 출력한 뒤에만 `CONFIRMED`로 바꾼다.
