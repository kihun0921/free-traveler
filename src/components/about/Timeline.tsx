interface TimelineEntry {
  year: number;
  title: string;
  description: string;
}

const TIMELINE_ENTRIES: TimelineEntry[] = [
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
];

export function Timeline() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-ink">여행 경력</h2>
      <div className="space-y-8">
        {TIMELINE_ENTRIES.map((entry, index) => (
          <div key={entry.year} className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary font-semibold">
                {entry.year}
              </div>
              {index !== TIMELINE_ENTRIES.length - 1 && (
                <div className="mt-2 h-16 w-0.5 bg-hairline-strong" />
              )}
            </div>
            <div className="pb-8">
              <h3 className="mb-2 text-lg font-semibold text-ink">
                {entry.title}
              </h3>
              <p className="text-body">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
