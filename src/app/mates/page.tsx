"use client";

import { useState, useEffect } from "react";
import { Intro } from "@/components/mates/Intro";
import { Filter } from "@/components/mates/Filter";
import { List } from "@/components/mates/List";
import { Detail } from "@/components/mates/Detail";
import { ApplyPanel } from "@/components/mates/ApplyPanel";
import { ReportBlockActions } from "@/components/mates/ReportBlockActions";
import { Steps } from "@/components/mates/Steps";
import { SafetyCta } from "@/components/mates/SafetyCta";

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
  updated_at: string;
}

interface Profile {
  age_group?: string;
  gender?: string;
  travel_style?: string;
  nickname: string;
}

interface BlockedUser {
  blocker_id: string;
  blocked_id: string;
}

export default function MatesPage() {
  const [posts, setPosts] = useState<MatePost[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<MatePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsRes, blockedRes, userRes] = await Promise.all([
          fetch("/api/mates"),
          fetch("/api/blocks"),
          fetch("/api/auth/me"),
        ]);

        if (!postsRes.ok || !blockedRes.ok) {
          setError(true);
          return;
        }

        const postsData = await postsRes.json();
        const blockedData = await blockedRes.json();
        const userData = userRes.ok ? await userRes.json() : null;

        setPosts(postsData);
        setFilteredPosts(postsData);
        setBlockedUsers(blockedData || []);
        setCurrentUserId(userData?.id || "");

        const userIds = [...new Set(postsData.map((p: MatePost) => p.user_id))];
        if (userIds.length > 0) {
          const profilesRes = await fetch("/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_ids: userIds }),
          });

          if (profilesRes.ok) {
            const profilesData = await profilesRes.json();
            const profilesMap: Record<string, Profile> = {};
            profilesData.forEach(
              (profile: Profile & { id: string }) => {
                profilesMap[profile.id] = profile;
              },
            );
            setProfiles(profilesMap);
          }
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="min-h-screen bg-white">
      <Intro />

      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-12 lg:py-16">
          {!isLoading && (
            <Filter
              posts={posts}
              profiles={profiles}
              blockedUsers={blockedUsers}
              currentUserId={currentUserId}
              onFilterChange={setFilteredPosts}
            />
          )}
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-12 lg:py-16">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-6 text-center">
              <p className="text-red-700">동행글을 불러올 수 없습니다.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <List posts={filteredPosts} profiles={profiles} />
          )}
        </div>
      </div>


      <Steps />

      <SafetyCta />
    </div>
  );
}
