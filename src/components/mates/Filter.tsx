"use client";

import { useState } from "react";

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

interface MateProfile {
  age_group?: string;
  gender?: string;
  travel_style?: string;
}

interface BlockedUser {
  blocker_id: string;
  blocked_id: string;
}

interface FilterProps {
  posts: MatePost[];
  profiles: Record<string, MateProfile>;
  blockedUsers: BlockedUser[];
  currentUserId: string;
  onFilterChange: (filteredPosts: MatePost[]) => void;
}

const COUNTRIES = ["한국", "일본", "중국", "태국", "베트남", "필리핀", "인도네시아", "말레이시아", "싱가포르", "미국", "캐나다", "영국", "프랑스", "독일", "이탈리아", "스페인", "호주", "뉴질랜드"];

const REGIONS_BY_COUNTRY: Record<string, string[]> = {
  "한국": ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"],
  "일본": ["도쿄", "오사카", "교토", "오키나와", "홋카이도", "후쿠오카"],
  "태국": ["방콕", "푸켓", "치앙마이", "파타야"],
  "필리핀": ["마닐라", "세부", "보라카이"],
  "미국": ["뉴욕", "로스앤젤레스", "샌프란시스코", "라스베가스", "마이애미"],
  "영국": ["런던", "맨체스터", "에딘버러"],
  "프랑스": ["파리", "니스", "리옹"],
};

const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대+"];
const GENDERS = ["남성", "여성"];
const TRAVEL_STYLES = ["문화탐방", "액티비티", "휴양", "음식여행", "자유로운"];
const RECRUITMENT_STATUSES = ["모집중", "마감"];

function isDateOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);

  return s1 <= e2 && s2 <= e1;
}

function isUserBlocked(
  userId: string,
  currentUserId: string,
  blockedUsers: BlockedUser[],
): boolean {
  return blockedUsers.some(
    (block) =>
      (block.blocker_id === currentUserId && block.blocked_id === userId) ||
      (block.blocker_id === userId && block.blocked_id === currentUserId),
  );
}

export function Filter({
  posts,
  profiles,
  blockedUsers,
  currentUserId,
  onFilterChange,
}: FilterProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start?: string;
    end?: string;
  }>({});
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedRegion("");
  };

  const handleFilterApply = () => {
    const filtered = posts.filter((post) => {
      if (selectedCountry && post.country !== selectedCountry) {
        return false;
      }

      if (selectedRegion && post.region !== selectedRegion) {
        return false;
      }

      if (
        selectedDateRange.start &&
        selectedDateRange.end &&
        !isDateOverlap(
          selectedDateRange.start,
          selectedDateRange.end,
          post.start_date,
          post.end_date,
        )
      ) {
        return false;
      }

      if (isUserBlocked(post.user_id, currentUserId, blockedUsers)) {
        return false;
      }

      const profile = profiles[post.user_id];
      if (profile) {
        if (selectedAgeGroups.length > 0 && profile.age_group) {
          if (!selectedAgeGroups.includes(profile.age_group)) {
            return false;
          }
        }

        if (selectedGenders.length > 0 && profile.gender) {
          if (!selectedGenders.includes(profile.gender)) {
            return false;
          }
        }

        if (selectedTravelStyles.length > 0 && profile.travel_style) {
          if (!selectedTravelStyles.includes(profile.travel_style)) {
            return false;
          }
        }
      }

      if (selectedStatuses.length > 0) {
        if (!selectedStatuses.includes(post.status)) {
          return false;
        }
      }

      return true;
    });

    onFilterChange(filtered);
  };

  const availableRegions = selectedCountry
    ? REGIONS_BY_COUNTRY[selectedCountry] || []
    : [];

  const handleFilterApplyClick = () => {
    handleFilterApply();
  };

  const filteredCount = (() => {
    return posts.filter((post) => {
      if (selectedCountry && post.country !== selectedCountry) {
        return false;
      }

      if (selectedRegion && post.region !== selectedRegion) {
        return false;
      }

      if (
        selectedDateRange.start &&
        selectedDateRange.end &&
        !isDateOverlap(
          selectedDateRange.start,
          selectedDateRange.end,
          post.start_date,
          post.end_date,
        )
      ) {
        return false;
      }

      if (isUserBlocked(post.user_id, currentUserId, blockedUsers)) {
        return false;
      }

      const profile = profiles[post.user_id];
      if (profile) {
        if (selectedAgeGroups.length > 0 && profile.age_group) {
          if (!selectedAgeGroups.includes(profile.age_group)) {
            return false;
          }
        }

        if (selectedGenders.length > 0 && profile.gender) {
          if (!selectedGenders.includes(profile.gender)) {
            return false;
          }
        }

        if (selectedTravelStyles.length > 0 && profile.travel_style) {
          if (!selectedTravelStyles.includes(profile.travel_style)) {
            return false;
          }
        }
      }

      if (selectedStatuses.length > 0) {
        if (!selectedStatuses.includes(post.status)) {
          return false;
        }
      }

      return true;
    }).length;
  })();

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">필터</h3>
        <p className="text-sm text-gray-600">
          총 <span className="font-semibold text-gray-900">{filteredCount}</span>
          건
        </p>
      </div>
      <div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              국가
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">전체</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              지역
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              disabled={!selectedCountry}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">전체</option>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              여행 시작
            </label>
            <input
              type="date"
              value={selectedDateRange.start || ""}
              onChange={(e) =>
                setSelectedDateRange({
                  ...selectedDateRange,
                  start: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              여행 종료
            </label>
            <input
              type="date"
              value={selectedDateRange.end || ""}
              onChange={(e) =>
                setSelectedDateRange({
                  ...selectedDateRange,
                  end: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연령대
            </label>
            <div className="space-y-2">
              {AGE_GROUPS.map((age) => (
                <label key={age} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAgeGroups.includes(age)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAgeGroups([...selectedAgeGroups, age]);
                      } else {
                        setSelectedAgeGroups(
                          selectedAgeGroups.filter((a) => a !== age),
                        );
                      }
                    }}
                    className="mr-2 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{age}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <div className="space-y-2">
              {GENDERS.map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes(gender)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGenders([...selectedGenders, gender]);
                      } else {
                        setSelectedGenders(
                          selectedGenders.filter((g) => g !== gender),
                        );
                      }
                    }}
                    className="mr-2 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              여행스타일
            </label>
            <div className="space-y-2">
              {TRAVEL_STYLES.map((style) => (
                <label key={style} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTravelStyles.includes(style)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTravelStyles([
                          ...selectedTravelStyles,
                          style,
                        ]);
                      } else {
                        setSelectedTravelStyles(
                          selectedTravelStyles.filter((s) => s !== style),
                        );
                      }
                    }}
                    className="mr-2 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              모집상태
            </label>
            <div className="space-y-2">
              {RECRUITMENT_STATUSES.map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStatuses([...selectedStatuses, status]);
                      } else {
                        setSelectedStatuses(
                          selectedStatuses.filter((s) => s !== status),
                        );
                      }
                    }}
                    className="mr-2 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    {status === "모집중" ? "OPEN" : "CLOSED"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleFilterApplyClick}
          className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
        >
          필터 적용
        </button>
      </div>
    </div>
  );
}
