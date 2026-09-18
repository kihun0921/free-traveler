import Link from "next/link";

export function Intro() {
  return (
    <section className="border-b border-hairline bg-surface-soft px-6 py-12 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-ink lg:text-4xl">
              함께 여행할 사람을 찾고 있나요?
            </h2>
            <p className="text-lg text-body">
              동행글을 작성하고 같은 마음의 여행자들을 만나보세요.
            </p>
          </div>
          <Link
            href="/travel-tools#mate-section"
            className="shrink-0 rounded-lg bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-hover"
          >
            동행글 작성하기
          </Link>
        </div>
      </div>
    </section>
  );
}
