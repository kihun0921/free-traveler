import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-white px-6 py-24 text-center">
      <span className="inline-flex items-center justify-center rounded-[4px] border border-[#F8CCC6] bg-[#FDF2F0] px-3 py-1 text-[12px] font-semibold leading-[1.3] text-[#C13515]">
        권한 없음
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] font-semibold leading-[1.36] tracking-[-0.01em] text-[#24242A]">
          이 페이지에 접근할 권한이 없어요
        </h1>
        <p className="max-w-md text-[14px] leading-[1.57] text-[#45454C]">
          로그인 상태나 권한이 필요한 화면이에요. 홈으로 돌아가 다른 기능을 먼저
          이용해 주세요.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#FF6B4A] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#E85837]"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
