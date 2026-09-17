"use client";

import { useCallback, useSyncExternalStore } from "react";

const FAVORITES_STORAGE_KEY = "freeTraveler:favorites";
const FAVORITES_CHANGED_EVENT = "freeTraveler:favorites-changed";

function readFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

function writeFavoriteIds(ids: string[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  } catch {
    // localStorage를 사용할 수 없는 환경(예: 프라이버시 모드)에서는 조용히 무시한다.
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_CHANGED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_CHANGED_EVENT, callback);
  };
}

function getServerSnapshot(): boolean {
  return false;
}

interface FavoriteToggleProps {
  destinationId: string;
  destinationName?: string;
  className?: string;
}

export default function FavoriteToggle({
  destinationId,
  destinationName,
  className,
}: FavoriteToggleProps) {
  const isFavorited = useSyncExternalStore(
    subscribe,
    () => readFavoriteIds().includes(destinationId),
    getServerSnapshot,
  );

  const handleToggle = useCallback(() => {
    const currentIds = readFavoriteIds();
    const alreadyFavorited = currentIds.includes(destinationId);

    // 중복 즐겨찾기 방지: 이미 있으면 제거, 없으면 한 번만 추가한다.
    const nextIds = alreadyFavorited
      ? currentIds.filter((id) => id !== destinationId)
      : [...currentIds, destinationId];

    writeFavoriteIds(nextIds);
  }, [destinationId]);

  const label = destinationName
    ? isFavorited
      ? `${destinationName} 즐겨찾기 해제`
      : `${destinationName} 즐겨찾기 추가`
    : isFavorited
      ? "즐겨찾기 해제"
      : "즐겨찾기 추가";

  return (
    <button
      type="button"
      aria-pressed={isFavorited}
      aria-label={label}
      onClick={handleToggle}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
        isFavorited
          ? "border-[#FF6B4A] bg-[#FF6B4A]"
          : "border-[#E5E5EA] bg-white hover:bg-[#FAFAFA]"
      } ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={isFavorited ? "#FFFFFF" : "none"}
        stroke={isFavorited ? "#FFFFFF" : "#45454C"}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20.5s-7.5-4.6-10-9.2C.5 8 2 4.5 5.5 4c2.1-.3 4 .8 6.5 3.3C14.5 4.8 16.4 3.7 18.5 4c3.5.5 5 4 3.5 7.3-2.5 4.6-10 9.2-10 9.2Z" />
      </svg>
    </button>
  );
}
