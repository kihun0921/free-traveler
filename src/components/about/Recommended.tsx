import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/data/destinations";

interface RecommendedDestination {
  destinationId: string;
  reason: string;
}

const RECOMMENDED: RecommendedDestination[] = [
  { destinationId: "rome", reason: "고대 문명과 현대 도시의 조화" },
  { destinationId: "istanbul", reason: "동양과 서양이 만나는 역사의 교차로" },
  { destinationId: "paris", reason: "문화와 예술의 중심" },
  { destinationId: "tokyo", reason: "전통과 혁신의 교차점" },
];

export function Recommended() {
  const recommendedDests = RECOMMENDED.map((rec) => {
    const dest = destinations.find((d) => d.id === rec.destinationId);
    return { ...rec, destination: dest };
  }).filter((item) => item.destination);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-ink">
          직접 추천하는 여행지
        </h2>
        <p className="text-body">
          25년의 경험 중에서 꼭 방문해야 할 곳들을 선별했습니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {recommendedDests.map(({ destination, reason }) => (
          <Link
            key={destination!.id}
            href={`/?destination=${destination!.id}`}
            className="group overflow-hidden rounded-md border border-hairline bg-canvas transition-shadow hover:shadow-card"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={destination!.image.url}
                alt={destination!.image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold text-ink group-hover:text-primary">
                {destination!.name}
              </h3>
              <p className="mb-3 text-sm text-muted">{destination!.country}</p>
              <p className="text-ink">{reason}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded border border-hairline-strong px-lg text-label-md text-ink hover:bg-surface-container transition-colors"
        >
          다른 여행지도 둘러보기 →
        </Link>
      </div>
    </div>
  );
}
