import type { Metadata } from "next";
import { generateSEOMetadata, PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata(PAGE_METADATA.mateSafety);

const POLICY_VERSION = "1.0";
const POLICY_EFFECTIVE_DATE = "2026-09-17";

export default function MateSafetyPage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-4 py-16 md:px-8">
      <header className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center justify-center rounded-[4px] border border-[#FCE4C0] bg-[#FEF7EC] px-3 py-1 text-[12px] font-semibold leading-[1.3] text-[#B8720A]">
          버전 {POLICY_VERSION} · {POLICY_EFFECTIVE_DATE}부터 적용
        </span>
        <h1 className="text-[32px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#24242A]">
          동행 안전수칙
        </h1>
        <p className="text-[16px] leading-[1.625] text-[#45454C]">
          Free Traveler는 동행 이용자의 신원을 검증하지 않습니다. 아래 수칙을
          반드시 확인한 뒤 동행 모집글을 작성하거나 신청해 주세요.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          1. 연락처는 서비스 안에서만
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          전화번호·이메일·메신저 ID를 모집글이나 신청 메시지에 적지 마세요.
          서비스는 이런 패턴을 자동으로 탐지해 제출을 차단합니다. 연락은 신청이
          승인된 뒤 서비스 안에서 조율해 주세요.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          2. 첫 만남은 공개된 장소에서
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          동행자를 처음 만날 때는 사람이 많은 공개 장소를 선택하고, 숙소나 개인
          공간에서의 만남은 피해 주세요. 가능하면 지인에게 일정과 만남 장소를
          미리 공유해 두세요.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          3. 미성년자 보호
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          동행 모집글 작성과 신청은 성인 인증을 완료한 회원만 이용할 수
          있습니다. 미성년 이용자가 동행 기능에 접근하면 로그인·성인 인증 안내를
          먼저 보여드립니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          4. 신고와 차단
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          불편하거나 위험하다고 느낀 이용자는 모집글·프로필에서 신고할 수 있고,
          이후 상호작용을 원치 않는 이용자는 차단할 수 있습니다. 신고는 운영자가
          확인 후 조치하며, 매너온도나 별점 같은 수치형 평판 표시는 제공하지
          않습니다.
        </p>
      </section>
    </div>
  );
}
