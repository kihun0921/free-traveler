import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import AuthPanel from "@/components/account/AuthPanel";
import ProfilePanel from "@/components/account/ProfilePanel";
import MyActivityPanel from "@/components/account/MyActivityPanel";
import AdminPanel from "@/components/account/AdminPanel";
import { generateSEOMetadata, PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata(PAGE_METADATA.account);

function isAdminEmail(email: string | null | undefined) {
  return Boolean(email?.endsWith("@admin.traveler.local"));
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  const role = !user ? "GUEST" : isAdminEmail(user.email) ? "ADMIN" : "MEMBER";

  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-12 lg:px-12 lg:py-16">
        <div>
          <h1 className="text-2xl font-bold text-[#24242A]">계정</h1>
          <p className="mt-2 text-sm text-[#45454C]">
            {role === "GUEST" &&
              "로그인하면 동행 구하기 글 작성, 참가 신청, 즐겨찾기 관리를 이용할 수 있습니다."}
            {role === "MEMBER" &&
              "프로필과 내 활동을 관리합니다."}
            {role === "ADMIN" &&
              "신고 처리 상태와 외부 이동 URL을 관리합니다."}
          </p>
        </div>

        {role === "GUEST" && <AuthPanel />}

        {(role === "MEMBER" || role === "ADMIN") && (
          <>
            <ProfilePanel />
            <MyActivityPanel />
          </>
        )}

        {role === "MEMBER" && (
          <div className="rounded-[12px] border border-[#EEEEF0] bg-[#FAFAFA] p-6">
            <p className="text-sm font-medium text-[#24242A]">다음 행동</p>
            <p className="mt-1 text-sm text-[#45454C]">
              동행 목록에서 함께 여행할 사람을 찾아보거나, 새로운 동행 글을 작성해 보세요.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/mates"
                className="inline-flex items-center justify-center rounded-[8px] bg-[#FF6B4A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E85837]"
              >
                동행 목록 보기
              </Link>
              <Link
                href="/travel-tools"
                className="inline-flex items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white px-4 py-2 text-sm font-medium text-[#24242A] hover:bg-[#FAFAFA]"
              >
                동행 글 작성하기
              </Link>
            </div>
          </div>
        )}

        {role === "ADMIN" && (
          <>
            <AdminPanel />
            <div className="rounded-[12px] border border-[#EEEEF0] bg-[#FAFAFA] p-6">
              <p className="text-sm font-medium text-[#24242A]">도움말</p>
              <p className="mt-1 text-sm text-[#45454C]">
                신고는 접수 순서대로 확인하고, 처리 완료 또는 반려로 상태를 변경해 주세요. 외부
                URL은 HTTPS 주소만 저장되며, 저장 즉시 항공·숙소 조회 이동에 반영됩니다.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
