"use client";

import { useState } from "react";
import { validateOutboundUrl, redirectToOutbound } from "@/lib/outbound";

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
      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            검색 결과
          </h3>
          <div className="space-y-2 text-gray-700">
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
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
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
            className="flex-1 rounded-lg border border-gray-300 py-2 font-medium text-gray-900 hover:bg-gray-50"
          >
            수정하기
          </button>
          <button
            onClick={handleHotelsClick}
            className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
          >
            숙소 보러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          지역
        </label>
        <input
          type="text"
          value={state.location}
          onChange={(e) =>
            setState((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="도시 또는 지역 입력"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
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
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {state.errors.checkIn && (
          <p className="mt-1 text-sm text-red-600">{state.errors.checkIn}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
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
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {state.errors.checkOut && (
          <p className="mt-1 text-sm text-red-600">{state.errors.checkOut}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          인원
        </label>
        <select
          value={state.guests}
          onChange={(e) =>
            setState((prev) => ({ ...prev, guests: parseInt(e.target.value) }))
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-blue-500"
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
        className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
      >
        검색하기
      </button>
    </div>
  );
}
