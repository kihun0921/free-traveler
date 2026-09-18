export function Steps() {
  const steps = [
    {
      number: 1,
      title: "동행글 찾기",
      description: "관심 있는 여행지, 기간, 스타일에 맞는 동행글을 찾습니다.",
    },
    {
      number: 2,
      title: "신청서 작성",
      description:
        "자신을 소개하는 간단한 메시지와 함께 신청합니다. 플랫폼 내 메시지로 소통해요.",
    },
    {
      number: 3,
      title: "동행자 확정",
      description:
        "작성자의 승인을 받으면 함께 여행을 준비할 수 있습니다.",
    },
  ];

  return (
    <section className="border-t border-gray-200 px-6 py-12 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <h3 className="mb-12 text-center text-2xl font-bold text-gray-900">
          신청 방법
        </h3>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                {step.number}
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">
                {step.title}
              </h4>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
