/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { destinations, type Destination } from "@/data/destinations";

interface Filters {
  country?: string;
  region?: string;
  search?: string;
}

export function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Destination[]>(destinations);
  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    const country = searchParams.get("country") || undefined;
    const region = searchParams.get("region") || undefined;
    const searchQuery = searchParams.get("search") || undefined;

    const newFilters = { country, region, search: searchQuery };
    setFilters(newFilters);
    setSearch(searchQuery || "");

    let filtered = destinations;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(searchLower) ||
        d.country.toLowerCase().includes(searchLower) ||
        d.region.toLowerCase().includes(searchLower) ||
        d.summary.toLowerCase().includes(searchLower) ||
        d.attractions.some((a) => a.toLowerCase().includes(searchLower))
      );
    }

    if (country) {
      filtered = filtered.filter((d) => d.country === country);
    }

    if (region) {
      filtered = filtered.filter((d) => d.region === region);
    }

    setResults(filtered);
    setShowEmpty(filtered.length === 0);
  }, [searchParams]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    if (!value) delete newFilters[key];

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });

    router.push(`/?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setFilters({});
    router.push("/");
  };

  const getRegions = (): string[] => {
    if (!filters.country) return [];
    return [
      ...new Set(
        destinations
          .filter((d) => d.country === filters.country)
          .map((d) => d.region)
      ),
    ];
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-12 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            여행지를 찾아보세요
          </h1>
          <p className="text-lg text-gray-600">
            50개 국가, 100개 이상의 여행지에서 당신의 다음 여행을 발견하세요
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-full shadow-lg p-4 mb-8 flex flex-col lg:flex-row gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="여행지명, 국가로 검색..."
            className="flex-1 px-4 py-2 outline-none text-gray-900 placeholder-gray-500"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
            검색
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <select
            value={filters.country || ""}
            onChange={(e) => {
              handleFilterChange("country", e.target.value);
              handleFilterChange("region", "");
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
          >
            <option value="">국가</option>
            {[
              ...new Set(destinations.map((d) => d.country)),
            ].sort().map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={filters.region || ""}
            onChange={(e) => handleFilterChange("region", e.target.value)}
            disabled={!filters.country}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none disabled:bg-gray-100"
          >
            <option value="">지역</option>
            {getRegions().map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors col-span-2 lg:col-span-2"
          >
            초기화
          </button>
        </div>

        {/* Results */}
        {showEmpty ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-lg text-gray-600 mb-4">
              검색 조건에 맞는 여행지가 없습니다.
            </p>
            <p className="text-gray-500 mb-6">필터를 완화하거나 다른 키워드로 시도해보세요.</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              조건 초기화하기
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 font-semibold mb-4">
              검색 결과: {results.length}개
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {results.slice(0, 12).map((destination) => (
                <div
                  key={destination.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {destination.country}
                    {destination.region && ` · ${destination.region}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {destination.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
