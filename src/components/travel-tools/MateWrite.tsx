"use client";

import { useState } from "react";
import { detectAndSanitizeContacts } from "@/lib/contact-detection";

interface MateWriteState {
  title: string;
  destination: string;
  travelDates: string;
  description: string;
  budget: string;
  maxPeople: number;
  errors: Record<string, string>;
  contactWarning: boolean;
}

export function MateWrite() {
  const [state, setState] = useState<MateWriteState>({
    title: "",
    destination: "",
    travelDates: "",
    description: "",
    budget: "",
    maxPeople: 3,
    errors: {},
    contactWarning: false,
  });

  const handleDescriptionChange = (value: string) => {
    const detection = detectAndSanitizeContacts(value);
    setState((prev) => ({
      ...prev,
      description: value,
      contactWarning: detection.hasContacts,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!state.title.trim()) errors.title = "제목을 입력하세요";
    if (!state.destination.trim()) errors.destination = "여행지를 입력하세요";
    if (!state.travelDates.trim()) errors.travelDates = "여행 기간을 입력하세요";
    if (!state.description.trim()) errors.description = "상세 설명을 입력하세요";
    if (state.description.length < 50)
      errors.description = "최소 50자 이상 입력하세요";

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, errors }));
      return;
    }

    setState((prev) => ({
      ...prev,
      errors: {},
      title: "",
      destination: "",
      travelDates: "",
      description: "",
      budget: "",
      contactWarning: false,
    }));

    alert("동행 모집 글이 등록되었습니다!");
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">동행 찾기</h3>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          제목
        </label>
        <input
          type="text"
          value={state.title}
          onChange={(e) =>
            setState((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="예: 7월 일본 오사카 가실 분 찾습니다"
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {state.errors.title && (
          <p className="mt-1 text-sm text-red-600">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          여행지
        </label>
        <input
          type="text"
          value={state.destination}
          onChange={(e) =>
            setState((prev) => ({ ...prev, destination: e.target.value }))
          }
          placeholder="예: 일본 오사카"
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.destination ? "border-red-500" : "border-gray-300"
          }`}
        />
        {state.errors.destination && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.destination}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          여행 기간
        </label>
        <input
          type="text"
          value={state.travelDates}
          onChange={(e) =>
            setState((prev) => ({ ...prev, travelDates: e.target.value }))
          }
          placeholder="예: 2026년 7월 5일 ~ 12일 (7박 8일)"
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.travelDates ? "border-red-500" : "border-gray-300"
          }`}
        />
        {state.errors.travelDates && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.travelDates}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          상세 설명
        </label>
        <textarea
          value={state.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="여행 계획, 관심사, 원하는 동행의 조건을 자유롭게 작성해주세요"
          rows={6}
          className={`w-full rounded-lg border px-3 py-2 ${
            state.errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {state.contactWarning && (
          <p className="mt-2 text-sm text-amber-600">
            ⚠️ 개인 연락처(이메일, 전화번호) 노출에 주의하세요. 안전을 위해
            플랫폼 내 메시지 기능을 사용하세요.
          </p>
        )}
        {state.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            예산 (선택사항)
          </label>
          <input
            type="text"
            value={state.budget}
            onChange={(e) =>
              setState((prev) => ({ ...prev, budget: e.target.value }))
            }
            placeholder="예: 200~300만원"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            모집 인원
          </label>
          <select
            value={state.maxPeople}
            onChange={(e) =>
              setState((prev) => ({ ...prev, maxPeople: parseInt(e.target.value) }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}명
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
      >
        모집 글 등록
      </button>
    </div>
  );
}
