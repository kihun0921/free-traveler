# Free Traveler — SRS UI/UX Revision Overlay

- **Document ID:** SRS-TRAVEL-001-R1
- **기반 문서:** `docs/02_SRS_BASELINE.md`(변경 없음, 원문 유지) + `docs/04_UIUX_PLAN.md` + `docs/03_UI_COVERAGE_ANALYSIS.md` + `docs/PROJECT_SCOPE.md`
- **성격:** 이 문서는 `02_SRS_BASELINE.md`를 대체하지 않는다. REQ-FUNC-001~080, REQ-NF-001~034의 내용과 번호는 변경하지 않으며, **라우트/화면 구조와 데이터 모델만** UI/UX 확정안 기준으로 재정리한다.

---

## 1. 변경 요약

| 영역 | Baseline(`02_SRS_BASELINE.md`) | Revised(이 문서) |
|---|---|---|
| Page/Route 수 | §3.5 기준 14개 라우트(`/destinations`, `/destinations/domestic`, `/destinations/overseas`, `/destinations/[slug]`, `/flights`, `/hotels`, `/mates`, `/mates/[id]`, `/mates/new`, `/safety`, `/safety/[countryCode]`, `/about`, `/auth/*`, `/my/*`, `/admin/*`) | **5개 디자인 Screen**(SCR-001~005) + 기술 Route로 통합 |
| 여행지/안전 상세 | 별도 라우트(`/destinations/[slug]`, `/safety/[countryCode]`) | SCR-001의 Drawer/Modal |
| 항공/호텔 입력 | 별도 라우트(`/flights`, `/hotels`) | SCR-003의 탭 2개(항공/숙소) |
| 동행 작성 | 별도 라우트(`/mates/new`) | SCR-003의 탭 1개(동행 구하기) |
| 동행 상세 | 별도 라우트(`/mates/[id]`) | SCR-004의 상세 패널(Desktop 분할 / Mobile Drawer) |
| 로그인/프로필/내 활동/관리자 | `/auth/*`, `/my/*`, `/admin/*` | SCR-005의 역할별 탭 |
| DB 엔터티 수 | §6.3 기준 11개(`COUNTRY`, `REGION`, `DESTINATION`, `DESTINATION_CONTENT`, `COUNTRY_SAFETY`, `MEDIA_ASSET`, `REPRESENTATIVE_PROFILE`, `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `AUDIT_LOG`) | **6개 테이블**로 제한(§3) — 콘텐츠성 엔터티는 정적 데이터로 대체, `AUDIT_LOG`는 EXCLUDED |

## 2. Screen ↔ Route 매핑 (정본: `design-reference/SCREEN_ROUTE_CONTRACT.json`)

| Screen | Route | Next.js 파일 | Baseline 대응 라우트 |
|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | `/`, `/destinations`, `/destinations/domestic`, `/destinations/overseas`, `/destinations/[slug]`, `/safety`, `/safety/[countryCode]` |
| SCR-002 | `/about` | `src/app/about/page.tsx` | `/about` |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | `/flights`, `/hotels`, `/mates/new` |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | `/mates`, `/mates/[id]` |
| SCR-005 | `/account` | `src/app/account/page.tsx` | `/auth/*`, `/my/*`, `/admin/*` |
| 기술 Route | `/auth/callback`, `/api/**`, `/404`, `/500`, `/unauthorized` | Next.js Route Handler / 오류 바운더리 | 동일 |

## 3. 데이터 모델 재정리 — 6개 테이블 한도

| # | 테이블 | 근거 REQ-FUNC | 비고 |
|---|---|---|---|
| 1 | `user_profile` | 028, 029, 066 | 닉네임, `is_adult`, `adult_verified_at`, 연령대, 성별, 여행 스타일, 상태. 정확한 생년월일 미저장 |
| 2 | `mate_post` | 031, 037, 038, 080 | 제목, 국가·지역, 기간, 인원, 조건, 설명, 상태(OPEN/CLOSED), 안전수칙 동의 시각·정책 버전 포함 |
| 3 | `mate_application` | 034, 035, 036 | 참가 메시지(500자), 상태(PENDING/ACCEPTED/REJECTED/WITHDRAWN) |
| 4 | `user_block` | 040 | `blocker_id`, `blocked_id` unique pair |
| 5 | `report` | 039, 041 | 신고 대상·사유·상태(OPEN/RESOLVED/DISMISSED) |
| 6 | `app_setting` | 077 | key-value, `flight_outbound_url` / `hotel_outbound_url` (HTTPS 허용목록) |

**DB에 만들지 않는 것(정적 데이터 또는 EXCLUDED로 대체):**
- `COUNTRY` / `REGION` / `DESTINATION` / `DESTINATION_CONTENT` / `MEDIA_ASSET` → `src/data/destinations.ts` 등 정적 데이터(REQ-FUNC-004, 008, 026, 027)
- `COUNTRY_SAFETY` → `src/data/safety.ts` 정적 데이터(REQ-FUNC-046~054)
- `REPRESENTATIVE_PROFILE` → `src/data/about.ts` 정적 데이터(REQ-FUNC-057~063)
- `AUDIT_LOG` → 만들지 않음(REQ-FUNC-076 EXCLUDED)
- 항공·호텔 입력값 → 어떤 테이블에도 저장하지 않음(REQ-FUNC-017, 025, REQ-NF-017 — 브라우저 상태로만 유지)

## 4. Requirement 상태 재확인

REQ-FUNC-001~080, REQ-NF-001~034의 IMPLEMENT/EXCLUDED 상태는 `docs/PROJECT_SCOPE.md`와 `docs/UIUX_TRACEABILITY.md`를 그대로 따른다. 이 문서는 상태를 재분류하지 않으며, Baseline SRS의 요구사항 문구도 변경하지 않는다.

## 5. 제약 재확인 (Baseline `CON-*`에 추가)

- **CON-15(신규):** 디자인 Screen은 정확히 5개(SCR-001~005)로 고정한다. API Route·인증 콜백·오류 처리는 기술 Route이며 Screen 수에 포함하지 않는다.
- **CON-16(신규):** DB 테이블은 §3의 6개로 제한한다. 신규 테이블이 필요하면 이 문서를 갱신하고 사유를 기록한다.
- **CON-17(신규):** Playwright 테스트는 Chromium 단일 브라우저 Smoke Test만 구성한다(다중 브라우저 매트릭스 없음).
