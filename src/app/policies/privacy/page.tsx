import type { Metadata } from "next";
import { generateSEOMetadata, PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata(PAGE_METADATA.privacy);

const POLICY_VERSION = "1.0";
const POLICY_EFFECTIVE_DATE = "2026-09-17";

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-4 py-16 md:px-8">
      <header className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center justify-center rounded-[4px] border border-[#E5E5EA] bg-[#FAFAFA] px-3 py-1 text-[12px] font-semibold leading-[1.3] text-[#6B6B72]">
          버전 {POLICY_VERSION} · {POLICY_EFFECTIVE_DATE}부터 적용
        </span>
        <h1 className="text-[32px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#24242A]">
          개인정보 처리방침
        </h1>
        <p className="text-[16px] leading-[1.625] text-[#45454C]">
          Free Traveler는 회원 가입, 동행 찾기, 안전한 이용을 위해 필요한
          최소한의 개인정보만 수집·처리합니다.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          1. 수집하는 개인정보
        </h2>
        <ul className="flex flex-col gap-2 text-[14px] leading-[1.57] text-[#45454C]">
          <li>계정 정보: 이메일, 비밀번호(암호화 저장), 닉네임</li>
          <li>프로필 정보: 연령대, 성별, 여행 스타일(선택 입력)</li>
          <li>동행 이용 정보: 모집글·신청 메시지 내용, 신고·차단 기록</li>
          <li>정책 동의 정보: 동의한 약관·안전수칙 버전과 동의 시각</li>
        </ul>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          여행지 즐겨찾기는 이용자의 브라우저 <code>localStorage</code>에만
          저장되며 서버로 전송되지 않습니다. 항공·숙소 검색을 위해 입력한
          국가·기간 등 조건도 서버·DB·로그로 전송하지 않고 브라우저 메모리에만
          유지합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          2. 이용 목적
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          회원 인증, 동행 모집글·신청 처리, 신고·차단 기반 안전 조치, 서비스
          개선을 위한 목적으로만 이용합니다. 광고·마케팅 목적으로 개인정보를
          제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          3. 보관과 위탁
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          회원 정보와 동행 관련 데이터는 인증·데이터베이스 처리를 위해
          Supabase에 위탁 보관되며, 접근 제어(RLS)를 통해 본인 또는 권한이 있는
          경우에만 조회할 수 있도록 제한합니다. 회원 탈퇴 시 관련 법령에서 정한
          기간을 제외하고 지체 없이 삭제합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold leading-[1.44] tracking-[-0.005em] text-[#24242A]">
          4. 이용자의 권리
        </h2>
        <p className="text-[14px] leading-[1.57] text-[#45454C]">
          이용자는 자신의 개인정보를 언제든지 조회·수정할 수 있으며, 계정 삭제를
          요청해 관련 정보의 삭제를 요구할 수 있습니다. 동행 모집글·신청
          메시지에 포함된 연락처는 §2(이용약관) 위반이므로 발견 즉시 제출이
          차단됩니다.
        </p>
      </section>
    </div>
  );
}
