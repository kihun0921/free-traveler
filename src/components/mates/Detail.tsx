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
                {post.title}
              </h2>
              <p className="text-gray-600">
                {post.country}
                {post.region ? ` · ${post.region}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">기간</p>
                <p className="text-gray-900">
                  {startDate} ~ {endDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">모집 인원</p>
                <p className="text-gray-900">{post.people_count}명</p>
              </div>
            </div>

            {profile && (
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">작성자</h3>
                <div className="space-y-2">
                  <p className="text-gray-900">{profile.nickname}</p>
                  {profile.age_group && (
                    <p className="text-sm text-gray-600">
                      {profile.age_group}
                    </p>
                  )}
                  {profile.travel_style && (
                    <p className="text-sm text-gray-600">
                      {profile.travel_style}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-semibold text-gray-900">상세 설명</h3>
              <p className="whitespace-pre-wrap text-gray-700">
                {post.description}
              </p>
            </div>

            {post.conditions && (
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">조건</h3>
                <p className="text-gray-700">{post.conditions}</p>
              </div>
            )}

            <button
              className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
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
