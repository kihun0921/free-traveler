import Image from "next/image";
import { destinations } from "@/data/destinations";

interface RecommendedDestination {
  destinationId: string;
  reason: string;
}

const RECOMMENDED: RecommendedDestination[] = [
  { destinationId: "ayutthaya", reason: "고대 문명과 현대의 조화" },
  { destinationId: "cusco", reason: "역사와 자연의 만남" },
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
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          직접 추천하는 여행지
        </h2>
        <p className="text-gray-600">
          25년의 경험 중에서 꼭 방문해야 할 곳들을 선별했습니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {recommendedDests.map(({ destination, reason }) => (
          <div
            key={destination!.id}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={destination!.image.url}
                alt={destination!.image.alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {destination!.name}
              </h3>
              <p className="mb-3 text-sm text-gray-500">{destination!.country}</p>
              <p className="text-gray-700">{reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
