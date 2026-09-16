# Free Traveler — UI/UX Plan (04_UIUX_PLAN.md)

- **Document ID:** UIUX-TRAVEL-001
- **기반 문서:** `docs/01_PRD.md`, `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `design-reference/vendor/airbnb/DESIGN.md`
- **적용 대상:** 5개 고정 디자인 Screen(SCR-001~005)의 디자인 토큰, 공통 컴포넌트, 화면별 Section 구성, 상태 정의

---

## 1. Airbnb 참고 범위와 차별화

Airbnb DESIGN.md는 레이아웃 밀도, 카드 중심 구조, 1단계 elevation, 섹션 리듬 같은 **구조적 관례만** 참고한다. 다음 상표 요소는 사용하지 않는다.

| Airbnb 요소 | Free Traveler 처리 |
|---|---|
| Rausch(#ff385c) 브랜드 컬러 | 사용하지 않음. 코랄 포인트(#FF6B4A)로 대체 |
| Airbnb Cereal VF 폰트 | 사용하지 않음. Inter + 시스템 한글 폰트로 대체 |
| Airbnb 워드마크·32px 손그림 아이콘·"NEW" 배지 | 사용하지 않음. 텍스트 로고와 아이콘 폰트만 사용 |
| "Guest favorite" 배지, 별점 중심 카드 | 사용하지 않음. Free Traveler는 여행지·안전정보·동행 카드로 대체 |
| Homes/Experiences/Services 3-Product Nav | 사용하지 않음. 5개 화면에 맞춘 전용 내비게이션 사용 |

참고한 구조적 개념: 8px 배수 spacing 체계, 카드 1단계 elevation, pill/rounded 폼 컴포넌트의 부드러운 형태 언어, 64px 내외 Section 여백, 반응형에서 "컬럼 수만 줄이고 순서는 유지"하는 그리드 전략.

---

## 2. 디자인 토큰

### 2.1 색상

| 토큰 | 값 | 용도 |
|---|---|---|
| `color-canvas` | `#FFFFFF` | 페이지 기본 배경(흰 배경) |
| `color-surface-soft` | `#FAF8F6` | Hero, Chip 영역, 비활성 배경 |
| `color-surface-strong` | `#F1EFEC` | 카드 대비 배경, 필터 바 |
| `color-hairline` | `#E4E2DF` | 1px 구분선 |
| `color-border-strong` | `#C7C4C0` | 입력 포커스 외 강조 테두리 |
| `color-ink` | `#24242A` | 짙은 회색 본문·헤드라인(순수 검정 미사용) |
| `color-body` | `#45454C` | 본문 단락 |
| `color-muted` | `#6B6B72` | 메타 텍스트, 보조 라벨 |
| `color-primary` (코랄) | `#FF6B4A` | 주요 CTA, 활성 탭, 저장/좋아요 |
| `color-primary-active` | `#E5502F` | 코랄 버튼 눌림 상태 |
| `color-primary-disabled` | `#FFD5C7` | 비활성 코랄 버튼 |
| `color-on-primary` | `#FFFFFF` | 코랄 배경 위 텍스트 |
| `color-safety-caution` | `#B8720A` (amber) | 안전정보 stale 경고, 주의 배지 — 코랄과 명확히 구분 |
| `color-safety-critical` | `#C13515` (brick red) | 여행금지·중대 경보, 폼 오류 텍스트 — 코랄과 명확히 구분 |
| `color-success` | `#1D7A4C` | 완료·승인 상태 |
| `color-focus-ring` | `color-ink` 기반 2px 링 | 키보드 포커스 표시(코랄과 분리해 항상 인지 가능하게 유지) |
| `color-scrim` | `#000000` 50% | Drawer/Modal 배경 스크림 |

안전정보·오류·경고는 항상 코랄과 다른 색상(호박색 `safety-caution`, 벽돌색 `safety-critical`)을 사용해 "주의사항"과 "구매 유도 CTA"가 시각적으로 섞이지 않게 한다.

### 2.2 타이포그래피

- **폰트 스택:** `'Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`
- Inter는 라틴 문자·숫자·UI 라벨에 사용하고, 한글은 시스템 폰트 fallback이 자동 적용된다. 별도 한글 전용 웹폰트는 로드하지 않는다(성능 예산 REQ-NF-001~003 고려).

| 토큰 | 크기(Desktop / Mobile) | Weight | 용도 |
|---|---|---|---|
| `type-display-xl` | 32px / 26px | 700 | SCR-001·SCR-002 Hero 타이틀 |
| `type-display-lg` | 24px / 20px | 600 | Section 제목 |
| `type-display-md` | 20px / 18px | 600 | Sub-section·Drawer 제목 |
| `type-title-md` | 17px | 600 | 카드 제목 |
| `type-title-sm` | 15px | 600 | 라벨, 필터 그룹명 |
| `type-body-md` | 16px | 400 | 본문 단락 |
| `type-body-sm` | 14px | 400 | 메타 텍스트, 카드 설명 |
| `type-caption` | 13px | 500 | 배지, 태그, stale 경고 라벨 |
| `type-button` | 16px | 600 | 버튼 라벨 |

### 2.3 Spacing / Radius / Elevation

| 토큰 | 값 |
|---|---|
| `space-xxs`~`space-xxl` | 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48px |
| `space-section-desktop` | 64~96px (Section 상하 여백, Desktop) |
| `space-section-mobile` | 40~64px (Section 상하 여백, Mobile) |
| `radius-sm` / `radius-md` / `radius-lg` / `radius-full` | 8px / 12px / 16px / 9999px |
| `elevation-card` | `0 1px 2px rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.08)` — 카드 hover, Drawer, Toast에만 사용하는 단일 elevation 단계 |
| `elevation-none` | Hero, Footer, 텍스트 섹션 대부분(95%의 화면) |

### 2.4 Breakpoint

| 이름 | 기준 폭 | 콘텐츠 최대 폭 | Card 그리드 |
|---|---|---|---|
| **Desktop** | 1440px | 1200~1280px 중앙 정렬 | 3~4열(섹션별 표에 명시) |
| **Mobile** | 390px | 화면 폭 − 좌우 16px 거터 | 1열 |

두 기준 사이(Tablet)는 컬럼 수만 단계적으로 줄이고 카드 순서는 유지한다(행 재배치 없음).

### 2.5 접근성 공통 규칙

- 모든 인터랙티브 요소(버튼, 카드 전체 클릭 영역, 탭, Chip, 입력 필드)는 최소 44×44px 터치 영역을 확보한다.
- 키보드 포커스 시 `color-focus-ring` 기반 2px 링을 표시하며, 코랄 CTA 위에서도 대비가 확인되도록 링과 배경 사이 2px 여백(offset)을 둔다.
- 상태 정보(모집중/마감, 경보 단계, stale)는 색상만이 아니라 텍스트 라벨을 항상 함께 표기한다.

---

## 3. 공통 컴포넌트

### 3.1 Header (5개 화면 공통)

| 항목 | Desktop(1440) | Mobile(390) |
|---|---|---|
| 구성 | 좌: Free Traveler 텍스트 로고(코랄 포인트 점 + 워드마크) · 중앙: `여행지 검색`(→ SCR-001 검색) · `여행 준비`(→ `/travel-tools`) · `동행 찾기`(→ `/mates`) · `대표 소개`(→ `/about`) 내비게이션 링크 · 우: 계정 아이콘(→ `/account`) | 좌: 로고 · 우: 검색 아이콘 + 햄버거 메뉴(탭하면 내비게이션 4개 링크 + 계정 링크가 있는 전체 화면 시트 오픈) |
| 높이 | 72px, 흰 배경, 하단 1px hairline | 56px |
| 상태 | 로그인 전: 계정 아이콘 클릭 시 `/account` 로그인 탭으로 이동 / 로그인 후: 아이콘에 프로필 이니셜 표시 | 동일 |

### 3.2 Footer (5개 화면 공통)

| 컬럼 | 링크 |
|---|---|
| 서비스 | 여행지 둘러보기(SCR-001), 항공·숙소 준비(SCR-003), 동행 찾기(SCR-004), 국가별 안전정보(SCR-001 안전 Drawer 진입) |
| 회사 | 대표 소개(SCR-002), 문의하기 |
| 이용 정책 | 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내 |
| 하단 고지 | "Free Traveler는 항공·숙소 예약을 대행하지 않으며 외부 사이트로 연결만 제공합니다." "안전정보는 외교부 해외안전여행 공식 발표를 기준으로 하며 출국 전 원문을 직접 확인하시기 바랍니다." © Free Traveler |

Desktop 3컬럼 + 고지 밴드, Mobile 1컬럼 아코디언(컬럼 제목 탭 시 펼침) + 고지 밴드.

### 3.3 카드 패턴

| 컴포넌트 | 구성 | 사용처 |
|---|---|---|
| `card-destination` | 사진(실제 장소 alt 필수) + 국내/해외 배지 + 제목 + 지역 + 1줄 요약 + 테마 Chip 1~2개 | SCR-001 여행지 그리드 |
| `card-safety` | 국가명 + 경보 단계 텍스트 + 최종 확인일 + `stale`/`최신` 배지(`color-safety-caution`) | SCR-001 안전정보 그리드 |
| `card-mate` | 제목 + 국가·지역·기간 + 모집 인원/현재 인원 + 모집중/마감 배지 | SCR-001 최근 동행글, SCR-004 목록 |
| `card-action` | 굵은 제목 1줄 + 설명 1~2줄 + 버튼(주요 코랄 1개) | SCR-003 요약 Action Card, CTA Banner |
| `card-stat` | 큰 숫자(예: `50+`) + 라벨(`Trips`) | SCR-001·SCR-002 지표 |

카드 클릭 영역 전체가 44px 이상이며, 이미지에는 항상 실제 장소·상황을 설명하는 alt(예: "제주 성산일출봉과 유채꽃밭 전경")를 붙인다.

### 3.4 Drawer / Modal

- SCR-001의 여행지 상세, 안전정보는 Desktop에서 우측에서 슬라이드인하는 Drawer(폭 480~560px), Mobile에서 하단에서 올라오는 Full-height Sheet로 렌더링한다.
- SCR-004의 동행글 상세는 Desktop에서 좌우 분할 패널, Mobile에서 목록 위에 Full-height Drawer로 렌더링한다(요구사항 4번 규칙).
- Drawer는 `color-scrim` 배경, `elevation-card`, ESC/배경 클릭/닫기 버튼으로 닫히며 닫기 버튼은 44px 이상이다.

### 3.5 버튼·입력·배지·Toast

| 컴포넌트 | 스타일 |
|---|---|
| `button-primary` | 코랄 배경, 흰 텍스트, `radius-sm`, 높이 48px |
| `button-secondary` | 흰 배경, 잉크 텍스트, 1px 잉크 테두리, `radius-sm`, 높이 48px |
| `button-tertiary` | 텍스트만, 밑줄은 hover/focus 시 |
| `chip` | `radius-full`, 기본 `surface-strong` 배경, 선택 시 코랄 배경 + 흰 텍스트 |
| `tab` | 밑줄 2px 코랄로 활성 표시, 비활성은 `color-muted` 텍스트 |
| `input` | 흰 배경, 1px hairline, `radius-sm`, 높이 48px, 포커스 시 2px `color-focus-ring` |
| `badge-safety-caution` | `color-safety-caution` 텍스트 + 연한 amber 배경, "재확인 필요" 라벨 포함 |
| `badge-safety-critical` | `color-safety-critical` 텍스트 + 연한 red 배경, "여행경보" 라벨 포함 |
| `toast` | 화면 하단(Mobile)/우측 하단(Desktop) 고정, `elevation-card`, 3~5초 자동 소멸, 참가 요청/신고 접수/외부 이동 실패 등에 사용 |

---

## 4. 콘텐츠 밀도·섹션 배치 규칙 요약

- 모든 화면은 Header–Footer 사이에 목적이 분명한 Section을 순서대로 배치하며, 각 Section은 제목 + 1~3문장 설명 + 실제 콘텐츠 또는 명확한 CTA로 구성한다.
- SCR-001·SCR-002는 7개, SCR-003·SCR-004는 6개 Section을 기본으로 한다.
- Desktop 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px. Mobile Section 상하 여백 40~64px, Card는 1열.
- Hero는 1440px 화면 전체 높이를 차지하지 않으며, 다음 Section의 시작 일부가 뷰포트 하단에 보이도록 높이를 제한한다(Desktop Hero 높이 약 480~560px).
- Hero, Card Grid, 좌우 분할, Chip 목록, 3단계 안내, CTA Banner를 교차 사용해 같은 레이아웃이 연속되지 않게 한다.
- Lorem ipsum, `준비 중`, `정보 확인 필요` 같은 자리표시자 문구를 쓰지 않는다. 데이터가 없는 상태도 안내 문장 + 이용 방법 + 다음 행동 CTA를 함께 보여준다.

---

## 5. SCR-001 `/` 메인 (7 Section)

| # | Section | 레이아웃 패턴 | 목적·설명(1~3문장) | 콘텐츠 구성 | 주요 CTA / 이동 | 상태 | 관련 요구사항 |
|---|---|---|---|---|---|---|---|
| 1 | 여행지 검색 Hero | Hero(비전체높이) | "어디로 떠날지 아직 정하지 못하셨나요? 여행지를 검색하고 항공·숙소 준비를 바로 시작해 보세요." | 통합 검색 입력창(여행지·안전정보 통합 검색) + 배경 사진(실제 도시 전경, alt 예: "노을이 지는 파리 에펠탑과 센강") | `여행 준비 시작하기` 버튼 → `/travel-tools` | Loading(검색 자동완성), Success | REQ-FUNC-003, 067, 015(간접) |
| 2 | 국내 인기 여행지 | Card Grid 3열(Mobile 1열) | "서울부터 제주까지, 지금 많은 여행자가 찾는 국내 여행지를 소개합니다." | `card-destination` × 6(국내), 하단 `국내 여행지 전체 보기` 링크 | 카드 클릭 → 같은 화면 상세 Drawer, 전체 보기 → 필터·목록 모드 확장 | Loading(스켈레톤), Success, Empty(필터 적용 후 결과 없음: 조건 완화 안내 + 초기화 버튼) | REQ-FUNC-001, 002, 004, 005, 007 |
| 3 | 해외 인기 여행지 | Card Grid 3열(Mobile 1열) | "가까운 아시아부터 유럽까지, 15개국 30개 도시의 해외 여행지를 만나보세요." | `card-destination` × 6(해외) + 국가별 안전정보 상태 미니 배지 | 카드 클릭 → 상세 Drawer(안전정보 Drawer로 이어짐) | 상동 | REQ-FUNC-001, 002, 004, 006 |
| 4 | 여행 동기·테마 | Chip 목록 | "자연, 도심, 미식, 휴양 등 원하는 테마를 골라 여행지를 좁혀보세요." | 테마 Chip 6개(자연, 도심, 미식, 휴양, 액티비티, 가족여행) | Chip 선택 → 2·3번 Section 결과를 같은 화면에서 필터링 | UI_STATE(선택/해제) | REQ-FUNC-002, 010 |
| 5 | 국가별 주의사항 | Card Grid 3열(Mobile 1열) | "출국 전 꼭 확인해야 할 국가별 치안·법규·보건 정보를 최종 확인일과 함께 제공합니다." | `card-safety` × 6(경보 단계, 최종 확인일, stale/정상 배지) | 카드 클릭 → 안전정보 Drawer(REQ-FUNC-047~054) | Success, Error(안전정보 stale: 경고 배지 + "공식 원문 재확인" 링크 우선 노출) | REQ-FUNC-046~054 |
| 6 | 최근 동행글 | Card Grid 3열 또는 Empty State | "함께 떠날 동행을 찾고 있다면 최근 등록된 모집글을 확인해 보세요." | 데이터 있음: `card-mate` × 3(모집중만) / 데이터 없음: 설명 문장 + "모집글은 이렇게 작성해요" 3단계 미니 안내 + `동행글 작성하기` CTA | `card-mate` 클릭 → `/mates` 상세로 이동, Empty CTA → `/account`(비로그인) 또는 `/travel-tools` 동행 탭(로그인·성인 확인 완료) | Success, Empty(안내+CTA 포함, 빈 화면처럼 보이지 않게 구성) | REQ-FUNC-030, 034 |
| 7 | free_traveler 요약 | 좌우 분할 | "50회 이상, 30개국 이상을 여행한 free_traveler가 신뢰할 수 있는 기준으로 여행지를 소개합니다." | 좌: 대표 사진(alt: "배낭을 멘 free_traveler가 산티아고 순례길에서 걷는 모습") / 우: 한 줄 소개 + `50+ Trips`·`30+ Countries` `card-stat` 2개 | `대표 소개 더 보기` 버튼 → `/about` | Success | REQ-FUNC-057, 058, 063 |

---

## 6. SCR-002 `/about` 대표 소개 (7 Section)

| # | Section | 레이아웃 패턴 | 목적·설명 | 콘텐츠 구성 | 주요 CTA / 이동 | 상태 | 관련 요구사항 |
|---|---|---|---|---|---|---|---|
| 1 | free_traveler Hero | Hero(비전체높이) | "50회 이상의 자유여행, 30개국 이상의 경험으로 여행자의 눈높이에서 정보를 전합니다." | 대표 사진(alt: "베트남 호이안 등불 거리에서 촬영한 free_traveler") + 한 줄 소개 문장 | 없음(스크롤 유도) | Success | REQ-FUNC-057, 058 |
| 2 | 여행 지표 | Card Row(Card Grid 변형, 2열) | "숫자로 보는 free_traveler의 여행 이력입니다." | `card-stat` `50+ Trips`, `card-stat` `30+ Countries` | 없음 | Success | REQ-FUNC-057 |
| 3 | 소개·철학 | 좌우 분할(좌: 소제목 네비, 우: 본문) | "자기소개, 여행을 시작한 이유, 여행 철학을 직접 전합니다." | 좌: "자기소개" "시작한 이유" "여행 철학" 앵커 링크 / 우: 2~4개 문단 본문("좋은 여행은 많이 보는 여행이 아니라, 내가 감당할 수 있는 속도로 현지를 이해하는 여행이다." 포함) | 없음 | Success | REQ-FUNC-058 |
| 4 | 여행 Timeline | Timeline(세로형) | "지난 여행의 주요 순간을 시간순으로 기록했습니다." | 연도·장소·한 줄 요약을 가진 Timeline 항목 6개 이상 | 항목 클릭 → 해당 국가가 SCR-001에 있으면 상세 Drawer로 이동 | Success | REQ-FUNC-060 |
| 5 | 방문 국가 | Chip 목록(권역별 그룹) | "아시아, 유럽, 북미, 오세아니아 30개국을 방문했습니다." | 권역별 헤딩 4개 + 국가 Chip 30개 이상 | Chip 클릭 → 해당 국가 여행지가 있으면 SCR-001 필터로 이동 | Success | REQ-FUNC-059 |
| 6 | 여행 사진 Gallery | Card Grid 4열(Mobile 1열) | "서로 다른 장소에서 담은 여행의 순간들입니다." | 사진 8장 이상, 각 사진에 장소를 설명하는 alt(예: "아이슬란드 요쿨살론 빙하 호수") | 사진 클릭 → 확대 보기(Lightbox) | Success | REQ-FUNC-061 |
| 7 | 기억에 남는 여행지 | Card Grid 4열(Mobile 1열) + CTA Banner | "free_traveler가 직접 추천하는 여행지 4곳입니다." | `card-destination` × 4 | 카드 클릭 → SCR-001 상세 Drawer / 하단 `항공·숙소 준비하기`(→ `/travel-tools`), `동행 찾기`(→ `/mates`) CTA 2개 | Success | REQ-FUNC-063 |

---

## 7. SCR-003 `/travel-tools` 통합 여행 준비 (6 Section, 3 Tab)

탭 전환 시 각 탭은 독립된 입력·검증·완료 상태를 유지한다(항공 탭에서 입력한 값은 숙소·동행 탭으로 전환해도 유지되며, 탭 간 검증 오류나 요약 상태는 서로 영향을 주지 않는다). 항공/숙소 탭은 3~5번 Section을, 동행 탭은 6번 Section을 사용한다.

| # | Section | 레이아웃 패턴 | 목적·설명 | 콘텐츠 구성 | 주요 CTA / 이동 | 상태 | 관련 요구사항 |
|---|---|---|---|---|---|---|---|
| 1 | Intro | 3단계 안내 | "국가와 날짜를 먼저 정리하면 외부 사이트에서 검색할 때 헷갈리지 않아요. 탭을 선택해 항공·숙소·동행을 준비해 보세요." | 3단계 아이콘: ①탭 선택 ②조건 입력 ③요약 확인 후 이동/제출 | 없음(아래 탭으로 스크롤 유도) | Success | 스토리 2·3·4 전체 소개 |
| 2 | 탭 전환 | Tab | "항공편, 숙소, 동행 구하기 중 준비할 항목을 선택하세요." | 탭 3개: `항공편` `숙소` `동행 구하기` | 탭 선택 → 3~6번 Section 콘텐츠 전환 | UI_STATE(활성 탭) | REQ-FUNC-011, 019, 031 |
| 3 | 조건 입력 Form | Form | (항공) "여행할 국가와 출발일·귀국일을 입력해 주세요." / (숙소) "숙박할 국가와 체크인·체크아웃 날짜를 입력해 주세요." | 국가·지역 선택 + 날짜 2개, 필드별 오류 메시지(`color-safety-critical` 텍스트) | `계속` 버튼 → 4번 Section 요약 표시 | Error(과거/역전 날짜), Success(검증 통과) | REQ-FUNC-011~013, 019~021 |
| 4 | 입력 요약 + 외부 이동 | Card(`card-action`) | "입력하신 조건을 확인하고 외부 사이트에서 항공편·숙소를 찾아보세요." | 국가·지역·날짜 요약 텍스트 + `항공편 보러 가기`/`호텔 보러 가기` `card-action` | 새 탭으로 외부 사이트 이동(`noopener,noreferrer`) | Loading(이동 처리), Success, Error(외부 URL 오류: "현재 외부 사이트에 연결할 수 없습니다" + 다시 시도) | REQ-FUNC-014~018, 022~026 |
| 5 | 비전달 고지 + Tip | 3단계 안내 | "입력하신 조건은 외부 사이트로 전달되지 않습니다. 검색 전 이 팁을 확인해 보세요." | 고지 문구 1개 + 이용 Tip 3개(예: "날짜는 여유 있게 입력하세요", "지역명은 영문 표기를 함께 확인하세요", "가격은 방문 시점마다 달라질 수 있어요") | 없음 | Success | REQ-FUNC-015, 023 |
| 6 | 동행 구하기 | Form 또는 Unauthorized 안내 | "여행 스타일이 맞는 동행을 찾고 있다면 모집글을 작성해 보세요." | 비로그인·미성년: 안내 카드("로그인과 성인 확인이 필요합니다") + `로그인/가입` CTA / 로그인·성인 확인 완료: 제목·국가·지역·기간·인원·조건·설명·안전수칙 동의 Form + 공개 연락처 탐지 경고 | Form 제출 성공 → `/mates` 해당 글 상세로 이동 | Unauthorized(비로그인·미성년), Error(연락처 탐지, 필수값 누락), Success(작성 완료) | REQ-FUNC-027~032, 080 |

---

## 8. SCR-004 `/mates` 동행 조회 (6 Section)

| # | Section | 레이아웃 패턴 | 목적·설명 | 콘텐츠 구성 | 주요 CTA / 이동 | 상태 | 관련 요구사항 |
|---|---|---|---|---|---|---|---|
| 1 | Intro | CTA Banner | "여행 스타일이 맞는 동행을 찾아보세요. 직접 모집글을 올릴 수도 있어요." | 한 줄 설명 + `동행글 작성하기` 버튼 | → `/travel-tools` 동행 탭 | Success | REQ-FUNC-030, 031 |
| 2 | 검색 Filter | Chip 목록 + Filter Bar | "국가, 지역, 기간, 모집 상태로 원하는 동행글을 좁혀보세요." | 국가·지역·기간·연령대·성별·여행 스타일·모집상태 필터 + "총 N건" 결과 요약 | 필터 적용 → 3번 Section 갱신 | Loading, UI_STATE(적용된 필터 태그) | REQ-FUNC-030 |
| 3 | 동행글 목록 | Card Grid(Desktop 3열 / Mobile 1열) | "조건에 맞는 동행글을 최신순으로 보여드려요." | `card-mate` 최대 8개 우선 노출 + "더 보기" | 카드 클릭 → 4번 상세로 연결 | Loading(스켈레톤), Success, Empty(검색 조건 초기화 버튼 + "이런 조건으로 찾아보세요" 안내 + 작성 CTA) | REQ-FUNC-030, 033 |
| 4 | 목록+상세 | Desktop: 좌우 분할 / Mobile: Drawer | "선택한 동행글의 조건과 설명을 확인하고 참가를 요청하세요." | 작성자 조건·설명·안전수칙 동의 표시, 참가 요청 폼(500자 이내 메시지), 작성자 화면에서는 요청 목록 승인/거절 버튼 | 참가 요청 제출, 승인/거절, 신고·차단 버튼 | Unauthorized(비로그인·미성년 참가 요청 시도), Error(중복 요청, 권한 없음), Success(요청 접수 Toast) | REQ-FUNC-033~040 |
| 5 | 참가 신청 방법 | 3단계 안내 | "참가 요청은 이렇게 진행돼요." | ①모집글 확인 ②참가 메시지 작성·제출 ③작성자 승인 후 연결(연락처 비공개 유지) | 없음 | Success | REQ-FUNC-034~036 |
| 6 | 안전 안내 | CTA Banner | "공개 연락처 교환 없이 안전하게 첫 연결을 만드세요. 불편한 상황은 신고·차단으로 대응할 수 있어요." | 안전수칙 요약 3줄 + 신고·차단 안내 | `항공·숙소 준비하기` CTA → `/travel-tools` | Success | REQ-FUNC-039, 040, 080 |

---

## 9. SCR-005 `/account` 계정·관리 (역할별 탭)

역할에 따라 노출되는 탭이 달라지며, 역할에 없는 탭은 렌더링하지 않는다.

| 탭 | Guest | Adult Member | Admin |
|---|---|---|---|
| 로그인 | ✅(기본 진입 탭) | ❌(로그인 상태이므로 미노출) | ❌ |
| 프로필 | ❌ | ✅ | ✅ |
| 내 활동 | ❌ | ✅ | ✅ |
| 관리자 | ❌ | ❌ | ✅ |

### 9.1 로그인 탭(Guest)

| Block | 내용 | 상태 |
|---|---|---|
| 계정 기능 Intro | "로그인하면 동행 모집글 작성, 참가 요청, 여행지 즐겨찾기를 이용할 수 있어요." | Success |
| 로그인·가입·비밀번호 재설정 Card | 이메일 로그인 폼, 회원가입 링크, 비밀번호 재설정 링크(각 `card-action` 형태) | Loading(제출 중), Error(잘못된 이메일/비밀번호 — `color-safety-critical` 텍스트) |
| 로그인 후 가능한 기능 | 체크리스트형 3~4항목("동행 모집글 작성", "참가 요청·승인", "여행지 즐겨찾기", "신고·차단") | Success |
| 보안 안내 | "비밀번호는 안전하게 암호화되어 저장되며, 성인 확인은 정확한 생년월일 대신 확인 여부만 기록됩니다." | Success |

관련 요구사항: REQ-FUNC-027, 028, 066, REQ-NF-012~016

### 9.2 프로필 탭(Adult Member/Admin)

| Block | 내용 | 상태 |
|---|---|---|
| 프로필·성인 확인 요약 | 닉네임, 연령대, 성별(선택), 여행 스타일, 성인 확인 완료 배지 + 수정 버튼 | Success, Unauthorized(성인 확인 미완료 시 확인 유도 카드) |

관련 요구사항: REQ-FUNC-028, 029

### 9.3 내 활동 탭(Adult Member/Admin)

| Block | 내용 | 상태 |
|---|---|---|
| 내 글 | 내가 쓴 동행글 목록(모집중/마감) + 마감·수정·삭제 버튼 | Empty("아직 작성한 동행글이 없어요" + `동행글 작성하기` CTA → `/travel-tools`) |
| 참가 요청 | 내가 보낸 요청 현황(PENDING/ACCEPTED/REJECTED) | Empty("아직 요청한 동행글이 없어요" + `동행 찾기` CTA → `/mates`) |
| 차단 목록 | 차단한 사용자 목록 + 해제 버튼 | Empty("차단한 사용자가 없어요") |
| 새 동행글 작성 CTA | 상단 고정 버튼 | → `/travel-tools` 동행 탭 |

관련 요구사항: REQ-FUNC-035~040, 068

### 9.4 관리자 탭(Admin만)

| Block | 내용 | 상태 |
|---|---|---|
| 관리 Intro | "신고 상태를 확인하고 항공·숙소 외부 연결 URL을 관리할 수 있어요." | Success |
| 신고 상태 변경 | 신고 목록(OPEN/RESOLVED/DISMISSED) + 상태 변경 액션 | Empty("접수된 신고가 없어요") |
| 외부 URL 설정 | 항공·숙소 외부 URL 입력 필드 + 허용목록(HTTPS만) 검증 | Error(HTTP/`javascript:` 등 비허용 URL 저장 시도) |

관련 요구사항: REQ-FUNC-041, 077 (REQ-FUNC-042·055·056·072·073·075·076은 `docs/PROJECT_SCOPE.md` 기준 EXCLUDED로 이 탭에 포함하지 않음)

> Dashboard, 통계 차트, 방문자 그래프 등 복잡한 통계 화면은 만들지 않는다. 관리자 탭은 목록 + 상태 변경 액션으로만 구성한다.

---

## 10. 상태(State) 정의 총괄

각 화면에 필요한 상태만 정의하며, 정의하지 않은 상태(예: SCR-002의 Unauthorized)는 만들지 않는다.

| Screen | Loading | Success | Empty | Error | Unauthorized |
|---|---|---|---|---|---|
| SCR-001 | 카드 목록 스켈레톤 | 목록·필터·Drawer 정상 표시 | 필터 결과 없음(조건 완화 안내+초기화), 최근 동행글 없음(안내+CTA) | 이미지 로드 실패 시 대체 썸네일 | 해당 없음(전체 공개) |
| SCR-002 | 이미지 lazy load | 정적 콘텐츠 표시 | 해당 없음(정적 데이터로 항상 콘텐츠 보장) | 해당 없음 | 해당 없음(전체 공개) |
| SCR-003 | 외부 이동 처리 중(버튼 disabled) | 요약 완료·외부 이동 성공 | 해당 없음(폼 화면이므로 목록형 Empty 없음) | 날짜 검증 오류, 연락처 탐지 차단, 외부 URL 연결 실패 | 동행 탭 비로그인·미성년 접근 시 로그인 유도 카드 |
| SCR-004 | 목록·상세 로딩 | 목록·상세·요청 처리 정상 | 검색 결과 없음(조건 초기화+작성 CTA+이용 방법) | 참가 요청 실패, 신고 접수 실패 | 비로그인·미성년의 참가 요청·글쓰기·신고 시도 |
| SCR-005 | 목록·로그인 처리 중 | 로그인/프로필/내 활동/관리자 정상 표시 | 내 글·참가 요청·차단·신고 목록 없음(안내+다음 행동 CTA) | 로그인 실패, 비밀번호 재설정 오류, 외부 URL 저장 오류 | 권한 없는 탭 접근 시 해당 탭 미노출(관리자 탭은 Admin 외 렌더링하지 않음) |

---

## 11. 요구사항 반영 확인

본 문서는 `docs/03_UI_COVERAGE_ANALYSIS.md`에서 5개 Screen에 배치된 REQ-FUNC/REQ-NF 항목을 각 Section·Block에 그대로 대응시켰으며, EXCLUDED 항목(REQ-FUNC-042·045·055·056·062·071·072·073·075·076, REQ-NF-007~011·018·020~022·029·032·033)은 화면 요소로 되살리지 않았다. Requirement는 삭제하지 않았고, `docs/PROJECT_SCOPE.md`의 IMPLEMENT/EXCLUDED 분류를 그대로 유지했다.
