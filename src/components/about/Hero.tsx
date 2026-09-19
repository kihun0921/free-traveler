import Image from "next/image";

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-xl px-base py-xl lg:px-xl lg:py-xxl min-h-[320px] lg:min-h-[400px] flex flex-col justify-center text-center">
      <Image
        src="https://commons.wikimedia.org/wiki/Special:FilePath/Hot%20air%20balloons%20over%20valleys%20near%20G%C3%B6reme%2C%20Cappadocia%20at%20dawn.JPG"
        alt="터키 카파도키아 계곡 위로 떠오르는 새벽 열기구들"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* 음영 스크림 — 아래로 갈수록 짙어지는 그라데이션(DESIGN.md §6 scrim 토큰) */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/10"
        aria-hidden="true"
      />

      <div className="relative">
        <h1 className="mb-sm text-headline-lg lg:text-display-mobile font-bold text-on-primary drop-shadow-sm">
          Free Traveler
        </h1>
        <p className="mx-auto mb-base max-w-2xl text-body-lg text-on-primary/90 drop-shadow-sm">
          세계를 누비며 여행의 새로운 방식을 찾는 사람
        </p>
        <p className="mx-auto max-w-3xl rounded-md bg-canvas/90 px-base py-sm text-body-md leading-relaxed text-ink">
          25년간 50개 이상의 국가를 방문하며 축적한 경험과 통찰을 바탕으로, 더 많은 사람들이 안전하고
          의미 있는 여행을 할 수 있는 플랫폼을 만들고 있습니다.
        </p>
      </div>
    </div>
  );
}
