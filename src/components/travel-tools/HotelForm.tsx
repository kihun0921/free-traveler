"use client";

import { useState } from "react";
import { redirectToOutbound } from "@/lib/outbound";

interface HotelFormState {
  step: "input" | "summary";
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  errors: Record<string, string>;
  urlError: string | null;
}

export function HotelForm() {
  const [state, setState] = useState<HotelFormState>({
    step: "input",
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    errors: {},
    urlError: null,
  });

  const validateDates = () => {
    const errors: Record<string, string> = {};
    const today = new Date().toISOString().split("T")[0];

    if (state.checkIn < today) {
      errors.checkIn = "체크인은 오늘 이후여야 합니다";
    }
    if (state.checkOut <= state.checkIn) {
      errors.checkOut = "체크아웃은 체크인 이후여야 합니다";
    }

    return errors;
  };

  const handleSearch = () => {
    const newErrors = validateDates();

    if (Object.keys(newErrors).length > 0) {
      setState((prev) => ({ ...prev, errors: newErrors }));
      return;
    }

    setState((prev) => ({
      ...prev,
      step: "summary",
      errors: {},
    }));
  };

  const handleHotelsClick = () => {
    try {
      const hotelsUrl = "https://www.booking.com/";
      redirectToOutbound(hotelsUrl);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        urlError: "링크를 열 수 없습니다. 다시 시도해주세요.",
      }));
    }
  };

  if (state.step === "summary") {
    return (
      <div className="space-y-6 rounded-lg border border-hairline-strong bg-canvas p-6">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-ink">
            검색 결과
          </h3>
          <div className="space-y-2 text-body">
            <p>
              <strong>지역:</strong> {state.location}
            </p>
            <p>
              <strong>체크인:</strong> {state.checkIn}
            </p>
            <p>
              <strong>체크아웃:</strong> {state.checkOut}
            </p>
            <p>
              <strong>인원:</strong> {state.guests}명
            </p>
          </div>
        </div>

        {state.urlError && (
          <div className="rounded-lg bg-critical-surface border border-critical-border p-4 text-sm text-critical-text">
            {state.urlError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() =>
              setState((prev) => ({
                ...prev,
                step: "input",
                urlError: null,
              }))
            }
            className="flex-1 rounded-lg border border-hairline-strong py-2 font-medium text-ink hover:bg-surface-container"
          >
            수정하기
          </button>
          <button
            onClick={handleHotelsClick}
            className="flex-1 rounded-lg bg-primary py-2 font-medium text-on-primary hover:bg-primary-hover"
          >
            숙소 보러 가기 <span aria-hidden="true">↗</span>
          </button>
        </div>
        <p className="text-center text-xs text-muted">
          새 탭에서 열립니다. 이 화면에 입력한 조건은 그대로 남아있어요.
        </p>

        <a
          href="/mates"
          className="block rounded-lg border border-hairline bg-surface-soft px-4 py-3 text-center text-sm font-medium text-ink hover:bg-surface-container"
        >
          같이 갈 동행도 찾아볼까요? 동행 찾기로 이동 →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-hairline-strong bg-canvas p-6">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          지역
        </label>
        <input
          type="text"
          value={state.location}
          onChange={(e) =>
            setState((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="도시 또는 지역 입력"
          className="w-full rounded-lg border border-hairline-strong px-3 py-2 focus:border-focus-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          체크인
        </label>
        <input
          type="date"
          value={state.checkIn}
          onChange={(e) =>
            setState((prev) => ({ ...prev, checkIn: e.target.value }))
          }
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.checkIn
              ? "border-critical-text focus:border-critical-text"
              : "border-hairline-strong focus:border-focus-ring"
          }`}
        />
        {state.errors.checkIn && (
          <p className="mt-1 text-sm text-critical-text">{state.errors.checkIn}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          체크아웃
        </label>
        <input
          type="date"
          value={state.checkOut}
          onChange={(e) =>
            setState((prev) => ({ ...prev, checkOut: e.target.value }))
          }
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.checkOut
              ? "border-critical-text focus:border-critical-text"
              : "border-hairline-strong focus:border-focus-ring"
          }`}
        />
        {state.errors.checkOut && (
          <p className="mt-1 text-sm text-critical-text">{state.errors.checkOut}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          인원
        </label>
        <select
          value={state.guests}
          onChange={(e) =>
            setState((prev) => ({ ...prev, guests: parseInt(e.target.value) }))
          }
          className="w-full rounded-lg border border-hairline-strong px-3 py-2 focus:border-focus-ring"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}명
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="w-full rounded-lg bg-primary py-2 font-medium text-on-primary hover:bg-primary-hover"
      >
        검색하기
      </button>
    </div>
  );
}
