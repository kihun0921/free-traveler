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
            className="group rounded-lg border border-hairline p-4 text-left transition-colors hover:border-hairline-strong hover:bg-surface-soft"
          >
            <h3 className="font-semibold text-ink group-hover:text-primary">
              {safety.country}
            </h3>
            <p className="mt-2 text-sm text-body line-clamp-2">
              {safety.scopeText}
            </p>
            <div className="mt-3 flex gap-2">
              {safety.scopeType === "advisory" && (
                <span className="inline-flex rounded-full bg-critical-surface px-2 py-1 text-xs font-semibold text-critical-text">
                  3단계 철수권고
                </span>
              )}
              {safety.scopeType === "caution" && (
                <span className="inline-flex rounded-full bg-caution-surface px-2 py-1 text-xs font-semibold text-caution-text">
                  2단계 여행자제
                </span>
              )}
              {safety.scopeType === "general" && (
                <span className="inline-flex rounded-full bg-success-surface px-2 py-1 text-xs font-semibold text-success-text">
                  여행경보 없음
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
