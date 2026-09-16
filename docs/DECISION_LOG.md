# Free Traveler — Decision Log (docs/DECISION_LOG.md)

- **형식:** 각 결정은 ID, 상태, 결정 내용, 배경, 근거, 검토했던 대안, 영향/후속 조치, 관련 문서로 구성한다.
- **상태 값:** `Accepted`(확정) — 이 로그의 모든 결정은 확정 상태이며, 변경이 필요하면 새 ID로 후속 결정을 추가하고 이전 결정을 폐기(`Superseded`)로 표시한다. 기존 항목의 내용을 직접 고쳐 쓰지 않는다.
- **최초 작성일:** 2026-09-16

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **상태:** Accepted
- **결정:** Next.js 프로젝트의 실제 개발 루트는 `C:\AI_SERVICE\traveler\app`이다. 이 디렉터리가 `package.json`, `src/app`, `docs/`, `design-reference/`, `TASKS/`, `scripts/`를 담는 단일 작업 루트다.
- **배경:** `traveler/` 상위 폴더에는 앱 코드 외에도 `stitch_free_traveler` 등 부속 폴더가 함께 존재해, 어느 디렉터리를 기준으로 커밋·빌드·배포를 수행해야 하는지 혼동될 수 있었다.
- **근거:** `package.json`(Next.js 앱 정의), `.git`, `next.config.ts`가 모두 `traveler/app` 안에 있고, 지금까지 작성된 모든 산출물(`docs/*.md`, `design-reference/*`, `TASKS/*`, `scripts/*`)도 이 경로를 기준으로 생성되었다.
- **검토한 대안:** `traveler/` 상위 폴더를 루트로 사용 — 기각(앱 코드가 아닌 부속 폴더까지 빌드 스코프에 포함되어 배포 대상이 불명확해짐).
- **영향/후속:** Vercel 프로젝트 연결, GitHub Actions 워크플로, 로컬 개발 명령은 모두 `traveler/app`을 Working Directory로 고정한다.
- **관련 문서:** `docs/ARCHITECTURE.md` §1

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **상태:** Accepted
- **결정:** 디자인 Screen은 정확히 5개(`SCR-001`~`SCR-005`)로 고정하고, 이 중 핵심 4개는 `SCR-001`(메인), `SCR-003`(`/travel-tools`), `SCR-004`(`/mates`), `SCR-005`(`/account`)이며 보조 1개는 `SCR-002`(`/about`)다.
- **배경:** PRD 원안(`docs/PROJECT_SCOPE.md` §"반드시 직접 구현할 범위" 1번)은 "핵심 화면 4개(여행지, 비행기 찾기, 호텔 찾기, 동행 찾기)와 보조 화면 1개(국가별 주의사항)"로 정의했다. 이후 UI 설계 단계에서 여행지+안전정보, 비행기+호텔이 각각 하나의 Screen으로 통합되면서 원래의 5분류를 새 5-Screen 구조에 재대응할 필요가 있었다.
- **근거:** 안전정보는 SCR-001의 Drawer로 흡수되어 별도 Screen이 아니게 되었고, 비행기·호텔은 SCR-003으로 통합되었다. 동행 기능이 요구하는 인증·프로필·관리자 흐름(SCR-005)은 동행 찾기(SCR-004)와 마찬가지로 핵심 기능을 지지하므로 핵심으로 분류하고, 순수 편집성 콘텐츠인 대표 소개(SCR-002)만 보조로 남긴다.
- **검토한 대안:** SCR-002를 핵심으로, SCR-005를 보조로 분류 — 기각(계정·인증 없이는 동행 핵심 기능 자체가 동작하지 않으므로 SCR-005가 더 핵심에 가깝다).
- **영향/후속:** `design-reference/SCREEN_ROUTE_CONTRACT.json`이 Screen 목록의 정본이며, API Route·인증 콜백·오류 페이지는 "기술 Route"로 이 5개 수에 포함하지 않는다.
- **관련 문서:** `docs/04_UIUX_PLAN.md`, `docs/ARCHITECTURE.md` §2

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **상태:** Accepted
- **결정:** 항공 조건 입력, 숙소 조건 입력, 동행 모집글 작성을 하나의 라우트(`/travel-tools`, `src/app/travel-tools/page.tsx`) 안의 탭 3개(`flight`/`hotel`/`mate`)로 통합한다. 별도의 `/flights`, `/hotels`, `/mates/new` 라우트는 만들지 않는다.
- **배경:** 세 기능 모두 "여행 조건을 정리한 뒤 다음 행동(외부 이동 또는 글 등록)으로 넘어간다"는 동일한 사용자 목표를 공유하며, 별도 라우트로 나누면 SRS Baseline이 요구하는 14개 라우트를 그대로 유지해야 해 §DEC-002의 5-Screen 원칙과 충돌한다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md` §2 Route 매핑, `design-reference/UI_CONTRACT.md`의 SCR-003 Section 계약(Intro→탭→Form→요약·외부이동→Tip→동행작성).
- **검토한 대안:** 탭 대신 아코디언으로 3기능을 한 페이지에 나열 — 기각(탭이 "지금 무엇을 하고 있는가"를 더 명확히 드러내고 상태 분리가 쉬움).
- **영향/후속:** 세 탭은 입력·검증·완료 상태를 서로 독립적으로 유지해야 한다(`COMP-SCR003-FLIGHT-FORM`, `COMP-SCR003-HOTEL-FORM`, `COMP-SCR003-MATE-WRITE`가 별도 Component Task로 분리됨).
- **관련 문서:** `docs/ARCHITECTURE.md` §2, `TASKS/00_TASK_LIST.md` §3.3

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **상태:** Accepted
- **결정:** 여행지, 국가 안전정보, `free_traveler` 대표 소개 콘텐츠는 DB 테이블이 아니라 `src/data/destinations.ts`, `src/data/safety.ts`, `src/data/about.ts` 정적 TypeScript 데이터로 관리한다.
- **배경:** 이 콘텐츠들은 회원의 실시간 쓰기가 필요 없고, Editor/Admin용 CMS를 만들면 `docs/PROJECT_SCOPE.md`가 EXCLUDED로 분류한 "전체 콘텐츠 CMS"(`REQ-FUNC-072`, `REQ-FUNC-073`) 범위를 다시 불러오게 된다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md` §3 "DB에 만들지 않는 것" 목록, `docs/PROJECT_SCOPE.md`의 EXCLUDED 사유(`REQ-FUNC-055`, `072`, `073` — CMS·미디어 승인 워크플로 제외).
- **검토한 대안:** Supabase 테이블로 관리하되 Admin CRUD는 나중에 추가 — 기각(§DEC-006의 6테이블 한도를 넘고, 콘텐츠 변경 빈도가 낮아 정적 파일 + Git 배포로 충분).
- **영향/후속:** 콘텐츠 변경은 코드 수정 + 배포로 처리하며, 완전성은 `scripts/validate_content.py`(`TASK-DATA-CONTENT-VALIDATION`)로 검증한다.
- **관련 문서:** `docs/ARCHITECTURE.md` §5

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **상태:** Accepted
- **결정:** Supabase는 이메일 인증·세션(Auth)과 동행(Mate) 기능(모집글, 참가 요청, 차단, 신고, Admin 설정)에만 사용한다. 여행지·안전·대표 콘텐츠 조회는 Supabase를 거치지 않는다(§DEC-004).
- **배경:** Supabase 사용 범위를 명확히 하지 않으면 정적 데이터까지 DB로 옮기려는 시도가 반복될 수 있다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md` §3, `docs/ARCHITECTURE.md` §6.
- **검토한 대안:** 모든 데이터를 Supabase로 일원화 — 기각(§DEC-004의 근거와 동일하게 불필요한 CMS/DB 복잡도를 유발).
- **영향/후속:** 즐겨찾기는 Supabase가 아니라 `localStorage`로 유지한다.
- **관련 문서:** `docs/ARCHITECTURE.md` §6

## DEC-006 — DB는 6개 Table로 제한

- **상태:** Accepted
- **결정:** Supabase PostgreSQL 스키마는 `user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting` 6개 테이블로 제한한다. 7번째 테이블은 별도 결정 없이 추가하지 않는다.
- **배경:** SRS Baseline(§6.3)은 `COUNTRY`, `REGION`, `DESTINATION`, `DESTINATION_CONTENT`, `COUNTRY_SAFETY`, `MEDIA_ASSET`, `REPRESENTATIVE_PROFILE`, `AUDIT_LOG` 등 11개 엔터티를 정의했으나, §DEC-004(정적 데이터 대체)와 `docs/PROJECT_SCOPE.md`의 EXCLUDED 처리(`REQ-FUNC-076` 감사 로그 등)로 실제 DB 테이블 수요가 크게 줄었다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md` §3, `TASKS/00_TASK_LIST.md`(`DB-SCHEMA-BASE`), `scripts/audit_tasks.py` 검사 #12(허용 목록 밖 테이블 미검출).
- **검토한 대안:** `AUDIT_LOG` 테이블을 별도로 유지 — 기각(`REQ-FUNC-076`이 EXCLUDED이며 Git 커밋 로그로 대체 가능).
- **영향/후속:** 새 기능이 새 테이블을 요구하면 이 결정을 갱신하는 후속 DEC를 먼저 추가한 뒤 스키마를 변경한다.
- **관련 문서:** `docs/ARCHITECTURE.md` §6.1, `TASKS/TASK_MANIFEST.csv`

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **상태:** Accepted
- **결정:** 항공·숙소 입력 폼(국가·지역·날짜)의 값은 Client Component의 로컬 상태(브라우저 메모리)에만 유지하며, 서버 API, DB, 외부 이동 URL의 query, 서버/분석 로그 어디에도 전달하지 않는다.
- **배경:** 제품 원칙(`docs/01_PRD.md` 제품 원칙 3번)이 "항공·호텔 입력값은 MVP에서 외부 사이트로 전달하거나 서버에 저장하지 않는다"를 명시했고, 이는 SRS 전체에서 `CON-01`, `CON-02`로 재확인된다.
- **근거:** `REQ-FUNC-017`, `REQ-FUNC-025`, `REQ-NF-017`, `docs/ARCHITECTURE.md` §4.
- **검토한 대안:** `sessionStorage`에 임시 저장해 새로고침 복원 지원 — 기각(전달 범위를 넓히면 "서버 미저장"이라는 사용자 신뢰 문구와 검증 범위가 애매해짐. 세션 내 상태 유지만으로 충분).
- **영향/후속:** `API-OUTBOUND-VALIDATION`, `UNIT-TRAVEL-DATES`, `E2E-TRAVEL-TOOLS`가 이 경계를 검증한다.
- **관련 문서:** `docs/ARCHITECTURE.md` §4

## DEC-008 — Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본

- **상태:** Accepted
- **결정:** `design-reference/vendor/airbnb/DESIGN.md`는 구조적 관례(카드 밀도, 1단계 elevation, spacing 리듬)만 참고하는 vendor 참고 자료이며, 실제 디자인 정본은 `design-reference/D-001/DESIGN.md`(Status: LOCKED)다. Airbnb의 컬러(Rausch)·폰트(Cereal)·워드마크·배지 등 상표 요소는 어디에도 복제하지 않는다.
- **배경:** Airbnb DESIGN.md는 참고 목적으로 vendor 폴더에 보존되어 있지만, Free Traveler는 독립 브랜드(코랄 액센트, Inter 폰트)를 사용해야 했다.
- **근거:** `design-reference/D-001/DESIGN.md` §1(Visual Theme), §21(Do/Do Not), `docs/STITCH_VALIDATION_REPORT.md`에서 확인된 위반 없음.
- **검토한 대안:** Airbnb DESIGN.md의 토큰을 그대로 재사용 — 기각(상표·브랜드 침해 우려, 제품 정체성 불일치).
- **영향/후속:** 새 화면/컴포넌트를 만들 때는 `design-reference/D-001/DESIGN.md`만 인용하고, vendor 폴더는 "왜 이런 구조를 참고했는가"를 설명할 때만 인용한다.
- **관련 문서:** `design-reference/D-001/DESIGN.md`, `design-reference/DESIGN_MANIFEST.md`

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **상태:** Accepted
- **결정:** E2E 테스트는 Playwright로 작성하되, **Chromium 단일 브라우저**로 핵심 흐름 5~7개를 3개 Task(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)에 묶어 Smoke 수준으로만 구성한다. Firefox·WebKit을 포함한 다중 브라우저 매트릭스는 만들지 않는다.
- **배경:** MVP 단계에서 크로스 브라우저 회귀보다 핵심 사용자 흐름이 깨지지 않는지 확인하는 것이 우선이며, 다중 브라우저 매트릭스는 CI 시간과 유지보수 비용을 크게 늘린다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md` CON-17, `scripts/audit_tasks.py` 검사 #15.
- **검토한 대안:** Chromium+WebKit 2브라우저 매트릭스 — 기각(MVP 범위에서 비용 대비 효과가 낮음, 필요 시 후속 결정으로 확장).
- **영향/후속:** `playwright.config.ts`는 Chromium 프로젝트만 등록한다.
- **관련 문서:** `docs/ARCHITECTURE.md` §7, `TASKS/TASK_MANIFEST.csv`

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **상태:** Accepted
- **결정:** 사용자가 실제 개발을 착수·진행·검토하는 단위는 **Wave**다. 하나의 Wave는 `TASKS/00_TASK_LIST.md`의 Task 중 서로 의존성이 해소된(Depends On이 이미 완료된) 묶음이며, 한 Wave가 끝나야 다음 Wave를 시작한다.
- **배경:** 76개 Task를 한 번에 착수하면 진행 상황을 검토하기 어렵고, Depends On 순서(예: `DB-SCHEMA-BASE` → `DB-RLS-BASE` → `DB-ACCESS` → `AUTH-SUPABASE-SETUP`)를 무시한 병렬 착수는 재작업 위험이 크다.
- **근거:** `TASKS/00_TASK_LIST.md`의 Depends On 그래프(`scripts/audit_tasks.py` 검사 #3·#4로 순환·누락이 없음을 이미 확인함)가 자연스러운 Wave 경계(예: Wave 0 = 인프라/DB/정적 데이터, Wave 1 = Page Owner별 Component, Wave 2 = 통합·테스트)를 이룬다.
- **검토한 대안:** Task 76개를 우선순위(P0~P2)로만 정렬해 순서 없이 착수 — 기각(의존성 위반으로 재작업 위험).
- **영향/후속:** Wave 분할 계획은 이 로그가 아니라 별도 실행 계획 문서(필요 시 `TASKS/WAVE_PLAN.md` 등)에서 관리한다.
- **관련 문서:** `TASKS/00_TASK_LIST.md`, `TASKS/TASK_MANIFEST.csv`

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **상태:** Accepted
- **결정:** 하나의 Wave 안에서는 **단일 Agent(Claude Code 세션 1개)**가 Task를 하나씩 순차적으로 수행한다. Wave 내부에서 여러 Agent를 동시에 병렬 실행하지 않는다.
- **배경:** Task 간 파일 경합(같은 Expected Files를 건드리는 Task는 없지만 같은 Component를 참조하는 Page Owner가 존재)과 리뷰 부담을 고려할 때, 병렬 멀티에이전트보다 순차 단일 Agent가 이 프로젝트 규모(76 Task)에서 더 예측 가능하다.
- **근거:** `TASKS/00_TASK_LIST.md`의 Page Owner는 항상 같은 Screen의 Component Task 완료를 전제하므로(§DEC-010), 순차 수행이 Depends On 순서를 자연스럽게 지킨다.
- **검토한 대안:** Screen별로 별도 Agent를 병렬 배정 — 기각(전역 공통 Task인 `COMP-GLOBAL-*`, `DB-*`를 여러 Agent가 동시에 건드릴 위험, 현재 Wave 계획 문서 부재 상태에서는 조정 비용이 큼).
- **영향/후속:** 병렬화가 필요해지면(예: Task 수가 크게 늘어날 때) 이 결정을 갱신하는 후속 DEC를 추가한다.
- **관련 문서:** `.claude/skills/traveler-project-pipeline/SKILL.md`

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **상태:** Accepted
- **결정:** Pull Request 생성과 `main` 브랜치로의 Merge는 항상 **사용자가 직접 검토하고 수동으로 실행**한다. Agent(Claude Code)는 PR을 만들거나 Merge를 실행하지 않는다.
- **배경:** §DEC-013(자동 Merge 미사용)과 짝을 이루는 프로세스 결정으로, 코드 품질과 배포 시점에 대한 최종 판단은 사람이 유지해야 한다.
- **근거:** `docs/ARCHITECTURE.md` §9 "자동 Merge(Merge Runner 등) — 미사용. PR 병합은 사람이 검토 후 수동으로 진행한다."
- **검토한 대안:** CI 통과 시 자동 Merge — 기각(§DEC-013·§DEC-014와 함께 이번 프로젝트가 명시적으로 배제한 자동화 범위).
- **영향/후속:** GitHub Actions(§DEC-013과 별개로 §DEC-009와 연계된 CI)는 검증만 수행하고 Merge 권한을 갖지 않는다.
- **관련 문서:** `docs/ARCHITECTURE.md` §8·§9

## DEC-013 — EC2·AWS는 사용하지 않음

- **상태:** Accepted
- **결정:** 컴퓨트는 Vercel, 데이터는 Supabase로 고정하며, AWS EC2를 포함한 어떤 AWS 서비스도 이 프로젝트의 인프라로 사용하지 않는다.
- **배경:** 초기 SRS Baseline 초안에 AWS 인프라 가능성이 언급된 적이 있으나, MVP 비용 목표(`REQ-NF-034`, 월 10만원 이하)와 운영 복잡도를 고려해 Vercel+Supabase 관리형 플랫폼으로 확정했다.
- **근거:** `docs/PROJECT_SCOPE.md` 제외 기능 "EC2·AWS 인프라", `scripts/validate_inputs.py` 검사 #11(AWS·EC2가 활성 기술로 정의되지 않았는지 확인), `scripts/audit_tasks.py` 검사 #16.
- **검토한 대안:** Supabase 대신 AWS RDS + EC2 자체 호스팅 — 기각(운영 인력 없이 관리형 서비스가 MVP에 더 적합).
- **영향/후속:** 어떤 Task 설명에도 "EC2"·"AWS"가 등장하면 감사 스크립트가 실패로 처리한다(자동 검증 대상).
- **관련 문서:** `docs/ARCHITECTURE.md` §9, `scripts/validate_inputs.py`, `scripts/audit_tasks.py`

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **상태:** Accepted
- **결정:** 구현하지 않기로 한 모든 Requirement(REQ-FUNC/REQ-NF)는 목록에서 삭제하지 않고 **EXCLUDED** 상태로 `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)에 사유·후속 방향과 함께 남긴다.
- **배경:** 요구사항을 삭제하면 "왜 안 만들었는지"에 대한 추적성이 사라지고, 나중에 같은 논의를 반복하게 된다.
- **근거:** REQ-FUNC 80개 + REQ-NF 34개 = 114개 전수 추적 원칙(`docs/UIUX_TRACEABILITY.md`, `scripts/validate_inputs.py` 검사 #10, `scripts/audit_tasks.py` 검사 #17·#18). 현재 EXCLUDED는 22건(REQ-FUNC 10건, REQ-NF 12건)이며 구현 Task의 `requirements`에는 절대 포함되지 않는다.
- **검토한 대안:** 제외 항목을 문서에서 완전히 삭제 — 기각(추적성 상실, 재논의 비용 증가).
- **영향/후속:** 새로운 제외 결정이 생기면 해당 REQ ID를 EXCLUDED로 표시하고 이 로그에 후속 DEC를 추가해 사유를 남긴다.
- **관련 문서:** `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `TASKS/00_TASK_LIST.md` §5

---

## 요약표

| ID | 결정 | 상태 |
|---|---|---|
| DEC-001 | 실제 개발 루트는 `traveler/app` | Accepted |
| DEC-002 | 디자인 Screen은 핵심 4개·보조 1개 | Accepted |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성 통합 | Accepted |
| DEC-004 | 여행지·안전·대표는 정적 TypeScript Data | Accepted |
| DEC-005 | Supabase는 Auth와 동행 기능 중심 | Accepted |
| DEC-006 | DB는 6개 Table로 제한 | Accepted |
| DEC-007 | 항공·숙소 입력은 Browser Memory에만 유지 | Accepted |
| DEC-008 | Airbnb DESIGN.md는 vendor 참고본, D-001이 정본 | Accepted |
| DEC-009 | Playwright는 Chromium Smoke만 필수 | Accepted |
| DEC-010 | 사용자의 개발 실행 단위는 Wave | Accepted |
| DEC-011 | Single Agent가 Wave 내부 Task를 순차 수행 | Accepted |
| DEC-012 | PR·Merge는 사용자가 수동 수행 | Accepted |
| DEC-013 | EC2·AWS는 사용하지 않음 | Accepted |
| DEC-014 | 제외 기능은 EXCLUDED로 관리 | Accepted |
