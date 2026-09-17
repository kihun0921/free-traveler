"use client";

import { useState } from "react";
import type { SafetyInfo } from "@/data/safety";
import SAFETY_INFO from "@/data/safety";
import { SafetyDrawer } from "./SafetyDrawer";

export function SafetyGrid() {
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        {SAFETY_INFO.slice(0, 6).map((safety: SafetyInfo) => (
          <button
            key={safety.countryCode}
            onClick={() => {
              setSelectedCountry(safety.countryCode);
              setDrawerOpen(true);
            }}
            className="group rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
              {safety.country}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {safety.scopeText}
            </p>
            <div className="mt-3 flex gap-2">
              {safety.scopeType === "advisory" && (
                <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-900">
                  출국권고
                </span>
              )}
              {safety.scopeType === "caution" && (
                <span className="inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900">
                  주의
                </span>
              )}
              {safety.scopeType === "general" && (
                <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-900">
                  안전
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      {selectedCountry && (
        <SafetyDrawer
          countryCode={selectedCountry}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
