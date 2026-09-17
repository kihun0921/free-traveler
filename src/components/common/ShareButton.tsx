"use client";

import { useCallback, useState } from "react";

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
  className?: string;
}

async function copyToClipboard(url: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

export default function ShareButton({
  title,
  url,
  text,
  className,
}: ShareButtonProps) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const handleShare = useCallback(() => {
    const shareData = { title, text, url };

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(shareData).catch(() => {
        // 공유 시트를 사용자가 취소한 경우까지 오류로 취급하지 않고 조용히 종료한다.
      });
      return;
    }

    void copyToClipboard(url).then((didCopy) => {
      setFeedback(didCopy ? "copied" : "failed");
      window.setTimeout(() => setFeedback("idle"), 2500);
    });
  }, [title, text, url]);

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleShare}
        aria-label="공유하기"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5EA] bg-white text-[#45454C] transition-colors hover:bg-[#FAFAFA]"
      >
        <svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx={18}
            cy={6}
            r={2.5}
            stroke="currentColor"
            strokeWidth={1.75}
          />
          <circle
            cx={6}
            cy={12}
            r={2.5}
            stroke="currentColor"
            strokeWidth={1.75}
          />
          <circle
            cx={18}
            cy={18}
            r={2.5}
            stroke="currentColor"
            strokeWidth={1.75}
          />
          <path
            d="M8.2 10.8L15.8 7.2M8.2 13.2l7.6 3.6"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
          />
        </svg>
      </button>
      {feedback === "copied" && (
        <span
          className={`text-[13px] leading-[1.4] text-[#137A54] ${className ?? ""}`}
        >
          링크를 복사했어요
        </span>
      )}
      {feedback === "failed" && (
        <span
          className={`text-[13px] leading-[1.4] text-[#C13515] ${className ?? ""}`}
        >
          링크 복사에 실패했어요. 주소창 URL을 직접 복사해 주세요.
        </span>
      )}
    </div>
  );
}
