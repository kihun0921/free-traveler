"use client";

import { useState } from "react";

type Tab = "flight" | "hotel" | "mate";

interface IntroTabsProps {
  children?: React.ReactNode;
}

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: "flight", label: "항공편", icon: "✈️" },
  { id: "hotel", label: "숙소", icon: "🏨" },
  { id: "mate", label: "동행", icon: "👥" },
];

export function IntroTabs({ children }: IntroTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("flight");

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <div className="flex gap-8" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              className={`pb-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-red-500 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2" aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div id={`${activeTab}-panel`} role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
        {children ? (
          children
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === "flight" && "항공편 검색"}
              {activeTab === "hotel" && "숙소 검색"}
              {activeTab === "mate" && "동행 찾기"}
            </h3>
            <p className="text-gray-600">
              {activeTab === "flight" &&
                "출발지와 날짜를 선택하여 항공편을 검색하세요."}
              {activeTab === "hotel" &&
                "체크인·체크아웃 날짜와 지역을 선택하여 숙소를 검색하세요."}
              {activeTab === "mate" &&
                "여행 계획을 공유하고 함께할 동행을 찾으세요."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
