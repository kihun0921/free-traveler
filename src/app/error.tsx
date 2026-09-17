"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-white px-6 py-24 text-center">
      <span className="inline-flex items-center justify-center rounded-[4px] border border-[#F8CCC6] bg-[#FDF2F0] px-3 py-1 text-[12px] font-semibold leading-[1.3] text-[#C13515]">
        500
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] font-semibold leading-[1.36] tracking-[-0.01em] text-[#24242A]">
          잠시 문제가 발생했어요
        </h1>
        <p className="max-w-md text-[14px] leading-[1.57] text-[#45454C]">
          페이지를 불러오는 중 오류가 났어요. 다시 시도하거나 홈으로 돌아가
          주세요.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#FF6B4A] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#E85837]"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white px-5 text-[14px] font-semibold text-[#24242A] transition-colors hover:bg-[#FAFAFA]"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
