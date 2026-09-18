"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/common/Toast";

const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대+"];
const GENDERS = ["남성", "여성"];
const TRAVEL_STYLES = ["문화탐방", "액티비티", "휴양", "음식여행", "자유로운"];

interface Profile {
  id: string;
  nickname: string;
  age_group: string | null;
  gender: string | null;
  travel_style: string | null;
  is_adult: boolean;
  adult_verified_at: string | null;
}

export default function ProfilePanel() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [nickname, setNickname] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [saving, setSaving] = useState(false);

  const [adultConfirmOpen, setAdultConfirmOpen] = useState(false);
  const [adultChecked, setAdultChecked] = useState(false);
  const [adultSubmitting, setAdultSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) {
          setLoading(false);
          return;
        }
        const { data } = await supabase
          .from("user_profile")
          .select("id, nickname, age_group, gender, travel_style, is_adult, adult_verified_at")
          .eq("id", userId)
          .single();
        if (data) {
          const loaded = data as Profile;
          setProfile(loaded);
          setNickname(loaded.nickname ?? "");
          setAgeGroup(loaded.age_group ?? "");
          setGender(loaded.gender ?? "");
          setTravelStyle(loaded.travel_style ?? "");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    if (!nickname.trim() || !ageGroup || !travelStyle) {
      showToast("닉네임·연령대·여행스타일은 필수 입력입니다.", "critical");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_profile")
        .update({
          nickname: nickname.trim(),
          age_group: ageGroup,
          gender: gender || null,
          travel_style: travelStyle,
        })
        .eq("id", profile.id)
        .select()
        .single();
      if (error) {
        showToast("프로필 저장에 실패했습니다.", "critical");
        return;
      }
      setProfile(data as Profile);
      showToast("프로필이 저장되었습니다.", "success");
    } finally {
      setSaving(false);
    }
  }

  function openAdultConfirm() {
    setAdultChecked(false);
    setAdultConfirmOpen(true);
  }

  async function submitAdultConfirm() {
    if (!profile || !adultChecked) return;
    setAdultSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_profile")
        .update({
          is_adult: true,
          adult_verified_at: new Date().toISOString(),
        })
        .eq("id", profile.id)
        .select()
        .single();
      if (error) {
        showToast("성인 확인에 실패했습니다.", "critical");
        return;
      }
      setProfile(data as Profile);
      setAdultConfirmOpen(false);
      showToast("성인 확인이 완료되었습니다.", "success");
    } finally {
      setAdultSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="space-y-4" aria-label="프로필">
        <h2 className="text-lg font-semibold text-[#24242A]">프로필</h2>
        <p className="text-sm text-[#6B6B72]">불러오는 중...</p>
      </section>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <section className="space-y-6" aria-label="프로필">
      <div>
        <h2 className="text-lg font-semibold text-[#24242A]">프로필</h2>
        <p className="mt-1 text-sm text-[#45454C]">
          닉네임과 여행 정보를 관리하고 성인 확인 상태를 확인합니다.
        </p>
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="profile-nickname" className="block text-sm font-medium text-[#24242A]">
              닉네임
            </label>
            <input
              id="profile-nickname"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="profile-age-group" className="block text-sm font-medium text-[#24242A]">
              연령대
            </label>
            <select
              id="profile-age-group"
              required
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
            >
              <option value="">선택해 주세요</option>
              {AGE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="profile-travel-style" className="block text-sm font-medium text-[#24242A]">
              여행 스타일
            </label>
            <select
              id="profile-travel-style"
              required
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
            >
              <option value="">선택해 주세요</option>
              {TRAVEL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="profile-gender" className="block text-sm font-medium text-[#24242A]">
              성별(선택)
            </label>
            <select
              id="profile-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block h-12 w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
            >
              <option value="">선택 안 함</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#FF6B4A] px-6 text-sm font-semibold text-white hover:bg-[#E85837] disabled:bg-[#FFD5C7]"
          >
            {saving ? "저장 중..." : "프로필 저장"}
          </button>
        </form>
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#24242A]">성인 확인</p>
            {profile.is_adult ? (
              <span className="mt-1 inline-flex items-center rounded-[4px] bg-[#F0F9F5] px-2 py-0.5 text-xs font-medium text-[#137A54]">
                확인 완료
                {profile.adult_verified_at
                  ? ` · ${new Date(profile.adult_verified_at).toLocaleDateString("ko-KR")}`
                  : ""}
              </span>
            ) : (
              <span className="mt-1 inline-flex items-center rounded-[4px] bg-[#FEF7EC] px-2 py-0.5 text-xs font-medium text-[#B8720A]">
                확인 필요
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={openAdultConfirm}
            className="rounded-[8px] border border-[#E5E5EA] bg-white px-4 py-2 text-sm font-medium text-[#24242A] hover:bg-[#FAFAFA]"
          >
            {profile.is_adult ? "다시 확인" : "성인 확인하기"}
          </button>
        </div>

        {adultConfirmOpen && (
          <div className="mt-4 rounded-[12px] border border-[#EEEEF0] bg-[#FAFAFA] p-4">
            <label className="flex items-start gap-2 text-sm text-[#45454C]">
              <input
                type="checkbox"
                checked={adultChecked}
                onChange={(e) => setAdultChecked(e.target.checked)}
                className="mt-0.5"
              />
              만 19세 이상임을 확인합니다. 생년월일은 저장하지 않으며, 확인 여부와 확인 시각만 기록됩니다.
            </label>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={submitAdultConfirm}
                disabled={!adultChecked || adultSubmitting}
                className="rounded-[8px] bg-[#FF6B4A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E85837] disabled:bg-[#FFD5C7]"
              >
                {adultSubmitting ? "확인 중..." : "확인 완료"}
              </button>
              <button
                type="button"
                onClick={() => setAdultConfirmOpen(false)}
                className="rounded-[8px] border border-[#E5E5EA] bg-white px-4 py-2 text-sm text-[#24242A] hover:bg-[#FAFAFA]"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
