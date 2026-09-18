import type { Metadata } from "next";
import { IntroTabs } from "@/components/travel-tools/IntroTabs";
import { FlightForm } from "@/components/travel-tools/FlightForm";
import { HotelForm } from "@/components/travel-tools/HotelForm";
import { MateWrite } from "@/components/travel-tools/MateWrite";
import { Tips } from "@/components/travel-tools/Tips";
import { generateSEOMetadata, PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata(PAGE_METADATA.travelTools);

export default function TravelToolsPage() {
  return (
    <main className="w-full bg-white">
      {/* S1: Hero */}
      <section className="border-b border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
            여행 준비 도구
          </h1>
          <p className="text-xl text-gray-600">
            항공편, 숙소, 동행을 한곳에서 찾고, 안전하게 여행을 준비하세요.
          </p>
        </div>
      </section>

      {/* S2: Intro Tabs + Forms */}
      <section className="border-b border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <IntroTabs>
            <div className="space-y-6">
              <div id="flight-section">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  ✈️ 항공편 검색
                </h3>
                <FlightForm />
              </div>
              <div id="hotel-section">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  🏨 숙소 검색
                </h3>
                <HotelForm />
              </div>
              <div id="mate-section">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  👥 동행 찾기
                </h3>
                <MateWrite />
              </div>
            </div>
          </IntroTabs>
        </div>
      </section>

      {/* S3: Tips */}
      <section className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <Tips />
        </div>
      </section>
    </main>
  );
}
