import type { Metadata } from "next";
import { generateSEOMetadata, PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata(PAGE_METADATA.contentDisclaimer);

const POLICY_VERSION = "1.0";
const POLICY_EFFECTIVE_DATE = "2026-09-17";

export default function ContentDisclaimerPage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-4 py-16 md:px-8">
      <header className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center justify-center rounded-[4px] border border-[#E5E5EA] bg-[#FAFAFA] px-3 py-1 text-[12px] font-semibold leading-[1.3] text-[#6B6B72]">
          버전 {POLICY_VERSION} · {POLICY_EFFECTIVE_DATE}부터 적용
        </span>
        <h1 className="text-[32px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#24242A]">
          콘텐츠 면책 안내
        </h1>
        <p className="text-[16px] leading-[1.625] text-[#45454C]">
          Free Traveler가 제공하는 여행지·안전정보·동행 콘텐츠를 이용하기 전
          아래 내용을 확인해 주세요.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          1. 여행지·안전정보의 성격
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          여행지 소개와 국가별 주의사항은 서비스가 직접 작성·정리한 정적
          정보이며, 각 항목에 출처와 최종 확인일을 함께 표시합니다. 실시간으로
          갱신되지 않으므로, 안전정보는 반드시 외교부 해외안전여행 공식 발표
          원문을 출국 전 다시 확인해 주세요.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          2. 항공·숙소 정보의 성격
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          서비스는 항공권·숙소 가격이나 예약 가능 여부를 직접 제공하지 않습니다.
          입력한 조건을 바탕으로 외부 검색 사이트로 연결만 제공하며, 실제
          가격·조건·예약은 해당 외부 사이트에서 확인해야 합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          3. 동행 콘텐츠의 성격
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          동행 모집글과 신청 메시지는 작성한 이용자가 직접 입력한 내용입니다.
          서비스는 그 내용의 사실 여부나 작성자의 신원을 검증하지 않으며, 이용자
          간 분쟁이나 피해에 대해 책임을 지지 않습니다. 위험 요소를 발견하면
          신고·차단 기능을 이용해 주세요.
        </p>
      </section>
    </div>
  );
}
