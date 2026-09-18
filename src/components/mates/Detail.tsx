"use client";

interface MatePost {
  id: string;
  user_id: string;
  title: string;
  country: string;
  region?: string;
  start_date: string;
  end_date: string;
  people_count: number;
  conditions?: string;
  description: string;
  status: "OPEN" | "CLOSED";
  created_at: string;
}

interface Profile {
  nickname: string;
  age_group?: string;
  gender?: string;
  travel_style?: string;
}

interface DetailProps {
  post: MatePost;
  profile?: Profile;
  isOpen: boolean;
  onClose: () => void;
}

export function Detail({ post, profile, isOpen, onClose }: DetailProps) {
  if (!isOpen) return null;

  const startDate = new Date(post.start_date).toLocaleDateString("ko-KR");
  const endDate = new Date(post.end_date).toLocaleDateString("ko-KR");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      <div className="relative min-h-screen flex items-end sm:items-center sm:justify-center">
        <div
          className="relative bg-canvas w-full sm:rounded-lg sm:shadow-card sm:max-w-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
        >
          <button
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-4 top-4 text-muted hover:text-ink z-10"
          >
            ✕
          </button>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <h2 id="detail-title" className="mb-2 text-2xl font-bold text-ink">
                {post.title}
              </h2>
              <p className="text-body">
                {post.country}
                {post.region ? ` · ${post.region}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-body">기간</p>
                <p className="text-ink">
                  {startDate} ~ {endDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-body">모집 인원</p>
                <p className="text-ink">{post.people_count}명</p>
              </div>
            </div>

            {profile && (
              <div className="rounded-lg bg-surface-container p-4">
                <h3 className="mb-3 font-semibold text-ink">작성자</h3>
                <div className="space-y-2">
                  <p className="text-ink">{profile.nickname}</p>
                  {profile.age_group && (
                    <p className="text-sm text-body">
                      {profile.age_group}
                    </p>
                  )}
                  {profile.travel_style && (
                    <p className="text-sm text-body">
                      {profile.travel_style}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-semibold text-ink">상세 설명</h3>
              <p className="whitespace-pre-wrap text-body">
                {post.description}
              </p>
            </div>

            {post.conditions && (
              <div>
                <h3 className="mb-2 font-semibold text-ink">조건</h3>
                <p className="text-body">{post.conditions}</p>
              </div>
            )}

            <button
              className="w-full rounded-lg bg-primary py-2 font-medium text-on-primary hover:bg-primary-hover disabled:bg-primary-disabled"
              disabled={post.status === "CLOSED"}
            >
              {post.status === "OPEN" ? "신청하기" : "모집 마감"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
