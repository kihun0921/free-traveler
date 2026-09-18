"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/common/Toast";
import { destinations } from "@/data/destinations";

const FAVORITES_STORAGE_KEY = "freeTraveler:favorites";
const FAVORITES_CHANGED_EVENT = "freeTraveler:favorites-changed";

type PostStatus = "OPEN" | "CLOSED";
type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

interface MatePost {
  id: string;
  title: string;
  country: string;
  region?: string;
  start_date: string;
  end_date: string;
  status: PostStatus;
}

interface MyApplication {
  id: string;
  post_id: string;
  status: ApplicationStatus;
  created_at: string;
  postTitle: string | null;
}

interface Block {
  id: string;
  blocked_id: string;
  created_at: string;
  nickname: string | null;
}

function EmptyState({
  message,
  guide,
  ctaLabel,
  ctaHref,
}: {
  message: string;
  guide: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#EEEEF0] bg-[#FAFAFA] p-6 text-center">
      <p className="text-sm text-[#45454C]">{message}</p>
      <p className="mt-1 text-sm text-[#6B6B72]">{guide}</p>
      <Link
        href={ctaHref}
        className="mt-3 inline-flex items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white px-4 py-2 text-sm font-medium text-[#24242A] hover:bg-[#FAFAFA]"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function PostStatusBadge({ status }: { status: PostStatus }) {
  const style =
    status === "OPEN"
      ? "bg-[#F0F9F5] text-[#137A54] border border-transparent"
      : "bg-[#EEEEF0] text-[#6B6B72] border border-transparent";
  return (
    <span className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-xs font-medium ${style}`}>
      {status === "OPEN" ? "모집중" : "마감"}
    </span>
  );
}

const APPLICATION_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "대기중",
  ACCEPTED: "승인됨",
  REJECTED: "거절됨",
};

function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const style: Record<ApplicationStatus, string> = {
    PENDING: "bg-[#FEF7EC] text-[#B8720A] border border-[#FCE4C0]",
    ACCEPTED: "bg-[#F0F9F5] text-[#137A54] border border-transparent",
    REJECTED: "bg-[#EEEEF0] text-[#6B6B72] border border-transparent",
  };
  return (
    <span className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-xs font-medium ${style[status]}`}>
      {APPLICATION_LABEL[status]}
    </span>
  );
}

function readFavoriteIds(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeFavoriteIds(ids: string[]) {
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  } catch {
    // localStorage unavailable — ignore
  }
}

export default function MyActivityPanel() {
  const [userId, setUserId] = useState<string | null>(null);

  const [myPosts, setMyPosts] = useState<MatePost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [postActionId, setPostActionId] = useState<string | null>(null);

  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blocksLoading, setBlocksLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  async function loadMyPosts(currentUserId: string) {
    setPostsLoading(true);
    try {
      const res = await fetch("/api/mates");
      if (!res.ok) return;
      const all: MatePost[] = await res.json();
      setMyPosts(all.filter((post) => (post as unknown as { user_id: string }).user_id === currentUserId));
    } catch {
      showToast("내 글을 불러오지 못했습니다.", "critical");
    } finally {
      setPostsLoading(false);
    }
  }

  async function loadApplications() {
    setApplicationsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("mate_application")
        .select("id, post_id, status, created_at")
        .order("created_at", { ascending: false });
      if (error || !data) {
        setApplications([]);
        return;
      }
      const withTitles = await Promise.all(
        data.map(async (application) => {
          try {
            const res = await fetch(`/api/mates/${application.post_id}`);
            const post = res.ok ? await res.json() : null;
            return { ...application, postTitle: post?.title ?? null } as MyApplication;
          } catch {
            return { ...application, postTitle: null } as MyApplication;
          }
        }),
      );
      setApplications(withTitles);
    } finally {
      setApplicationsLoading(false);
    }
  }

  async function loadBlocks() {
    setBlocksLoading(true);
    try {
      const res = await fetch("/api/blocks");
      if (!res.ok) {
        setBlocks([]);
        return;
      }
      const rows: { id: string; blocked_id: string; created_at: string }[] = await res.json();
      const supabase = createClient();
      const blockedIds = rows.map((row) => row.blocked_id);
      let nicknameById = new Map<string, string>();
      if (blockedIds.length > 0) {
        const { data: profiles } = await supabase
          .from("user_profile")
          .select("id, nickname")
          .in("id", blockedIds);
        nicknameById = new Map((profiles ?? []).map((p) => [p.id as string, p.nickname as string]));
      }
      setBlocks(
        rows.map((row) => ({
          ...row,
          nickname: nicknameById.get(row.blocked_id) ?? null,
        })),
      );
    } finally {
      setBlocksLoading(false);
    }
  }

  useEffect(() => {
    setFavoriteIds(readFavoriteIds());
    function handleFavoritesChanged() {
      setFavoriteIds(readFavoriteIds());
    }
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);
    window.addEventListener("storage", handleFavoritesChanged);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);
      window.removeEventListener("storage", handleFavoritesChanged);
    };
  }, []);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const currentUserId = data.user?.id ?? null;
      setUserId(currentUserId);
      if (currentUserId) {
        loadMyPosts(currentUserId);
        loadApplications();
      } else {
        setPostsLoading(false);
        setApplicationsLoading(false);
      }
      loadBlocks();
    }
    init();
  }, []);

  async function hasAcceptedApplicants(postId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/mates/${postId}/applications`);
      if (!res.ok) return false;
      const list: { status: ApplicationStatus }[] = await res.json();
      return list.some((application) => application.status === "ACCEPTED");
    } catch {
      return false;
    }
  }

  async function handleClosePost(post: MatePost) {
    if (await hasAcceptedApplicants(post.id)) {
      const confirmed = window.confirm(
        "승인된 참가자가 있는 글입니다. 마감하면 참가자에게 안내가 필요할 수 있습니다. 계속할까요?",
      );
      if (!confirmed) return;
    }
    setPostActionId(post.id);
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const res = await fetch(`/api/mates/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ end_date: yesterday.toISOString().slice(0, 10) }),
      });
      if (!res.ok) {
        showToast("마감 처리에 실패했습니다.", "critical");
        return;
      }
      showToast("모집을 마감했습니다.", "success");
      if (userId) loadMyPosts(userId);
    } finally {
      setPostActionId(null);
    }
  }

  async function handleDeletePost(post: MatePost) {
    if (await hasAcceptedApplicants(post.id)) {
      const confirmed = window.confirm(
        "승인된 참가자가 있는 글입니다. 삭제하면 참가자와의 약속이 사라집니다. 계속할까요?",
      );
      if (!confirmed) return;
    } else if (!window.confirm("이 글을 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.")) {
      return;
    }
    setPostActionId(post.id);
    try {
      const res = await fetch(`/api/mates/${post.id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("삭제에 실패했습니다.", "critical");
        return;
      }
      showToast("글을 삭제했습니다.", "success");
      setMyPosts((prev) => prev.filter((p) => p.id !== post.id));
    } finally {
      setPostActionId(null);
    }
  }

  function startEdit(post: MatePost) {
    setEditingPostId(post.id);
    setEditTitle(post.title);
  }

  async function submitEdit(postId: string) {
    setPostActionId(postId);
    try {
      const res = await fetch(`/api/mates/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });
      if (!res.ok) {
        showToast("수정에 실패했습니다.", "critical");
        return;
      }
      showToast("글을 수정했습니다.", "success");
      setEditingPostId(null);
      if (userId) loadMyPosts(userId);
    } finally {
      setPostActionId(null);
    }
  }

  function removeFavorite(id: string) {
    const next = favoriteIds.filter((favoriteId) => favoriteId !== id);
    setFavoriteIds(next);
    writeFavoriteIds(next);
  }

  async function handleUnblock(block: Block) {
    setUnblockingId(block.id);
    try {
      const res = await fetch(`/api/blocks/${block.id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("차단 해제에 실패했습니다.", "critical");
        return;
      }
      setBlocks((prev) => prev.filter((b) => b.id !== block.id));
      showToast("차단을 해제했습니다.", "success");
    } finally {
      setUnblockingId(null);
    }
  }

  const favoriteDestinations = favoriteIds
    .map((id) => destinations.find((destination) => destination.id === id))
    .filter((destination): destination is (typeof destinations)[number] => Boolean(destination));

  return (
    <section className="space-y-8" aria-label="내 활동">
      <div>
        <h2 className="text-lg font-semibold text-[#24242A]">내 활동</h2>
        <p className="mt-1 text-sm text-[#45454C]">
          내가 작성한 글, 참가 신청 현황, 즐겨찾기와 차단 목록을 확인합니다.
        </p>
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <h3 className="text-base font-semibold text-[#24242A]">내 글</h3>
        {postsLoading ? (
          <p className="mt-4 text-sm text-[#6B6B72]">불러오는 중...</p>
        ) : myPosts.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              message="아직 작성한 동행 글이 없습니다."
              guide="동행 구하기에서 글을 작성하면 여기에서 마감·수정·삭제할 수 있습니다."
              ctaLabel="동행 글 작성하러 가기"
              ctaHref="/travel-tools"
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {myPosts.map((post) => (
              <li key={post.id} className="rounded-[12px] border border-[#EEEEF0] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#24242A]">{post.title}</span>
                    <PostStatusBadge status={post.status} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      disabled={post.status === "CLOSED" || postActionId === post.id}
                      className="rounded-[8px] border border-[#E5E5EA] bg-white px-3 py-1.5 text-sm text-[#24242A] hover:bg-[#FAFAFA] disabled:opacity-50"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClosePost(post)}
                      disabled={post.status === "CLOSED" || postActionId === post.id}
                      className="rounded-[8px] border border-[#E5E5EA] bg-white px-3 py-1.5 text-sm text-[#24242A] hover:bg-[#FAFAFA] disabled:opacity-50"
                    >
                      마감
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post)}
                      disabled={postActionId === post.id}
                      className="rounded-[8px] border border-[#F8CCC6] bg-[#FDF2F0] px-3 py-1.5 text-sm text-[#C13515] hover:bg-[#FDF2F0]/70 disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-[#6B6B72]">
                  {post.country} · {post.start_date} ~ {post.end_date}
                </p>
                {editingPostId === post.id && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-10 flex-1 min-w-[200px] rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => submitEdit(post.id)}
                      disabled={postActionId === post.id}
                      className="rounded-[8px] bg-[#FF6B4A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E85837] disabled:bg-[#FFD5C7]"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPostId(null)}
                      className="rounded-[8px] border border-[#E5E5EA] bg-white px-4 py-2 text-sm text-[#24242A] hover:bg-[#FAFAFA]"
                    >
                      취소
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <h3 className="text-base font-semibold text-[#24242A]">참가 요청 현황</h3>
        {applicationsLoading ? (
          <p className="mt-4 text-sm text-[#6B6B72]">불러오는 중...</p>
        ) : applications.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              message="아직 신청한 동행 참가 요청이 없습니다."
              guide="동행 목록에서 마음에 드는 글에 참가를 신청하면 여기에서 진행 상태를 확인할 수 있습니다."
              ctaLabel="동행 목록 보러 가기"
              ctaHref="/mates"
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {applications.map((application) => (
              <li
                key={application.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] border border-[#EEEEF0] p-4"
              >
                <span className="text-sm text-[#24242A]">
                  {application.postTitle ?? "삭제된 동행 글"}
                </span>
                <ApplicationStatusBadge status={application.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <h3 className="text-base font-semibold text-[#24242A]">즐겨찾기</h3>
        {favoriteDestinations.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              message="즐겨찾기한 여행지가 없습니다."
              guide="여행지 카드의 즐겨찾기 아이콘을 누르면 이 목록에 추가됩니다."
              ctaLabel="여행지 둘러보러 가기"
              ctaHref="/"
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {favoriteDestinations.map((destination) => (
              <li
                key={destination.id}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-[#EEEEF0] p-4"
              >
                <div>
                  <p className="text-sm font-medium text-[#24242A]">{destination.name}</p>
                  <p className="text-sm text-[#6B6B72]">{destination.country}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFavorite(destination.id)}
                  className="rounded-[8px] border border-[#E5E5EA] bg-white px-3 py-1.5 text-sm text-[#24242A] hover:bg-[#FAFAFA]"
                >
                  즐겨찾기 해제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <h3 className="text-base font-semibold text-[#24242A]">차단 목록</h3>
        {blocksLoading ? (
          <p className="mt-4 text-sm text-[#6B6B72]">불러오는 중...</p>
        ) : blocks.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              message="차단한 사용자가 없습니다."
              guide="부적절한 사용자를 신고·차단하면 이 목록에서 관리하고 언제든 해제할 수 있습니다."
              ctaLabel="동행 목록 보러 가기"
              ctaHref="/mates"
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {blocks.map((block) => (
              <li
                key={block.id}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-[#EEEEF0] p-4"
              >
                <span className="text-sm text-[#24242A]">{block.nickname ?? "알 수 없는 사용자"}</span>
                <button
                  type="button"
                  onClick={() => handleUnblock(block)}
                  disabled={unblockingId === block.id}
                  className="rounded-[8px] border border-[#E5E5EA] bg-white px-3 py-1.5 text-sm text-[#24242A] hover:bg-[#FAFAFA] disabled:opacity-50"
                >
                  차단 해제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
