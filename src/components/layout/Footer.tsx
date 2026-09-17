import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "서비스",
    links: [
      { href: "/", label: "여행지 둘러보기" },
      { href: "/travel-tools", label: "항공·숙소 준비" },
      { href: "/mates", label: "동행 찾기" },
      { href: "/", label: "국가별 안전정보" },
    ],
  },
  {
    title: "회사",
    links: [
      { href: "/about", label: "대표 소개" },
      { href: "mailto:hello@freetraveler.app", label: "문의하기" },
    ],
  },
  {
    title: "이용 정책",
    links: [
      { href: "/policies/terms", label: "이용약관" },
      { href: "/policies/privacy", label: "개인정보 처리방침" },
      { href: "/policies/mate-safety", label: "동행 안전수칙" },
      { href: "/policies/content-disclaimer", label: "콘텐츠 면책 안내" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#EEEEF0] bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-10 md:flex-row md:justify-between md:gap-8 md:px-8 md:py-16">
        {FOOTER_COLUMNS.map((column) => (
          <details
            key={column.title}
            open
            className="border-b border-[#EEEEF0] pb-4 md:flex-1 md:border-none md:pb-0"
          >
            <summary className="cursor-pointer text-[14px] font-semibold text-[#24242A] md:pointer-events-none md:cursor-default">
              {column.title}
            </summary>
            <ul className="mt-3 flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-[14px] leading-[1.57] text-[#45454C] transition-colors hover:text-[#24242A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 border-t border-[#EEEEF0] px-4 py-6 md:px-8">
        <p className="text-[13px] leading-[1.4] text-[#6B6B72]">
          Free Traveler는 항공·숙소 예약을 대행하지 않으며 외부 사이트로 연결만
          제공합니다.
        </p>
        <p className="text-[13px] leading-[1.4] text-[#6B6B72]">
          안전정보는 외교부 해외안전여행 공식 발표를 기준으로 하며 출국 전
          원문을 직접 확인하시기 바랍니다.
        </p>
        <p className="text-[13px] leading-[1.4] text-[#6B6B72]">
          © {new Date().getFullYear()} Free Traveler
        </p>
      </div>
    </footer>
  );
}
