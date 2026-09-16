# Free Traveler — UI Coverage Analysis (03_UI_COVERAGE_ANALYSIS.md)

- **Document ID:** UICOV-TRAVEL-001
- **기반 문서:** `docs/01_PRD.md`, `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`
- **목적:** SRS의 REQ-FUNC-001~080, REQ-NF-001~034 전체(114개)를 UI 표현 방식으로 분류하고, `docs/PROJECT_SCOPE.md`의 IMPLEMENT/EXCLUDED 분류와 함께 5개 고정 디자인 Screen에 배치한다.

---

## 1. 분류 기준

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 화면에 눈에 보이는 요소(패널, 필드, 버튼, 배지, 텍스트)로 직접 구현되는 요구사항 |
| **UI_STATE** | 화면에는 보이지만 별도 요소가 아니라 상태·검증·동작 로직으로 표현되는 요구사항(로딩, 오류, 필터 적용 등) |
| **NON_UI** | 화면에 직접 드러나지 않는 데이터·보안·성능·정책 계층 요구사항(RLS, 서버 검증, 성능 목표 등) |
| **OPERATIONS** | 제품 화면이 아니라 운영·거버넌스·인프라 프로세스에 속하는 요구사항(감사 로그, CMS 워크플로, SLA 모니터링 등). 대부분 `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 항목과 겹친다. |

Scope 상태 칼럼은 `docs/PROJECT_SCOPE.md`의 분류를 그대로 인용한다. 본 문서는 Requirement를 삭제하지 않으며, EXCLUDED 항목을 구현 범위로 복원하지 않는다.

---

## 2. 디자인 Screen 인벤토리 (5개 고정)

### SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 국내·해외 여행지를 탐색하고, 관심 여행지의 상세 정보와 국가 안전정보를 확인한다. |
| 주요 영역 | 통합 검색창, 국내/해외 탭, 필터 바(국가·도시·계절·테마·기간), 여행지 카드 목록, 빈 결과 안내, 여행지 상세 Drawer/Modal, 안전정보 Drawer/Modal(여행지 상세에서 진입), 관련 여행지 추천, 즐겨찾기 토글, 전역 내비게이션·푸터 |
| 상태 | 목록 로딩/빈 결과, 필터 적용 상태(URL 동기화 포함), 여행지 상세 Drawer open/close, 안전정보 Drawer open/close 및 stale/정상 배지, 즐겨찾기 on/off |
| 이동 목적지 | SCR-003(항공/호텔 준비 시작), SCR-004(동행 찾기), SCR-005(로그인 필요 액션 시 인증 유도) |

### SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| 사용자 목표 | `free_traveler`의 여행 경험과 편집 기준을 확인해 콘텐츠 신뢰도를 판단한다. |
| 주요 영역 | 대표 이미지·한 줄 소개, `50+ Trips`/`30+ Countries` 수치 카드, 여행 철학·편집 원칙, 방문 권역·국가 목록, 여행 타임라인, 추천 여행지 6곳, 문의·SNS 링크 |
| 상태 | 정적 콘텐츠 중심이며 이미지 lazy load 상태만 존재 |
| 이동 목적지 | SCR-001(추천 여행지 클릭 시 해당 여행지 상세 Drawer) |

### SCR-003 `/travel-tools` 통합 여행 준비 (탭: 항공 / 호텔 / 동행 작성)

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 항공·숙소 조건을 정리해 외부 사이트로 이동하거나, 새 동행 모집글을 작성한다. |
| 주요 영역 | 탭 전환(항공/호텔/동행 작성), 항공·호텔 입력 폼과 검증 오류, 입력 요약과 비전달 고지, 외부 이동 버튼, 동행 작성 폼(제목·조건·설명·안전수칙 동의), 공개 연락처 탐지 경고 |
| 상태 | 탭 선택 상태, 폼 미완성/검증 실패/요약 완료, 외부 이동 성공/실패, 동행 작성 성공(→SCR-004 이동 안내), 비로그인·미성년 시 작성 탭 잠금 |
| 이동 목적지 | 외부 사이트(Google Flights/Booking.com, 새 탭), SCR-004(동행 작성 완료 후 해당 글 상세로 이동), SCR-005(비로그인·미성년 시 인증 유도) |

### SCR-004 `/mates` 동행 조회 (상세 패널)

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 조건이 맞는 동행 모집글을 찾아 참가를 요청하거나, 내가 쓴 글의 요청을 처리한다. |
| 주요 영역 | 필터 바(국가·지역·기간·연령대·성별·스타일·모집상태), 모집글 목록, 상세 패널(작성자 조건·설명, 참가 요청 폼, 참가 요청 승인/거절, 신고·차단 버튼) |
| 상태 | 필터 적용, 목록 로딩/빈 결과, 상세 패널 open, 모집중/마감(OPEN/CLOSED) 표시, 참가 요청 PENDING/ACCEPTED/REJECTED, 신고 접수 완료 |
| 이동 목적지 | SCR-003(새 동행 글쓰기 진입), SCR-005(비로그인·미성년 인증 유도, 내 활동에서 요청 현황 확인) |

### SCR-005 `/account` 계정·관리 (탭: 로그인 / 프로필 / 내 활동 / 간단 관리자)

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 로그인·성인 확인을 완료하고, 프로필과 내 활동(글·요청·즐겨찾기·차단)을 관리한다. 관리자는 신고 상태와 외부 URL을 처리한다. |
| 주요 영역 | 로그인/회원가입/비밀번호 재설정 폼, 성인 확인 UI, 프로필 편집(닉네임·연령대·성별·여행 스타일), 내가 쓴 동행글 목록(마감/수정/삭제), 내 참가 요청 현황, 즐겨찾기 목록, 차단 목록, 간단 관리자 탭(신고 상태 변경, 항공·호텔 외부 URL 설정) |
| 상태 | 인증 세션 유무, 성인 확인 완료 여부, 각 목록 로딩/빈 상태, 관리자 권한 여부에 따른 탭 노출 |
| 이동 목적지 | SCR-004(내 활동에서 글/요청 상세로 복귀), SCR-003(내 동행글 수정 시 작성 탭 재사용) |

> API Route, 인증 콜백(`/auth/callback` 등), 404/500/권한 없음 오류 처리는 기술 Route로서 위 5개 디자인 Screen에 포함하지 않는다.

---

## 3. Requirement 매핑 — Functional Requirements (REQ-FUNC-001~080)

### 3.1 F1. Destination Guide

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-001 | UI_DIRECT | IMPLEMENT | SCR-001 | 국내/해외 탭 |
| REQ-FUNC-002 | UI_DIRECT | IMPLEMENT | SCR-001 | 필터 바 |
| REQ-FUNC-003 | UI_DIRECT | IMPLEMENT | SCR-001 | 통합 검색창 |
| REQ-FUNC-004 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer/Modal |
| REQ-FUNC-005 | UI_STATE | IMPLEMENT | SCR-001 | 목록 영역 빈 결과 상태 |
| REQ-FUNC-006 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer → 안전정보 Drawer 연결 |
| REQ-FUNC-007 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer 이미지 alt/출처 |
| REQ-FUNC-008 | OPERATIONS | IMPLEMENT | 해당없음 | 콘텐츠 수량 게이트(정적 데이터 검증, 화면 아님) |
| REQ-FUNC-009 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer 하단 추천 목록 |
| REQ-FUNC-010 | UI_STATE | IMPLEMENT | SCR-001 | 필터 상태 URL 동기화 |

### 3.2 F2. Flight Link-out

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-011 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 입력 폼 |
| REQ-FUNC-012 | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 지역 옵션 재계산 |
| REQ-FUNC-013 | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 날짜 검증 오류 |
| REQ-FUNC-014 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 요약 단계 |
| REQ-FUNC-015 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 비전달 고지 문구 |
| REQ-FUNC-016 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 외부 이동 버튼 |
| REQ-FUNC-017 | NON_UI | IMPLEMENT | SCR-003 | 항공 탭 데이터 미저장(서버 계층) |
| REQ-FUNC-018 | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 외부 URL 오류 상태 |

### 3.3 F3. Hotel Link-out

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-019 | UI_DIRECT | IMPLEMENT | SCR-003 | 호텔 탭 입력 폼 |
| REQ-FUNC-020 | UI_STATE | IMPLEMENT | SCR-003 | 호텔 탭 지역 옵션 재계산 |
| REQ-FUNC-021 | UI_STATE | IMPLEMENT | SCR-003 | 호텔 탭 날짜 검증 오류 |
| REQ-FUNC-022 | UI_DIRECT | IMPLEMENT | SCR-003 | 호텔 탭 요약 단계 |
| REQ-FUNC-023 | UI_DIRECT | IMPLEMENT | SCR-003 | 호텔 탭 비전달 고지 문구 |
| REQ-FUNC-024 | UI_DIRECT | IMPLEMENT | SCR-003 | 호텔 탭 외부 이동 버튼 |
| REQ-FUNC-025 | NON_UI | IMPLEMENT | SCR-003 | 호텔 탭 데이터 미저장(서버 계층) |
| REQ-FUNC-026 | UI_STATE | IMPLEMENT | SCR-003 | 호텔 탭 외부 URL 오류 상태 |

### 3.4 F4. Travel Mate

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-027 | NON_UI | IMPLEMENT | SCR-005 | 인증 세션 요구(SCR-003 작성 탭·SCR-004 참가요청 접근 제어의 근원) |
| REQ-FUNC-028 | UI_STATE | IMPLEMENT | SCR-005 | 프로필 탭 성인 확인 상태 |
| REQ-FUNC-029 | UI_DIRECT | IMPLEMENT | SCR-005 | 프로필 탭 입력 필드 |
| REQ-FUNC-030 | UI_DIRECT | IMPLEMENT | SCR-004 | 목록 필터 바 |
| REQ-FUNC-031 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 작성 탭 입력 필드 |
| REQ-FUNC-032 | UI_STATE | IMPLEMENT | SCR-003 | 동행 작성 탭 연락처 탐지 경고 |
| REQ-FUNC-033 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 연락처 비노출 표시 |
| REQ-FUNC-034 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 참가 메시지 제출 |
| REQ-FUNC-035 | UI_STATE | IMPLEMENT | SCR-004 | 상세 패널 중복 요청 차단 오류 |
| REQ-FUNC-036 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 승인/거절(작성자 뷰) |
| REQ-FUNC-037 | UI_STATE | IMPLEMENT | SCR-004 | 상세 패널·목록의 자동 마감 상태 표시 |
| REQ-FUNC-038 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 탭 수동 마감·수정·삭제 |
| REQ-FUNC-039 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 신고 버튼 |
| REQ-FUNC-040 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 차단 버튼(목록은 SCR-005 내 활동 탭) |
| REQ-FUNC-041 | UI_DIRECT | IMPLEMENT | SCR-005 | 간단 관리자 탭 신고 상태 필터 |
| REQ-FUNC-042 | OPERATIONS | EXCLUDED | 해당없음 | 별도 제재 액션 UI 없음(관리자 신고 상태 변경만 유지) |
| REQ-FUNC-043 | UI_STATE | IMPLEMENT | 전역 | 모든 Screen 공통 Toast 알림 |
| REQ-FUNC-044 | NON_UI | IMPLEMENT | 해당없음 | RLS 데이터 접근 제어(서버 계층) |
| REQ-FUNC-045 | OPERATIONS | EXCLUDED | 해당없음 | 탈퇴 비식별화·삭제 파이프라인 UI 없음 |

### 3.5 F5. Country Safety

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-046 | OPERATIONS | IMPLEMENT | 해당없음 | 해외 국가 안전정보 커버리지(콘텐츠 완전성, 화면 아님) |
| REQ-FUNC-047 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 8개 섹션 |
| REQ-FUNC-048 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 출처·확인일 메타 |
| REQ-FUNC-049 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 외교부 링크 |
| REQ-FUNC-050 | UI_STATE | IMPLEMENT | SCR-001 | 안전정보 Drawer stale 경고 배지 |
| REQ-FUNC-051 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 상단 중대 경보 |
| REQ-FUNC-052 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 국가/지역 범위 구분 |
| REQ-FUNC-053 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 긴급연락처 |
| REQ-FUNC-054 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 면책 고지(SCR-003 요약 단계에도 동일 문구 노출) |
| REQ-FUNC-055 | OPERATIONS | EXCLUDED | 해당없음 | Editor 작성·검수·게시 워크플로 UI 없음 |
| REQ-FUNC-056 | OPERATIONS | EXCLUDED | 해당없음 | 안전정보 변경 이력 UI 없음 |

### 3.6 F6. About free_traveler

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-057 | UI_DIRECT | IMPLEMENT | SCR-002 | 수치 카드 |
| REQ-FUNC-058 | UI_DIRECT | IMPLEMENT | SCR-002 | 소개문·철학·편집 원칙 |
| REQ-FUNC-059 | UI_DIRECT | IMPLEMENT | SCR-002 | 방문 권역·국가 목록 |
| REQ-FUNC-060 | UI_DIRECT | IMPLEMENT | SCR-002 | 여행 타임라인 |
| REQ-FUNC-061 | UI_DIRECT | IMPLEMENT | SCR-002 | 대표 이미지 alt/출처 |
| REQ-FUNC-062 | OPERATIONS | EXCLUDED | SCR-002 | 문의·SNS 링크는 정적 값으로 표시(관리자 설정 UI 없음) |
| REQ-FUNC-063 | UI_DIRECT | IMPLEMENT | SCR-002 | 추천 여행지 6곳(SCR-001 상세로 연결) |

### 3.7 F7. Common, Admin, Governance

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-FUNC-064 | UI_DIRECT | IMPLEMENT | 전역 | 전역 내비게이션·푸터 |
| REQ-FUNC-065 | UI_STATE | IMPLEMENT | 전역 | 반응형 레이아웃 |
| REQ-FUNC-066 | UI_DIRECT | IMPLEMENT | SCR-005 | 로그인 탭(가입·인증·로그아웃·재설정), 콜백은 기술 Route |
| REQ-FUNC-067 | UI_DIRECT | IMPLEMENT | SCR-001 | 통합 검색창(여행지+안전정보 결과) |
| REQ-FUNC-068 | UI_DIRECT | IMPLEMENT | SCR-001 | 즐겨찾기 토글(목록은 SCR-005 내 활동 탭) |
| REQ-FUNC-069 | UI_DIRECT | IMPLEMENT | SCR-001 | 공유 버튼(SCR-002·SCR-004 상세에도 공통 적용) |
| REQ-FUNC-070 | NON_UI | IMPLEMENT | 전역 | 페이지별 SEO 메타데이터 |
| REQ-FUNC-071 | OPERATIONS | EXCLUDED | 해당없음 | 커스텀 분석 이벤트 스키마 UI 없음 |
| REQ-FUNC-072 | OPERATIONS | EXCLUDED | 해당없음 | 여행지 CMS CRUD UI 없음 |
| REQ-FUNC-073 | OPERATIONS | EXCLUDED | 해당없음 | 미디어 업로드 승인 UI 없음 |
| REQ-FUNC-074 | OPERATIONS | IMPLEMENT | 해당없음 | 콘텐츠 완전성 검증 스크립트(화면 아님) |
| REQ-FUNC-075 | OPERATIONS | EXCLUDED | 해당없음 | stale 대시보드 UI 없음 |
| REQ-FUNC-076 | OPERATIONS | EXCLUDED | 해당없음 | 범용 감사 로그 UI 없음 |
| REQ-FUNC-077 | UI_DIRECT | IMPLEMENT | SCR-005 | 간단 관리자 탭 외부 URL 설정 |
| REQ-FUNC-078 | UI_DIRECT | IMPLEMENT | 기술 Route | 404/500/권한 없음/외부 연결 실패 화면(디자인 Screen 아님) |
| REQ-FUNC-079 | UI_STATE | IMPLEMENT | 전역 | 시맨틱 HTML·ARIA 상태(모든 Screen 공통) |
| REQ-FUNC-080 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 작성 탭 안전수칙 동의(정책 전문은 정적 문서 Route) |

---

## 4. Requirement 매핑 — Non-Functional Requirements (REQ-NF-001~034)

### 4.1 Performance

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-001 | NON_UI | IMPLEMENT | 전역 | LCP 설계 목표 |
| REQ-NF-002 | NON_UI | IMPLEMENT | 전역 | INP 설계 목표 |
| REQ-NF-003 | NON_UI | IMPLEMENT | 전역 | CLS 설계 목표 |
| REQ-NF-004 | NON_UI | IMPLEMENT | SCR-001/SCR-004 | 필터 응답 성능 |
| REQ-NF-005 | NON_UI | IMPLEMENT | SCR-003/SCR-004 | 쓰기 동작 응답 성능 |
| REQ-NF-006 | UI_STATE | IMPLEMENT | 전역 | 이미지 responsive/lazy/priority |
| REQ-NF-007 | OPERATIONS | EXCLUDED | 해당없음 | Lighthouse CI 게이트 없음 |

### 4.2 Reliability and Recovery

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-008 | OPERATIONS | EXCLUDED | 해당없음 | 가용성 SLA 모니터링 없음 |
| REQ-NF-009 | OPERATIONS | EXCLUDED | 해당없음 | 5xx 모니터링 없음 |
| REQ-NF-010 | OPERATIONS | EXCLUDED | 해당없음 | 자동 백업 없음 |
| REQ-NF-011 | OPERATIONS | EXCLUDED | 해당없음 | 링크 자동 점검·알림 없음 |

### 4.3 Security and Privacy

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-012 | NON_UI | IMPLEMENT | 전역 | TLS 적용(플랫폼 계층) |
| REQ-NF-013 | NON_UI | IMPLEMENT | 전역 | 인증·역할·RLS 서버 검증 |
| REQ-NF-014 | NON_UI | IMPLEMENT | 전역 | CSRF/SameSite |
| REQ-NF-015 | NON_UI | IMPLEMENT | 전역 | 입력 검증·XSS 방지 |
| REQ-NF-016 | NON_UI | IMPLEMENT | 전역 | 비밀키 환경변수 관리 |
| REQ-NF-017 | NON_UI | IMPLEMENT | SCR-003 | 항공·호텔 원시 입력 미보존 |
| REQ-NF-018 | OPERATIONS | EXCLUDED | 해당없음 | 개인정보 내보내기·삭제 파이프라인 없음 |

### 4.4 Safety and Moderation

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-019 | NON_UI | IMPLEMENT | SCR-004 | 신고 접수 응답 성능 |
| REQ-NF-020 | OPERATIONS | EXCLUDED | 해당없음 | 신고 SLA 계측 대시보드 없음 |
| REQ-NF-021 | OPERATIONS | EXCLUDED | 해당없음 | rate limiting 인프라 없음 |
| REQ-NF-022 | OPERATIONS | EXCLUDED | 해당없음 | Moderator 조치 감사 로그 없음 |

### 4.5 Accessibility

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-023 | UI_STATE | IMPLEMENT | 전역 | WCAG 2.2 AA 설계 목표 |
| REQ-NF-024 | NON_UI | IMPLEMENT | 전역 | axe-core 자동 검사(Playwright, 화면 아님) |
| REQ-NF-025 | NON_UI | IMPLEMENT | 전역 | 키보드·스크린리더 수동 점검 |

### 4.6 Content, Freshness, SEO, Copyright

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-026 | NON_UI | IMPLEMENT | SCR-001 | 여행지 콘텐츠 완전성(데이터 계층) |
| REQ-NF-027 | NON_UI | IMPLEMENT | SCR-001 | 안전정보 커버리지(데이터 계층) |
| REQ-NF-028 | UI_STATE | IMPLEMENT | SCR-001 | 안전정보 stale 경고 표시 |
| REQ-NF-029 | OPERATIONS | EXCLUDED | 해당없음 | 미디어 라이선스 메타데이터 100% 강제 없음 |
| REQ-NF-030 | NON_UI | IMPLEMENT | 전역 | SEO 메타데이터 |

### 4.7 Maintainability, Monitoring, Cost

| ID | UI 분류 | Scope 상태 | 배치 Screen | 배치 위치 |
|---|---|---|---|---|
| REQ-NF-031 | NON_UI | IMPLEMENT | 해당없음 | TS strict/lint/단위테스트(개발 프로세스) |
| REQ-NF-032 | OPERATIONS | EXCLUDED | 해당없음 | 구조화 로그 없음 |
| REQ-NF-033 | OPERATIONS | EXCLUDED | 해당없음 | 장애 알림 없음 |
| REQ-NF-034 | NON_UI | IMPLEMENT | 해당없음 | 월 인프라 비용 목표 |

---

## 5. 집계 및 검증

### 5.1 Requirement 총수 검증

| 구분 | 건수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |

### 5.2 UI 분류별 집계

| UI 분류 | REQ-FUNC | REQ-NF | 합계 |
|---|---:|---:|---:|
| UI_DIRECT | 46 | 0 | 46 |
| UI_STATE | 16 | 3 | 19 |
| NON_UI | 5 | 19 | 24 |
| OPERATIONS | 13 | 12 | 25 |
| **합계** | **80** | **34** | **114** |

### 5.3 Screen별 배치 집계 (UI_DIRECT + UI_STATE 대상)

| Screen | 배치된 Requirement 수 |
|---|---:|
| SCR-001 `/` 메인 | 21 |
| SCR-002 `/about` | 6 |
| SCR-003 `/travel-tools` | 17 |
| SCR-004 `/mates` | 8 |
| SCR-005 `/account` | 6 |
| 전역(모든 Screen 공통) | 6 |
| 기술 Route(디자인 Screen 아님) | 1 |
| **합계** | **65** |

> 65는 UI_DIRECT(46) + UI_STATE(19) 합계와 일치한다. 전역·기술 Route·해당없음(OPERATIONS/NON_UI 데이터·서버 계층) 항목은 특정 디자인 Screen의 화면 요소 수에 포함하지 않는다.

### 5.4 Scope 상태 교차 검증

OPERATIONS로 분류된 25건 중 22건(REQ-FUNC 10건: 042·045·055·056·062·071·072·073·075·076, REQ-NF 12건: 007·008·009·010·011·018·020·021·022·029·032·033)은 `docs/PROJECT_SCOPE.md`의 EXCLUDED와 정확히 일치하며 5개 디자인 Screen에 화면 요소로 배치하지 않았다. 나머지 OPERATIONS 3건(REQ-FUNC-008·046·074)은 IMPLEMENT 상태지만 콘텐츠 수량·완전성 검증 스크립트로 처리되어 화면 요소가 아니므로 Screen에 배치하지 않았다. IMPLEMENT 92건 중 화면 요소가 필요한 65건은 5개 Screen 또는 전역/기술 Route에 배치했다.
