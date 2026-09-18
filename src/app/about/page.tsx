import type { Metadata } from "next";
import { Hero } from "@/components/about/Hero";
import { CountryChips } from "@/components/about/CountryChips";
import { Gallery } from "@/components/about/Gallery";
import { IntroPhilosophy } from "@/components/about/IntroPhilosophy";
import { Recommended } from "@/components/about/Recommended";
import { Stats } from "@/components/about/Stats";
import { Timeline } from "@/components/about/Timeline";
import { generateSEOMetadata, PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata(PAGE_METADATA.about);

export default function AboutPage() {
  return (
    <main className="w-full bg-canvas">
      {/* S1: Hero */}
      <section className="border-b border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <Hero />
        </div>
      </section>

      {/* S2: 여행 지표 */}
      <section className="border-b border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <h2 className="mb-lg text-headline-lg text-ink">여행 지표</h2>
          <Stats />
        </div>
      </section>

      {/* S3: 소개·철학 */}
      <section className="border-b border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <IntroPhilosophy />
        </div>
      </section>

      {/* S4: 여행 Timeline */}
      <section className="border-b border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <Timeline />
        </div>
      </section>

      {/* S5: 방문 국가 */}
      <section className="border-b border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <h2 className="mb-lg text-headline-lg text-ink">방문한 국가</h2>
          <CountryChips />
        </div>
      </section>

      {/* S6: 여행 사진 Gallery */}
      <section className="border-b border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <h2 className="mb-lg text-headline-lg text-ink">여행 스냅샷</h2>
          <Gallery />
        </div>
      </section>

      {/* S7: 기억에 남는 여행지 + CTA */}
      <section className="px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
        <div className="mx-auto max-w-content-desktop">
          <Recommended />
        </div>
      </section>
    </main>
  );
}
