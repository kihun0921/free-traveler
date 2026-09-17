"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-white px-6 py-24 text-center">
      <span className="inline-flex items-center justify-center rounded-[4px] border border-[#F8CCC6] bg-[#FDF2F0] px-3 py-1 text-[12px] font-semibold leading-[1.3] text-[#C13515]">
        404
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] font-semibold leading-[1.36] tracking-[-0.01em] text-[#24242A]">
          찾을 수 없는 페이지예요
        </h1>
        <p className="max-w-md text-[14px] leading-[1.57] text-[#45454C]">
          주소가 바뀌었거나 삭제된 페이지일 수 있어요. 홈으로 돌아가거나 이전
          화면으로 이동해 주세요.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#FF6B4A] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#E85837]"
        >
          홈으로 가기
        </Link>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-12 items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white px-5 text-[14px] font-semibold text-[#24242A] transition-colors hover:bg-[#FAFAFA]"
        >
          이전 페이지로
        </button>
      </div>
    </div>
  );
}
