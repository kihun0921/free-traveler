"use client";

import Link from "next/link";
import REPRESENTATIVE from "@/data/about";

const STATS = (r: typeof REPRESENTATIVE) => [
  { value: `${r.tripsCompleted}+`, label: "완료한 여행" },
  { value: `${r.countriesVisited}+`, label: "방문 국가" },
  { value: `${r.yearsOfExperience}+`, label: "여행 경력(년)" },
];

export function AboutTeaser() {
  const stats = STATS(REPRESENTATIVE);

  return (
    <section className="border-t border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
      <div className="mx-auto grid max-w-content-desktop grid-cols-1 gap-xl lg:grid-cols-2 lg:gap-xxl lg:items-center">
        {/* Left: Text content */}
        <div className="flex flex-col justify-center space-y-lg">
          <div>
            <h2 className="text-headline-lg text-ink">
              {REPRESENTATIVE.name}
            </h2>
            <p className="mt-sm text-body-lg text-body">
              {REPRESENTATIVE.tagline}
            </p>
          </div>

          <p className="text-body-lg text-body leading-relaxed line-clamp-3">
            {REPRESENTATIVE.introduction}
          </p>

          <div className="flex divide-x divide-hairline">
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 px-lg first:pl-0">
                <p className="text-headline-md text-ink font-semibold">
                  {stat.value}
                </p>
                <p className="mt-xxs text-body-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex h-12 items-center justify-center rounded bg-primary px-lg text-button text-on-primary transition-colors hover:bg-primary-hover w-fit"
          >
            전체 소개 읽기
          </Link>
        </div>

        {/* Right: Stat highlight card */}
        <div className="hidden lg:block">
          <div className="rounded-xl border border-hairline bg-surface-soft px-xl py-xxl text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-disabled text-primary text-headline-sm"
            >
              ✈
            </span>
            <p className="mt-lg text-headline-sm font-semibold text-ink">
              {REPRESENTATIVE.yearsOfExperience}년의 여행 경험
            </p>
            <p className="mt-xs text-body-md text-body">
              전 세계 {REPRESENTATIVE.countriesVisited}개국을 다니며 쌓은 이야기
            </p>

            <div className="mt-xl grid grid-cols-2 gap-md">
              {stats.slice(0, 2).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-hairline bg-canvas py-lg"
                >
                  <p className="text-headline-md font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-xxs text-body-sm text-body">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
