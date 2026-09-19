import type { ComponentType } from "react";

interface Stat {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden="true">
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.75} />
      <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9Z" stroke="currentColor" strokeWidth={1.75} />
    </svg>
  );
}

function SuitcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden="true">
      <rect x={3.5} y={7.5} width={17} height={12} rx={2} stroke="currentColor" strokeWidth={1.75} />
      <path d="M8.5 7.5V6a2.5 2.5 0 0 1 2.5-2.5h2A2.5 2.5 0 0 1 15.5 6v1.5" stroke="currentColor" strokeWidth={1.75} />
      <path d="M3.5 12.5h17" stroke="currentColor" strokeWidth={1.75} />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden="true">
      <rect x={3.5} y={5} width={17} height={15} rx={2} stroke="currentColor" strokeWidth={1.75} />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden="true">
      <circle cx={9} cy={8.5} r={3} stroke="currentColor" strokeWidth={1.75} />
      <path d="M2.5 19.5c1.1-3.2 3.6-4.8 6.5-4.8s5.4 1.6 6.5 4.8" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      <path d="M15.5 6a3 3 0 0 1 0 5.8M18.5 19.5c-.6-1.9-1.8-3.3-3.3-4.1" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
    </svg>
  );
}

const STATS: Stat[] = [
  { label: "방문 국가", value: 32, icon: GlobeIcon },
  { label: "완료한 여행", value: 57, icon: SuitcaseIcon },
  { label: "경험 연수", value: "24년", icon: CalendarIcon },
  { label: "만난 여행자", value: "수백 명", icon: UsersIcon },
];

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-base lg:grid-cols-4">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group rounded-md border border-hairline bg-canvas p-lg text-center transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="mx-auto mb-base flex h-12 w-12 items-center justify-center rounded-full bg-primary-disabled text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
              <Icon />
            </div>
            <div className="mb-xs text-headline-lg font-bold text-ink">
              {stat.value}
            </div>
            <div className="text-body-sm text-body">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
