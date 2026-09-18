"use client";

import Link from "next/link";

interface MatePost {
  id: string;
  user_id: string;
  title: string;
  country: string;
  region?: string;
  start_date: string;
  end_date: string;
  people_count: number;
  description: string;
  status: "OPEN" | "CLOSED";
  created_at: string;
}

interface Profile {
  nickname: string;
  age_group?: string;
  travel_style?: string;
}

interface ListProps {
  posts: MatePost[];
  profiles: Record<string, Profile>;
}

export function List({ posts, profiles }: ListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-12 text-center">
        <p className="mb-2 text-lg font-medium text-gray-900">
          현재 동행글이 없습니다
        </p>
        <p className="text-gray-600">
          첫 번째 동행글을 작성해 여행자들을 만나보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const profile = profiles[post.user_id];
        const startDate = new Date(post.start_date).toLocaleDateString("ko-KR");
        const endDate = new Date(post.end_date).toLocaleDateString("ko-KR");

        return (
          <Link
            key={post.id}
            href={`/mates/${post.id}`}
            className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="font-semibold text-gray-900">{post.title}</h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  post.status === "OPEN"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {post.status === "OPEN" ? "모집중" : "마감"}
              </span>
            </div>

            <p className="mb-2 text-sm text-gray-600">
              {post.country}
              {post.region ? ` · ${post.region}` : ""}
            </p>

            <p className="mb-3 line-clamp-2 text-sm text-gray-700">
              {post.description}
            </p>

            <div className="mb-3 flex flex-wrap gap-2">
              {profile?.age_group && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {profile.age_group}
                </span>
              )}
              {profile?.travel_style && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {profile.travel_style}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{profile?.nickname || "익명"}</span>
              <span>
                {startDate} ~ {endDate}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
