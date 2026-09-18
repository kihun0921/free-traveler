"use client";

import { useState } from "react";
import { showToast } from "@/components/common/Toast";

interface ReportBlockActionsProps {
  userId: string;
  postId: string;
  onReportSuccess?: () => void;
  onBlockSuccess?: () => void;
}

export function ReportBlockActions({
  userId,
  postId,
  onReportSuccess,
  onBlockSuccess,
}: ReportBlockActionsProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isBlockLoading, setIsBlockLoading] = useState(false);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportReason.trim()) {
      showToast("신고 사유를 입력해주세요", "critical");
      return;
    }

    if (reportReason.length > 500) {
      showToast("신고 사유는 500자 이내여야 합니다", "critical");
      return;
    }

    setIsReportLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: "user",
          target_id: userId,
          reason: reportReason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        showToast(
          error.error || "신고 접수에 실패했습니다",
          "critical",
        );
        return;
      }

      const report = await response.json();
      showToast(`신고가 접수되었습니다 (ID: ${report.id.slice(0, 8)})`, "success");
      setReportReason("");
      setIsReportOpen(false);
      onReportSuccess?.();
    } catch {
      showToast("신고 중 오류가 발생했습니다", "critical");
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleBlock = async () => {
    setIsBlockLoading(true);
    try {
      const response = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_id: userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 409) {
          showToast("이미 차단한 사용자입니다", "critical");
        } else {
          showToast(error.error || "차단에 실패했습니다", "critical");
        }
        return;
      }

      showToast("사용자가 차단되었습니다", "success");
      onBlockSuccess?.();
    } catch {
      showToast("차단 중 오류가 발생했습니다", "critical");
    } finally {
      setIsBlockLoading(false);
    }
  };

  return (
    <div className="space-y-3 border-t border-gray-200 px-6 py-4 sm:px-8">
      <button
        onClick={() => setIsReportOpen(!isReportOpen)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        disabled={isReportLoading || isBlockLoading}
      >
        신고하기
      </button>

      <button
        onClick={handleBlock}
        disabled={isBlockLoading || isReportLoading}
        className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-center font-medium text-red-700 hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {isBlockLoading ? "차단 중..." : "차단하기"}
      </button>

      {isReportOpen && (
        <div className="rounded-lg bg-gray-50 p-4 space-y-3">
          <form onSubmit={handleReport} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                신고 사유 ({reportReason.length}/500자)
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                maxLength={500}
                placeholder="신고 사유를 입력해주세요"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={4}
                disabled={isReportLoading}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isReportLoading || !reportReason.trim()}
                className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isReportLoading ? "제출 중..." : "신고 제출"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReportOpen(false);
                  setReportReason("");
                }}
                disabled={isReportLoading}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
