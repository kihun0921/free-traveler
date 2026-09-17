export interface SafetyCategory {
  /** 분류: 건강·의료, 범죄·소매치기, 자연재해, 정치안정성, 교통안전, 테러위협, 사기·사취, 긴급연락처 */
  category:
    | "health"
    | "crime"
    | "disaster"
    | "political"
    | "transportation"
    | "terrorism"
    | "fraud"
    | "emergency";
  /** 분류별 상세 정보 */
  description: string;
}

export interface SafetyInfo {
  /** 국가 코드 (ISO 3166-1 alpha-2) */
  countryCode: string;
  /** 국가 이름 */
  country: string;
  /** 안전 정보의 범위 유형 */
  scopeType: "general" | "caution" | "advisory";
  /** 안전 정보의 범위 설명 (일반안내/주의/경고) */
  scopeText: string;
  /** 8개 카테고리 안전 정보 */
  categories: SafetyCategory[];
  /** 긴급 연락처 (국가별 공식 번호) */
  emergencyContacts: {
    police: string;
    ambulance: string;
    koreaEmbassy: string;
  };
  /** 정보 출처 */
  sourceUrl: string;
  /** 최종 확인 수정일 (YYYY-MM-DD) */
  lastVerifiedAt: string;
}

const SAFETY_INFO: SafetyInfo[] = [
  {
    countryCode: "JP",
    country: "일본",
    scopeType: "general",
    scopeText: "일반 안전 국가, 특별한 여행 제약 없음",
    categories: [
      {
        category: "health",
        description:
          "의료 수준이 높고 약국이 많으므로 응급 상황 대처가 용이합니다. 건강보험이 없으면 의료 비용이 상당하니 여행보험 가입 권장.",
      },
      {
        category: "crime",
        description:
          "전반적으로 치안이 좋으나, 도시의 번화가나 역 주변에서는 소매치기·날치기 주의. 귀중품 관리 필수.",
      },
      {
        category: "disaster",
        description:
          "지진 가능성이 있어 건물 구조와 비상구 확인이 중요합니다. 태풍 시즌(여름~초가을) 기후 예보 확인.",
      },
      {
        category: "political",
        description:
          "정치적으로 안정적인 국가. 대규모 집회나 시위는 드물며 일상 생활에 영향 없음.",
      },
      {
        category: "transportation",
        description:
          "대중교통이 안전하고 신뢰할 수 있습니다. 택시는 미터기 확인, 렌터카 운전 시 교통법규 준수 필요.",
      },
      {
        category: "terrorism",
        description:
          "테러 위협이 매우 낮습니다. 북한 관련 특수 상황을 제외하고는 안전.",
      },
      {
        category: "fraud",
        description:
          "관광객 대상 사기 사건은 드문 편. 유명 명소 주변 고가 음식점 요금 확인, 환전 시 정규 환전소 이용.",
      },
      {
        category: "emergency",
        description:
          "경찰 110, 소방차/구급차 119로 통일. 영어 대응 불가능한 경우가 많으므로 호텔 스태프 도움 청하기.",
      },
    ],
    emergencyContacts: {
      police: "110",
      ambulance: "119",
      koreaEmbassy: "+81-3-5211-4400",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/일본",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "CN",
    country: "중국",
    scopeType: "caution",
    scopeText: "일반적으로 안전하나 대도시 관광지에서 소매치기 주의",
    categories: [
      {
        category: "health",
        description:
          "의료 수준은 도시별로 편차가 있습니다. 유명 호텔 인근 국제 병원 이용 권장. 위생 관리에 주의.",
      },
      {
        category: "crime",
        description:
          "베이징, 상하이 등 대도시에서는 소매치기와 날치기가 발생합니다. 번화가와 대중교통에서 특히 주의. 밤늦은 외출 피하기.",
      },
      {
        category: "disaster",
        description:
          "남부 지역은 홍수 위험, 북부는 황사 현상이 있습니다. 계절별 기후 예보 확인 필수.",
      },
      {
        category: "political",
        description:
          "공산당 일당체제 국가. 정치적 민감한 주제 언급 자제. 대규모 집회나 시위 근처 피하기.",
      },
      {
        category: "transportation",
        description:
          "택시 이용 시 정부 허가 택시 확인(메터기 있음). 장거리는 고속철도 또는 항공편 이용. 야간 운전 피하기.",
      },
      {
        category: "terrorism",
        description:
          "테러 위협이 낮은 편. 신장 지역 여행 시 보안 상황 최신 정보 확인.",
      },
      {
        category: "fraud",
        description:
          "관광객 대상 위조 티켓이나 가짜 제품 판매 주의. 공식 판매처에서만 구입. 거리 환전상 이용 금지.",
      },
      {
        category: "emergency",
        description:
          "경찰 110, 소방차/구급차 120. 대도시의 국제 병원이나 호텔을 통한 긴급 요청 권장.",
      },
    ],
    emergencyContacts: {
      police: "110",
      ambulance: "120",
      koreaEmbassy: "+86-10-3468-1100",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/중화인민공화국",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "TW",
    country: "대만",
    scopeType: "general",
    scopeText: "일반적으로 안전한 국가, 특별한 여행 제약 없음",
    categories: [
      {
        category: "health",
        description:
          "의료 수준이 높고 건강보험 시스템이 잘 갖춰져 있습니다. 의료비도 합리적. 약국 접근성 좋음.",
      },
      {
        category: "crime",
        description:
          "치안이 매우 좋습니다. 여성 혼자 밤거리를 다니기도 안전한 편. 소매치기 가능성은 낮음.",
      },
      {
        category: "disaster",
        description:
          "태풍과 지진의 가능성이 있습니다. 8월~10월 태풍 시즌 기후 예보 확인. 건물 비상구 위치 파악.",
      },
      {
        category: "political",
        description:
          "민주주의 국가로 정치적으로 안정적입니다. 해협 양안 관계에 민감한 주제는 언급 자제.",
      },
      {
        category: "transportation",
        description:
          "대중교통이 안전하고 효율적. MRT(지하철)와 버스 네트워크 발달. 택시 요금 투명.",
      },
      {
        category: "terrorism",
        description:
          "테러 위협이 매우 낮습니다. 일상 생활에서 안전 위험 거의 없음.",
      },
      {
        category: "fraud",
        description:
          "사기 사건이 드문 편입니다. 환전은 은행 또는 공식 환전소 이용. 거리 장사 주의.",
      },
      {
        category: "emergency",
        description:
          "경찰 110, 소방차/구급차 119로 통일. 영어 대응 가능한 국제 병원 많음.",
      },
    ],
    emergencyContacts: {
      police: "110",
      ambulance: "119",
      koreaEmbassy: "+886-2-2715-0700",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/대만",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "VN",
    country: "베트남",
    scopeType: "caution",
    scopeText: "일반적으로 안전하나 소매치기와 오토바이 택시 주의",
    categories: [
      {
        category: "health",
        description:
          "의료 수준이 도시별로 편차가 있습니다. 호찌민, 하노이의 국제 클리닉 이용 권장. 식수는 생수 마시기.",
      },
      {
        category: "crime",
        description:
          "관광 지구에서 소매치기와 날치기 많음. 특히 야시장과 대중교통에서 주의. 야간 혼자 외출 피하기.",
      },
      {
        category: "disaster",
        description:
          "우기(5~9월) 홍수 위험. 북부 산간지역 산사태 가능. 계절별 기후 예보 확인.",
      },
      {
        category: "political",
        description:
          "공산당 일당체제 국가. 정치적 민감한 주제 피하기. 정부 정책 비판적 언급 자제.",
      },
      {
        category: "transportation",
        description:
          "택시 미터기 확인 필수. 오토바이 택시는 안전상 권장하지 않음. 장거리는 버스 또는 항공편 이용.",
      },
      {
        category: "terrorism",
        description: "테러 위협이 낮습니다. 일반 관광지는 안전.",
      },
      {
        category: "fraud",
        description:
          "관광객 대상 가격 사기와 위조 상품 많음. 공식 가게 이용. 거리 환전상 피하기. 지정된 투어 회사 선택.",
      },
      {
        category: "emergency",
        description:
          "경찰 113, 소방차/구급차 114. 호텔 통역원 도움 받기. 한국 영사관 긴급 연락.",
      },
    ],
    emergencyContacts: {
      police: "113",
      ambulance: "114",
      koreaEmbassy: "+84-24-3942-5656",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/베트남",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "TH",
    country: "태국",
    scopeType: "caution",
    scopeText: "일반적으로 안전하나 정치 상황과 소매치기 주의",
    categories: [
      {
        category: "health",
        description:
          "방콕, 치앙마이의 의료 시설이 잘 갖춰져 있습니다. 의약품과 비타민 영수증 보관. 물은 생수 마시기.",
      },
      {
        category: "crime",
        description:
          "방콕과 관광지에서 소매치기 다발. 야시장과 대중교통에서 주의. 밤 늦은 외출 피하기. 여성 혼자 외출 주의.",
      },
      {
        category: "disaster",
        description:
          "우기(5~10월) 홍수 위험. 건기는 건조하고 스모그 가능. 시즌별 기후 정보 확인.",
      },
      {
        category: "political",
        description:
          "정치적으로 불안정한 시기가 있습니다. 시위나 쿠데타 위험 관련 최신 정보 확인. 왕실 모독 절대 금지.",
      },
      {
        category: "transportation",
        description:
          "택시 미터기 확인. 방콕 오토바이 택시는 위험. 장거리는 야간 버스 또는 항공편 이용. 야간 운전 피하기.",
      },
      {
        category: "terrorism",
        description:
          "남부 깟따이 지역은 테러 위협이 있으므로 방문 자제. 주요 관광지 보안은 양호.",
      },
      {
        category: "fraud",
        description:
          "보석 사기와 택시 바가지 요금 많음. 공식 택시 또는 앱(Grab, Line) 이용. 거리 보석점 피하기.",
      },
      {
        category: "emergency",
        description:
          "경찰 191, 소방차/구급차 1669. 관광경찰(Tourist Police) 1155 한영중 가능. 호텔 도움 요청.",
      },
    ],
    emergencyContacts: {
      police: "191",
      ambulance: "1669",
      koreaEmbassy: "+66-2-2040-4000",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/태국",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "SG",
    country: "싱가포르",
    scopeType: "general",
    scopeText: "매우 안전한 국가, 특별한 여행 제약 없음",
    categories: [
      {
        category: "health",
        description:
          "의료 수준이 세계 최상위 수준입니다. 건강보험이 없으면 의료비가 상당하니 여행보험 가입 필수.",
      },
      {
        category: "crime",
        description:
          "아시아에서 가장 안전한 도시. 소매치기와 범죄가 거의 없음. 여성 혼자 밤거리 다녀도 안전.",
      },
      {
        category: "disaster",
        description:
          "자연 재해 가능성이 낮습니다. 연중 고온 다습한 기후. 우기 대비 우산 준비.",
      },
      {
        category: "political",
        description:
          "정치적으로 매우 안정적입니다. 민주주의 국가로 시위는 거의 없음.",
      },
      {
        category: "transportation",
        description:
          "MRT와 버스 네트워크가 완벽합니다. 택시 요금 투명하고 안전. 그랩(Grab) 앱 이용 편리.",
      },
      {
        category: "terrorism",
        description:
          "테러 위협이 매우 낮습니다. 국제 금융 중심지로 보안이 우수함.",
      },
      {
        category: "fraud",
        description:
          "사기 사건이 매우 드문 편입니다. 신뢰할 수 있는 상권. 환전은 은행 또는 공식 환전소.",
      },
      {
        category: "emergency",
        description:
          "경찰 999, 소방차/구급차 995. 영어 대응 완벽. 국제 표준 응급 서비스.",
      },
    ],
    emergencyContacts: {
      police: "999",
      ambulance: "995",
      koreaEmbassy: "+65-6256-1188",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/싱가포르",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "MY",
    country: "말레이시아",
    scopeType: "caution",
    scopeText: "일반적으로 안전하나 소매치기와 도시별 치안 편차 주의",
    categories: [
      {
        category: "health",
        description:
          "쿠알라룸푸르의 의료 시설이 잘 갖춰져 있습니다. 의료비는 합리적. 깨끗한 물 공급.",
      },
      {
        category: "crime",
        description:
          "쿠알라룸푸르의 야간 지구에서 소매치기 주의. 밤늦은 외출 피하기. 번화가는 상대적으로 안전.",
      },
      {
        category: "disaster",
        description:
          "우기(9~3월)는 폭우와 홍수 위험. 동해안은 11월~3월 우기 심각. 계절별 정보 확인.",
      },
      {
        category: "political",
        description:
          "정치적으로 상대적으로 안정적. 다종교 다민족 사회이므로 종교 존중. 왕실 존경 필수.",
      },
      {
        category: "transportation",
        description:
          "쿠알라룸푸르 택시 미터기 확인. Grab 앱 이용 권장. 도시간 장거리는 버스 또는 항공편.",
      },
      {
        category: "terrorism",
        description:
          "테러 위협이 낮은 편. 사바/사라왁 주(보르네오) 일부 지역은 여행 자제권.",
      },
      {
        category: "fraud",
        description:
          "관광객 대상 사기가 가능합니다. 공식 환전소 이용. 거리 장사 주의. 지정 투어 회사 선택.",
      },
      {
        category: "emergency",
        description:
          "경찰 999, 소방차/구급차 994. 쿠알라룸푸르는 영어 대응 가능. 호텔 통역 요청.",
      },
    ],
    emergencyContacts: {
      police: "999",
      ambulance: "994",
      koreaEmbassy: "+60-3-2012-6600",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/말레이시아",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "ID",
    country: "인도네시아",
    scopeType: "caution",
    scopeText: "일반적으로 안전하나 소매치기와 테러 위협(특정 지역) 주의",
    categories: [
      {
        category: "health",
        description:
          "자카르타, 발리의 의료 시설이 일정 수준 갖춰져 있습니다. 위생에 주의. 물은 생수 마시기.",
      },
      {
        category: "crime",
        description:
          "발리와 자카르타에서 소매치기 주의. 야시장과 관광지 인파에서 주의. 야간 외출 자제.",
      },
      {
        category: "disaster",
        description:
          "우기(11~3월)는 홍수와 산사태 위험. 화산 활동 가능. 자연재해 뉴스 확인.",
      },
      {
        category: "political",
        description:
          "정치적으로 민주주의 국가로 상대적 안정. 종교 다양성 존중. 무슬림 국가이므로 예절 필요.",
      },
      {
        category: "transportation",
        description:
          "발리 택시는 미터기 확인 또는 Grab 앱 이용. 오토바이 택시는 위험. 장거리는 항공편 이용.",
      },
      {
        category: "terrorism",
        description:
          "테러 위협이 낮지 않습니다. 발리, 자카르타 기독교 예배당 등 특정 시설은 경계. 종교 갈등 관련 정보 확인.",
      },
      {
        category: "fraud",
        description:
          "관광객 대상 사기와 위조 상품이 있습니다. 공식 상점 이용. 거리 환전상 피하기. 지정 투어 선택.",
      },
      {
        category: "emergency",
        description:
          "경찰 110, 소방차/구급차 118. 영어 대응 제한적. 호텔과 영사관 지원 요청.",
      },
    ],
    emergencyContacts: {
      police: "110",
      ambulance: "118",
      koreaEmbassy: "+62-21-5361-7171",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/인도네시아",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "TR",
    country: "튀르키예",
    scopeType: "caution",
    scopeText: "일반적으로 안전하나 정치 상황과 소매치기 주의",
    categories: [
      {
        category: "health",
        description:
          "이스탄불과 안카라의 의료 시설이 잘 갖춰져 있습니다. 의료비는 합리적. 물은 일반적으로 안전.",
      },
      {
        category: "crime",
        description:
          "이스탄불의 관광지와 바자르에서 소매치기 주의. 밤 늦은 외출 피하기. 여성 혼자 외출 주의.",
      },
      {
        category: "disaster",
        description:
          "지진 가능성이 있습니다. 2023년 대지진 이후 건설 기준 강화. 건물 안전도 확인.",
      },
      {
        category: "political",
        description:
          "정치적으로 불안정한 시기가 있을 수 있습니다. 시위와 쿠데타 관련 최신 정보 확인. 정부 비판 자제.",
      },
      {
        category: "transportation",
        description:
          "택시 미터기 확인. Bitaksi 앱 이용 권장. 장거리는 버스 또는 항공편. 야간 운전 피하기.",
      },
      {
        category: "terrorism",
        description:
          "테러 위협이 존재합니다. PKK 관련 폭탄 테러 가능. 종교 시설과 경찰 근처 주의. 정보 확인 필수.",
      },
      {
        category: "fraud",
        description:
          "관광객 대상 사기와 가격 바가지 있습니다. 바자르 흥정은 예절 있게. 공식 상점 이용. 환전소 확인.",
      },
      {
        category: "emergency",
        description:
          "경찰 155, 소방차/구급차 112. 관광경찰(Tourpolice) 가능. 영어 제한적, 호텔 도움 요청.",
      },
    ],
    emergencyContacts: {
      police: "155",
      ambulance: "112",
      koreaEmbassy: "+90-312-4468-600",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/튀르키예",
    lastVerifiedAt: "2026-09-01",
  },
  {
    countryCode: "AE",
    country: "아랍에미리트",
    scopeType: "general",
    scopeText: "일반적으로 안전한 국가, 특별한 여행 제약 없음",
    categories: [
      {
        category: "health",
        description:
          "의료 수준이 높고 현대적 병원이 많습니다. 건강보험 없으면 의료비가 상당하니 여행보험 필수.",
      },
      {
        category: "crime",
        description:
          "범죄율이 낮아 안전합니다. 소매치기와 강도 가능성 낮음. 여성 혼자 외출도 안전한 편.",
      },
      {
        category: "disaster",
        description:
          "자연 재해가 거의 없습니다. 매우 건조한 사막 기후. 여름(6~8월) 극고온 주의.",
      },
      {
        category: "political",
        description:
          "정치적으로 매우 안정적입니다. 절대군주제이지만 관광객에게는 영향 없음.",
      },
      {
        category: "transportation",
        description:
          "택시 미터기 확인. Uber, Careem 앱 이용 편리. 운전면허증 준비. 항공편이 안전하고 신뢰할 수 있음.",
      },
      {
        category: "terrorism",
        description: "테러 위협이 낮습니다. 국제 금융 중심지로 보안이 우수함.",
      },
      {
        category: "fraud",
        description:
          "관광객 대상 사기가 적은 편입니다. 공식 상점과 몰 쇼핑 권장. 환전은 은행 또는 호텔.",
      },
      {
        category: "emergency",
        description:
          "경찰 999, 소방차/구급차 998. 영어 대응 완벽. 국제 표준 응급 서비스.",
      },
    ],
    emergencyContacts: {
      police: "999",
      ambulance: "998",
      koreaEmbassy: "+971-4-308-8222",
    },
    sourceUrl: "https://ko.wikipedia.org/wiki/아랍에미리트",
    lastVerifiedAt: "2026-09-01",
  },
];

export default SAFETY_INFO;
