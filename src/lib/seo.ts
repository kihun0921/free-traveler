import type { Metadata } from "next";

interface SEOMetadataParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}

export function generateSEOMetadata({
  title,
  description,
  path,
  image = "/og-default.png",
  type = "website",
}: SEOMetadataParams): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://freetraveler.vercel.app";
  const fullUrl = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "Free Traveler",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export const PAGE_METADATA = {
  home: {
    title: "Free Traveler — 함께 떠나는 자유로운 여행",
    description: "안전하고 신뢰할 수 있는 동행자를 찾고, 전 세계 여행 정보를 한곳에서 확인하세요.",
    path: "/",
  },
  about: {
    title: "대표 소개 — Free Traveler",
    description: "세계를 여행하는 여정 속에서 만난 사람들의 이야기와 동행의 가치를 나눕니다.",
    path: "/about",
  },
  travelTools: {
    title: "여행 준비 — 항공편·숙소·동행 검색",
    description: "항공편과 숙소 정보를 확인하고, 함께 여행할 동행자를 찾아보세요.",
    path: "/travel-tools",
  },
  mates: {
    title: "동행 찾기 — 함께할 여행자 검색",
    description: "같은 취향의 여행자를 찾고, 안전하게 동행을 신청하세요.",
    path: "/mates",
  },
  account: {
    title: "계정 — 나의 여행 활동",
    description: "프로필 관리, 신청 현황, 안전 정보 및 설정을 한곳에서 확인하세요.",
    path: "/account",
  },
  terms: {
    title: "이용약관",
    description: "Free Traveler 서비스 이용약관입니다.",
    path: "/policies/terms",
  },
  privacy: {
    title: "개인정보 처리방침",
    description: "Free Traveler의 개인정보 처리 방침입니다.",
    path: "/policies/privacy",
  },
  mateSafety: {
    title: "동행 안전 가이드",
    description: "안전한 동행 활동을 위한 Free Traveler의 가이드라인입니다.",
    path: "/policies/mate-safety",
  },
  contentDisclaimer: {
    title: "콘텐츠 고지",
    description: "Free Traveler의 콘텐츠 사용 및 출처 안내입니다.",
    path: "/policies/content-disclaimer",
  },
  unauthorized: {
    title: "접근 불가 — Free Traveler",
    description: "요청하신 페이지에 접근할 수 없습니다.",
    path: "/unauthorized",
  },
};
