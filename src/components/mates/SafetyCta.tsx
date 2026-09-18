export function SafetyCta() {
  return (
    <section className="border-t border-gray-200 bg-amber-50 px-6 py-12 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              안전한 여행을 위해
            </h3>
            <p className="text-gray-600">
              동행자를 선택할 때 안전이 최우선입니다. 플랫폼 내 메시지 기능으로 안전하게 소통하세요.
            </p>
          </div>
          <a
            href="/account#safety-info"
            className="shrink-0 rounded-lg border border-amber-300 bg-amber-100 px-6 py-3 font-medium text-amber-900 hover:bg-amber-200"
          >
            안전 정보 보기
          </a>
        </div>
      </div>
    </section>
  );
}
