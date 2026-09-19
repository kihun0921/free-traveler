"use client";

import Image from "next/image";
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
      <div className="mx-auto grid max-w-content-desktop grid-cols-1 gap-xl lg:grid-cols-2 lg:gap-xxl lg:items-stretch">
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

        {/* Right: Traveler photo card — 패널 없이 사진 전체를 보여주고, 인물을 피해 우측에 문구를 배치 */}
        <div className="hidden lg:block">
          <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-xl border border-hairline">
            <Image
              src="https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Backpacker_against_Clouds_%2844961813314%29.jpg/1920px-Backpacker_against_Clouds_%2844961813314%29.jpg"
              alt="구름 위 산등성이에서 풍경을 바라보는 배낭 여행자"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />

            {/* 왼쪽 인물은 그대로 보이게 두고, 오른쪽만 은은하게 어둡게 해서 글자 대비를 확보 */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/65 via-black/15 to-transparent" />

            <div className="absolute inset-y-0 right-0 flex w-[55%] flex-col items-end justify-center gap-base px-lg text-right">
              <div>
                <p className="text-headline-sm font-bold text-on-primary drop-shadow-md">
                  {REPRESENTATIVE.yearsOfExperience}년의 여행 경험
                </p>
                <p className="mt-xxs text-body-sm text-on-primary drop-shadow-md">
                  전 세계 {REPRESENTATIVE.countriesVisited}개국을 다니며 쌓은 이야기
                </p>
              </div>

              <div className="flex w-full flex-col gap-sm">
                {stats.slice(0, 2).map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg bg-canvas px-base py-sm text-center"
                  >
                    <p className="text-headline-sm font-bold text-primary">
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
      </div>
    </section>
  );
}
