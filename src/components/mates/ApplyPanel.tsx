"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/common/Toast";

interface ApplyPanelProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  isPostAuthor?: boolean;
  currentUserId?: string;
  applicationStatus?: string;
}

export function ApplyPanel({
  postId,
  isOpen,
  onClose,
  isPostAuthor = false,
  currentUserId,
  applicationStatus,
}: ApplyPanelProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthCheckLoading, setIsAuthCheckLoading] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    setIsAuthCheckLoading(true);
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        router.push("/auth/login");
        return false;
      }
      const user = await response.json();
      if (!user.profile?.is_adult) {
        showToast("미성년자는 참가 신청이 불가능합니다", "critical");
        return false;
      }
      return true;
    } catch {
      router.push("/auth/login");
      return false;
    } finally {
      setIsAuthCheckLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      showToast("메시지를 입력해주세요", "critical");
      return;
    }

    if (message.length > 500) {
      showToast("메시지는 500자 이내여야 합니다", "critical");
      return;
    }

    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/mates/${postId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 409) {
          showToast("이미 신청한 글입니다", "critical");
        } else if (response.status === 401) {
          showToast("로그인이 필요합니다", "critical");
          router.push("/auth/login");
        } else {
          showToast(error.error || "신청에 실패했습니다", "critical");
        }
        return;
      }

      showToast("참가 신청이 완료되었습니다", "success");
      setMessage("");
      onClose();
    } catch {
      showToast("신청 중 오류가 발생했습니다", "critical");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative min-h-screen flex items-end sm:items-center sm:justify-center">
        <div className="relative bg-white w-full sm:rounded-lg sm:shadow-xl sm:max-w-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
          >
            ✕
          </button>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                참가 신청
              </h2>
              <p className="text-gray-600">
                자신을 소개하는 간단한 메시지를 작성해주세요
              </p>
            </div>

            {isPostAuthor ? (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-900">
                  본인의 글입니다. 신청을 할 수 없습니다.
                </p>
              </div>
            ) : applicationStatus === "PENDING" || applicationStatus === "ACCEPTED" ? (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-900">
                  이미 신청한 글입니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    메시지 ({message.length}/500자)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    placeholder="당신을 소개하고 함께 여행하고 싶은 이유를 간단히 작성해주세요"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={6}
                    disabled={isLoading || isAuthCheckLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isAuthCheckLoading || !message.trim()}
                  className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "신청 중..." : "신청하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
