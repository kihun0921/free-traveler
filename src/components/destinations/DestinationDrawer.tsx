"use client";

import Image from "next/image";
import { useState } from "react";
import type { Destination } from "@/data/destinations";
import { destinations } from "@/data/destinations";
import type { SafetyInfo } from "@/data/safety";
import SAFETY_INFO from "@/data/safety";
import { SafetyDrawer } from "./SafetyDrawer";

interface DestinationDrawerProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DestinationDrawer({
  destination,
  isOpen,
  onClose,
}: DestinationDrawerProps) {
  const [safetyDrawerOpen, setSafetyDrawerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>();

  if (!isOpen || !destination) return null;

  const relatedDestinations = destinations.filter((d: Destination) => {
    if (d.id === destination.id) return false;
    return (
      (d.country === destination.country &&
        d.region === destination.region) ||
      (d.region === "overseas" &&
        destination.region === "overseas" &&
        d.country === destination.country)
    );
  }).slice(0, 6);

  const handleSafetyClick = () => {
    if (destination.region === "overseas") {
      const countryCode = SAFETY_INFO.find(
        (s: SafetyInfo) => s.country === destination.country
      )?.countryCode;
      if (countryCode) {
        setSelectedCountry(countryCode);
        setSafetyDrawerOpen(true);
      }
    }
  };

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[560px] overflow-y-auto bg-white shadow-lg sm:rounded-l-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dest-title"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 border-b border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 id="dest-title" className="text-2xl font-bold text-gray-900">
                {destination.name}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {destination.country}
                {destination.region === "domestic" ? " · 국내" : " · 해외"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close drawer"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-8 p-6">
          {/* Main Image */}
          {destination.image && (
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={destination.image.url}
                alt={destination.image.alt}
                width={560}
                height={256}
                className="h-64 w-full object-cover"
              />
              <p className="bg-gray-50 px-4 py-2 text-xs text-gray-600">
                {destination.image.alt}
              </p>
            </div>
          )}

          {/* Introduction */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              소개
            </h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              {destination.summary}
            </p>
          </section>

          {/* Best Season */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              추천 방문 시기
            </h3>
            <p className="mt-3 text-gray-900">{destination.bestSeason}</p>
          </section>

          {/* Attractions */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              주요 명소 ({destination.attractions.length}개)
            </h3>
            <ul className="mt-3 space-y-2">
              {destination.attractions.map((attraction, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                    {idx + 1}
                  </span>
                  <span className="text-gray-900">{attraction}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Itineraries */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              추천 일정
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">1일 일정</h4>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-gray-700">
                  {destination.itinerary.oneDay.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">3일 일정</h4>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-gray-700">
                  {destination.itinerary.threeDay.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Budget */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              예산 가이드
            </h3>
            <p className="mt-3 text-gray-700">{destination.budgetGuide}</p>
          </section>

          {/* Transportation */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              교통 안내
            </h3>
            <p className="mt-3 text-gray-700">{destination.transportation}</p>
          </section>

          {/* Food */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              대표 음식 ({destination.food.length}개)
            </h3>
            <ul className="mt-3 space-y-1">
              {destination.food.map((food, idx) => (
                <li key={idx} className="text-sm text-gray-900">
                  • {food}
                </li>
              ))}
            </ul>
          </section>

          {/* Etiquette */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              여행 에티켓 ({destination.etiquette.length}개)
            </h3>
            <ul className="mt-3 space-y-1">
              {destination.etiquette.map((rule, idx) => (
                <li key={idx} className="text-sm text-gray-900">
                  • {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* Safety Info Link (Overseas only) */}
          {destination.region === "overseas" && (
            <section>
              <button
                onClick={handleSafetyClick}
                className="w-full rounded-lg bg-red-50 px-4 py-3 text-left font-semibold text-red-900 hover:bg-red-100 transition-colors"
              >
                🛡️ 안전정보 보기
              </button>
            </section>
          )}

          {/* Related Destinations */}
          {relatedDestinations.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                관련 여행지 ({relatedDestinations.length}개)
              </h3>
              <div className="mt-3 space-y-2">
                {relatedDestinations.map((dest: Destination) => (
                  <div
                    key={dest.id}
                    className="rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-gray-900">{dest.name}</p>
                    <p className="text-xs text-gray-600">{dest.country}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Source & Date */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-600">
              최종 확인:{" "}
              {new Date(destination.lastVerifiedAt).toLocaleDateString(
                "ko-KR"
              )}
            </p>
            {destination.sourceUrl && (
              <a
                href={destination.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                정보 출처 →
              </a>
            )}
          </section>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Safety Drawer (nested) */}
      {selectedCountry && (
        <SafetyDrawer
          countryCode={selectedCountry}
          isOpen={safetyDrawerOpen}
          onClose={() => setSafetyDrawerOpen(false)}
        />
      )}
    </>
  );
}
