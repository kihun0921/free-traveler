# Free Traveler — Project Scope (PROJECT_SCOPE.md)

- **Document ID:** SCOPE-TRAVEL-001
- **기반 문서:** `docs/01_PRD.md`, `docs/02_SRS_BASELINE.md`
- **적용 대상:** 현재 `package.json`(Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4)과 `src/app` 구조 위에서 진행하는 MVP 구현
- **문서 목적:** SRS의 REQ-FUNC-001~080, REQ-NF-001~034를 각각 IMPLEMENT(직접 구현·테스트) 또는 EXCLUDED(미구현·제외 사유 기록)로 분류하고, 각 항목의 처리 방법과 확인 방법을 정의한다.

---

## 1. 요구사항 상태 정의

| 상태 | 의미 |
|---|---|
| **IMPLEMENT** | 이번 범위에서 직접 구현하고 테스트(Playwright smoke test, 단위 테스트, 수동 QA 중 하나 이상)로 확인한다. SRS 원문과 동일한 수준으로 구현하지 못하고 간소화한 경우 처리 방법에 간소화 내용을 명시한다. |
| **EXCLUDED** | 이번 범위에서 만들지 않는다. 처리 방법 칸에 제외 사유와 대체 방안(있는 경우)을 기록한다. |

---

## 2. 반드시 직접 구현할 범위

1. 핵심 화면 4개(여행지, 비행기 찾기, 호텔 찾기, 동행 찾기)와 보조 화면 1개(국가별 주의사항)
2. 여행지 검색·필터와 상세 패널
3. 국가 안전정보 패널
4. `free_traveler` 대표 소개
5. 항공·숙소 입력·검증·요약·외부 이동
6. Supabase 이메일 인증과 성인 확인
7. 동행글 작성·조회·수정·마감
8. 참가 요청·승인·거절
9. 간단한 차단·신고
10. 내 활동과 간단한 관리자 탭
11. Playwright 핵심 Smoke Test
12. Vercel 배포

## 3. 구현 방식

- 여행지·안전·대표 콘텐츠는 `src/data`의 정적 데이터로 관리한다(관리자 CMS를 통한 DB 편집이 아님).
- 즐겨찾기는 `localStorage`에 저장한다(서버 저장 없음).
- 실제 이메일 알림은 발송하지 않으며 Toast 또는 화면 상태로 대체한다.
- 동행글 자동 마감은 배치 작업이 아니라 조회 시점에 종료일을 계산해 상태를 파생한다.
- 안전정보 stale 여부는 저장된 `verified_at`을 기준으로 렌더링 시 날짜 계산으로 판정한다.
- 이미지는 일반 인터넷 URL과 `alt` 텍스트만 사용한다(별도 라이선스 승인 워크플로 없음).
- 관리자 화면은 신고 상태 변경과 항공·호텔 외부 URL 설정만 다룬다(콘텐츠 CRUD·미디어 승인·감사 로그 등은 제외).

## 4. 제외 기능

| 제외 항목 | 사유 |
|---|---|
| 전체 콘텐츠 CMS | 콘텐츠는 `src/data` 정적 데이터로 대체하며 관리자 DB 편집 화면은 만들지 않는다. |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지는 외부 URL과 alt 텍스트만 사용하고 별도 승인 절차를 두지 않는다. |
| 범용 감사 로그 | 관리자 조치를 이력화하는 공용 audit log 시스템을 구축하지 않는다. |
| 자동 백업·장애 알림·부하 테스트 | 운영 자동화·모니터링 인프라는 이번 범위에서 구축하지 않는다. |
| 외부 이메일 사업자 연동 | SendGrid 등 별도 이메일 발송 사업자를 연동하지 않는다(Supabase Auth 기본 인증 메일은 예외로 허용). |
| EC2·AWS 인프라 | 배포는 Vercel과 Supabase만 사용한다. |
| 무인 자동 Merge Runner | 배포·병합은 수동으로 진행한다. |

---

## 5. 요구사항 매핑 — Functional Requirements (REQ-FUNC-001~080)

### 5.1 F1. Destination Guide

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | 국내/해외 탭으로 `src/data` 여행지 목록을 구분 렌더링 | Playwright smoke test |
| REQ-FUNC-002 | IMPLEMENT | 국가·도시·계절·테마·기간 필터를 클라이언트에서 AND 조건으로 적용 | 수동 QA + Playwright |
| REQ-FUNC-003 | IMPLEMENT | 여행지명·국가명·테마 대상 한글 부분 일치 키워드 검색 | 수동 QA |
| REQ-FUNC-004 | IMPLEMENT | 상세 패널에 소개·명소 5개 이상·추천 시기·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일 표시, 정적 데이터 스키마로 필드 강제 | 정적 데이터 검증 스크립트 |
| REQ-FUNC-005 | IMPLEMENT | 필터 결과 없음 시 조건 완화 안내와 초기화 버튼 표시 | Playwright smoke test |
| REQ-FUNC-006 | IMPLEMENT | 해외 여행지 상세에서 `country_code` 기준 안전정보 페이지로 연결 | 수동 QA |
| REQ-FUNC-007 | IMPLEMENT (간소화) | 대표 이미지에 alt 텍스트와 출처 URL만 기록(라이선스 승인 절차 없음) | 정적 데이터 검증 스크립트 |
| REQ-FUNC-008 | IMPLEMENT | `src/data` 국내 10개 이상, 해외 15개국 30개 도시 이상 등록 | 정적 데이터 검증 스크립트 |
| REQ-FUNC-009 | IMPLEMENT | 동일 국가·테마 관련 여행지 최대 6개 상세 하단 노출 | 수동 QA |
| REQ-FUNC-010 | IMPLEMENT | 허용된 필터만 URL query로 직렬화, 잘못된 값 무시 | 수동 QA |

### 5.2 F2. Flight Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | 국가·지역·출발일·귀국일 4개 필수 입력 필드 제공 | Playwright smoke test |
| REQ-FUNC-012 | IMPLEMENT | 국가 변경 시 지역 옵션 재계산 및 기존 값 초기화 | 수동 QA |
| REQ-FUNC-013 | IMPLEMENT | 과거 출발일·역전 날짜 클라이언트 검증 후 제출 차단 | Playwright smoke test |
| REQ-FUNC-014 | IMPLEMENT | 검증 통과 후 브라우저 상태 기반 요약 단계 표시 | Playwright smoke test |
| REQ-FUNC-015 | IMPLEMENT | 폼·요약에 "입력값은 외부 사이트로 전달되지 않습니다" 고지 | 수동 QA |
| REQ-FUNC-016 | IMPLEMENT | 환경변수 `FLIGHT_OUTBOUND_URL`을 `noopener,noreferrer` 새 탭으로 오픈, query 없음 | Playwright smoke test |
| REQ-FUNC-017 | IMPLEMENT | 항공 폼 전용 서버 API를 만들지 않고 클라이언트 상태로만 처리 | 코드 리뷰 + 네트워크 탭 수동 점검 |
| REQ-FUNC-018 | IMPLEMENT | URL 미설정·허용목록 밖일 때 이동 차단, Toast 오류와 재시도 버튼 제공 | 수동 QA |

### 5.3 F3. Hotel Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | 국가·지역·체크인·체크아웃 4개 필수 입력 필드 제공 | Playwright smoke test |
| REQ-FUNC-020 | IMPLEMENT | 국가 변경 시 지역 옵션 재계산 및 초기화 | 수동 QA |
| REQ-FUNC-021 | IMPLEMENT | 과거 체크인·체크아웃 역전/동일 값 검증 후 제출 차단 | Playwright smoke test |
| REQ-FUNC-022 | IMPLEMENT | 검증 통과 후 요약 단계에 폼 입력값 그대로 표시 | 수동 QA |
| REQ-FUNC-023 | IMPLEMENT | 폼·요약에 비전달 고지 문구 표시 | 수동 QA |
| REQ-FUNC-024 | IMPLEMENT | 환경변수 `HOTEL_OUTBOUND_URL`을 `noopener,noreferrer` 새 탭으로 오픈 | Playwright smoke test |
| REQ-FUNC-025 | IMPLEMENT | 호텔 폼 전용 서버 API 없이 클라이언트 상태로만 처리 | 코드 리뷰 + 네트워크 탭 수동 점검 |
| REQ-FUNC-026 | IMPLEMENT | URL 오류 시 이동 차단, 현재 입력값 유지 + Toast 오류 표시 | 수동 QA |

### 5.4 F4. Travel Mate

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | Supabase Auth 이메일 인증 세션을 동행 쓰기 API/Server Action 전제 조건으로 요구 | Vitest 통합 테스트 |
| REQ-FUNC-028 | IMPLEMENT | `is_adult`, `adult_verified_at`만 저장, 생년월일 미저장 | 수동 QA + 데이터 스키마 검토 |
| REQ-FUNC-029 | IMPLEMENT | 닉네임·연령대·여행 스타일 필수, 성별 선택 프로필 폼 | Playwright smoke test |
| REQ-FUNC-030 | IMPLEMENT | 국가·지역·기간 겹침·연령대·성별·스타일·모집상태 필터, 차단 사용자 글 제외 | 수동 QA |
| REQ-FUNC-031 | IMPLEMENT | 제목·국가·지역·기간·인원·조건·설명·안전수칙 동의 입력, 클라이언트+서버 검증 | Playwright smoke test |
| REQ-FUNC-032 | IMPLEMENT | 정규식 기반 전화번호·이메일·메신저 ID 패턴 탐지 후 제출 차단 | Vitest 단위 테스트 |
| REQ-FUNC-033 | IMPLEMENT | 응답 payload에서 이메일·전화번호 필드 제외 | 코드 리뷰 + Vitest |
| REQ-FUNC-034 | IMPLEMENT | 500자 이하 비공개 참가 메시지 제출, 작성자·요청자만 열람 | Playwright smoke test |
| REQ-FUNC-035 | IMPLEMENT | 사용자·글 조합 unique 제약 및 UI 중복 오류 처리 | Vitest 통합 테스트 |
| REQ-FUNC-036 | IMPLEMENT | 작성자만 PENDING → ACCEPTED/REJECTED 전이 가능, 타 사용자 403 | Vitest 통합 테스트 |
| REQ-FUNC-037 | IMPLEMENT (간소화) | 배치 작업 대신 조회 시점에 `end_date` 경과 여부를 계산해 CLOSED로 표시 | 수동 QA |
| REQ-FUNC-038 | IMPLEMENT | 작성자의 수동 마감·수정·삭제, 승인된 요청자가 있으면 경고 표시 | 수동 QA |
| REQ-FUNC-039 | IMPLEMENT | 사유 코드·설명 기반 신고 접수, 접수번호 즉시 반환 | Playwright smoke test |
| REQ-FUNC-040 | IMPLEMENT | 사용자 간 차단·해제, 차단 시 상호 글·프로필·요청 미노출 | Vitest 통합 테스트 |
| REQ-FUNC-041 | IMPLEMENT (간소화) | `/my` 관리자 탭에서 신고 상태(OPEN/RESOLVED/DISMISSED)만 필터·표시(우선순위·증거 큐는 미구현) | 수동 QA |
| REQ-FUNC-042 | EXCLUDED | 경고·콘텐츠 숨김·계정 일시 제한 등 별도 제재 액션 세트는 만들지 않는다. 관리자는 신고 상태 변경만 수행하며, 필요 시 데이터베이스에서 수동 처리한다. | — |
| REQ-FUNC-043 | IMPLEMENT (간소화) | 실제 이메일 발송 없이 인앱 Toast/화면 상태로 접수·승인·거절·신고 결과 안내 | 수동 QA |
| REQ-FUNC-044 | IMPLEMENT | Supabase RLS로 본인 글/요청, 대상 작성자, 관리자만 비공개 데이터 열람 | 권한별 부정 접근 테스트(Vitest) |
| REQ-FUNC-045 | EXCLUDED | 탈퇴 시 비식별화 및 30일 이내 개인정보 삭제 파이프라인은 구축하지 않는다. 탈퇴는 계정 비활성화 수준으로 처리한다. | — |

### 5.5 F5. Country Safety

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | `src/data` 안전정보에 소개되는 모든 해외 국가 1건 이상 등록 | 정적 데이터 검증 스크립트 |
| REQ-FUNC-047 | IMPLEMENT | 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 섹션 스키마로 강제 | 정적 데이터 검증 스크립트 |
| REQ-FUNC-048 | IMPLEMENT | 출처명·URL·최종 확인일·편집자 필드를 정적 데이터에 포함 | 정적 데이터 검증 스크립트 |
| REQ-FUNC-049 | IMPLEMENT | 외교부 해외안전여행 링크를 `noopener,noreferrer` 새 탭으로 제공 | 수동 QA |
| REQ-FUNC-050 | IMPLEMENT | `verified_at` 기준 렌더링 시 7일 경과 여부 계산 후 stale 경고 표시 | Playwright smoke test |
| REQ-FUNC-051 | IMPLEMENT | 여행금지·출국권고 등 경보 텍스트를 본문 상단에 표시(색상 단독 사용 금지) | 수동 QA |
| REQ-FUNC-052 | IMPLEMENT | `scope_type`/`scope_text`로 국가 전체·지역 경보 구분 표시 | 수동 QA |
| REQ-FUNC-053 | IMPLEMENT | 현지 긴급전화·영사콜센터 연결 정보 표시 | 수동 QA |
| REQ-FUNC-054 | IMPLEMENT | 안전정보가 공식 판단을 대체하지 않는다는 고지 문구 표시 | 수동 QA |
| REQ-FUNC-055 | EXCLUDED | Editor/Admin의 작성·검수·게시·보관 워크플로는 만들지 않는다. 안전정보는 `src/data` 정적 파일 수정으로 갱신한다. | — |
| REQ-FUNC-056 | EXCLUDED | 이전값·새값·사유·담당자 변경 이력 보존(감사 로그)은 만들지 않는다. Git 커밋 이력으로 대체한다. | — |

### 5.6 F6. About free_traveler

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | 대표명 `free_traveler`, `50+ Trips`, `30+ Countries`를 단일 정적 데이터 소스에서 표시 | 수동 QA |
| REQ-FUNC-058 | IMPLEMENT | 확정 소개문·여행 철학·편집 원칙 전문 표시 | 수동 QA |
| REQ-FUNC-059 | IMPLEMENT | 방문 국가 목록(권역 포함) 정적 데이터로 30개국 이상 표시 | 정적 데이터 검증 스크립트 |
| REQ-FUNC-060 | IMPLEMENT | 연도·장소·요약을 포함한 여행 타임라인 표시 | 수동 QA |
| REQ-FUNC-061 | IMPLEMENT (간소화) | 대표 이미지에 alt 텍스트와 출처 URL만 기록(라이선스 승인 워크플로 없음) | 정적 데이터 검증 스크립트 |
| REQ-FUNC-062 | EXCLUDED | "관리자 설정 기반" 문의·SNS 링크 편집 화면은 만들지 않는다. 문의·SNS 링크는 `src/data` 정적 값으로 제공한다. | — |
| REQ-FUNC-063 | IMPLEMENT | 대표 추천 여행지 6개를 공개 여행지 상세로 연결, 비공개 제외 | 수동 QA |

### 5.7 F7. Common, Admin, Governance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 공통 레이아웃에 전역 내비게이션·푸터 배치 | Playwright smoke test |
| REQ-FUNC-065 | IMPLEMENT | Tailwind 기반 320px~데스크톱 반응형 레이아웃 | 수동 QA(모바일 뷰포트) |
| REQ-FUNC-066 | IMPLEMENT | Supabase Auth로 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 제공(Supabase 기본 인증 메일 사용, 별도 이메일 사업자 연동 아님) | Playwright smoke test |
| REQ-FUNC-067 | IMPLEMENT | 여행지·안전정보 통합 키워드 검색과 결과 유형 라벨 표시 | 수동 QA |
| REQ-FUNC-068 | IMPLEMENT | `localStorage` 기반 여행지 즐겨찾기 추가·해제·목록 조회, 중복 방지 | 수동 QA |
| REQ-FUNC-069 | IMPLEMENT | Web Share API 우선 사용, 실패 시 URL 복사로 폴백 | 수동 QA |
| REQ-FUNC-070 | IMPLEMENT | 공개 페이지별 title/description/canonical/OG 메타데이터 제공 | 수동 QA(메타 태그 점검) |
| REQ-FUNC-071 | EXCLUDED | 별도 분석 이벤트 스키마·파이프라인은 구축하지 않는다. Vercel 기본 웹 분석 범위로 대체한다. | — |
| REQ-FUNC-072 | EXCLUDED | Editor/Admin 여행지 콘텐츠 CRUD·상태 워크플로(DRAFT/REVIEW/PUBLISHED/ARCHIVED)는 만들지 않는다. `src/data` 파일 편집으로 대체한다. | — |
| REQ-FUNC-073 | EXCLUDED | 미디어 업로드 시 출처·작가·라이선스·원문 URL 필수 입력 워크플로는 만들지 않는다. alt 텍스트와 출처 URL만 정적 데이터에 기록한다. | — |
| REQ-FUNC-074 | IMPLEMENT (간소화) | 관리자 UI 게이트 대신 `src/data` 필수 필드를 검사하는 스크립트/단위 테스트로 완전성 검증 | 정적 데이터 검증 스크립트 |
| REQ-FUNC-075 | EXCLUDED | stale 현황·담당자 대시보드는 만들지 않는다. 안전정보 stale 표시(REQ-FUNC-050)는 공개 페이지에서만 제공한다. | — |
| REQ-FUNC-076 | EXCLUDED | 관리자 변경·신고 처리·권한 변경에 대한 범용 감사 로그는 만들지 않는다. | — |
| REQ-FUNC-077 | IMPLEMENT | Admin 탭에서 항공·호텔 외부 URL을 HTTPS 허용목록으로 설정, HTTP/`javascript:`/`data:` 저장 차단 | Vitest 단위 테스트 |
| REQ-FUNC-078 | IMPLEMENT | 404/500/권한 없음/외부 연결 실패 화면에 홈·이전·재시도 중 최소 1개 행동 제공 | Playwright smoke test |
| REQ-FUNC-079 | IMPLEMENT | 폼·모달·탭·알림에 시맨틱 HTML과 ARIA 상태 적용 | 코드 리뷰 + 수동 키보드 점검 |
| REQ-FUNC-080 | IMPLEMENT | 이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책 안내 정적 페이지 제공, 모집글 작성 시 정책 버전과 동의 시각 저장 | 수동 QA + Vitest |

---

## 6. 요구사항 매핑 — Non-Functional Requirements (REQ-NF-001~034)

### 6.1 Performance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-001 | IMPLEMENT | 이미지 최적화·서버 컴포넌트 활용으로 LCP p75 2.5초 이하를 설계 목표로 관리 | 수동 Lighthouse 점검 |
| REQ-NF-002 | IMPLEMENT | 무거운 클라이언트 로직 최소화로 INP 200ms 이하를 설계 목표로 관리 | 수동 Lighthouse 점검 |
| REQ-NF-003 | IMPLEMENT | 이미지·폰트 크기 고정, 레이아웃 시프트 방지 | 수동 Lighthouse 점검 |
| REQ-NF-004 | IMPLEMENT | 정적 데이터 기반 클라이언트 필터로 p95 1초 이하 달성 | 수동 QA |
| REQ-NF-005 | IMPLEMENT | Server Action 응답을 p95 3초 이하로 설계 | 수동 QA |
| REQ-NF-006 | IMPLEMENT | `next/image` responsive size·lazy load·LCP 이미지 priority 적용 | 코드 리뷰 |
| REQ-NF-007 | EXCLUDED | Lighthouse CI 성능 예산 게이트는 구축하지 않는다(부하 테스트 인프라 제외 범위와 연계). | — |
| REQ-NF-008 | EXCLUDED | 월간 가용성 99.5% SLA 측정·모니터링 인프라는 구축하지 않는다. Vercel 플랫폼 기본 가용성에 의존한다. | — |
| REQ-NF-009 | EXCLUDED | 내부 API 5xx 비율 모니터링은 별도 구축하지 않는다. | — |
| REQ-NF-010 | EXCLUDED | DB 자동 백업/RPO·RTO 설계는 만들지 않는다(자동 백업 제외 항목). | — |
| REQ-NF-011 | EXCLUDED | 외부 링크 주간 자동 검사·관리자 알림은 만들지 않는다. 배포 전 수동 링크 점검으로 대체한다. | — |
| REQ-NF-012 | IMPLEMENT | Vercel·Supabase 기본 TLS 1.2+ 적용 | 수동 SSL 설정 점검 |
| REQ-NF-013 | IMPLEMENT | Supabase Auth + RLS 정책으로 인증·역할을 서버에서 검증 | 권한별 부정 접근 테스트(Vitest) |
| REQ-NF-014 | IMPLEMENT | Server Action 동일 출처 보호와 SameSite 쿠키 설정 적용 | 코드 리뷰 |
| REQ-NF-015 | IMPLEMENT | 입력값 서버 검증과 React 자동 이스케이프로 저장 XSS 차단 | Vitest 단위 테스트 |
| REQ-NF-016 | IMPLEMENT | Supabase 키 등 비밀값은 서버 전용 환경변수로 관리, 클라이언트 번들 미포함 | 빌드 산출물 수동 점검 |
| REQ-NF-017 | IMPLEMENT | 항공·호텔 원시 입력값을 서버 API·로그·DB에 저장하지 않음 | 네트워크 탭 + 코드 리뷰 |
| REQ-NF-018 | EXCLUDED | 개인정보 내보내기·자동 삭제 파이프라인은 구축하지 않는다(REQ-FUNC-045와 동일 사유). | — |
| REQ-NF-019 | IMPLEMENT | 신고 접수 Server Action을 p95 3초 이하로 설계 | 수동 QA |
| REQ-NF-020 | EXCLUDED | 신고 1차 검토 24시간 90% SLA 계측 대시보드는 만들지 않는다. 운영자가 관리자 탭에서 수동 처리한다. | — |
| REQ-NF-021 | EXCLUDED | 별도 rate limiting 인프라는 구축하지 않는다(부하 대응 인프라 제외 범위와 연계). | — |
| REQ-NF-022 | EXCLUDED | Moderator 조치의 감사 로그 추적성은 제공하지 않는다(범용 감사 로그 제외). | — |
| REQ-NF-023 | IMPLEMENT | WCAG 2.2 Level AA를 설계 목표로 시맨틱 마크업·명도 대비 적용 | 수동 접근성 점검 |
| REQ-NF-024 | IMPLEMENT | Playwright smoke test에 axe-core 자동 검사 포함 | Playwright + axe-core |
| REQ-NF-025 | IMPLEMENT | 핵심 화면 키보드 탐색·스크린리더 수동 점검 | 수동 QA |
| REQ-NF-026 | IMPLEMENT | `src/data` 여행지 필수 필드를 스키마로 강제 | 정적 데이터 검증 스크립트 |
| REQ-NF-027 | IMPLEMENT | 소개되는 해외 국가 전체에 안전정보 등록 | 정적 데이터 검증 스크립트 |
| REQ-NF-028 | IMPLEMENT | `verified_at` 기준 렌더링 시 stale 경고 표시(수치 목표 95%는 콘텐츠 운영 기준으로 별도 관리) | 수동 QA |
| REQ-NF-029 | EXCLUDED | 공개 미디어 100% 라이선스 메타데이터 강제는 하지 않는다. alt 텍스트와 출처 URL만 요구한다(미디어 라이선스 워크플로 제외). | — |
| REQ-NF-030 | IMPLEMENT | 공개 페이지 SEO 메타데이터 누락 0건을 목표로 구현 | 수동 QA(메타 태그 점검) |
| REQ-NF-031 | IMPLEMENT | TypeScript strict 모드, ESLint, Vitest 단위 테스트를 main 병합 전 통과 조건으로 운영 | CI 스크립트(lint/build/test) |
| REQ-NF-032 | EXCLUDED | `request_id` 포함 구조화 로그 시스템은 구축하지 않는다. Vercel 기본 로그로 대체한다. | — |
| REQ-NF-033 | EXCLUDED | 5xx 비율·외부 링크 실패에 대한 5분 이내 알림 체계는 구축하지 않는다(장애 알림 제외 항목). | — |
| REQ-NF-034 | IMPLEMENT | Vercel·Supabase 무료/저비용 티어로 월 인프라 비용 10만원 이하 설계 | 수동 비용 점검 |

---

## 7. 요약

| 구분 | 총 건수 | IMPLEMENT | EXCLUDED |
|---|---:|---:|---:|
| REQ-FUNC | 80 | 70 | 10 |
| REQ-NF | 34 | 22 | 12 |
| 합계 | 114 | 92 | 22 |

EXCLUDED 10개 REQ-FUNC: REQ-FUNC-042, 045, 055, 056, 062, 071, 072, 073, 075, 076
EXCLUDED 12개 REQ-NF: REQ-NF-007, 008, 009, 010, 011, 018, 020, 021, 022, 029, 032, 033

모든 EXCLUDED 항목은 4절의 제외 기능(전체 콘텐츠 CMS, 미디어 업로드·라이선스 승인 워크플로, 범용 감사 로그, 자동 백업·장애 알림·부하 테스트, 외부 이메일 사업자 연동)과 직접 연결되며, 별도 자동화 인프라 없이는 충족할 수 없는 항목만 제외했다.
