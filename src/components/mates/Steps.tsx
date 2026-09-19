function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden="true">
      <circle cx={11} cy={11} r={6.5} stroke="currentColor" strokeWidth={1.75} />
      <path d="M20 20L16 16" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden="true">
      <path d="M4 20h4.5L18 10.5a2.1 2.1 0 0 0-3-3L5.5 17v3Z" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" />
      <path d="M13 6.5 17.5 11" stroke="currentColor" strokeWidth={1.75} />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden="true">
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.75} />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      aria-hidden="true"
      className="hidden shrink-0 text-hairline-strong md:block"
    >
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Steps() {
  const steps = [
    {
      number: 1,
      title: "동행글 찾기",
      description: "관심 있는 여행지, 기간, 스타일에 맞는 동행글을 찾습니다.",
      icon: SearchIcon,
    },
    {
      number: 2,
      title: "신청서 작성",
      description:
        "자신을 소개하는 간단한 메시지와 함께 신청합니다. 플랫폼 내 메시지로 소통해요.",
      icon: EditIcon,
    },
    {
      number: 3,
      title: "동행자 확정",
      description: "작성자의 승인을 받으면 함께 여행을 준비할 수 있습니다.",
      icon: CheckIcon,
    },
  ];

  return (
    <section className="border-t border-hairline px-base py-section-mobile-min lg:px-base lg:py-section-desktop-min">
      <div className="mx-auto max-w-content-desktop">
        <h3 className="mb-lg text-center text-headline-lg text-ink">
          신청 방법
        </h3>

        <div className="flex flex-col gap-base md:flex-row md:items-stretch">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-1 items-stretch gap-base">
                <div className="group flex-1 rounded-md border border-hairline bg-canvas p-lg text-center transition-all hover:-translate-y-0.5 hover:shadow-card">
                  <div className="relative mx-auto mb-base flex h-12 w-12 items-center justify-center rounded-full bg-primary-disabled text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                    <Icon />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs font-bold text-on-primary">
                      {step.number}
                    </span>
                  </div>
                  <h4 className="mb-2 font-semibold text-ink">{step.title}</h4>
                  <p className="text-body-sm text-body">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden items-center md:flex">
                    <ArrowIcon />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
