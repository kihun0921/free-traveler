import { Hero } from "@/components/destinations/Hero";
import { DomesticGrid } from "@/components/destinations/DomesticGrid";
import { OverseasGrid } from "@/components/destinations/OverseasGrid";
import { SafetyGrid } from "@/components/destinations/SafetyGrid";
import { ThemeChips } from "@/components/destinations/ThemeChips";
import { MatePreview } from "@/components/destinations/MatePreview";
import { AboutTeaser } from "@/components/destinations/AboutTeaser";

export default function Home() {
  return (
    <main className="w-full bg-white">
      {/* S1: Hero Search */}
      <section className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <Hero />
        </div>
      </section>

      {/* S2: Domestic Destinations */}
      <section className="border-t border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            국내 인기 여행지
          </h2>
          <DomesticGrid />
        </div>
      </section>

      {/* S3: Overseas Destinations */}
      <section className="border-t border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            해외 인기 여행지
          </h2>
          <OverseasGrid />
        </div>
      </section>

      {/* S4: Theme Chips */}
      <section className="border-t border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            여행 동기·테마
          </h2>
          <ThemeChips />
        </div>
      </section>

      {/* S5: Country Safety */}
      <section className="border-t border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
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
