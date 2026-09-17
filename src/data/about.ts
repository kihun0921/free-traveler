export interface TimelineEntry {
  year: number;
  title: string;
  description: string;
}

export interface RecommendedDestination {
  destinationId: string;
  reason: string;
}

export interface RepresentativeProfile {
  /** 대표 이름 */
  name: string;
  /** 대표 소개 한 문장 */
  tagline: string;
  /** 상세 소개 (500자 이상) */
  introduction: string;
  /** 여행 철학 (300자 이상) */
  philosophy: string;
  /** 누적 방문 국가 수 */
  countriesVisited: number;
  /** 누적 여행 경험 수 */
  tripsCompleted: number;
  /** 여행 경력 (연도 단위) */
  yearsOfExperience: number;
  /** 시간 순서대로 정렬된 여행 경력 Timeline (6개 이상) */
  timeline: TimelineEntry[];
  /** 추천 여행지 4개 (destinations.ts의 id 참조) */
  recommendedDestinations: RecommendedDestination[];
}

const REPRESENTATIVE: RepresentativeProfile = {
  name: "Free Traveler",
  tagline: "세계를 누비며 여행의 새로운 방식을 찾는 사람",
  introduction:
    "Free Traveler는 2000년대 초부터 시작한 여행 경험을 바탕으로 전 세계 50개 이상 국가를 방문했습니다. 초기에는 배낭여행자로 유명한 동남아시아, 중남미 일대를 중심으로 활동했으며, 이후 유럽·아프리카·중동·북태평양 지역으로 활동 범위를 확대했습니다. 단순히 명소를 도는 관광을 넘어, 현지 문화를 존중하고 지역 공동체와 함께하는 여행의 의미를 추구합니다. 이 과정에서 만난 여행자들과의 인연, 현지인들과 나눈 대화, 예상치 못한 경험들이 모여 이 서비스의 철학을 이루었습니다.",
  philosophy:
    "여행은 누구나 할 수 있어야 합니다. 여행 정보는 투명하고 접근 가능해야 하며, 혼자라도 안전하게 동행을 찾을 수 있어야 합니다. Free Traveler는 기성 패키지 여행 대행사가 아닌, 스스로 계획하고 결정하는 여행자를 응원합니다. 다양한 경험을 나누고, 세계 곳곳의 문화를 존중하며, 미래 세대를 위한 지속 가능한 여행을 함께 만들어갈 수 있는 플랫폼을 꿈꿉니다.",
  countriesVisited: 32,
  tripsCompleted: 57,
  yearsOfExperience: 24,
  timeline: [
    {
      year: 2000,
      title: "첫 여행, 태국 방콕",
      description:
        "대학생 시절 처음 해외 여행을 시작했습니다. 태국 방콕의 골목길을 헤매며 여행의 매력에 빠지게 됩니다.",
    },
    {
      year: 2002,
      title: "동남아 배낭여행의 시작",
      description:
        "태국, 베트남, 캄보디아를 거쳐 1년 여행을 다녀옵니다. 게스트하우스에서 만난 여행자들과의 인연이 평생의 친구가 됩니다.",
    },
    {
      year: 2008,
      title: "중미·남미 확장 탐방",
      description:
        "멕시코에서 칠레까지 남미 대륙 전역을 8개월에 걸쳐 종주합니다. 잉카 문명과 아마존의 자연에 깊은 인상을 받습니다.",
    },
    {
      year: 2013,
      title: "유럽·북아프리카 회주행",
      description:
        "포르투갈에서 시작해 유럽 전역을 거쳐 모로코까지 약 6개월간 여행합니다. 문화 다양성의 가치를 깨닫습니다.",
    },
    {
      year: 2018,
      title: "아프리카 대륙 횡단",
      description:
        "케냐, 탄자니아, 짐바브웨 등 동아프리카를 순회합니다. 사바나의 자연과 현지 부족의 전통을 경험합니다.",
    },
    {
      year: 2024,
      title: "Free Traveler 서비스 런칭",
      description:
        "25년간의 여행 경험과 통찰을 바탕으로 Free Traveler 플랫폼을 시작합니다. 더 많은 여행자가 안전하고 의미 있는 여행을 할 수 있도록 돕는 것을 목표로 합니다.",
    },
  ],
  recommendedDestinations: [
    {
      destinationId: "seoul",
      reason:
        "전통과 현대가 공존하는 도시. 짧은 기간에 역사·문화·미식·쇼핑을 모두 경험할 수 있는 완벽한 입문 여행지입니다.",
    },
    {
      destinationId: "tokyo",
      reason:
        "정밀함과 인간미가 공존하는 도시. 미세한 문화적 차이에서 오는 경험의 깊이가 여행을 통해 배울 수 있는 소중한 교훈입니다.",
    },
    {
      destinationId: "bangkok",
      reason:
        "동남아시아 여행의 시작점. 거리 음식·야시장·사찰·강변 풍경이 뒤섞여 있는 매력적인 도시이며, 주변 여행지로의 허브입니다.",
    },
    {
      destinationId: "denpasar",
      reason:
        "발리의 중심. 해변·논밭·사찰 문화가 조화로워 휴식과 문화 경험을 동시에 얻을 수 있는 곳입니다.",
    },
  ],
};

export default REPRESENTATIVE;
