"use client";

import { useState } from "react";
import { SAFETY_INFO } from "@/data/safety";
import { validateOutboundUrl, redirectToOutbound } from "@/lib/outbound";

const COUNTRIES = [
  { code: "KR", name: "대한민국", regions: ["서울", "부산", "인천"] },
  { code: "JP", name: "일본", regions: ["도쿄", "오사카", "교토"] },
  { code: "TH", name: "태국", regions: ["방콕", "푸켓", "치앙마이"] },
  { code: "VN", name: "베트남", regions: ["하노이", "호찌민", "다낭"] },
  { code: "US", name: "미국", regions: ["뉴욕", "로스앤젤레스", "샌프란시스코"] },
  { code: "FR", name: "프랑스", regions: ["파리", "마르세유", "리옹"] },
];

interface FlightFormState {
  step: "input" | "summary";
  country: string;
  region: string;
  departDate: string;
  returnDate: string;
  errors: Record<string, string>;
  urlError: string | null;
}

export function FlightForm() {
  const [state, setState] = useState<FlightFormState>({
    step: "input",
    country: "",
    region: "",
    departDate: "",
    returnDate: "",
    errors: {},
    urlError: null,
  });

  const getCountry = (code: string) => COUNTRIES.find((c) => c.code === code);

  const validateDates = () => {
    const errors: Record<string, string> = {};
    const today = new Date().toISOString().split("T")[0];

    if (state.departDate < today) {
      errors.departDate = "출발일은 오늘 이후여야 합니다";
    }
    if (state.returnDate < state.departDate) {
      errors.returnDate = "귀국일은 출발일 이후여야 합니다";
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

  const handleFlightsClick = () => {
    try {
      const safetyInfo = SAFETY_INFO.find(
        (s) => s.countryCode === state.country.toUpperCase()
      );
      const flightsUrl = safetyInfo?.ministry_link || "https://www.skyscanner.co.kr/";
      redirectToOutbound(flightsUrl);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        urlError: "링크를 열 수 없습니다. 다시 시도해주세요.",
      }));
    }
  };

  const selectedCountry = getCountry(state.country);
  const availableRegions = selectedCountry?.regions || [];

  if (state.step === "summary") {
    return (
      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            검색 결과
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>출발지:</strong> {selectedCountry?.name} · {state.region}
            </p>
            <p>
              <strong>출발일:</strong> {state.departDate}
            </p>
            <p>
              <strong>귀국일:</strong> {state.returnDate}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-lg bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            ⚠️ 안전 정보 고지
          </p>
          <p className="text-xs text-amber-800">
            여행 시 해당 국가의 최신 안전 정보를 반드시 확인하세요. 외교부 여행
            주의보를 참고하여 안전한 여행을 계획해주세요.
          </p>
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
            onClick={handleFlightsClick}
            className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
          >
            항공편 보러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          출발 국가
        </label>
        <select
          value={state.country}
          onChange={(e) =>
            setState((prev) => ({
              ...prev,
              country: e.target.value,
              region: "",
            }))
          }
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.country
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        >
          <option value="">선택하세요</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {state.errors.country && (
          <p className="mt-1 text-sm text-red-600">{state.errors.country}</p>
        )}
      </div>

      {state.country && availableRegions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            지역
          </label>
          <select
            value={state.region}
            onChange={(e) =>
              setState((prev) => ({ ...prev, region: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-blue-500"
          >
            <option value="">선택하세요</option>
            {availableRegions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          출발일
        </label>
        <input
          type="date"
          value={state.departDate}
          onChange={(e) =>
            setState((prev) => ({ ...prev, departDate: e.target.value }))
          }
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.departDate
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {state.errors.departDate && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.departDate}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          귀국일
        </label>
        <input
          type="date"
          value={state.returnDate}
          onChange={(e) =>
            setState((prev) => ({ ...prev, returnDate: e.target.value }))
          }
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.returnDate
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {state.errors.returnDate && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.returnDate}
          </p>
        )}
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
