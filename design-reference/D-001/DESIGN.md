---
version: D-001
name: Free-Traveler-design-system
description: A calm, trust-first travel-preparation product on a pure white canvas with a single coral accent (#FF6B4A). Structurally inspired by Airbnb's card density and one-shadow-tier restraint, but with its own identity — a small coral-dot wordmark, no Airbnb iconography, and no booking/payment surfaces. Type runs Inter with a Korean system fallback stack rather than a licensed variable font. Content is organized as a fixed sequence of purposeful Sections (Hero, Card Grid, Split, Chip list, 3-step guide, CTA banner) rather than an open canvas, and every list-type surface must resolve to a complete state — populated, or a designed Empty State — never a placeholder.
status: LOCKED

colors:
  canvas: "#FFFFFF"
  surface-soft: "#FAFAFA"
  surface-container: "#EEEEF0"
  surface-container-high: "#E8E8EA"
  hairline: "#EEEEF0"
  hairline-strong: "#E5E5EA"
  ink: "#24242A"
  body: "#45454C"
  muted: "#6B6B72"
  primary: "#FF6B4A"
  primary-hover: "#E85837"
  primary-disabled: "#FFD5C7"
  on-primary: "#FFFFFF"
  caution-text: "#B8720A"
  caution-surface: "#FEF7EC"
  caution-border: "#FCE4C0"
  critical-text: "#C13515"
  critical-surface: "#FDF2F0"
  critical-border: "#F8CCC6"
  success-text: "#137A54"
  success-surface: "#F0F9F5"
  focus-ring: "#24242A"
  scrim: "#000000"

typography:
  display:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 40px
    fontSizeMobile: 30px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 32px
    fontSizeMobile: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.015em
  headline-md:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.36
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.44
    letterSpacing: -0.005em
  body-lg:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
  body-md:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.57
  body-sm:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
  label-md:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  label-sm:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
  button:
    fontFamily: "Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.25

rounded:
  sm: 4px
  DEFAULT: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 40px
  section-desktop-min: 64px
  section-desktop-max: 96px
  section-mobile-min: 40px
  section-mobile-max: 64px
  content-max-desktop-min: 1200px
  content-max-desktop-max: 1280px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.DEFAULT}"
    height: 48px
    hover: "{colors.primary-hover}"
    disabled: "{colors.primary-disabled}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    rounded: "{rounded.DEFAULT}"
    height: 48px
  button-tertiary:
    backgroundColor: transparent
    textColor: "{colors.body}"
    hoverTextColor: "{colors.ink}"
  chip:
    rounded: "{rounded.full}"
    backgroundColor: "{colors.surface-container}"
    activeBackgroundColor: "{colors.canvas}"
    activeBorder: "1.5px solid {colors.ink}"
  search-bar:
    rounded: "{rounded.full}"
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline-strong}"
    height: 56px
  text-input:
    rounded: "{rounded.DEFAULT}"
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline-strong}"
    height: 48px
    focusBorder: "1.5px solid {colors.ink}"
  card:
    rounded: "{rounded.md}"
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    hoverShadow: "{shadow.card}"
  badge-caution:
    backgroundColor: "{colors.caution-surface}"
    textColor: "{colors.caution-text}"
    border: "1px solid {colors.caution-border}"
    rounded: "{rounded.sm}"
  badge-critical:
    backgroundColor: "{colors.critical-surface}"
    textColor: "{colors.critical-text}"
    border: "1px solid {colors.critical-border}"
    rounded: "{rounded.sm}"
  badge-success:
    backgroundColor: "{colors.success-surface}"
    textColor: "{colors.success-text}"
    rounded: "{rounded.sm}"
---

## 1. Visual Theme

Free Traveler는 "예약 대행 없이 조건을 정리해주는 여행 준비 허브"라는 제품 성격을 그대로 화면에 드러낸다. 캔버스는 항상 순백(`#FFFFFF`)이고, 색은 코랄 한 가지만 브랜드 액션에 쓴다는 점에서 Airbnb DESIGN.md의 "단일 액센트 컬러" 원칙을 구조적으로 참고했다. 다만 다음은 참고하지 않는다: Airbnb 워드마크·손그림 아이콘·"NEW" 배지·"Guest favorite" 배지·별점 중심 카드·Rausch(#ff385c) 컬러·Cereal 폰트. Free Traveler는 코랄 점 하나 + 텍스트 워드마크로 된 독립 브랜드이며, 정보 신뢰도는 별점이나 리뷰가 아니라 **출처·최종 확인일·비공개 참가 요청**으로 전달한다.

성격 3가지:
1. **명확성** — 화면은 항상 "지금 무엇을 할 수 있는가"를 먼저 보여준다. 장식용 빈 공간이나 의미 없는 배경 블록을 두지 않는다.
2. **신중함** — 코랄은 주요 CTA·활성 탭·저장 아이콘에만 쓰고, 경고·안전정보에는 코랄과 분리된 색(호박색/브릭레드)을 쓴다.
3. **완결성** — 데이터가 없는 목록도 "완성된 화면"으로 보이게 설계한다(§13).

## 2. Color Token

| 토큰 | 값 | 용도 |
|---|---|---|
| `canvas` | `#FFFFFF` | 페이지 기본 배경 |
| `surface-soft` | `#FAFAFA` | Hero/알림 배경 |
| `surface-container` | `#EEEEF0` | Chip 기본 배경, 옅은 구획 |
| `surface-container-high` | `#E8E8EA` | 강조 구획 |
| `hairline` | `#EEEEF0` | 카드 기본 테두리 |
| `hairline-strong` | `#E5E5EA` | 입력창·버튼 테두리, hover 테두리 |
| `ink` | `#24242A` | 본문·헤드라인 기본 텍스트(순수 검정 금지) |
| `body` | `#45454C` | 보조 본문 |
| `muted` | `#6B6B72` | 메타 텍스트, 타임스탬프 |
| `primary` (코랄) | `#FF6B4A` | 주요 CTA, 활성 탭 밑줄, 즐겨찾기 |
| `primary-hover` | `#E85837` | 코랄 버튼 hover/active |
| `primary-disabled` | `#FFD5C7` | 코랄 버튼 비활성 |
| `on-primary` | `#FFFFFF` | 코랄 배경 위 텍스트 |
| `caution-text` / `caution-surface` / `caution-border` | `#B8720A` / `#FEF7EC` / `#FCE4C0` | 안전정보 stale, "재확인 필요" |
| `critical-text` / `critical-surface` / `critical-border` | `#C13515` / `#FDF2F0` / `#F8CCC6` | 폼 오류, 중대 경보 |
| `success-text` / `success-surface` | `#137A54` / `#F0F9F5` | 완료·승인·인증 완료 상태(수치·별점이 아닌 텍스트 배지로만 사용) |
| `focus-ring` | `#24242A` | 키보드 포커스 링(코랄과 분리) |
| `scrim` | `#000000` 50% | Drawer/Modal 배경 |

**규칙:** 위 목록에 없는 색을 임의로 추가하지 않는다. 새 의미가 필요하면 반드시 이 표에 토큰을 추가한 뒤 사용한다.

## 3. Typography

- **폰트:** `Inter, Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`. Inter는 시스템 폰트이거나 오픈소스 웹폰트로 로드하며, 라이선스가 필요한 Proprietary 폰트 파일(Airbnb Cereal VF 등)은 절대 사용하지 않는다.
- **스케일:** `display`(40/30px, 600) → `headline-lg`(32/24px) → `headline-md`(22px) → `headline-sm`(18px) → `body-lg`(16px) → `body-md`(14px) → `body-sm`(13px) → `label-md`(14px, 500) → `label-sm`(12px, 600).
- 헤드라인 최대 굵기는 Semi-Bold(600)로 제한한다. 700 이상의 굵은 비중은 쓰지 않는다(에디토리얼 톤 유지).
- 한글 줄바꿈은 `word-break: keep-all`을 사용해 어절 중간에서 끊기지 않게 한다.

## 4. Spacing

기본 단위는 4px이며 다음 토큰을 사용한다: `xxs`2 · `xs`4 · `sm`8 · `md`12 · `base`16 · `lg`24 · `xl`32 · `xxl`40.
Section 상하 여백과 콘텐츠 최대 폭은 §11에서 별도로 고정한다.

## 5. Radius

`sm` 4px(배지) · `DEFAULT` 8px(버튼·입력창) · `md` 12px(카드) · `lg` 16px(대형 카드·Drawer) · `xl` 24px(특수 강조 블록) · `full` 9999px(검색창·Chip·Pill 버튼). 하드 스퀘어 코너는 본문 그리드 자체를 제외하고 쓰지 않는다.

## 6. Shadow

Elevation은 단일 단계만 쓴다(Airbnb의 "한 단계 그림자" 원칙을 그대로 채택).

- **Flat(기본):** Hero, Footer, 텍스트 섹션 대부분 — 그림자 없음.
- **`shadow.card`(hover/Drawer/Toast 전용):** `0 1px 2px rgba(36,36,42,.04), 0 8px 24px -4px rgba(36,36,42,.06)`.
- **Modal/Drawer 배경:** `scrim` 50% 흑색.

여러 단계의 그림자를 쌓지 않는다.

## 7. Header · Footer

5개 화면(SCR-001~005) 공통.

- **Header(Desktop 72px / Mobile 56px):** 좌측 코랄 점+"Free Traveler" 텍스트 워드마크, 중앙 내비 4개 링크(여행지/여행 준비/동행 찾기/대표 소개), 우측 계정 아이콘. Mobile은 로고+검색 아이콘+햄버거로 축약.
- **Footer(3컬럼 Desktop / 1컬럼 아코디언 Mobile):** 서비스(여행지·여행 준비·동행 찾기·국가별 안전정보) · 회사(대표 소개·문의하기) · 이용 정책(이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책 안내). 하단에 "Free Traveler는 항공·숙소 예약을 대행하지 않으며 외부 사이트로 연결만 제공합니다." 고지와 저작권 라인을 항상 표시한다.

## 8. Search · Filter

- **검색창(`search-bar`):** `rounded.full`, 56px 높이, 흰 배경, `hairline-strong` 테두리. 포커스 시 `focus-ring` 표시, 코랄은 검색 아이콘에만 사용.
- **필터 바(SCR-001/004):** 국가·지역·기간·테마 등 드롭다운/Chip 조합, 결과 개수 텍스트("총 N건")를 항상 함께 표시한다. 필터는 AND 조건으로 적용되며 결과가 없으면 §13의 Empty State 규칙을 따른다.

## 9. Destination Card

- 구조: 사진(실제 장소, alt 필수) → 국내/해외 배지 → 제목 → 지역 → 1줄 요약 → 테마 Chip 1~2개.
- `rounded.md`, 이미지 비율 4:3, hover 시에만 `shadow.card` 적용.
- 해외 카드에는 안전정보 상태 미니 배지(`caution` 또는 텍스트 "최신")를 함께 표시할 수 있다. 별점·리뷰 점수는 절대 표시하지 않는다.

## 10. Form · Tabs

- **Tabs(SCR-003):** 3개 이하 탭(항공편/숙소/동행 구하기), 활성 탭은 코랄 밑줄 2px + `ink` 텍스트, 비활성은 `muted`. 탭마다 입력·검증·완료 상태를 독립적으로 유지한다.
- **Form:** 라벨은 필드 위, `text-input` 스타일(48px, `rounded.DEFAULT`, 포커스 시 `ink` 2px 테두리), 오류는 `critical-text`로 필드 하단에 표시. 날짜 역전·과거 날짜 등은 제출 전 차단한다.
- 폼에는 가격·예약·결제 관련 필드나 버튼을 절대 두지 않는다.

## 11. Mate Post Card

- 구조: 제목 → 국가·지역·기간 → 모집 인원(현재/전체) → 모집중/마감 상태 배지.
- 목록 카드에는 연락처(전화번호/이메일/메신저 ID)를 절대 표시하지 않는다.
- 상세 패널에는 참가 메시지 입력(500자 제한 안내), 승인/거절(작성자 뷰), 신고·차단 링크를 포함하되, **수치형 신뢰도·매너온도·별점 배지는 추가하지 않는다**(§16 Do Not, `docs/STITCH_VALIDATION_REPORT.md`에서 발견된 이탈 사례 참고). 인증 상태는 텍스트형 `badge-success`("성인 인증 완료")로만 표시한다.

## 12. Drawer · Modal

- 여행지 상세·안전정보 상세: Desktop은 우측 슬라이드인 Drawer(480~560px), Mobile은 하단 Full-height Sheet.
- 동행 상세: Desktop은 좌우 분할 패널, Mobile은 목록 위 Full-height Drawer.
- 공통: `scrim` 50% 배경, `shadow.card` 적용, 닫기 버튼 44px 이상, ESC/배경 클릭으로 닫힘.

## 13. Alert · Toast

- **Toast:** Mobile 하단 고정 / Desktop 우측 하단 고정, `shadow.card`, 3~5초 자동 소멸. 참가 요청 접수·신고 접수·외부 이동 실패 등에 사용.
- **Alert 배지:** `badge-caution`(재확인 필요), `badge-critical`(오류·중대 경보), `badge-success`(완료·인증)만 사용한다. 새로운 색상 조합을 임의로 만들지 않는다.

## 14. Loading · Empty · Error 상태

| 상태 | 규칙 |
|---|---|
| **Loading** | 카드형 콘텐츠는 스켈레톤, 버튼 액션은 disabled+진행 표시. 스피너만 있는 빈 화면을 두지 않는다. |
| **Empty** | §17 참고 — 항상 안내 문장 + 이용 방법 + 다음 행동 CTA 3요소를 갖춘 "완성형 화면"으로 만든다. |
| **Error** | `critical-text`/`critical-surface`로 원인과 재시도·복구 행동을 함께 제공한다(예: 외부 URL 연결 실패 시 "다시 시도" 버튼). 오류를 색상만으로 표시하지 않고 텍스트를 병기한다. |

## 15. Desktop · Mobile 규칙

| 기준 | Desktop | Mobile |
|---|---|---|
| 뷰포트 기준 | 1440px | 390px |
| Card 그리드 | 3~4열 | 1열(세로 스택) |
| Section 상하 여백 | 64~96px | 40~64px |
| 콘텐츠 최대 폭 | 1200~1280px 중앙 정렬 | 화면폭 − 좌우 16px |
| 버튼/입력 높이 | 48px | 48px(터치 영역 44px 이상 유지) |

Tablet 구간은 컬럼 수만 단계적으로 줄이고 행 순서는 바꾸지 않는다.

## 16. Page Section 최대 폭과 상하 여백

- Desktop 콘텐츠 최대 폭: **1200~1280px**, 중앙 정렬.
- Desktop Section 상하 여백: **64~96px**.
- Mobile Section 상하 여백: **40~64px**, Card는 항상 1열.
- 이 범위를 벗어나는 여백(더 넓거나 0에 가까운 여백)은 사용하지 않는다.

## 17. Hero 높이와 다음 Section 노출 규칙

- Hero는 1440px 뷰포트 전체 높이를 차지하지 않는다. Desktop Hero 높이는 약 **480~560px**로 제한해, 스크롤 없이도 다음 Section의 제목 일부가 보이도록 한다.
- Hero 아래에 긴 빈 여백을 두지 않는다 — Hero의 배경 사진/CTA 블록이 끝나면 바로 다음 Section의 제목·설명이 시작된다.
- 이 규칙은 SCR-001, SCR-002의 Hero에 동일하게 적용된다.

## 18. Section 계층과 시각적 리듬

모든 Section은 다음 4계층을 순서대로 갖는다: **제목(headline-lg/md) → 설명 1~3문장(body-md, muted 또는 body) → 실제 콘텐츠(Card/Chip/Form/Timeline 등) → CTA(있는 경우, button-primary 또는 button-secondary)**.

같은 레이아웃 패턴을 연속 배치하지 않는다. 다음 6가지 패턴을 화면 안에서 교차 사용한다: **Hero · Card Grid · 좌우 분할(Split) · Chip 목록 · 3단계 안내 · CTA Banner**. 예: SCR-001은 Hero → Grid → Grid → Chip → Grid → Card/Empty → Split 순서로 패턴을 바꾼다.

## 19. 화면별 Section 순서와 최소 콘텐츠 수

| Screen | Section 순서(고정) | 최소 콘텐츠 수 |
|---|---|---|
| **SCR-001** `/` | Hero → 국내 여행지 → 해외 여행지 → 여행 동기·테마 Chip → 국가별 주의사항 → 최근 동행글(또는 Empty) → free_traveler 소개 | 국내 카드 6, 해외 카드 6, 테마 Chip 6, 안전 카드 6, 동행글 3(또는 완성형 Empty) |
| **SCR-002** `/about` | Hero → 여행 지표 → 소개·철학 → Timeline → 방문 국가 → Gallery → 기억에 남는 여행지+CTA | 지표 카드 2, Timeline 6개 이상, 방문국가 30개국 이상(4권역), Gallery 사진 8장 이상, 추천 여행지 4 |
| **SCR-003** `/travel-tools` | Intro → 탭(항공/숙소/동행) → 조건 입력 Form → 요약+외부이동 → 비전달 고지+Tip → 동행 구하기(로그인 안내 또는 작성 폼) | 탭 3개 전부 존재, Tip 3개, Form 필드 4개(국가·지역·시작일·종료일) |
| **SCR-004** `/mates` | Intro → Filter+결과요약 → 목록 → 목록+상세 분할 → 신청방법 3단계 → 안전안내+CTA | 목록 카드 최대 8(데이터 있을 때), 신청방법 3단계, 안전 안내 문구 3줄 이상 |
| **SCR-005** `/account` | (역할별) Intro → 핵심 작업 → 도움말/다음 행동 | Guest: 로그인/가입/재설정 Card 3, Member: 내 글·참가요청·차단목록 각 1개 이상(또는 Empty), Admin: 신고 상태 표+외부 URL 설정 |

## 20. 완성형 Empty State와 Placeholder 문구 금지

- `Lorem ipsum`, `준비 중`, `정보 확인 필요`와 같은 자리표시자 문구를 어떤 화면에도 쓰지 않는다.
- 데이터가 없는 목록(내 글, 참가 요청, 차단 목록, 최근 동행글, 신고 목록 등)은 다음 3요소를 모두 갖춘 **완성형 Empty State**로 표시한다:
  1. 상황을 설명하는 자연스러운 한국어 문장(예: "아직 작성한 동행글이 없어요")
  2. 짧은 이용 방법 안내(1~2문장 또는 mini 3단계)
  3. 다음 행동 CTA(예: "동행글 작성하기" 버튼)
- 빈 Card, 빈 배경 블록, 텍스트 없는 장식 영역을 만들지 않는다.

## 21. Do / Do Not

### Do
- 코랄은 주요 CTA·활성 상태에만 쓰고, 경고·안전정보는 항상 caution/critical 토큰으로 분리한다.
- 모든 이미지에 실제 장소를 설명하는 alt 텍스트를 붙인다.
- Empty/Error 상태에도 다음 행동(CTA)을 함께 제공한다.
- Section마다 레이아웃 패턴을 바꿔 같은 Card Grid가 연속되지 않게 한다.
- 신규 색상·폰트·컴포넌트가 필요하면 이 문서에 토큰을 추가한 뒤 사용한다.

### Do Not
- Airbnb 로고·워드마크·"Guest favorite"류 배지·손그림 아이콘·Rausch 컬러·Cereal 폰트를 복제하지 않는다.
- 예약·결제·체크아웃 UI, 가격 표기(₩/$), "예약하기"/"결제" 버튼을 만들지 않는다.
- 라이선스가 필요한 Proprietary 폰트 파일을 프로젝트에 포함하지 않는다(Inter는 오픈소스/시스템 폰트로만 로드).
- 이 문서의 Color Token 표에 없는 색을 임의로 추가하지 않는다.
- 별점·리뷰·수치형 신뢰도(예: "매너온도")를 어떤 화면에도 추가하지 않는다 — `docs/STITCH_VALIDATION_REPORT.md`에서 SCR-004/005에 자동 추가되어 NEEDS_REVISION 판정을 받은 항목이며, 재발 시 즉시 제거 대상이다.
- 광고 배너, 실시간 항공권·호텔 가격, 복잡한 관리자 통계 Dashboard를 추가하지 않는다.
