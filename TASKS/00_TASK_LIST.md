# Free Traveler — Task List (TASKS/00_TASK_LIST.md)

- **선행 검사:** `python scripts/validate_inputs.py` → `VALIDATE_INPUTS_PASS (11/11 checks)` 확인 후 작성됨.
- **입력 근거:** `docs/06_SRS_UIUX_REVISED.md`, `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, 실제 `src/app` 트리(`page.tsx`, `layout.tsx`, `globals.css`, `favicon.ico`만 존재 — Next.js Starter 상태).
- **이 문서는 구현 코드·Branch·Commit·Issue를 만들지 않는다.** Task 정의 문서만 작성한다.

## 0. 요약

| 구분 | 값 |
|---|---:|
| **Task 총수** | **76개** |
| PAGE (Page Owner) | 5 |
| COMPONENT | 41 (SCR-001: 9 / SCR-002: 7 / SCR-003: 5 / SCR-004: 8 / SCR-005: 4 / GLOBAL: 8) |
| DATA | 4 |
| DB | 4 |
| AUTH/API | 7 |
| SEC | 1 |
| UNIT TEST | 3 |
| RLS TEST | 1 |
| E2E TEST | 3 |
| CI | 1 |
| RELEASE/MANUAL CHECK | 6 |

| Requirement 커버리지 | 값 |
|---|---:|
| REQ-FUNC-001~080 + REQ-NF-001~034 총수 | **114** |
| IMPLEMENT (Task에 배분) | **92 / 92** — 누락 없음 (§6 검증표 참고) |
| EXCLUDED (NON_IMPLEMENTATION表 기록) | **22 / 22** — 누락 없음 (§5 참고) |
| **합계 확인** | 92 + 22 = **114/114 — 빠진 Requirement ID 없음** |

> 위 커버리지는 §6에서 92개 IMPLEMENT ID를 실제로 나열해 재확인했고, §5에서 22개 EXCLUDED ID를 전부 나열했다. 어느 한쪽에도 없는 ID가 있으면 이 문서는 완료로 간주하지 않는다 — 현재 누락 0건.

## 1. 열 정의 (Legend)

| 열 | 의미 |
|---|---|
| Seq | 전체 일련번호(1~76) |
| Task ID | `PAGE-`, `COMP-`, `DATA-`, `DB-`, `AUTH-`/`API-`, `SEC-`, `UNIT-`, `TEST-`, `E2E-`, `CI-`, `RELEASE-` 접두사 |
| Category | PAGE_OWNER / COMPONENT / DATA / DB / AUTH / API / SEC / UNIT_TEST / RLS_TEST / E2E_TEST / CI / RELEASE_CHECK |
| Implementation Status | IMPLEMENT(구현) / VERIFY(검증 전용, 코드 아님) |
| Requirement Ref | 이 Task가 다루는 REQ-FUNC/REQ-NF ID. `-(Section 계약)`은 특정 REQ가 아니라 `SCREEN_ROUTE_CONTRACT.json`의 Section 계약 충족을 위한 Task |
| Screen / Route / Page Entry | 해당되면 SCR-00X / 라우트 / `src/app/.../page.tsx`, 없으면 `-` |
| Depends On | 선행 Task ID |
| Expected Files | 실제 `src/app` 트리 확인 결과 기준 (신규)/(수정) 표기 |
| Verify | Unit / E2E / Manual Check / Release Check / CI 중 이 Task를 확인할 방법 |
| Priority | P0(필수, MVP 게이트) / P1(핵심 기능) / P2(품질·운영 확인) |

---

## 2. PAGE OWNER Task (5개, Screen당 정확히 1개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PAGE-SCR001 | SCR-001 `/` 메인 Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-050, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-069 | SCR-001 | `/` | `src/app/page.tsx` | COMP-SCR001-HERO, COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-OVERSEAS-GRID, COMP-SCR001-THEME-CHIPS, COMP-SCR001-SAFETY-GRID, COMP-SCR001-MATE-PREVIEW, COMP-SCR001-ABOUT-TEASER, COMP-SCR001-DEST-DRAWER, COMP-SCR001-SAFETY-DRAWER, COMP-GLOBAL-HEADER-FOOTER, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | `src/app/page.tsx`(수정 — 현재 create-next-app 기본 템플릿 제거 필요) | Section 순서 고정: Hero→국내 6→해외 6→여행 동기 6→국가별 주의사항 6→최근 동행글 3(또는 완성형 Empty State)→free_traveler 소개; Section별 데이터 출처: 국내/해외=`DATA-DESTINATIONS`, 안전=`DATA-SAFETY`, 소개=`DATA-REPRESENTATIVE`, 동행글=`API-MATE-POSTS`(읽기전용); 여행지/안전 Drawer는 SCR-001 내에서 열림(별도 라우트 아님) | Next.js/Vercel create-next-app 기본 템플릿 마크업·로고·기본 링크 완전 제거; 최소 콘텐츠: 국내 Card 6, 해외 Card 6, 테마 Chip 6, 안전 Card 6, 동행글 3; Desktop 1440(3~4열)/Mobile 390(1열) 반응형 콘텐츠 밀도 준수; Lorem ipsum·준비 중·정보 확인 필요·내용 없는 Card 금지; 최근 동행글 0건 시 안내 문장+이용 방법+작성 CTA를 갖춘 완성형 Empty State; Loading은 동행글 미리보기 조회 중 스켈레톤 Card, Error는 조회 실패 시 critical 토큰 오류+재시도 | 즐겨찾기는 localStorage만 사용(서버 미전송); 안전정보 stale 배지는 코랄과 분리된 amber 토큰 | E2E-PUBLIC-SMOKE, Manual Check | P0 |
| 2 | PAGE-SCR002 | SCR-002 `/about` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-063 | SCR-002 | `/about` | `src/app/about/page.tsx` | COMP-SCR002-HERO, COMP-SCR002-STATS, COMP-SCR002-INTRO-PHILOSOPHY, COMP-SCR002-TIMELINE, COMP-SCR002-COUNTRY-CHIPS, COMP-SCR002-GALLERY, COMP-SCR002-RECOMMENDED, COMP-GLOBAL-HEADER-FOOTER, DATA-REPRESENTATIVE | `src/app/about/page.tsx`(신규) | Section 순서 고정: Profile Hero→여행 지표→소개·철학→Timeline→방문 국가→Gallery→기억에 남는 여행지+CTA; 전 Section 데이터 출처는 `DATA-REPRESENTATIVE` 정적 데이터 단일 소스 | 최소 콘텐츠: Timeline 6개 이상, 방문 국가 30개국 이상(4권역), Gallery 사진 8장 이상, 추천 여행지 4개; Desktop/Mobile 반응형 밀도(Gallery/Chip 1열 축소); Lorem ipsum·준비 중·정보 확인 필요 금지, 빈 Card 없음(정적 데이터이므로 Empty State 없음); Loading은 이미지 blur-up/스켈레톤, 정적 데이터이므로 별도 런타임 Error 상태 없음(데이터 누락은 RELEASE-CONTENT-QA에서 게시 전 차단) | 이미지 alt·출처·라이선스 메타 필수(라이선스 승인 워크플로 없이 alt+출처 URL만) | E2E-PUBLIC-SMOKE, Manual Check | P0 |
| 3 | PAGE-SCR003 | SCR-003 `/travel-tools` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-054, REQ-FUNC-080 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | COMP-SCR003-INTRO-TABS, COMP-SCR003-FLIGHT-FORM, COMP-SCR003-HOTEL-FORM, COMP-SCR003-TIPS, COMP-SCR003-MATE-WRITE, COMP-GLOBAL-HEADER-FOOTER, API-OUTBOUND-VALIDATION, API-CONTACT-DETECTION, AUTH-SUPABASE-SETUP | `src/app/travel-tools/page.tsx`(신규) | Section 순서 고정: Intro→탭(항공/숙소/동행 구하기)→여행정보 Form→입력 요약·외부 이동→찾기 Tip 3개→동행 작성 또는 로그인 안내·안전 안내; 항공/숙소 탭 데이터 출처=사용자 입력(브라우저 상태만), 동행 탭 제출 데이터 출처=`API-MATE-POSTS` | 항공·숙소·동행 구하기 3개 탭이 모두 실제로 렌더링되고 탭별 입력·검증·완료 상태가 서로 독립적으로 유지됨(탭 전환 시 값 유지, 오류 상태 비전파); 비로그인·미성년 시 동행 탭은 안내 카드로 대체(빈 화면 아님); Lorem ipsum·준비 중·정보 확인 필요 금지; Loading은 외부 이동/동행 제출 버튼 disabled+진행 표시, Error는 URL 오류·제출 실패 시 critical 토큰 오류+재시도(입력값 유지) | 항공·숙소 입력값(국가·지역·날짜)은 서버 API·DB·외부 URL query·서버 로그 어디에도 전달되지 않고 브라우저 상태로만 유지; 외부 이동은 `noopener,noreferrer` 새 탭; 동행 작성 시 공개 연락처 패턴 탐지 후 제출 차단 | E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION | P0 |
| 4 | PAGE-SCR004 | SCR-004 `/mates` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-036, REQ-FUNC-039, REQ-FUNC-040 | SCR-004 | `/mates` | `src/app/mates/page.tsx` | COMP-SCR004-INTRO, COMP-SCR004-FILTER, COMP-SCR004-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT-BLOCK, COMP-SCR004-STEPS, COMP-SCR004-SAFETY-CTA, COMP-GLOBAL-HEADER-FOOTER, API-MATE-POSTS, API-MATE-APPLICATIONS, API-BLOCK-REPORT | `src/app/mates/page.tsx`(신규) | Section 순서 고정: Intro→Filter·결과 요약→동행 목록→상세→신청 방법 3단계→안전·신고·차단 안내+CTA; 목록/상세 데이터 출처=`API-MATE-POSTS`, 참가·신고·차단 출처=`API-MATE-APPLICATIONS`/`API-BLOCK-REPORT` | 목록 Card 최대 8개 우선 노출; Desktop 목록+상세 좌우 분할/Mobile 목록→상세 Drawer; Lorem ipsum·준비 중·정보 확인 필요 금지; 검색 결과 0건 시 조건 초기화 버튼+이용 방법+작성 CTA를 갖춘 완성형 Empty State; Loading은 목록 조회 중 스켈레톤 Card+제출 버튼 disabled, Error는 조회·제출 실패 시 critical 토큰 오류+재시도 | 목록·상세 어디에도 전화번호·이메일·메신저 ID 미노출; 차단 관계 상호 미노출; 비로그인·미성년의 참가/신고/작성 시도는 인증 유도로 차단 | E2E-MATE-AUTH, Manual Check | P0 |
| 5 | PAGE-SCR005 | SCR-005 `/account` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-038, REQ-FUNC-041, REQ-FUNC-066, REQ-FUNC-077 | SCR-005 | `/account` | `src/app/account/page.tsx` | COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-MY-ACTIVITY, COMP-SCR005-ADMIN, COMP-GLOBAL-HEADER-FOOTER, AUTH-SUPABASE-SETUP, API-MATE-POSTS, API-BLOCK-REPORT, API-ADMIN-SETTINGS | `src/app/account/page.tsx`(신규) | 역할별 Section 순서: Guest=로그인 Intro→로그인/가입/재설정 Card→로그인 후 가능 기능→보안 안내; Member=프로필 Intro→프로필·성인확인·내 활동(내 글/참가요청/즐겨찾기/차단)→다음 행동; Admin=관리 Intro→신고 상태 변경·외부 URL 설정→도움말; 데이터 출처=`AUTH-SUPABASE-SETUP`(세션), `API-MATE-POSTS`/`API-BLOCK-REPORT`(내 활동), `API-ADMIN-SETTINGS`(관리자) | Guest/Member/Admin 3역할이 실제로 서로 다른 콘텐츠를 렌더링하고, 역할에 없는 관리 영역(예: Guest에게 관리자 탭)은 DOM에 렌더링되지 않음; 목록형 Section(내 글/참가요청/차단목록/신고목록) 데이터 없을 때 안내+이용 방법+CTA를 갖춘 완성형 Empty State; Lorem ipsum·준비 중·정보 확인 필요 금지; Dashboard·통계 차트 없음(리스트/표 기반); Loading은 인증·목록 조회·관리자 저장 중 버튼 disabled+진행 표시 또는 스켈레톤, Error는 실패 시 critical 토큰 오류+재시도 | 역할·권한은 서버(RLS)에서도 재검증(클라이언트 숨김만으로 끝내지 않음); 외부 URL 저장은 HTTPS 허용목록만 | E2E-MATE-AUTH, Manual Check | P0 |

---

## 3. COMPONENT Task

### 3.1 SCR-001 (9개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | COMP-SCR001-HERO | 여행지 검색 Hero(Section1) | COMPONENT | IMPLEMENT | REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-010, REQ-FUNC-067; REQ-NF-004 | SCR-001 | `/` | - | DATA-DESTINATIONS | `src/components/destinations/Hero.tsx`(신규) | 통합 검색(여행지+안전정보)+필터(국가/도시/계절/테마/기간, AND 조건)+빈 결과 시 조건 완화 안내·초기화; 필터 상태 URL query 동기화(허용 필터만) | 1440에서 Hero가 전체 높이를 차지하지 않고 다음 Section 시작이 보임; Mobile 전체폭 pill 검색 입력 | 필터/검색어를 서버 로그에 원문 저장하지 않음(분석 이벤트는 허용 속성만) | Manual Check | P0 |
| 7 | COMP-SCR001-DOMESTIC-GRID | 국내 여행지 Card Grid(Section2) | COMPONENT | IMPLEMENT | REQ-FUNC-001 | SCR-001 | `/` | - | DATA-DESTINATIONS, COMP-SCR001-DEST-DRAWER | `src/components/destinations/DomesticGrid.tsx`(신규) | 국내 탭 선택 시 국내 여행지만 표시(오분류 0건); 카드 클릭 시 `COMP-SCR001-DEST-DRAWER` 오픈 | 최소 6개 Card, Desktop 3열/Mobile 1열, 실제 장소 alt 텍스트 | - | Manual Check | P0 |
| 8 | COMP-SCR001-OVERSEAS-GRID | 해외 여행지 Card Grid(Section3) | COMPONENT | IMPLEMENT | REQ-FUNC-001 | SCR-001 | `/` | - | DATA-DESTINATIONS, COMP-SCR001-DEST-DRAWER, COMP-SCR001-SAFETY-DRAWER | `src/components/destinations/OverseasGrid.tsx`(신규) | 해외 탭 선택 시 해외 여행지만 표시; 각 카드에 안전정보 상태 미니 배지(최신/재확인 필요) | 최소 6개 Card, Desktop 3열/Mobile 1열 | 안전 배지는 amber/critical 토큰만 사용(코랄 재사용 금지) | Manual Check | P0 |
| 9 | COMP-SCR001-THEME-CHIPS | 여행 동기·테마 Chip(Section4) | COMPONENT | IMPLEMENT | -(Section 계약: SCR-001-S4) | SCR-001 | `/` | - | COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-OVERSEAS-GRID | `src/components/destinations/ThemeChips.tsx`(신규) | 테마 6개(자연/도심/미식/휴양/액티비티/가족여행) 선택 시 위 Grid를 같은 화면에서 필터링 | Chip 목록 패턴(Card Grid 반복 금지), Desktop/Mobile 모두 wrap | - | Manual Check | P1 |
| 10 | COMP-SCR001-SAFETY-GRID | 국가별 주의사항 Card Grid(Section5) | COMPONENT | IMPLEMENT | REQ-FUNC-047, REQ-FUNC-050 | SCR-001 | `/` | - | DATA-SAFETY, COMP-SCR001-SAFETY-DRAWER | `src/components/destinations/SafetyGrid.tsx`(신규) | 카드 클릭 시 `COMP-SCR001-SAFETY-DRAWER` 오픈; 최종 확인일 7일 초과 시 stale 배지 | 최소 6개 Card, 경보 단계·최종 확인일 텍스트 병기(색상 단독 금지) | - | Manual Check | P0 |
| 11 | COMP-SCR001-MATE-PREVIEW | 최근 동행글 3개/Empty(Section6) | COMPONENT | IMPLEMENT | -(Section 계약: SCR-001-S6) | SCR-001 | `/` | - | API-MATE-POSTS | `src/components/destinations/MatePreview.tsx`(신규) | 모집중 글만 최신 3개 노출; 0건이면 완성형 Empty State(설명+3단계 미니 안내+작성 CTA) 표시 | Card Grid 3열/Mobile 1열; Lorem ipsum·준비 중 금지 | 연락처 미노출(목록 카드) | Manual Check | P0 |
| 12 | COMP-SCR001-ABOUT-TEASER | free_traveler 소개 Split(Section7) | COMPONENT | IMPLEMENT | REQ-FUNC-057 | SCR-001 | `/` | - | DATA-REPRESENTATIVE | `src/components/destinations/AboutTeaser.tsx`(신규) | `50+ Trips`/`30+ Countries` 수치가 `/about`과 동일한 단일 데이터 소스 | 좌우 분할 패턴, `/about` CTA 버튼 | - | Manual Check | P1 |
| 13 | COMP-SCR001-DEST-DRAWER | 여행지 상세 Drawer/Modal | COMPONENT | IMPLEMENT | REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009 | SCR-001 | `/` | - | DATA-DESTINATIONS, COMP-SCR001-SAFETY-DRAWER | `src/components/destinations/DestinationDrawer.tsx`(신규) | 소개/명소 5+/추천시기/1·3일 일정/예산/교통/음식 3+/에티켓/출처/수정일 필수 필드 전부 표시; 해외 여행지는 안전정보 Drawer로 연결(국가코드 일치); 관련 여행지 최대 6개 추천 | Desktop 우측 슬라이드 Drawer 480~560px/Mobile Full-height Sheet; 닫기 버튼 44px 이상 | 이미지 alt·출처 표기 | Manual Check | P0 |
| 14 | COMP-SCR001-SAFETY-DRAWER | 안전정보 Drawer | COMPONENT | IMPLEMENT | REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054; REQ-NF-028 | SCR-001 | `/` | - | DATA-SAFETY | `src/components/destinations/SafetyDrawer.tsx`(신규) | 8개 필수 카테고리+출처·확인일+외교부 링크(새 탭, noopener,noreferrer)+국가/지역 범위 구분+긴급연락처+면책 고지; 7일 초과 시 재확인 필요 경고를 최신 배지보다 우선 노출; 중대 경보는 상단 텍스트로 표시 | amber(재확인 필요)/critical(중대 경보) 토큰 사용, 코랄 미사용 | 출처 URL 없이는 게시 불가(정적 데이터 검증은 DATA-SAFETY) | Manual Check | P0 |

### 3.2 SCR-002 (7개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 15 | COMP-SCR002-HERO | free_traveler Hero(Section1) | COMPONENT | IMPLEMENT | REQ-FUNC-061 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `src/components/about/ProfileHero.tsx`(신규) | 대표 사진+한 줄 소개; 대표 이미지 alt·출처 표시 | 1440에서 Hero 아래 다음 Section 시작이 보임 | - | Manual Check | P0 |
| 16 | COMP-SCR002-STATS | 여행 지표 Card(Section2) | COMPONENT | IMPLEMENT | REQ-FUNC-057 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `src/components/about/StatsCards.tsx`(신규) | `50+ Trips`/`30+ Countries` 단일 데이터 소스, 홈 Teaser와 동일 값 | 2개 Stat Card | - | Manual Check | P0 |
| 17 | COMP-SCR002-INTRO-PHILOSOPHY | 소개·철학 Split(Section3) | COMPONENT | IMPLEMENT | REQ-FUNC-058 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `src/components/about/IntroPhilosophy.tsx`(신규) | 자기소개·시작 이유·여행 철학 앵커 네비+본문 | 2~4개 문단, 한글 keep-all 줄바꿈 | - | Manual Check | P1 |
| 18 | COMP-SCR002-TIMELINE | 여행 Timeline(Section4) | COMPONENT | IMPLEMENT | REQ-FUNC-060 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `src/components/about/Timeline.tsx`(신규) | 연도·장소·요약 포함 항목, 클릭 시 해당 국가 있으면 SCR-001 Drawer로 이동 | 최소 6개 항목 | - | Manual Check | P1 |
| 19 | COMP-SCR002-COUNTRY-CHIPS | 방문 국가 Chip(Section5) | COMPONENT | IMPLEMENT | REQ-FUNC-059 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `src/components/about/CountryChips.tsx`(신규) | 4권역(아시아/유럽/북미/오세아니아) 그룹 헤딩+Chip | 최소 30개국 | - | Manual Check | P1 |
| 20 | COMP-SCR002-GALLERY | 여행 사진 Gallery(Section6) | COMPONENT | IMPLEMENT | REQ-FUNC-061 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `src/components/about/Gallery.tsx`(신규) | 서로 다른 장소, 실제 장소 설명 alt | 최소 8장, Desktop 4열/Mobile 1열 | - | Manual Check | P1 |
| 21 | COMP-SCR002-RECOMMENDED | 기억에 남는 여행지+CTA(Section7) | COMPONENT | IMPLEMENT | REQ-FUNC-063 | SCR-002 | `/about` | - | DATA-DESTINATIONS, DATA-REPRESENTATIVE | `src/components/about/Recommended.tsx`(신규) | 비공개 여행지 자동 제외, 클릭 시 SCR-001 Drawer 연결; `/travel-tools`·`/mates` CTA 2개 | 최소 4개 Card | - | Manual Check | P1 |

### 3.3 SCR-003 (5개, 항공/숙소/동행 작성 분리 — 원칙 9)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 22 | COMP-SCR003-INTRO-TABS | Intro+탭 전환(Section1·2) | COMPONENT | IMPLEMENT | -(Section 계약: SCR-003-S1/S2) | SCR-003 | `/travel-tools` | - | - | `src/components/travel-tools/IntroTabs.tsx`(신규) | 3단계 미니 안내(탭선택→조건입력→요약확인); 탭 3개 전환 시 아래 Section 콘텐츠만 교체(상태 분리) | 활성 탭 코랄 밑줄, 비활성 muted | - | Manual Check | P0 |
| 23 | COMP-SCR003-FLIGHT-FORM | 항공 조건 입력·요약·외부이동(Section3·4·5) | COMPONENT | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-054; REQ-NF-017 | SCR-003 | `/travel-tools` | - | API-OUTBOUND-VALIDATION, DATA-SAFETY | `src/components/travel-tools/FlightForm.tsx`(신규) | 국가/지역/출발일/귀국일 4필드+지역 종속 재계산; 과거/역전 날짜 제출 차단; 검증 통과 후 요약+비전달 고지+안전정보 면책 문구 재노출; `항공편 보러 가기` 새 탭(noopener,noreferrer); URL 오류 시 오류+재시도 | 필드별 오류는 critical 토큰, 코랄과 분리 | 입력값(국가/지역/날짜)을 서버 API·DB·로그·외부 URL query에 절대 전달하지 않음 | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS | P0 |
| 24 | COMP-SCR003-HOTEL-FORM | 숙소 조건 입력·요약·외부이동(Section3·4·5) | COMPONENT | IMPLEMENT | REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026; REQ-NF-017 | SCR-003 | `/travel-tools` | - | API-OUTBOUND-VALIDATION | `src/components/travel-tools/HotelForm.tsx`(신규) | 국가/지역/체크인/체크아웃 4필드; 체크인 과거·체크아웃≤체크인 차단; 검증 통과 후 요약+비전달 고지; `호텔 보러 가기` 새 탭; URL 오류 시 오류+재시도, 입력값 유지 | 상동 | 상동(서버·DB·URL 미전달) | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS | P0 |
| 25 | COMP-SCR003-TIPS | 비전달 고지+찾기 Tip 3개(Section5) | COMPONENT | IMPLEMENT | -(Section 계약: SCR-003-S5) | SCR-003 | `/travel-tools` | - | COMP-SCR003-FLIGHT-FORM, COMP-SCR003-HOTEL-FORM | `src/components/travel-tools/Tips.tsx`(신규) | Tip 3개(날짜 여유/영문 지역명 확인/가격 변동 안내), 3단계 안내 패턴 | Card Grid와 다른 시각 패턴(아이콘+텍스트) | - | Manual Check | P1 |
| 26 | COMP-SCR003-MATE-WRITE | 동행 구하기: 작성 Form/로그인 안내(Section6) | COMPONENT | IMPLEMENT | REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080 | SCR-003 | `/travel-tools` | - | API-MATE-POSTS, API-CONTACT-DETECTION, AUTH-SUPABASE-SETUP, COMP-GLOBAL-POLICY-PAGES | `src/components/travel-tools/MateWriteForm.tsx`(신규) | 비로그인/미성년: 로그인·성인확인 안내 카드(빈 화면 아님); 로그인+성인확인 완료: 제목/국가/지역/기간/인원/조건/설명/안전수칙 동의 Form; 제출 전 전화번호·이메일·메신저 ID 패턴 탐지 시 제출 차단+수정 안내; 동의 시 정책 버전·시각 저장 | 오류 문구 critical 토큰 | 연락처 탐지 실패율 목표(탐지 95%+/오탐 5%-)를 UNIT-CONTACT-DETECTION으로 검증 | UNIT-CONTACT-DETECTION, E2E-TRAVEL-TOOLS | P0 |

### 3.4 SCR-004 (8개, 목록/필터/상세/참가/신고/차단 분리 — 원칙 10)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 27 | COMP-SCR004-INTRO | Intro+작성 CTA(Section1) | COMPONENT | IMPLEMENT | -(Section 계약: SCR-004-S1) | SCR-004 | `/mates` | - | - | `src/components/mates/Intro.tsx`(신규) | `/travel-tools` 동행 탭으로 이동하는 CTA | CTA Banner 패턴 | - | Manual Check | P1 |
| 28 | COMP-SCR004-FILTER | Filter+결과 요약(Section2) | COMPONENT | IMPLEMENT | REQ-FUNC-030; REQ-NF-004 | SCR-004 | `/mates` | - | API-MATE-POSTS | `src/components/mates/Filter.tsx`(신규) | 국가/지역/기간겹침/연령대/성별/스타일/모집상태 필터, 차단 사용자 글 제외; "총 N건" 결과 요약 | p95 1초 이내(정적/캐시 목록 기준) | 차단 관계 상호 미노출 | Manual Check | P0 |
| 29 | COMP-SCR004-LIST | 동행글 목록 Card(Section3) | COMPONENT | IMPLEMENT | REQ-FUNC-033 | SCR-004 | `/mates` | - | COMP-SCR004-FILTER, API-MATE-POSTS | `src/components/mates/MateList.tsx`(신규) | 최대 8개 우선 노출; 0건 시 완성형 Empty State(조건 초기화+이용 방법+작성 CTA) | Desktop 3열/Mobile 1열 | 카드에 연락처 미노출 | Manual Check | P0 |
| 30 | COMP-SCR004-DETAIL | 목록+상세 분할/Drawer(Section4) | COMPONENT | IMPLEMENT | REQ-FUNC-033 | SCR-004 | `/mates` | - | COMP-SCR004-LIST | `src/components/mates/MateDetail.tsx`(신규) | Desktop 좌우 분할, Mobile Full-height Drawer; 작성자 조건·설명 전문 표시 | - | 연락처 미노출, 응답에도 이메일/전화번호 필드 제외 | Manual Check | P0 |
| 31 | COMP-SCR004-APPLY | 참가 요청 제출·승인·거절 | COMPONENT | IMPLEMENT | REQ-FUNC-034, REQ-FUNC-036 | SCR-004 | `/mates` | - | COMP-SCR004-DETAIL, API-MATE-APPLICATIONS, AUTH-SUPABASE-SETUP | `src/components/mates/ApplyPanel.tsx`(신규) | 500자 이내 비공개 메시지 제출; 작성자 뷰에서 승인/거절 버튼; 비로그인·미성년 시 인증 유도 | Toast로 접수 확인(`COMP-GLOBAL-TOAST`) | 중복 PENDING/ACCEPTED 차단(API 레벨), 비작성자 승인 시도 403 | UNIT-MATE-STATE, E2E-MATE-AUTH | P0 |
| 32 | COMP-SCR004-REPORT-BLOCK | 신고·차단 버튼 | COMPONENT | IMPLEMENT | REQ-FUNC-039, REQ-FUNC-040 | SCR-004 | `/mates` | - | COMP-SCR004-DETAIL, API-BLOCK-REPORT | `src/components/mates/ReportBlockActions.tsx`(신규) | 신고 사유코드+설명 제출 시 접수번호 즉시 반환; 차단 시 상호 노출 즉시 제한 | Toast로 접수 완료 안내 | 신고자/피신고자 상세는 관리자만 접근(RLS) | E2E-MATE-AUTH | P0 |
| 33 | COMP-SCR004-STEPS | 신청 방법 3단계(Section5) | COMPONENT | IMPLEMENT | -(Section 계약: SCR-004-S5) | SCR-004 | `/mates` | - | - | `src/components/mates/StepsGuide.tsx`(신규) | 모집글 확인→메시지 작성·제출→승인 후 연결(연락처 비공개 유지) 3단계 | 3단계 안내 패턴(다른 Section과 시각 구분) | - | Manual Check | P1 |
| 34 | COMP-SCR004-SAFETY-CTA | 안전 안내+CTA(Section6) | COMPONENT | IMPLEMENT | -(Section 계약: SCR-004-S6, REQ-FUNC-054 면책 재노출) | SCR-004 | `/mates` | - | - | `src/components/mates/SafetyCtaBanner.tsx`(신규) | 안전수칙 요약 3줄+신고·차단 안내+`/travel-tools` CTA | CTA Banner 패턴 | - | Manual Check | P1 |

### 3.5 SCR-005 (4개, Auth/Profile/My Activity/Admin 분리 — 원칙 11)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 35 | COMP-SCR005-AUTH | Guest: 로그인/가입/재설정 | COMPONENT | IMPLEMENT | REQ-FUNC-066 | SCR-005 | `/account` | - | AUTH-SUPABASE-SETUP | `src/components/account/AuthPanel.tsx`(신규) | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정; 인증되지 않은 이메일은 쓰기 권한 없음 | 로그인 후 가능한 기능 체크리스트+보안 안내 | 비밀번호 서버 해시, 콜백은 기술 Route(`/auth/callback`) | E2E-MATE-AUTH | P0 |
| 36 | COMP-SCR005-PROFILE | Member: 프로필·성인확인 | COMPONENT | IMPLEMENT | REQ-FUNC-028, REQ-FUNC-029 | SCR-005 | `/account` | - | AUTH-SUPABASE-SETUP | `src/components/account/ProfilePanel.tsx`(신규) | 닉네임/연령대/여행스타일 필수, 성별 선택; 성인 확인 완료 배지+수정 버튼 | - | 정확한 생년월일 미저장, `is_adult`+`adult_verified_at`만 | Manual Check | P0 |
| 37 | COMP-SCR005-MY-ACTIVITY | Member: 내 글/참가요청/즐겨찾기/차단 | COMPONENT | IMPLEMENT | REQ-FUNC-038, REQ-FUNC-040 | SCR-005 | `/account` | - | API-MATE-POSTS, API-BLOCK-REPORT, COMP-GLOBAL-FAVORITE-TOGGLE | `src/components/account/MyActivityPanel.tsx`(신규) | 내 글 마감/수정/삭제(승인된 요청자 있으면 경고); 참가요청 현황(PENDING/ACCEPTED/REJECTED); 즐겨찾기 목록(localStorage 읽기); 차단 목록+해제 | 각 목록 0건 시 완성형 Empty State(안내+CTA) | 본인 데이터만 조회(RLS) | Manual Check | P0 |
| 38 | COMP-SCR005-ADMIN | Admin: 신고 상태·외부 URL 설정 | COMPONENT | IMPLEMENT | REQ-FUNC-041, REQ-FUNC-077 | SCR-005 | `/account` | - | API-BLOCK-REPORT, API-ADMIN-SETTINGS | `src/components/account/AdminPanel.tsx`(신규) | 신고 목록 OPEN/RESOLVED/DISMISSED 필터+상태 변경; 항공·호텔 외부 URL 입력(HTTPS 허용목록만 저장) | 표/리스트 기반, Dashboard·차트 없음; Admin 외 역할에는 렌더링되지 않음 | HTTP/`javascript:`/`data:` URL 저장 차단; Admin 역할 서버 재검증 | Manual Check | P0 |

### 3.6 전역(GLOBAL) Component (8개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 39 | COMP-GLOBAL-HEADER-FOOTER | 전역 Header/Footer | COMPONENT | IMPLEMENT | REQ-FUNC-064, REQ-FUNC-065 | - | 전 화면 | - | - | `src/components/layout/Header.tsx`(신규), `src/components/layout/Footer.tsx`(신규) | 5개 Screen 공통 내비 4개 링크+계정 아이콘; Footer 3컬럼(서비스/회사/이용정책)+면책 문구 | 320px~Desktop 반응형, 가로 스크롤 없음 | - | Manual Check | P0 |
| 40 | COMP-GLOBAL-FAVORITE-TOGGLE | 즐겨찾기 토글(localStorage) | COMPONENT | IMPLEMENT | REQ-FUNC-068 | SCR-001 | `/` | - | - | `src/components/common/FavoriteToggle.tsx`(신규) | localStorage에만 저장(서버 미전송), 중복 즐겨찾기 방지 | 44px 이상 터치 영역 | 서버 저장 0건 | Manual Check | P1 |
| 41 | COMP-GLOBAL-SHARE-BUTTON | 공유 버튼 | COMPONENT | IMPLEMENT | REQ-FUNC-069 | - | SCR-001/002/004 | - | - | `src/components/common/ShareButton.tsx`(신규) | Web Share API 우선, 실패 시 URL 복사 폴백 | - | - | Manual Check | P1 |
| 42 | COMP-GLOBAL-TOAST | 전역 Toast 알림 | COMPONENT | IMPLEMENT | REQ-FUNC-043 | - | 전 화면 | - | - | `src/components/common/Toast.tsx`(신규) | 참가요청 접수/신고 접수/외부 이동 실패 등에 사용; 이메일 실제 발송 없이 인앱 상태로만 대체 | 3~5초 자동 소멸, Mobile 하단/Desktop 우측 하단 고정 | - | Manual Check | P0 |
| 43 | COMP-GLOBAL-SEO | 페이지별 SEO 메타데이터 | COMPONENT | IMPLEMENT | REQ-FUNC-070; REQ-NF-030 | - | 전 화면 | - | - | `src/lib/seo.ts`(신규), 각 `page.tsx`에 `generateMetadata` 적용(수정) | title/description/canonical/OG를 화면별로 고유하게 생성 | - | - | RELEASE-SEO-CHECK | P1 |
| 44 | COMP-GLOBAL-A11Y | 시맨틱 HTML·ARIA 공통 규칙 | COMPONENT | IMPLEMENT | REQ-FUNC-079; REQ-NF-023, REQ-NF-024 | - | 전 화면 | - | - | 각 컴포넌트 파일 내 적용(전용 파일 없음, 코드 리뷰 체크리스트로 관리) | 폼/모달/탭/알림에 올바른 role·aria-* | - | 색상만으로 상태 구분 금지, 텍스트 라벨 병기 | E2E-PUBLIC-SMOKE(axe-core) | P1 |
| 45 | COMP-GLOBAL-ERROR-PAGES | 404/500/권한없음/외부연결실패 | COMPONENT | IMPLEMENT | REQ-FUNC-078 | 기술 Route | `/404`,`/500`,`/unauthorized` | `src/app/not-found.tsx`, `src/app/error.tsx` | - | `src/app/not-found.tsx`(신규), `src/app/error.tsx`(신규), `src/app/unauthorized/page.tsx`(신규) | 홈·이전·재시도 중 최소 1개 복구 행동 제공 | - | - | Manual Check | P1 |
| 46 | COMP-GLOBAL-POLICY-PAGES | 이용약관·개인정보·안전수칙·면책 | COMPONENT | IMPLEMENT | REQ-FUNC-080 | 기술 Route(정적 문서) | `/policies/*` | `src/app/policies/terms/page.tsx` 등 | - | `src/app/policies/terms/page.tsx`(신규), `.../privacy/page.tsx`(신규), `.../mate-safety/page.tsx`(신규), `.../content-disclaimer/page.tsx`(신규) | 정책 버전 명시, `COMP-SCR003-MATE-WRITE`의 동의 체크박스가 이 버전을 참조 | - | - | Manual Check | P1 |

---

## 4. DATA / DB / AUTH·API / SEC / TEST / CI / RELEASE Task

### 4.1 DATA (4개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 47 | DATA-DESTINATIONS | 여행지 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-007, REQ-FUNC-008; REQ-NF-006, REQ-NF-026 | - | SCR-001 | - | - | `src/data/destinations.ts`(신규) | 국내 10개 이상, 해외 15개국 30개 도시 이상; 필수 필드(소개300자+/명소5+/추천시기/1·3일 일정/예산/교통/음식3+/에티켓3+/출처/수정일) 스키마로 강제 | 이미지는 일반 URL+alt 텍스트만(라이선스 승인 워크플로 없음) | 출처 URL 없이는 데이터 등록 불가 | RELEASE-CONTENT-QA | P0 |
| 48 | DATA-SAFETY | 국가 안전정보 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053; REQ-NF-027 | - | SCR-001 | - | DATA-DESTINATIONS | `src/data/safety.ts`(신규) | 소개되는 해외 국가 전체 커버리지; 8개 카테고리+출처+최종확인일+`scope_type`/`scope_text`+긴급연락처 스키마로 강제 | - | 출처 URL·확인일 없이는 등록 불가 | RELEASE-CONTENT-QA | P0 |
| 49 | DATA-REPRESENTATIVE | 대표 소개 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-063 | - | SCR-002 | - | DATA-DESTINATIONS | `src/data/about.ts`(신규) | `50+ Trips`/`30+ Countries`/소개문/철학/30개국 이상/Timeline 6+/추천 여행지 4(공개 여행지 ID 참조) | 이미지 alt+출처만(라이선스 워크플로 없음) | - | RELEASE-CONTENT-QA | P0 |
| 50 | DATA-CONTENT-VALIDATION | 콘텐츠 완전성 검증 스크립트 | DATA | IMPLEMENT | REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-074; REQ-NF-026, REQ-NF-027 | - | - | - | DATA-DESTINATIONS, DATA-SAFETY | `scripts/validate_content.py`(신규) | `src/data/*.ts`의 수량·필수 필드 완전성을 스크립트로 검사, 미달 시 실패 | - | - | CI-LINT-TYPECHECK-UNIT, RELEASE-CONTENT-QA | P1 |

### 4.2 DB (4개, Schema/RLS/Access 분리 — 원칙 12)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 51 | DB-SCHEMA-BASE | DB 스키마(6테이블 한도) | DB | IMPLEMENT | -(지원: REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-077) | - | - | - | - | `supabase/migrations/0001_init.sql`(신규) | `user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting` 6개 테이블만 생성; 7번째 테이블 추가 금지 | - | 정확한 생년월일 컬럼 없음 | CI-LINT-TYPECHECK-UNIT | P0 |
| 52 | DB-RLS-BASE | RLS 정책 | DB | IMPLEMENT | REQ-FUNC-044; REQ-NF-013 | - | - | - | DB-SCHEMA-BASE | `supabase/migrations/0002_rls.sql`(신규) | 본인 글/요청, 대상 작성자, Admin만 비공개 데이터 열람; 그 외 403/빈 결과 | - | 권한별 부정 접근 테스트 전부 차단 | TEST-RLS-BASIC | P0 |
| 53 | DB-ACCESS | Supabase Access Layer | DB | IMPLEMENT | -(지원, 전 API Task 공통) | - | - | - | DB-SCHEMA-BASE, DB-RLS-BASE | `src/lib/supabase/client.ts`(신규), `src/lib/supabase/server.ts`(신규) | 서버/클라이언트 Supabase 클라이언트 분리, 서비스 키는 서버 전용 | - | 비밀키 환경변수로만 관리, 클라이언트 번들 미포함 | CI-LINT-TYPECHECK-UNIT | P0 |
| 54 | DB-SEED-BASE | 로컬/QA용 Seed 데이터 | DB | IMPLEMENT | -(지원, QA용) | - | - | - | DB-SCHEMA-BASE | `supabase/seed.sql`(신규) | E2E/Manual QA에 필요한 최소 mate_post/user_profile 샘플 데이터(연락처 패턴 미포함 예시 포함) | - | 실 개인정보 미포함(가상 데이터만) | E2E-MATE-AUTH | P1 |

### 4.3 AUTH / API (7개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 55 | AUTH-SUPABASE-SETUP | Supabase Auth 연동 | AUTH | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-066 | - | SCR-005 | `/auth/callback` | DB-ACCESS | `src/lib/auth.ts`(신규), `src/app/auth/callback/route.ts`(신규) | 이메일 인증 세션 필수(쓰기 API), 성인확인 상태 저장(`is_adult`,`adult_verified_at`) | - | 콜백은 기술 Route, 세션은 서버에서 검증 | E2E-MATE-AUTH | P0 |
| 56 | API-MATE-POSTS | 동행글 CRUD API | API | IMPLEMENT | REQ-FUNC-031, REQ-FUNC-037, REQ-FUNC-038; REQ-NF-005 | - | SCR-003/004/005 | - | DB-ACCESS, AUTH-SUPABASE-SETUP | `src/app/api/mates/route.ts`(신규), `src/app/api/mates/[id]/route.ts`(신규) | 생성/조회/수정/마감/삭제; 종료일 다음날 조회 시점 계산으로 CLOSED 파생(배치 작업 아님) | - | 본인 글만 수정/삭제(RLS) | UNIT-MATE-STATE, E2E-TRAVEL-TOOLS | P0 |
| 57 | API-MATE-APPLICATIONS | 참가 요청 CRUD API | API | IMPLEMENT | REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036; REQ-NF-005 | - | SCR-004 | - | API-MATE-POSTS | `src/app/api/mates/[id]/applications/route.ts`(신규), `src/app/api/applications/[id]/route.ts`(신규) | 500자 제한, 중복 PENDING/ACCEPTED unique 제약, 작성자만 승인/거절 | - | 비작성자 승인 시도 403 | UNIT-MATE-STATE, TEST-RLS-BASIC | P0 |
| 58 | API-BLOCK-REPORT | 차단·신고 API | API | IMPLEMENT | REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041; REQ-NF-019 | - | SCR-004/005 | - | DB-ACCESS | `src/app/api/blocks/route.ts`(신규), `src/app/api/blocks/[id]/route.ts`(신규), `src/app/api/reports/route.ts`(신규), `src/app/api/admin/reports/route.ts`(신규) | 신고 접수 즉시 ID 반환(p95 3초 이내), 차단 시 상호 노출 즉시 제한, Admin 상태 변경(OPEN/RESOLVED/DISMISSED) | - | 신고 상세는 Admin만 조회 | E2E-MATE-AUTH | P0 |
| 59 | API-ADMIN-SETTINGS | 외부 URL 설정 API | API | IMPLEMENT | REQ-FUNC-077 | - | SCR-005 | - | DB-ACCESS | `src/app/api/admin/settings/outbound/route.ts`(신규) | 항공/호텔 외부 URL HTTPS 허용목록만 저장·조회 | - | HTTP/`javascript:`/`data:` 저장 거부 | Manual Check | P0 |
| 60 | API-OUTBOUND-VALIDATION | 외부 이동 URL 검증 로직 | API | IMPLEMENT | REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026; REQ-NF-017 | - | SCR-003 | - | API-ADMIN-SETTINGS | `src/lib/outbound.ts`(신규) | 허용목록 밖/미설정 URL이면 이동 차단; 목적지·날짜 query·본문·쿠키로 전달 안 함 | - | 입력값 로그 미기록 | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS | P0 |
| 61 | API-CONTACT-DETECTION | 공개 연락처 탐지 로직 | API | IMPLEMENT | REQ-FUNC-032 | - | SCR-003 | - | - | `src/lib/contact-detection.ts`(신규) | 전화번호·이메일·메신저 ID 정규식 탐지, 탐지 시 수정 안내 메시지 반환 | - | 탐지 실패 시에도 서버 재검증(클라이언트 우회 방지) | UNIT-CONTACT-DETECTION | P0 |

### 4.4 SEC (1개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 62 | SEC-BASELINE | CSRF/XSS/환경변수 베이스라인 | SEC | IMPLEMENT | REQ-NF-014, REQ-NF-015, REQ-NF-016 | - | 전역 | - | DB-ACCESS | `src/lib/security.ts`(신규), `next.config.ts`(수정) | Server Action 동일출처 검증, 입력 이스케이프/검증, 비밀키는 서버 전용 env로만 접근 | - | 클라이언트 번들에 비밀키 미포함(빌드 산출물 점검) | CI-LINT-TYPECHECK-UNIT, RELEASE-VERCEL-SUPABASE-CHECK | P0 |

### 4.5 TEST — Unit / RLS / E2E (7개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 63 | UNIT-TRAVEL-DATES | 날짜 검증 Unit Test | UNIT_TEST | IMPLEMENT | REQ-FUNC-013, REQ-FUNC-021 | - | SCR-003 | - | COMP-SCR003-FLIGHT-FORM, COMP-SCR003-HOTEL-FORM | `tests/unit/travel-dates.test.ts`(신규) | 과거 출발일/체크인, 역전 날짜, 동일 체크인=체크아웃 등 경계값 전부 차단 검증 | - | - | Unit(CI) | P0 |
| 64 | UNIT-CONTACT-DETECTION | 연락처 탐지 Unit Test | UNIT_TEST | IMPLEMENT | REQ-FUNC-032 | - | SCR-003 | - | API-CONTACT-DETECTION | `tests/unit/contact-detection.test.ts`(신규) | 전화번호/이메일/메신저 ID 패턴 기준 테스트셋 탐지율 95%+, 오탐 5%- | - | - | Unit(CI) | P0 |
| 65 | UNIT-MATE-STATE | 동행 상태 전이 Unit Test | UNIT_TEST | IMPLEMENT | REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037 | - | SCR-004 | - | API-MATE-APPLICATIONS, API-MATE-POSTS | `tests/unit/mate-state.test.ts`(신규) | PENDING→ACCEPTED/REJECTED, 중복 요청 차단, 종료일 경과 시 CLOSED 파생 로직 검증 | - | - | Unit(CI) | P0 |
| 66 | TEST-RLS-BASIC | RLS 기본 정책 Test | RLS_TEST | IMPLEMENT | REQ-FUNC-044; REQ-NF-013 | - | - | - | DB-RLS-BASE | `tests/rls/rls-basic.test.ts`(신규) | 타인 글 수정/비공개 신고 상세 조회 등 권한별 부정 접근이 전부 403 또는 빈 결과 | - | - | Unit(CI) | P0 |
| 67 | E2E-PUBLIC-SMOKE | 공개 화면 Smoke(Chromium) | E2E_TEST | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-004, REQ-FUNC-047; REQ-NF-024 | SCR-001/002 | `/`,`/about` | - | PAGE-SCR001, PAGE-SCR002 | `tests/e2e/public-smoke.spec.ts`(신규), `playwright.config.ts`(신규 — Chromium 단일) | 흐름 1: 홈 여행지 탐색+상세 Drawer; 흐름 2: 안전정보 Drawer stale 배지; 흐름 3: `/about` 탐색; axe-core 자동 검사 포함 | - | - | E2E(CI) | P0 |
| 68 | E2E-TRAVEL-TOOLS | 여행 준비 흐름 Smoke(Chromium) | E2E_TEST | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-016, REQ-FUNC-019, REQ-FUNC-024 | SCR-003 | `/travel-tools` | - | PAGE-SCR003 | `tests/e2e/travel-tools.spec.ts`(신규) | 흐름 4: 항공 조건 입력→요약→외부이동 새 탭; 흐름 5: 숙소 동일 흐름 | - | 네트워크 탭에서 입력값 미노출 확인 | E2E(CI) | P0 |
| 69 | E2E-MATE-AUTH | 동행·인증 흐름 Smoke(Chromium) | E2E_TEST | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-034, REQ-FUNC-036, REQ-FUNC-039, REQ-FUNC-040 | SCR-004/005 | `/mates`,`/account` | - | PAGE-SCR004, PAGE-SCR005 | `tests/e2e/mate-auth.spec.ts`(신규) | 흐름 6: 로그인·성인확인→참가 요청→작성자 승인; 흐름 7: 신고·차단 접수 확인 | - | 연락처 미노출 재확인 | E2E(CI) | P0 |

### 4.6 CI / RELEASE (7개)

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 70 | CI-LINT-TYPECHECK-UNIT | CI 파이프라인(Lint/Typecheck/Unit/Build) | CI | IMPLEMENT | REQ-NF-031 | - | - | - | DATA-CONTENT-VALIDATION, SEC-BASELINE | `.github/workflows/ci.yml`(신규) | main 병합 전 ESLint/TypeScript strict/Vitest 단위테스트/`next build` 전부 통과 필수 | - | - | CI | P0 |
| 71 | RELEASE-PERFORMANCE-CHECK | 성능 목표 수동 점검 | RELEASE_CHECK | VERIFY | REQ-NF-001, REQ-NF-002, REQ-NF-003, REQ-NF-004, REQ-NF-005, REQ-NF-006, REQ-NF-019 | - | 전역 | - | PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005 | (문서) `docs/release/performance-checklist.md`(신규) | Lighthouse 수동 측정으로 LCP/INP/CLS/필터·쓰기 응답 목표 확인(CI 게이트 아님) | - | - | Manual Check | P1 |
| 72 | RELEASE-A11Y-MANUAL | 접근성 수동 점검 | RELEASE_CHECK | VERIFY | REQ-NF-025 | - | 전역 | - | COMP-GLOBAL-A11Y | (문서) `docs/release/a11y-checklist.md`(신규) | 키보드 전용 탐색·스크린리더로 핵심 UC 100% 통과 확인 | - | - | Manual Check | P1 |
| 73 | RELEASE-CONTENT-QA | 콘텐츠 완전성 게이트 | RELEASE_CHECK | VERIFY | REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-074; REQ-NF-026, REQ-NF-027 | - | SCR-001 | - | DATA-CONTENT-VALIDATION | (문서) `docs/release/content-qa-checklist.md`(신규) | 게시 전 수량·필수필드·출처·확인일 스크립트 결과가 실패 0건 | - | - | Manual Check | P0 |
| 74 | RELEASE-SEO-CHECK | SEO 메타데이터 점검 | RELEASE_CHECK | VERIFY | REQ-FUNC-070; REQ-NF-030 | - | 전역 | - | COMP-GLOBAL-SEO | (문서) `docs/release/seo-checklist.md`(신규) | 5개 Screen 모두 title/description/canonical/OG 누락 0건 | - | - | Manual Check | P2 |
| 75 | RELEASE-COST-CHECK | 월 인프라 비용 점검 | RELEASE_CHECK | VERIFY | REQ-NF-034 | - | - | - | - | (문서) `docs/release/cost-checklist.md`(신규) | Vercel+Supabase 무료/저비용 티어 기준 월 10만원 이하 확인 | - | - | Manual Check | P2 |
| 76 | RELEASE-VERCEL-SUPABASE-CHECK | Vercel/Supabase 배포 확인 | RELEASE_CHECK | VERIFY | REQ-NF-012, REQ-NF-016 | - | - | - | SEC-BASELINE, DB-ACCESS | (문서) `docs/release/deploy-checklist.md`(신규) | Vercel 배포 후 TLS 적용 확인, Supabase 환경변수(서버 전용)가 클라이언트에 노출되지 않음을 빌드 산출물에서 확인 | - | - | Manual Check | P0 |

---

## 5. NON_IMPLEMENTATION (EXCLUDED, 22건 — Task를 만들지 않음)

| Requirement Ref | 근거(제외 사유) | 후속 방향 |
|---|---|---|
| REQ-FUNC-042 | 신고 상태 변경 외 별도 제재 액션(경고/콘텐츠 숨김/계정 제한) UI는 관리자 범위 초과 | 필요 시 DB에서 운영자가 수동 처리(Admin UI 확장은 별도 승인 후 재검토) |
| REQ-FUNC-045 | 탈퇴 비식별화·30일 삭제 파이프라인은 MVP 범위 밖(자동화 인프라 필요) | 탈퇴는 계정 비활성화 수준으로 처리, 정식 삭제 파이프라인은 후속 스프린트 검토 |
| REQ-FUNC-055 | 안전정보 Editor 작성·검수·게시 워크플로(CMS) 제외 | `src/data/safety.ts` 정적 파일 직접 수정으로 대체, Git 커밋 이력으로 변경 추적 |
| REQ-FUNC-056 | 안전정보 변경 이력(감사 로그) UI 제외 | Git 커밋 로그로 대체, 별도 UI 불필요 시 계속 보류 |
| REQ-FUNC-062 | 관리자 설정 기반 문의·SNS 링크 편집 UI 제외 | `src/data/about.ts`에 정적 값으로 유지, 값 변경 시 코드 배포로 처리 |
| REQ-FUNC-071 | 커스텀 분석 이벤트 스키마·파이프라인 제외 | Vercel 기본 웹 분석 범위로 대체, 커스텀 이벤트 필요성 재발생 시 재검토 |
| REQ-FUNC-072 | 여행지 콘텐츠 CMS CRUD(Editor/Admin) 제외 | 정적 데이터 파일 직접 편집, 콘텐츠 양 증가 시 CMS 도입 재검토 |
| REQ-FUNC-073 | 미디어 업로드 라이선스 승인 워크플로 제외 | alt 텍스트+출처 URL만 정적 데이터에 기록, 라이선스 승인 필요성 재발생 시 재검토 |
| REQ-FUNC-075 | 안전정보 stale 현황 Admin 대시보드 제외 | 공개 페이지의 stale 배지(REQ-FUNC-050)만 제공, 운영자는 수동 순회 확인 |
| REQ-FUNC-076 | 관리자 변경·신고 처리 범용 감사 로그 제외 | Git 커밋 로그 + DB 타임스탬프 컬럼(있는 경우)으로 대체 |
| REQ-NF-007 | Lighthouse CI 성능 예산 게이트 미구축 | `RELEASE-PERFORMANCE-CHECK` 수동 점검으로 대체, 트래픽 증가 시 CI 게이트 재검토 |
| REQ-NF-008 | 월간 가용성 SLA 모니터링 미구축 | Vercel 플랫폼 기본 가용성에 의존 |
| REQ-NF-009 | 내부 API 5xx 비율 모니터링 미구축 | Vercel 기본 로그/대시보드로 대체 |
| REQ-NF-010 | DB 자동 백업 RPO/RTO 설계 제외 | Supabase 플랫폼 기본 백업에 의존, 요구 수준 상승 시 재검토 |
| REQ-NF-011 | 외부 링크 주간 자동 점검·Admin 알림 제외 | `RELEASE-VERCEL-SUPABASE-CHECK`/배포 전 수동 링크 점검으로 대체 |
| REQ-NF-018 | 개인정보 내보내기·자동 삭제 파이프라인 제외 | REQ-FUNC-045와 동일하게 후속 스프린트 검토 |
| REQ-NF-020 | 신고 1차 검토 24h SLA 계측 대시보드 제외 | 운영자가 Admin 신고 목록을 수동 처리(REQ-FUNC-041) |
| REQ-NF-021 | Rate limiting 인프라 미구축 | Supabase 기본 제한에 의존, 어뷰징 발생 시 재검토 |
| REQ-NF-022 | Moderator 조치 감사 로그 제외 | REQ-FUNC-076과 동일 사유 |
| REQ-NF-029 | 공개 미디어 100% 라이선스 메타데이터 강제 제외 | alt+출처 URL만 요구(REQ-FUNC-007/061과 동일 완화 기준) |
| REQ-NF-032 | `request_id` 구조화 로그 시스템 미구축 | Vercel 기본 로그로 대체 |
| REQ-NF-033 | 5xx/외부링크 실패 5분 이내 알림 체계 미구축 | REQ-NF-011과 동일하게 수동 점검으로 대체 |

> 22건 모두 `docs/PROJECT_SCOPE.md`의 EXCLUDED 분류와 정확히 일치하며, 어떤 Task의 `Requirement Ref`에도 등장하지 않는다(§6에서 재확인).

---

## 6. Requirement 커버리지 검증 (114/114 — 빠진 ID 없음)

### 6.1 IMPLEMENT 92건 → 배분 Task (전부 최소 1개 이상)

REQ-FUNC-001→7,8 · 002→6 · 003→6 · 004→13 · 005→6 · 006→13 · 007→13,47 · 008→47,50,73 · 009→13 · 010→6 · 011→23,68 · 012→23 · 013→23,63 · 014→23 · 015→23 · 016→23,60,68 · 017→23,60 · 018→23,60 · 019→24,68 · 020→24 · 021→24,63 · 022→24 · 023→24 · 024→24,60,68 · 025→24,60 · 026→24,60 · 027→55,69 · 028→36,55 · 029→36 · 030→28 · 031→26,56 · 032→26,61,64,69 · 033→29,30 · 034→31,69 · 035→57,65 · 036→31,57,65,69 · 037→56,65 · 038→37,56 · 039→32,58,69 · 040→32,37,58,69 · 041→38,58 · 043→42 · 044→52,66 · 046→48,50,73 · 047→10,14,67,73 · 048→14,73 · 049→14 · 050→10,14 · 051→14 · 052→14,73 · 053→14,73 · 054→14,23 · 057→12,16,49 · 058→17,49 · 059→19,49 · 060→18,49 · 061→15,20,49 · 063→21,49 · 064→39 · 065→39 · 066→35,55 · 067→6 · 068→40 · 069→41 · 070→43,74 · 074→50,73 · 077→38,59 · 078→45 · 079→44,72 · 080→26,46

REQ-NF-001→71 · 002→71 · 003→71 · 004→6,28,71 · 005→56,57,71 · 006→47,71 · 012→76 · 013→52,66 · 014→62 · 015→62 · 016→62,76 · 017→23,24,60 · 019→58,71 · 023→44 · 024→44,67 · 025→72 · 026→47,73 · 027→48,73 · 028→14 · 030→43,74 · 031→70 · 034→75

> 위 목록에 등장하지 않는 IMPLEMENT ID는 없음(전수 대조 완료). 92/92 배분 확인.

### 6.2 EXCLUDED 22건 사용 여부

§5 표의 22건은 §2~§4의 어떤 `Requirement Ref` 셀에도 등장하지 않음(교차 검색 결과 0건). 22/22 확인.

### 6.3 최종 합계

92(IMPLEMENT, 배분 완료) + 22(EXCLUDED, §5 기록 완료) = **114/114**. 빠진 Requirement ID 없음 — 이 문서를 완료로 보고한다.
