interface PhilosophyCard {
  title: string;
  description: string;
  icon: string;
}

const PHILOSOPHY_CARDS: PhilosophyCard[] = [
  {
    title: "투명한 정보",
    description:
      "모든 여행 정보는 기만 없이 투명하게 공개되어야 합니다. 사용자가 신뢰할 수 있는 데이터를 기반으로 스스로 결정합니다.",
    icon: "🔍",
  },
  {
    title: "접근 가능성",
    description:
      "누구나 여행할 수 있어야 합니다. 경제적, 신체적, 사회적 장벽 없이 모든 여행자를 응원합니다.",
    icon: "🌍",
  },
  {
    title: "안전과 공동체",
    description:
      "혼자여도 안전하게 동행을 찾을 수 있어야 하고, 지역 공동체를 존중하는 여행을 지향합니다.",
    icon: "🤝",
  },
];

export function IntroPhilosophy() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="mb-8 text-2xl font-bold text-gray-900">여행 철학</h2>
        <p className="mb-8 max-w-3xl leading-relaxed text-gray-700">
          여행은 누구나 할 수 있어야 합니다. 여행 정보는 투명하고 접근 가능해야 하며, 혼자라도 안전하게
          동행을 찾을 수 있어야 합니다. Free Traveler는 기성 패키지 여행 대행사가 아닌, 스스로 계획하고
          결정하는 여행자를 응원합니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PHILOSOPHY_CARDS.map((card) => (
          <div key={card.title} className="rounded-lg bg-gray-50 p-6">
            <div className="mb-4 text-4xl">{card.icon}</div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {card.title}
            </h3>
            <p className="text-gray-700">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
