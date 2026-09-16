# Free Traveler — Design Manifest

- **Active Design Version:** D-001
- **Status:** LOCKED
- **Active File:** `design-reference/D-001/DESIGN.md`
- **Vendor Reference:** `design-reference/vendor/airbnb/DESIGN.md` (구조적 참고만, 상표 요소 미사용)
- **Approved Screens:** SCR-001 ~ SCR-005
- **Mobile Variants:** SCR-001, SCR-003

---

## 승인 근거

- `docs/04_UIUX_PLAN.md` — Screen별 Section 계약, 토큰 초안
- `docs/STITCH_VALIDATION_REPORT.md` — Stitch Project `997344754745573204` 검증 결과
- Stitch 승인 디자인 시스템 자산: `assets/632329d9e732401d80cd50ac3fdfd74a`

## Approved Screen ↔ Stitch Screen ID 매핑 및 상태

| Screen | Stitch Screen ID | 검증 판정(STITCH_VALIDATION_REPORT 기준) |
|---|---|---|
| SCR-001 `/` 메인 (Desktop) | `ce264e4c3c074b0f9d0c9307a5caca30` | PASS |
| SCR-001 Mobile | `4bf39569ec4f47bc836c8fd5f9a2cf18` | PASS |
| SCR-002 `/about` | `388955b2216248ceb8309804b6528f15` | PASS |
| SCR-003 `/travel-tools` (Desktop) | `fc86c10df71e408d8cb0f93f40816d8e` | PASS |
| SCR-003 Mobile | `024270f87a8b4734a0d4977dba53fb07`(권장 유지본) | BLOCKED — 중복 화면 정리 필요(사람 확인) |
| SCR-004 `/mates` | `81d00f759e23402e84c0ff314803f747` | NEEDS_REVISION — 매너온도 배지 미제거 |
| SCR-005 `/account` | `4d1411f53b344094a3471dd1822b91f4` | NEEDS_REVISION — 매너온도 배지 미제거 |

> D-001은 디자인 토큰·규칙 정본으로서 LOCKED 상태이며, 위 표의 BLOCKED/NEEDS_REVISION 항목은 Stitch 화면 자체의 잔여 결함이다. `design-reference/D-001/DESIGN.md` §11, §21에 따라 해당 결함(매너온도 배지, 화면 중복)은 규칙 위반으로 명시되어 있고, 재작업 시 반드시 이 문서를 기준으로 수정한다.

## 금지 사항 (전 버전 공통, 예외 없음)

- Airbnb 상표 요소(로고·워드마크·"Guest favorite" 배지·손그림 아이콘·Rausch 컬러·Cereal 폰트) 사용 금지
- 구매·예약·결제 UI(가격 표기, "예약하기"/"결제" 버튼, 체크아웃 화면) 추가 금지
- Proprietary 폰트 파일 포함 금지 — Inter는 오픈소스/시스템 폰트로만 로드
- `design-reference/D-001/DESIGN.md`의 Color Token 표에 없는 임의 색상 추가 금지

## 버전 관리 규칙

- 새 디자인 결정이 필요하면 `design-reference/D-002/DESIGN.md`를 새로 만들고, 이 매니페스트의 `Active Design Version`/`Active File`을 갱신한 뒤에만 D-002를 정본으로 취급한다.
- `Status: LOCKED`인 버전의 파일 내용은 직접 수정하지 않는다. 수정이 필요하면 새 버전을 만든다.
- `Approved Screens`/`Mobile Variants`는 `docs/STITCH_VALIDATION_REPORT.md`가 갱신되어 모든 화면이 PASS로 전환된 시점에 맞춰 갱신한다.
