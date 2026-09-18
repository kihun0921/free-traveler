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
    <main className="w-full bg-white">
      {/* S1: Hero */}
      <section className="border-b border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <Hero />
        </div>
      </section>

      {/* S2: Stats */}
      <section className="border-b border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <Stats />
        </div>
      </section>

      {/* S3: Country Chips */}
      <section className="border-b border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            방문한 국가
          </h2>
          <CountryChips />
        </div>
      </section>

      {/* S4: Gallery */}
      <section className="border-b border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            여행 스냅샷
          </h2>
          <Gallery />
        </div>
      </section>

      {/* S5: Philosophy */}
      <section className="border-b border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <IntroPhilosophy />
        </div>
      </section>

      {/* S6: Recommended */}
      <section className="border-b border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <Recommended />
        </div>
      </section>

      {/* S7: Timeline */}
      <section className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <Timeline />
        </div>
      </section>
    </main>
  );
}
