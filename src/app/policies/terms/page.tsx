import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | Free Traveler",
};

const POLICY_VERSION = "1.0";
const POLICY_EFFECTIVE_DATE = "2026-09-17";

export default function TermsPage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-4 py-16 md:px-8">
      <header className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center justify-center rounded-[4px] border border-[#E5E5EA] bg-[#FAFAFA] px-3 py-1 text-[12px] font-semibold leading-[1.3] text-[#6B6B72]">
          버전 {POLICY_VERSION} · {POLICY_EFFECTIVE_DATE}부터 적용
        </span>
        <h1 className="text-[32px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#24242A]">
          이용약관
        </h1>
        <p className="text-[16px] leading-[1.625] text-[#45454C]">
          이 약관은 Free Traveler(이하 &ldquo;서비스&rdquo;)가 제공하는 여행지
          정보, 여행 준비 도구, 동행 찾기 기능의 이용 조건을 안내합니다.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          1. 서비스의 성격
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          서비스는 항공권·숙소 예약을 대행하지 않습니다. 여행지·안전정보를
          정리해 보여주고, 이용자가 입력한 조건으로 항공·숙소 검색 외부 사이트로
          연결만 제공하며, 이용자 간 동행을 찾을 수 있는 게시판을 운영합니다.
          실제 예약·결제는 항상 외부 사이트에서 이루어지며, 서비스는 그 결과에
          관여하지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          2. 이용자의 의무
        </h2>
        <ul className="flex flex-col gap-2 text-[14px] leading-[1.57] text-[#45454C]">
          <li>가입·프로필 정보는 사실대로 입력합니다.</li>
          <li>
            동행 모집글·신청 메시지에 전화번호·이메일·메신저 ID 등 연락처를 직접
            노출하지 않습니다.
          </li>
          <li>
            다른 이용자를 상대로 상업적 홍보, 불법 행위, 괴롭힘을 하지 않습니다.
          </li>
          <li>
            신고·차단 기능을 악용해 특정 이용자를 부당하게 배제하지 않습니다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          3. 콘텐츠와 책임
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          동행 모집글과 신청 메시지의 내용은 작성한 이용자 본인이 책임집니다.
          서비스는 게시글 내용의 사실 여부를 보증하지 않으며, 안전을 위해
          신고·차단 기능을 제공합니다. 여행지· 안전정보는 §3(콘텐츠 면책 안내)에
          따라 별도로 안내합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          4. 서비스 변경과 약관 개정
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          서비스는 운영상 필요에 따라 기능을 추가·변경·중단할 수 있습니다.
          약관을 변경하는 경우 변경된 버전 번호와 적용일을 이 페이지에 표시하며,
          동행 모집글 작성 시 동의한 약관 버전과 동의 시각을 기록합니다.
        </p>
      </section>
    </div>
  );
}
