import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  location: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
    alt: "태국 방콕의 왓 아룬 사원과 차오프라야 강의 야경",
    location: "태국, 방콕",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    alt: "페루 마추픽추의 안데스 산맥 유적지",
    location: "페루, 마추픽추",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    alt: "프랑스 파리의 에펠탑과 센 강",
    location: "프랑스, 파리",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
    alt: "오스트레일리아 시드니의 오페라 하우스",
    location: "호주, 시드니",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1504681869696-d977e3a34996?w=600&h=400&fit=crop",
    alt: "일본 교토의 후시미 이나리 신사의 붉은 도리이",
    location: "일본, 교토",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
    alt: "캐나다 밴프 국립공원의 레이크 루이즈와 산악 풍경",
    location: "캐나다, 밴프",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop",
    alt: "스위스 체르마트의 마터호른 산과 알프스 풍경",
    location: "스위스, 체르마트",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1500489944862-fd3350628b63?w=600&h=400&fit=crop",
    alt: "모로코 마라케시의 전통 메디나 시장과 건축물",
    location: "모로코, 마라케시",
  },
];

export function Gallery() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {GALLERY_IMAGES.map((image) => (
          <div key={image.id} className="overflow-hidden rounded-lg bg-gray-200">
            <div className="relative h-64 w-full">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="bg-white p-3">
              <p className="text-sm font-medium text-gray-900">
                {image.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
