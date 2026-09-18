import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/destinations/Hero";
import { DomesticGrid } from "@/components/destinations/DomesticGrid";
import { OverseasGrid } from "@/components/destinations/OverseasGrid";
import { SafetyGrid } from "@/components/destinations/SafetyGrid";
import { ThemeChips } from "@/components/destinations/ThemeChips";
import { MatePreview } from "@/components/destinations/MatePreview";
import { AboutTeaser } from "@/components/destinations/AboutTeaser";
import { generateSEOMetadata, PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata(PAGE_METADATA.home);

export default function Home() {
  return (
    <main className="w-full bg-canvas">
      {/* S1: Hero Search */}
      <section className="px-base pt-lg lg:px-base lg:pt-xl">
        <div className="mx-auto max-w-content-desktop">
          <Suspense fallback={null}>
            <Hero />
          </Suspense>
        </div>
      </section>

      {/* S2: Domestic Destinations */}
      <section className="border-t border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <h2 className="text-headline-lg text-ink mb-lg">
            국내 인기 여행지
          </h2>
          <DomesticGrid />
        </div>
      </section>

      {/* S3: Overseas Destinations */}
      <section className="border-t border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <h2 className="text-headline-lg text-ink mb-lg">
            해외 인기 여행지
          </h2>
          <OverseasGrid />
        </div>
      </section>

      {/* S4: Theme Chips */}
      <section className="border-t border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <h2 className="text-headline-lg text-ink mb-lg">
            여행 동기·테마
          </h2>
          <ThemeChips />
        </div>
      </section>

      {/* S5: Country Safety */}
      <section className="border-t border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <h2 className="text-headline-lg text-ink mb-lg">
            국가별 주의사항
          </h2>
          <SafetyGrid />
        </div>
      </section>

      {/* S6: Recent Mate Posts */}
      <MatePreview />

      {/* S7: About Representative */}
      <AboutTeaser />
    </main>
  );
}
