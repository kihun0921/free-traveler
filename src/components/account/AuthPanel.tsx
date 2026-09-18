"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/common/Toast";

type AuthTab = "login" | "signup" | "reset";

const TABS: { id: AuthTab; label: string }[] = [
  { id: "login", label: "로그인" },
  { id: "signup", label: "가입" },
  { id: "reset", label: "재설정" },
];

const UNLOCKED_FEATURES = [
  "동행 구하기 글 작성과 참가 신청",
  "내 활동에서 신청 상태·작성 글 확인",
  "부적절한 게시물·사용자 신고 및 차단",
];

function getRedirectUrl(): string {
  return `${window.location.origin}/auth/callback`;
}

export default function AuthPanel() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        showToast("이메일 또는 비밀번호가 올바르지 않습니다.", "critical");
        return;
      }
      showToast("로그인되었습니다.", "success");
      window.location.reload();
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: { emailRedirectTo: getRedirectUrl() },
      });
      if (error) {
        showToast(error.message || "가입에 실패했습니다.", "critical");
        return;
      }
      showToast("인증 이메일을 보냈습니다. 메일함을 확인해 주세요.", "success");
      setSignupEmail("");
      setSignupPassword("");
    } finally {
      setSignupSubmitting(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: getRedirectUrl(),
      });
      if (error) {
        showToast(error.message || "재설정 메일 전송에 실패했습니다.", "critical");
        return;
      }
      showToast("비밀번호 재설정 메일을 보냈습니다.", "success");
      setResetEmail("");
    } finally {
      setResetSubmitting(false);
    }
  }

  return (
    <section className="space-y-6" aria-label="로그인">
      <div>
        <h2 className="text-lg font-semibold text-[#24242A]">로그인</h2>
        <p className="mt-1 text-sm text-[#45454C]">
          이메일로 가입하고 로그인하면 동행 기능을 이용할 수 있습니다.
        </p>
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-[#FAFAFA] p-5">
        <p className="text-sm font-medium text-[#24242A]">로그인 후 이용 가능한 기능</p>
        <ul className="mt-2 space-y-1">
          {UNLOCKED_FEATURES.map((feature) => (
            <li key={feature} className="text-sm text-[#45454C]">
              · {feature}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-[#6B6B72]">
          비밀번호는 서버에 안전하게 저장되며, 인증되지 않은 이메일 계정은 쓰기 권한이 없습니다.
        </p>
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <div className="flex gap-2" role="tablist" aria-label="인증 방법 선택">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-[999px] px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-[#FF6B4A] text-white"
                  : "border border-[#E5E5EA] bg-white text-[#24242A] hover:bg-[#FAFAFA]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="mt-5 space-y-4" aria-label="로그인 Card">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-[#24242A]">
                이메일
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-[#24242A]">
                비밀번호
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loginSubmitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#FF6B4A] text-sm font-semibold text-white hover:bg-[#E85837] disabled:bg-[#FFD5C7]"
            >
              {loginSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </form>
        )}

        {activeTab === "signup" && (
          <form onSubmit={handleSignup} className="mt-5 space-y-4" aria-label="가입 Card">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-[#24242A]">
                이메일
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-[#24242A]">
                비밀번호
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={8}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={signupSubmitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#FF6B4A] text-sm font-semibold text-white hover:bg-[#E85837] disabled:bg-[#FFD5C7]"
            >
              {signupSubmitting ? "가입 처리 중..." : "가입하기"}
            </button>
          </form>
        )}

        {activeTab === "reset" && (
          <form onSubmit={handleReset} className="mt-5 space-y-4" aria-label="재설정 Card">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-[#24242A]">
                이메일
              </label>
              <input
                id="reset-email"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={resetSubmitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#FF6B4A] text-sm font-semibold text-white hover:bg-[#E85837] disabled:bg-[#FFD5C7]"
            >
              {resetSubmitting ? "전송 중..." : "재설정 메일 보내기"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
