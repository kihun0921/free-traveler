interface Stat {
  label: string;
  value: string | number;
}

const STATS: Stat[] = [
  { label: "방문 국가", value: 32 },
  { label: "완료한 여행", value: 57 },
  { label: "경험 연수", value: "24년" },
  { label: "만난 여행자", value: "수백 명" },
];

export function Stats() {
  return (
    <div className="grid gap-8 md:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="mb-2 text-4xl font-bold text-primary">
            {stat.value}
          </div>
          <div className="text-sm text-body">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
