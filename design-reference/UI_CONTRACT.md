# Free Traveler — UI Contract

- **정본 관계:** 이 문서는 `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)의 사람이 읽는 버전이다. 두 문서가 충돌하면 **JSON이 우선**한다.
- **디자인 토큰/Do·Do Not 근거:** `design-reference/D-001/DESIGN.md` (Status: LOCKED)
- **화면 목록 근거:** `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`

이 문서는 Page Owner Task의 Acceptance Criteria를 쓸 때 그대로 인용하는 계약이다. Screen은 정확히 5개(SCR-001~005)이며, 각 Screen의 Section 순서·최소 콘텐츠 수·Empty State 요구는 아래 표를 벗어날 수 없다.

## SCR-001 `/` 메인 — `src/app/page.tsx`

| 순서 | Section ID | 제목 | 패턴 | 최소 콘텐츠 | Empty State 필수 |
|---:|---|---|---|---:|:---:|
| 1 | SCR-001-S1 | 여행지 검색 Hero | HERO | 1 | - |
| 2 | SCR-001-S2 | 국내 인기 여행지 | CARD_GRID | 6 | ✅ |
| 3 | SCR-001-S3 | 해외 인기 여행지 | CARD_GRID | 6 | ✅ |
| 4 | SCR-001-S4 | 여행 동기·테마 | CHIP_LIST | 6 | - |
| 5 | SCR-001-S5 | 국가별 주의사항 | CARD_GRID | 6 | ✅ |
| 6 | SCR-001-S6 | 최근 동행글 | CARD_GRID | 3 | ✅ |
| 7 | SCR-001-S7 | free_traveler 소개 | SPLIT | 1 | - |

Drawer/Modal: 여행지 상세, 안전정보 상세(§D-001 12). Hero는 1440px에서 다음 Section 시작이 보여야 한다(§D-001 17).

## SCR-002 `/about` 대표 소개 — `src/app/about/page.tsx`

| 순서 | Section ID | 제목 | 패턴 | 최소 콘텐츠 | Empty State 필수 |
|---:|---|---|---|---:|:---:|
| 1 | SCR-002-S1 | free_traveler Hero | HERO | 1 | - |
| 2 | SCR-002-S2 | 여행 지표 | CARD_GRID | 2 | - |
| 3 | SCR-002-S3 | 소개·철학 | SPLIT | 3(문단) | - |
| 4 | SCR-002-S4 | 여행 Timeline | TIMELINE | 6 | - |
| 5 | SCR-002-S5 | 방문 국가 | CHIP_LIST | 30(국가) | - |
| 6 | SCR-002-S6 | 여행 사진 Gallery | CARD_GRID | 8(사진) | - |
| 7 | SCR-002-S7 | 기억에 남는 여행지 | CARD_GRID_CTA | 4 | - |

정적 콘텐츠 화면이므로 Empty State는 없음(데이터는 `src/data`에 항상 채워져 있어야 한다).

## SCR-003 `/travel-tools` 통합 여행 준비 — `src/app/travel-tools/page.tsx`

Tab: `flight` / `hotel` / `mate`. 세 탭은 입력·검증·완료 상태를 서로 분리한다.

| 순서 | Section ID | 제목 | 패턴 | 적용 탭 | 최소 콘텐츠 | Empty State 필수 |
|---:|---|---|---|---|---:|:---:|
| 1 | SCR-003-S1 | Intro | THREE_STEP | 공통 | 3(단계) | - |
| 2 | SCR-003-S2 | 탭 전환 | TAB_BAR | 공통 | 3(탭) | - |
| 3 | SCR-003-S3 | 조건 입력 Form | FORM | flight, hotel | 4(필드) | - |
| 4 | SCR-003-S4 | 입력 요약 + 외부 이동 | ACTION_CARD | flight, hotel | 1 | - |
| 5 | SCR-003-S5 | 비전달 고지 + Tip | THREE_STEP | flight, hotel | 3(Tip) | - |
| 6 | SCR-003-S6 | 동행 구하기 | FORM | mate | 1 | ✅(비로그인/미성년) |

## SCR-004 `/mates` 동행 조회 — `src/app/mates/page.tsx`

| 순서 | Section ID | 제목 | 패턴 | 최소 콘텐츠 | Empty State 필수 |
|---:|---|---|---|---:|:---:|
| 1 | SCR-004-S1 | Intro | CTA_BANNER | 1 | - |
| 2 | SCR-004-S2 | Filter + 결과 요약 | FILTER_BAR | 1 | - |
| 3 | SCR-004-S3 | 동행글 목록 | CARD_GRID | 8(최대) | ✅ |
| 4 | SCR-004-S4 | 목록+상세 분할 | SPLIT_DETAIL | 1 | - |
| 5 | SCR-004-S5 | 신청 방법 3단계 | THREE_STEP | 3 | - |
| 6 | SCR-004-S6 | 안전 안내 + CTA | CTA_BANNER | 1 | - |

Desktop: 좌우 분할. Mobile: 목록 → 상세 Drawer.

## SCR-005 `/account` 계정·관리 — `src/app/account/page.tsx`

Role: `GUEST` / `MEMBER` / `ADMIN`. 역할에 없는 탭은 렌더링하지 않는다.

| Section ID | 제목 | 적용 역할 | 최소 콘텐츠 | Empty State 필수 |
|---|---|---|---:|:---:|
| SCR-005-S1 | 로그인 | GUEST | 3(로그인/가입/재설정 Card) | - |
| SCR-005-S2 | 프로필 | MEMBER, ADMIN | 1 | - |
| SCR-005-S3 | 내 활동 | MEMBER, ADMIN | 1(목록당) | ✅ |
| SCR-005-S4 | 간단 관리자 | ADMIN | 2(신고 표+URL 설정) | ✅ |

## 공통 규칙 (모든 Page Owner Task 공통 AC)

1. Section 순서를 바꾸지 않는다. 위 표의 `순서`/`order`를 그대로 구현한다.
2. 각 Section은 제목 + 설명 1~3문장 + 실제 콘텐츠 또는 CTA를 갖는다.
3. 데이터가 없는 목록형 Section은 `Empty State 필수 = ✅`인 경우 안내 문장 + 이용 방법 + 다음 행동 CTA 3요소를 모두 갖춘 완성형 Empty State를 구현한다.
4. `Lorem ipsum`, `준비 중`, `정보 확인 필요`, 텍스트 없는 빈 Card, 의미 없는 빈 여백을 두지 않는다.
5. 같은 레이아웃 패턴을 연속 배치하지 않는다(§D-001 18).
6. 예약·결제 UI, 가격 표기, 별점/리뷰/수치형 신뢰도 배지를 추가하지 않는다(§D-001 21 Do Not).
