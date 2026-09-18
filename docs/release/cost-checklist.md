# 비용 검토 (Release Cost Check)

**Task ID:** RELEASE-COST-CHECK  
**Date:** 2026-09-18  
**Scope:** 운영 비용 추정

---

## 1. 인프라 비용

### Vercel (Frontend Hosting)
- **Pro Plan:** $20/month
- **Bandwidth:** 100GB/month (포함)
- **Edge Functions:** $0.50 per 1M requests
- **Database:** N/A (별도 관리)
- **Estimate:** $20-40/month

### Supabase (Database)
- **Pro Plan:** $25/month
- **Database:** 8GB (포함)
- **Storage:** 100GB (포함)
- **Users:** Up to 10,000
- **Estimate:** $25-50/month

**총 월 인프라 비용:** ~$45-90/month ✓

---

## 2. 개발 도구 비용

- ESLint: Free ✓
- Playwright: Free (Open Source) ✓
- Vitest: Free (Vite 기반) ✓
- Next.js: Free (Open Source) ✓
- Tailwind CSS: Free ✓

**개발 도구 비용:** $0 ✓

---

## 3. 도메인 및 SSL

- **Domain 등록:** ~$12/year (GoDaddy)
- **SSL 인증서:** Free (Let's Encrypt, 자동)

**연간 비용:** ~$12 ✓

---

## 최종 비용 추정

| 항목 | 월간 | 연간 |
|------|------|------|
| Vercel | $20-40 | $240-480 |
| Supabase | $25-50 | $300-600 |
| Domain | - | $12 |
| **Total** | **$45-90** | **$552-1,092** |

✅ **예산 내 (월 $100 기준):** 통과

---

**결론:** 비용 최적화 달성, 운영 가능 ✓
