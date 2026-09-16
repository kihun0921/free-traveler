# Free Traveler — Architecture (docs/ARCHITECTURE.md)

- **목적:** Traveler 프로젝트가 실제로 무엇으로 만들어지고, 무엇을 쓰지 않는지("구현 경계")를 한 문서로 확정한다.
- **입력 근거:** `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`
- **현재 저장소 상태(확인 시점 기준):** Next.js `create-next-app` 기본 템플릿 + `src/data`(빈 폴더)만 존재. Supabase 패키지·환경변수·테스트 설정·CI 워크플로는 아직 없음(§7 착수 차단 참고).

---

## 1. 기술 스택

| 영역 | 선택 | 근거 |
|---|---|---|
| 프레임워크 | **Next.js App Router**(`next@16.3.5`) | `package.json` 확인, `docs/06_SRS_UIUX_REVISED.md` §2 Route 매핑이 App Router 파일 경로를 전제로 함 |
| 언어 | **TypeScript**(`typescript@^5`, strict) | `package.json` devDependencies, `REQ-NF-031`(TS strict/lint/unit test CI 게이트) |
| UI 런타임 | React 19, Tailwind CSS 4 | `package.json` 확인 |
| 데이터/인증 | **Supabase**(Auth + PostgreSQL) | `docs/06_SRS_UIUX_REVISED.md` §3, 아래 §5 |
| 정적 콘텐츠 | `src/data/*.ts` | `docs/06_SRS_UIUX_REVISED.md` §3 "DB에 만들지 않는 것" |
| 테스트 | Vitest(Unit) + Playwright(E2E, Chromium만) | `TASKS/TASK_MANIFEST.csv`의 UNIT_TEST/E2E_TEST 행, `design-reference/UI_CONTRACT.md` |
| CI/배포 | GitHub Actions(CI) + Vercel(Preview/Prod) | `TASKS/TASK_MANIFEST.csv`의 `CI-LINT-TYPECHECK-UNIT`, `RELEASE-VERCEL-SUPABASE-CHECK` |

Next.js 이외의 프레임워크(Nuxt, Remix 등), Node 이외의 런타임, 별도 백엔드 서버는 이 프로젝트의 구현 경계 밖이다.

## 2. 화면 구성 — 핵심 4개 + 보조 1개

`design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)이 Screen 목록의 정본이며, 정확히 5개다.

| 분류 | Screen | Route | Page Entry |
|---|---|---|---|
| 핵심 | SCR-001 메인 | `/` | `src/app/page.tsx` |
| 보조 | SCR-002 대표 소개 | `/about` | `src/app/about/page.tsx` |
| 핵심 | SCR-003 통합 여행 준비 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| 핵심 | SCR-004 동행 조회 | `/mates` | `src/app/mates/page.tsx` |
| 핵심 | SCR-005 계정·관리 | `/account` | `src/app/account/page.tsx` |

> **핵심/보조 분류 근거:** PRD 원안(`docs/PROJECT_SCOPE.md` §"반드시 직접 구현할 범위" 1번)은 "핵심 화면 4개(여행지, 비행기 찾기, 호텔 찾기, 동행 찾기)와 보조 화면 1개(국가별 주의사항)"로 정의했다. 5-Screen 통합(`docs/04_UIUX_PLAN.md`) 이후 이 구분은 다음과 같이 대응한다: 여행지+안전정보 → **SCR-001**(안전정보는 Drawer로 흡수), 비행기·호텔 → **SCR-003**, 동행 찾기 → **SCR-004**, 그리고 동행 기능이 요구하는 인증·프로필·관리자 흐름을 담당하는 **SCR-005**가 핵심 화면에 포함된다. 순수 편집성 콘텐츠인 **SCR-002(대표 소개)**만 보조 화면으로 남는다.
>
> API Route, 인증 콜백(`/auth/callback`), 404/500/권한없음 오류 페이지, 정책 정적 문서는 **기술 Route**이며 이 5개 Screen 수에 포함하지 않는다.

## 3. Server Component / Client Component 경계

기본값은 **Server Component**다. `"use client"`는 다음 경우에만 사용한다.

| 필요 조건 | 해당 컴포넌트 예시 |
|---|---|
| 브라우저 상태(입력값, 탭 선택, Drawer open/close)가 필요 | `COMP-SCR003-FLIGHT-FORM`, `COMP-SCR003-HOTEL-FORM`, `COMP-SCR003-MATE-WRITE`, `COMP-SCR001-DEST-DRAWER`, `COMP-SCR001-SAFETY-DRAWER`, `COMP-SCR004-DETAIL` |
| `localStorage` 접근이 필요 | `COMP-GLOBAL-FAVORITE-TOGGLE` |
| 브라우저 전용 API(Web Share 등) 호출 | `COMP-GLOBAL-SHARE-BUTTON` |
| 실시간 UI 피드백(Toast) | `COMP-GLOBAL-TOAST` |
| 역할별(Guest/Member/Admin) 클라이언트 세션 상태 분기 | `COMP-SCR005-AUTH`, `COMP-SCR005-PROFILE`, `COMP-SCR005-MY-ACTIVITY`, `COMP-SCR005-ADMIN`의 상호작용 부분 |

나머지, 특히 5개 Page Owner(`PAGE-SCR001~005`)와 정적 데이터를 그대로 렌더링하는 컴포넌트(`COMP-SCR001-DOMESTIC-GRID`, `COMP-SCR002-*` 등)는 **Server Component**로 유지하고, `src/data/*.ts` 또는 Supabase 서버 클라이언트에서 직접 데이터를 읽는다. Page Owner는 Client Component를 감싸는 조립자 역할만 하며, Page Owner 자체를 `"use client"`로 만들지 않는다.

## 4. 항공·숙소 입력 폼 — Client Component 한정, 일시 상태만 사용

- `COMP-SCR003-FLIGHT-FORM`, `COMP-SCR003-HOTEL-FORM`은 **Client Component**이며, 입력값(국가·지역·날짜)은 `useState`/`useReducer` 등 **컴포넌트 로컬 상태로만** 유지한다.
- 이 값은 다음 어디에도 전달·저장하지 않는다(`REQ-FUNC-017`, `REQ-FUNC-025`, `REQ-NF-017`):
  - 서버 API Route / Server Action
  - Supabase DB(`user_profile`, `mate_post` 등 6개 테이블 중 어디에도 해당 컬럼 없음)
  - 외부 이동 URL의 query string(`FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL`은 고정 랜딩 URL만 열며 파라미터를 붙이지 않음)
  - 서버/클라이언트 로그, 분석 이벤트(`flight_form_start` 등은 `provider`/`source_page`만 기록, 목적지·날짜 제외)
- 외부 이동은 `window.open(url, "_blank", "noopener,noreferrer")` 패턴만 사용하고, 브라우저 탭을 벗어나는 순간 입력값은 소멸한다(세션 스토리지에도 옮기지 않음).
- 이 경계를 검증하는 Task: `API-OUTBOUND-VALIDATION`, `UNIT-TRAVEL-DATES`, `E2E-TRAVEL-TOOLS`(네트워크 탭에서 입력값 미노출 확인).

## 5. 정적 데이터 — 여행지·안전·대표

여행지, 국가 안전정보, `free_traveler` 대표 소개는 **DB 테이블이 아니라 `src/data/*.ts` 정적 데이터**로 관리한다.

| 데이터 | 파일 | 근거 |
|---|---|---|
| 여행지 | `src/data/destinations.ts` | `REQ-FUNC-007,008`, `TASK-DATA-DESTINATIONS` |
| 국가 안전정보 | `src/data/safety.ts` | `REQ-FUNC-046~054`, `TASK-DATA-SAFETY` |
| 대표 소개 | `src/data/about.ts` | `REQ-FUNC-057~063`, `TASK-DATA-REPRESENTATIVE` |

- 콘텐츠 완전성(수량, 필수 필드, 출처 URL, 최종 확인일)은 `scripts/validate_content.py`(`TASK-DATA-CONTENT-VALIDATION`)로 검증한다.
- Editor/Admin이 웹 UI로 이 데이터를 편집하는 CMS는 만들지 않는다(§8 참고). 값 변경은 파일 수정 + 배포로 처리한다.

## 6. Supabase 사용 범위 — Auth와 동행 기능 중심

Supabase는 **인증(Auth)**과 **동행(Mate) 기능**에만 사용한다. 여행지/안전/대표 콘텐츠 조회에는 Supabase를 거치지 않는다.

| 기능 | 사용 여부 |
|---|---|
| 이메일 가입·로그인·로그아웃·비밀번호 재설정·성인 확인 상태 | Supabase Auth 사용 |
| 동행 모집글·참가 요청·차단·신고·관리자 설정 | Supabase PostgreSQL 사용 |
| 여행지·안전정보·대표 소개 조회 | Supabase 미사용(§5 정적 데이터) |
| 즐겨찾기 | Supabase 미사용(`localStorage`만) |

### 6.1 DB — 6개 테이블

| # | 테이블 | 역할 |
|---|---|---|
| 1 | `user_profile` | 닉네임, `is_adult`/`adult_verified_at`, 연령대, 성별, 여행 스타일 |
| 2 | `mate_post` | 동행 모집글(국가·지역·기간·인원·조건·상태·정책 동의) |
| 3 | `mate_application` | 참가 요청과 상태(PENDING/ACCEPTED/REJECTED/WITHDRAWN) |
| 4 | `user_block` | 사용자 차단 관계 |
| 5 | `report` | 신고 대상·사유·처리 상태 |
| 6 | `app_setting` | 항공·숙소 외부 URL 등 Admin 설정(key-value) |

7번째 테이블은 만들지 않는다(`docs/06_SRS_UIUX_REVISED.md` §3, `TASK-DB-SCHEMA-BASE`). `AUDIT_LOG`·`COUNTRY`·`DESTINATION`·`MEDIA_ASSET` 등 SRS Baseline의 나머지 엔터티는 정적 데이터로 대체되거나 EXCLUDED 처리되어 테이블로 만들지 않는다.

### 6.2 Supabase Client — Browser / Server 분리

| 클라이언트 | 파일 | 사용처 |
|---|---|---|
| Browser Client | `src/lib/supabase/client.ts` | Client Component(로그인 폼, 참가 요청 제출 등)에서 사용자 세션으로 호출 |
| Server Client | `src/lib/supabase/server.ts` | Server Component/Server Action/Route Handler에서 서비스 역할 또는 세션 쿠키로 호출 |

서비스 역할 키(`SUPABASE_SERVICE_ROLE_KEY`)는 Server Client에만 존재하며 클라이언트 번들에 포함되지 않는다(`REQ-NF-016`, `TASK-SEC-BASELINE`).

### 6.3 RLS 원칙(간단)

- 본인 글/요청, 요청 대상 작성자, `Admin` 역할만 비공개 데이터(신고 상세, 타인의 PENDING 요청 등)를 조회한다.
- 그 외 접근은 403 또는 빈 결과로 처리한다.
- 복잡한 다단계 정책 대신 "본인 소유 여부 + Admin 여부" 두 조건만으로 판단하는 단순 정책을 기본으로 한다(`TASK-DB-RLS-BASE`, `TASK-TEST-RLS-BASIC`).

### 6.4 ORM 미사용

**Prisma를 포함한 어떤 ORM도 사용하지 않는다.** 스키마는 `supabase/migrations/*.sql`로 직접 관리하고, 쿼리는 Supabase JS SDK(`@supabase/supabase-js`)의 쿼리 빌더를 그대로 사용한다. 별도 스키마 정의 언어나 마이그레이션 프레임워크(Prisma, Drizzle 등)를 추가하지 않는다.

## 7. 테스트 전략

| 계층 | 도구 | 범위 |
|---|---|---|
| Unit | **Vitest** | 날짜 검증(`UNIT-TRAVEL-DATES`), 연락처 탐지(`UNIT-CONTACT-DETECTION`), 동행 상태 전이(`UNIT-MATE-STATE`) |
| RLS | Vitest + Supabase 테스트 프로젝트 | 권한별 부정 접근(`TEST-RLS-BASIC`) |
| E2E | **Playwright, Chromium 단일 브라우저만** | 공개 화면 Smoke(`E2E-PUBLIC-SMOKE`), 여행 준비 흐름(`E2E-TRAVEL-TOOLS`), 동행·인증 흐름(`E2E-MATE-AUTH`) — 핵심 5~7개 흐름을 3개 Task로 묶음 |

Firefox·WebKit을 포함한 다중 브라우저 매트릭스, 시각적 회귀 테스트, 부하 테스트는 이 프로젝트 범위에 포함하지 않는다.

## 8. CI/CD

- **GitHub Actions**: `main` 병합 전 ESLint, TypeScript strict 타입체크, Vitest 단위 테스트, `next build`를 실행한다(`TASK-CI-LINT-TYPECHECK-UNIT`, `REQ-NF-031`).
- **Vercel**: PR마다 Preview 배포, `main` 병합 시 Production 배포. 배포 후 TLS·환경변수 노출 여부를 수동 점검한다(`TASK-RELEASE-VERCEL-SUPABASE-CHECK`).
- 별도 Jenkins/CircleCI 등 CI 시스템은 두지 않는다.

## 9. 제외되는 인프라·자동화

| 항목 | 상태 |
|---|---|
| **AWS·EC2** | 미사용. 컴퓨트는 Vercel, 데이터는 Supabase로 고정한다. |
| **자동 Merge(Merge Runner 등)** | 미사용. PR 병합은 사람이 검토 후 수동으로 진행한다. |
| **Prisma 등 ORM** | 미사용(§6.4). |
| **다중 브라우저 E2E 매트릭스** | 미사용(§7). |

---

## 10. 착수 차단(Blocking) — 실제로 없는 파일·환경변수만 기록

아래는 리포지토리를 직접 확인해 **실제로 없는 것**만 나열한다(추측 아님).

| 구분 | 항목 | 없으면 막히는 작업 |
|---|---|---|
| 패키지 | `@supabase/supabase-js` — `package.json`에 없음 | `TASK-DB-ACCESS`, `TASK-AUTH-SUPABASE-SETUP`, 모든 `API-*`/`COMP-SCR004-*`/`COMP-SCR005-*` |
| 패키지 | `vitest`, `@testing-library/*` — `package.json`에 없음 | `TASK-UNIT-TRAVEL-DATES`, `TASK-UNIT-CONTACT-DETECTION`, `TASK-UNIT-MATE-STATE`, `TASK-TEST-RLS-BASIC` |
| 패키지 | `@playwright/test` — `package.json`에 없음 | `TASK-E2E-PUBLIC-SMOKE`, `TASK-E2E-TRAVEL-TOOLS`, `TASK-E2E-MATE-AUTH` |
| 설정 파일 | `playwright.config.ts` 없음(Chromium 프로젝트만 등록 필요) | 위 E2E 3개 Task |
| 설정 파일 | `vitest.config.ts` 없음 | 위 Unit/RLS 4개 Task |
| DB 마이그레이션 | `supabase/` 디렉터리 자체가 없음(`0001_init.sql`, RLS 정책 SQL, `seed.sql` 전부 없음) | `TASK-DB-SCHEMA-BASE`, `TASK-DB-RLS-BASE`, `TASK-DB-SEED-BASE` 및 이에 의존하는 모든 Task |
| CI | `.github/workflows/` 자체가 없음 | `TASK-CI-LINT-TYPECHECK-UNIT` |
| 환경변수 | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — 저장소에 `.env*` 파일이 전혀 없어 로컬/CI 어디에도 값이 없음 | Supabase Client(§6.2)를 쓰는 모든 Task |
| 환경변수 | `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL` | `TASK-API-OUTBOUND-VALIDATION`, `COMP-SCR003-FLIGHT-FORM`, `COMP-SCR003-HOTEL-FORM` |
| 외부 연동 | Supabase 프로젝트(실제 URL/키를 발급받을 프로젝트 자체)가 아직 연결되지 않음 | 위 환경변수 전부의 발급 전제 조건 |
| 외부 연동 | Vercel 프로젝트 연결(`vercel link` 미실행, `.vercel/` 없음) | `TASK-RELEASE-VERCEL-SUPABASE-CHECK`, Preview 배포 |

> 위 목록에 없는 항목(예: 특정 컴포넌트 파일)은 "아직 구현되지 않음"일 뿐 착수를 막는 결핍이 아니므로 여기 포함하지 않는다.

## 11. 명시적 범위 제외

다음은 이 프로젝트의 구현 경계 밖이며, 별도 승인 없이 추가하지 않는다.

- **콘텐츠 관리 시스템(CMS):** 여행지·안전정보·대표 소개는 §5의 정적 데이터 파일로만 관리하며, Editor/Admin용 CRUD 웹 UI(CMS)는 만들지 않는다(`docs/PROJECT_SCOPE.md` EXCLUDED: `REQ-FUNC-055`, `REQ-FUNC-072`, `REQ-FUNC-073`).
- **외부 이메일 공급자(SendGrid 등):** 참가 요청·신고 처리 알림은 인앱 Toast/화면 상태로만 제공하며, 실제 이메일을 발송하는 외부 사업자 연동은 하지 않는다. Supabase Auth의 기본 인증 메일(가입 확인, 비밀번호 재설정)은 예외로 허용한다.
- **Monitoring/observability 플랫폼(Datadog, Sentry 등):** 별도 모니터링·알림 도구를 구성하지 않는다. Vercel 기본 로그/분석 범위에만 의존한다(`docs/PROJECT_SCOPE.md` EXCLUDED: `REQ-NF-007~011`, `REQ-NF-020~022`, `REQ-NF-032`, `REQ-NF-033`).
