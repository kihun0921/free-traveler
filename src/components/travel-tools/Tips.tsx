"use client";

interface Tip {
  id: string;
  category: string;
  title: string;
  content: string;
}

const TRAVEL_TIPS: Tip[] = [
  {
    id: "1",
    category: "준비",
    title: "여행 체크리스트",
    content:
      "출국 2주 전: 여권 유효기간 확인, 비자 신청 (필요한 경우), 항공권 예약. 1주 전: 숙소 최종 확인, 짐 준비, 환전. 출국 당일: 항공사 앱 체크인, 공항 3시간 전 도착.",
  },
  {
    id: "2",
    category: "안전",
    title: "긴급 상황 대응",
    content:
      "여행 전 대사관 연락처, 보험사 긴급 전화번호, 숙소 긴급 연락처를 기록해두세요. 외교부 '해외안전정보' 앱을 설치하고, 정기적으로 안전정보를 확인하세요.",
  },
  {
    id: "3",
    category: "문화",
    title: "현지 에티켓",
    content:
      "종교 시설 방문 시 복장 확인, 사진 촬영 금지 구역 존중, 현지인에게 사진 찍기 전 허락 구하기. 음식 거부 시 존중하는 태도 유지하기.",
  },
  {
    id: "4",
    category: "금전",
    title: "통화·환전",
    content:
      "현지 통화는 도착 후 공항이나 현지 은행에서 환전. 신용카드는 수수료가 낮지만, 현금도 준비하기. 환율을 자주 확인하고, 큰 금액을 한 번에 환전하지 않기.",
  },
  {
    id: "5",
    category: "교통",
    title: "이동 팁",
    content:
      "대중교통 정기권 구매 (저렴함), 택시는 공식 택시만 이용, 밤늦은 귀환 피하기. 숙소에서 대중교통 앱 설치 추천 (Google Maps, Citymapper 등).",
  },
  {
    id: "6",
    category: "건강",
    title: "여행 중 건강 관리",
    content:
      "충분한 수면, 수분 섭취, 자외선 차단제 사용. 소화제, 감기약, 파스 등 상비약 준비. 현지 의료 시설 위치 미리 확인하기.",
  },
];

export function Tips() {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold text-gray-900">여행 팁</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {TRAVEL_TIPS.map((tip) => (
          <div key={tip.id} className="rounded-lg bg-gray-50 p-4">
            <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {tip.category}
            </div>
            <h4 className="mb-3 text-base font-semibold text-gray-900">
              {tip.title}
            </h4>
            <p className="text-sm text-gray-700">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
