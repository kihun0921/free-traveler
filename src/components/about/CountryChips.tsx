"use client";

interface CountryGroup {
  region: string;
  countries: string[];
}

const COUNTRY_GROUPS: CountryGroup[] = [
  {
    region: "아시아",
    countries: [
      "대한민국",
      "일본",
      "중국",
      "태국",
      "베트남",
      "캄보디아",
      "라오스",
      "미얀마",
      "인도",
      "스리랑카",
    ],
  },
  {
    region: "유럽",
    countries: [
      "프랑스",
      "이탈리아",
      "스페인",
      "포르투갈",
      "독일",
      "폴란드",
      "그리스",
      "오스트리아",
      "스위스",
    ],
  },
  {
    region: "북미",
    countries: ["미국", "캐나다", "멕시코"],
  },
  {
    region: "오세아니아",
    countries: ["호주", "뉴질랜드", "피지"],
  },
];

export function CountryChips() {
  return (
    <div className="space-y-8">
      {COUNTRY_GROUPS.map((group) => (
        <div key={group.region}>
          <h3 className="mb-4 text-lg font-semibold text-ink">
            {group.region}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.countries.map((country) => (
              <span
                key={country}
                className="inline-flex items-center rounded-full bg-surface-container px-3 py-1 text-sm font-medium text-ink"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
