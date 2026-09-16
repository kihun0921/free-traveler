# Free Traveler — Stitch Validation Report

- **Document ID:** STITCH-VALID-001
- **검증 대상 Project ID:** `997344754745573204` (Free Traveler) — 기존 프로젝트 재사용, 신규 프로젝트 생성 없음
- **기반 문서:** `docs/04_UIUX_PLAN.md`, `design-reference/vendor/airbnb/DESIGN.md`
- **검증 방식:** `get_project` / `list_screens` / `get_screen`으로 메타데이터 확인 + 각 화면의 `htmlCode.downloadUrl`을 WebFetch로 가져와 텍스트·구조 검사

---

## 1. Project / Screen 인벤토리 확인

| 항목 | 결과 |
|---|---|
| Project ID 재사용 | ✅ `997344754745573204` 그대로 사용 |
| 디자인 시스템 | ✅ `assets/632329d9e732401d80cd50ac3fdfd74a` (코랄 #FF6B4A, 잉크 #24242A, amber #B8720A, brick-red #C13515 포함) 7개 화면 모두 재사용 |
| SCR-001~005 각 1개 존재 | ✅ (검증 시작 시점) |
| SCR-001 Mobile 존재 | ✅ |
| SCR-003 Mobile 존재 | ⚠️ **최초 1개였으나 검증 중 생성된 화면(2개)까지 총 3개로 늘어남 — 4절 참고** |

### 검증 시작 시점 Screen 목록 (7개)

| Screen | Screen ID | Device (메타데이터) |
|---|---|---|
| SCR-001 `/` 메인 | `ce264e4c3c074b0f9d0c9307a5caca30` | DESKTOP |
| SCR-002 `/about` | `388955b2216248ceb8309804b6528f15` | DESKTOP |
| SCR-003 `/travel-tools` (Desktop) | `fc86c10df71e408d8cb0f93f40816d8e` | DESKTOP |
| SCR-004 `/mates` | `81d00f759e23402e84c0ff314803f747` | DESKTOP |
| SCR-005 `/account` | `4d1411f53b344094a3471dd1822b91f4` | DESKTOP |
| SCR-001 Mobile | `4bf39569ec4f47bc836c8fd5f9a2cf18` | MOBILE (width 780 = 390×2) |
| SCR-003 Mobile (기존) | `6d3d19a666ec4d9cbcc303dd6fc18930` | **메타데이터상 DESKTOP·width 2560** (이상 징후) |

---

## 2. 화면별 확인 영역 및 판정 (수정 전)

### SCR-001 `/` 메인 — **PASS**
- Section 7개 순서 확인: Hero → 국내 6카드 → 해외 6카드 → 여행 동기 Chip → 국가별 주의사항 6카드 → 최근 동행글 3카드 → free_traveler 소개. 계약과 일치.
- Hero가 전체 높이를 차지하지 않고 다음 Section이 바로 이어짐(WebFetch 확인: "Navigation to destination sections requires minimal scrolling").
- 국내/해외/안전 카드 모두 실제 지명(제주·서울·부산·경주·강릉·전주 / 도쿄·오사카·방콕·다낭·파리·바르셀로나 / 일본·태국·베트남·프랑스·스페인·미국)과 구체적 설명 포함.
- Lorem ipsum, "준비 중", "정보 확인 필요", 빈 Card 없음.
- 광고·별점·실시간 가격 없음. Airbnb 로고·상표 없음.

### SCR-001 Mobile — **PASS**
- 7개 Section 동일 순서, 모든 카드 1열 스택 확인.
- Lorem ipsum/placeholder 없음, 광고·별점·실시간 가격·Airbnb 브랜딩 없음.

### SCR-002 `/about` — **PASS**
- 7개 Section 모두 확인: Hero → 지표(50+/30+) → 소개·철학(3문단) → Timeline(6개, 2018~2024) → 방문국가(30개국, 4권역) → Gallery(8장) → 기억에 남는 여행지 4카드+CTA.
- 여행 철학 인용문("좋은 여행은 많이 보는 여행이 아니라...") 확인.
- Lorem ipsum/placeholder 없음, 별점·광고·실시간 가격·Airbnb 브랜딩 없음.

### SCR-003 `/travel-tools` (Desktop) — **PASS**
- 탭 3개(항공편/숙소/동행 구하기) 모두 존재 확인.
- Section 6개 계약 충족: Intro+3단계 → 탭바 → 조건 입력 Form → 요약+외부이동 Card → 비전달 고지+Tip 3개 → 동행 구하기(로그인 안내+폼 프리뷰).
- 가격 표기·"예약"·"결제" 문구 없음. 외부 링크는 Skyscanner·Booking.com(일반 외부 사이트)로 연결, Airbnb 브랜딩 없음.
- Lorem ipsum/placeholder 없음.

### SCR-004 `/mates` — **NEEDS_REVISION**
- 목록(6개 카드)과 상세 패널(선택된 글의 전체 정보+참가 메시지 입력+신고/차단)이 모두 존재 확인 → 목록+상세 요건은 **PASS**.
- 연락처(전화번호/이메일/메신저 ID) 비노출 확인, "모든 연락처는 비공개 유지됩니다" 문구 확인.
- 가격·광고 없음, Airbnb 브랜딩 없음.
- ❌ **결함 발견**: 상세 패널 작성자 프로필에 `"안전 매너온도 98℃ · 동행 경험 4회"`라는 수치형 신뢰도 배지가 자동 추가되어 있음. PRD/SRS는 "사용자 자유 리뷰·별점"을 명시적으로 Out of Scope로 규정하고 있어, 이 수치형 배지는 사실상 평점 기능에 해당해 범위를 벗어남.

### SCR-005 `/account` — **NEEDS_REVISION**
- 프로필 요약, 내 활동(내 글/참가 요청), 차단 목록, 관리자 섹션(신고 상태 변경 표, 외부 URL 설정 입력)이 모두 한 화면에 확인됨 → Member+Admin 표현 요건은 **PASS**.
- 단순 리스트/표 기반, 통계 차트·그래프 없음 확인.
- Empty State("아직 작성한 동행글이 없어요") 존재 확인, Lorem ipsum/placeholder 없음.
- ❌ **결함 발견**: 프로필 카드에 `"매너온도 / 신뢰도"` 항목과 `"신뢰 매너온도 98°C"` 수치가 SCR-004와 동일하게 존재 — 동일 사유로 범위 초과.

### SCR-003 Mobile (기존 화면 `6d3d19a666ec4d9cbcc303dd6fc18930`) — **NEEDS_REVISION**
- 탭 3개 모두 존재, 가격·예약·결제 문구 없음, Lorem ipsum/placeholder 없음 → 콘텐츠 자체는 양호.
- ❌ **결함 발견**: `get_screen` 메타데이터가 `deviceType: DESKTOP`, `width: 2560`으로 기록되어 있고, WebFetch 검사에서도 "모바일 뷰포트 제약이나 미디어쿼리가 보이지 않으며 데스크톱형 레이아웃"으로 판정됨. SCR-001 Mobile(정상적으로 `MOBILE`/`780`)과 달리 **실제로는 390px 모바일 변형이 아님**.

---

## 3. 수정 시도 내역 (화면당 최대 2회 원칙)

| Screen | 시도 | 방법 | 결과 |
|---|---|---|---|
| SCR-004 | 1회 | `edit_screens`로 매너온도 배지를 "성인 인증 완료" 비수치 배지로 교체 지시 | 도구는 "성공"으로 응답(dom_operation 로그 포함)했으나, 재조회(`get_screen`) 결과 **htmlCode 파일이 원본과 동일**하고 WebFetch 재검사에서도 "매너온도 98℃" 문구가 **그대로 남아있음** → 실제로 반영되지 않음 |
| SCR-005 | 1회 | 동일한 매너온도 배지 제거 지시 | 위와 동일하게 도구는 성공 응답했지만 `get_screen` 파일 ID가 원본과 동일 → 반영 확인 불가(미반영으로 판단) |
| SCR-003 Mobile | 2회(한도 소진) | `deviceType: MOBILE`을 명시하여 진짜 390px 레이아웃으로 재작성 지시 | 두 시도 모두 클라이언트 타임아웃 발생. 이후 `list_screens` 재조회 결과, 기존 화면(`6d3d19a666ec4d9cbcc303dd6fc18930`)은 그대로 남아있고, **각 시도마다 새로운 MOBILE 화면이 별도로 생성됨**(`db0e4c74adf940a9869c47e57c344a4c`, `024270f87a8b4734a0d4977dba53fb07`) — 편집이 아니라 신규 생성으로 처리된 것으로 확인 |

### 3-1. SCR-003 Mobile 중복 생성에 대한 조치

- 두 번째 시도로 생성된 `024270f87a8b4734a0d4977dba53fb07`(deviceType `MOBILE`, width 780)를 WebFetch로 재검사한 결과: 탭 3개 모두 존재, 항공편/호텔 버튼이 세로로 스택됨, 단일 컬럼 흐름 확인, Lorem ipsum·가격·예약 문구 없음 — **콘텐츠 기준으로는 가장 양호**.
- 그러나 이 프로젝트에는 현재 "SCR-003 Travel Tools Screen (Mobile 390px)"라는 동일 제목의 화면이 **3개**(기존 결함본 1개 + 신규 생성본 2개) 존재하는 상태이며, 이 MCP 연동에는 화면 삭제 도구가 없어 **자동으로 정리(삭제)할 수 없었다.**
- 수정 원칙("최대 2회까지만 수정, 중복 화면을 새로 만들지 않는다")을 지키기 위해 추가 시도를 중단했다.

---

## 4. 최종 화면별 판정

| Screen | Screen ID | 판정 |
|---|---|---|
| SCR-001 `/` 메인 | `ce264e4c3c074b0f9d0c9307a5caca30` | **PASS** |
| SCR-001 Mobile | `4bf39569ec4f47bc836c8fd5f9a2cf18` | **PASS** |
| SCR-002 `/about` | `388955b2216248ceb8309804b6528f15` | **PASS** |
| SCR-003 `/travel-tools` (Desktop) | `fc86c10df71e408d8cb0f93f40816d8e` | **PASS** |
| SCR-003 Mobile | `6d3d19a666ec4d9cbcc303dd6fc18930`(결함본, 삭제 대상) / `db0e4c74adf940a9869c47e57c344a4c`(중복, 삭제 대상) / `024270f87a8b4734a0d4977dba53fb07`(권장 유지본) | **BLOCKED** — 콘텐츠는 양호하나 중복 3개 정리가 사람 손으로 필요 |
| SCR-004 `/mates` | `81d00f759e23402e84c0ff314803f747` | **NEEDS_REVISION (미해결)** — 매너온도 배지 제거 시도가 반영되지 않음 |
| SCR-005 `/account` | `4d1411f53b344094a3471dd1822b91f4` | **NEEDS_REVISION (미해결)** — 매너온도 배지 제거 시도가 반영되지 않음 |

---

## 5. 남은 조치(사람 확인 필요)

1. **SCR-003 Mobile 중복 정리**: Stitch 프로젝트 화면에서 `6d3d19a666ec4d9cbcc303dd6fc18930`와 `db0e4c74adf940a9869c47e57c344a4c`를 삭제하고 `024270f87a8b4734a0d4977dba53fb07` 하나만 "SCR-003 Mobile"로 유지할 것을 권장.
2. **SCR-004 / SCR-005 매너온도 배지 제거**: `edit_screens` 호출이 성공 응답을 반환했지만 실제 파일에 반영되지 않는 현상이 반복 확인됨. Stitch 웹 에디터에서 직접 해당 요소(`"안전 매너온도 98℃ · 동행 경험 4회"`, `"신뢰 매너온도 98°C"`)를 제거하고 비수치 인증 배지로 교체하는 수동 확인이 필요.
3. 두 항목 모두 자동 재시도 한도(화면당 최대 2회)에 도달했거나, 추가 시도가 중복 생성 위험을 키우는 것으로 판단되어 자동화를 중단함.

---

## 6. 최종 판정

**STITCH_VALIDATION_NEEDS_HUMAN**

- PASS 4개(SCR-001 Desktop/Mobile, SCR-002, SCR-003 Desktop)
- BLOCKED 1개(SCR-003 Mobile — 중복 3개 정리 필요)
- NEEDS_REVISION 미해결 2개(SCR-004, SCR-005 — 매너온도 배지 제거 미반영)

전체 7개(계약상 5+2) 중 5개만 즉시 배포 가능 상태이며, 나머지는 Stitch 편집기에서 사람이 직접 확인·정리해야 STITCH_VALIDATION_PASS로 전환할 수 있다.
