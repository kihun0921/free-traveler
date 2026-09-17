"use client";

import type { SafetyInfo } from "@/data/safety";
import SAFETY_INFO from "@/data/safety";

interface SafetyDrawerProps {
  countryCode?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SafetyDrawer({
  countryCode,
  isOpen,
  onClose,
}: SafetyDrawerProps) {
  const safetyData: SafetyInfo | undefined = countryCode
    ? SAFETY_INFO.find((s: SafetyInfo) => s.countryCode === countryCode)
    : undefined;

  if (!isOpen || !safetyData) return null;

  const isStale = (() => {
    const lastVerified = new Date(safetyData.lastVerifiedAt);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - lastVerified.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff > 7;
  })();

  const categoryLabels: Record<string, string> = {
    health: "보건·의료",
    crime: "치안·소매치기",
    disaster: "자연재해",
    political: "정치 안정성",
    transportation: "교통 안전",
    terrorism: "테러 위협",
    fraud: "사기·사취",
    emergency: "긴급연락처",
  };

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-lg sm:rounded-l-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-title"
      >
        {/* Header */}
        <div className="sticky top-0 border-b border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2
                id="safety-title"
                className="text-2xl font-bold text-gray-900"
              >
                {safetyData.country}
              </h2>
              <p className="mt-1 text-sm text-gray-600">안전정보</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close drawer"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stale Warning (if 7+ days) */}
          {isStale && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                ⚠️ 재확인 필요
              </p>
              <p className="mt-1 text-sm text-amber-800">
                마지막 업데이트:{" "}
                {new Date(safetyData.lastVerifiedAt).toLocaleDateString(
                  "ko-KR"
                )}
              </p>
            </div>
          )}

          {/* Critical Alert (if applicable) */}
          {(safetyData.scopeType === "advisory" ||
            safetyData.scopeType === "caution") && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-900">
                🚨 {safetyData.scopeText}
              </p>
            </div>
          )}

          {/* Scope Information */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              범위
            </p>
            <p className="mt-2 text-sm text-gray-900">
              {safetyData.scopeType === "general"
                ? "전국 안전 정보"
                : safetyData.scopeType === "caution"
                  ? "지역별 주의사항"
                  : "출국 권고"}
            </p>
          </div>

          {/* 8 Required Categories */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              안전정보 8개 분류
            </p>
            {safetyData.categories.map(
              (cat: { category: string; description: string }) => (
                <div
                  key={cat.category}
                  className="border-l-4 border-blue-200 pl-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {categoryLabels[cat.category]}
                  </h3>
                  <p className="mt-1 text-sm text-gray-700">
                    {cat.description}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              긴급연락처
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-gray-600">경찰</p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {safetyData.emergencyContacts.police}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">구급차</p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {safetyData.emergencyContacts.ambulance}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">한국 영사콜센터</p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {safetyData.emergencyContacts.koreaEmbassy}
                </p>
              </div>
            </div>
          </div>

          {/* Source and Ministry Link */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              정보 출처
            </p>
            <p className="mt-2 text-sm text-gray-700">
              최종 확인:{" "}
              {new Date(safetyData.lastVerifiedAt).toLocaleDateString(
                "ko-KR"
              )}
            </p>
            {safetyData.sourceUrl && (
              <a
                href={safetyData.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                자세히 보기 →
              </a>
            )}
            <a
              href="https://www.mofa.go.kr/www/contents/en/i_11193.do"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 ml-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              외교부 해외안전여행 →
            </a>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-600">
              ⓘ 이 안전정보는 일반적인 참고 자료이며, 공식 정보를 대체할 수
              없습니다. 여행 전 최신 정보를 반드시 확인하세요.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-8 w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
