"use client";

import { useEffect, useState } from "react";
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
  conditions?: string;
  description: string;
  status: "OPEN" | "CLOSED";
  created_at: string;
  updated_at: string;
}

export function MatePreview() {
  const [posts, setPosts] = useState<MatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/mates");
        if (!response.ok) throw new Error("Failed to fetch mate posts");
        const data: MatePost[] = await response.json();

        // Filter for open posts only and get the 3 most recent
        const openPosts = data
          .filter((post) => post.status === "OPEN")
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3);

        setPosts(openPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-500">로딩 중...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-red-600">오류가 발생했습니다</p>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            최근 동행글
          </h2>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-8 text-center">
            <p className="text-lg text-gray-700 mb-4 font-semibold">
              현재 진행 중인 동행글이 없습니다
            </p>
            <p className="text-gray-600 mb-8">
              다른 여행자들과 함께 세계를 누비는 경험을 함께하세요!
            </p>

            {/* 3-step mini guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">여행 계획</h3>
                <p className="text-sm text-gray-600">
                  당신의 다음 여행지와 일정을 정하세요
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">동행글 작성</h3>
                <p className="text-sm text-gray-600">
                  함께하고 싶은 조건을 담아 글을 작성하세요
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">동행자 매칭</h3>
                <p className="text-sm text-gray-600">
                  같은 마음의 여행자들을 만나세요
                </p>
              </div>
            </div>

            <Link
              href="/travel-tools"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              동행글 작성하기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12 lg:px-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">최근 동행글</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="font-bold text-white text-lg line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  {post.country}
                  {post.region && ` · ${post.region}`}
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Dates */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">일정</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(post.start_date).toLocaleDateString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                    })}{" "}
                    ~{" "}
                    {new Date(post.end_date).toLocaleDateString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>

                {/* People count */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">모집 인원</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {post.people_count}명
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {post.description}
                </p>

                {/* Conditions */}
                {post.conditions && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">참여 조건</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {post.conditions}
                    </p>
                  </div>
                )}

                {/* Posted date */}
                <p className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                  에 작성됨
                </p>
              </div>

              {/* Footer CTA */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <Link
                  href={`/mates?country=${encodeURIComponent(post.country)}`}
                  className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to mate section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">더 많은 동행글을 보고 싶으신가요?</p>
          <Link
            href="/mates"
            className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            모든 동행글 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
