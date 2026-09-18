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

  const hasActiveFilter = Boolean(filters.country || filters.region || filters.search);

  return (
    <section className="bg-surface-soft rounded-xl px-base py-lg lg:px-xl lg:py-xl">
      <div className="max-w-content-desktop mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-lg">
          <h1 className="text-display-mobile lg:text-display text-ink mb-sm">
            여행지를 찾아보세요
          </h1>
          <p className="text-body-lg text-body">
            50개 국가, 100개 이상의 여행지에서 당신의 다음 여행을 발견하세요
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-canvas rounded-full border border-hairline-strong h-14 px-base mb-base flex items-center gap-sm max-w-2xl mx-auto focus-within:border-[1.5px] focus-within:border-focus-ring">
          <input
            type="text"
            value={search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="여행지명, 국가로 검색..."
            className="flex-1 h-full outline-none text-ink placeholder-muted bg-transparent"
          />
          <span className="text-primary text-label-md font-semibold whitespace-nowrap">
            검색
          </span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-sm mb-base max-w-2xl mx-auto">
          <select
            value={filters.country || ""}
            onChange={(e) => {
              handleFilterChange("country", e.target.value);
              handleFilterChange("region", "");
            }}
            className="h-12 px-md border border-hairline-strong rounded text-body-sm text-ink outline-none focus:border-[1.5px] focus:border-focus-ring"
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
            className="h-12 px-md border border-hairline-strong rounded text-body-sm text-ink outline-none disabled:bg-surface-container disabled:text-muted focus:border-[1.5px] focus:border-focus-ring"
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
            className="h-12 px-md border border-hairline-strong rounded text-label-md text-ink hover:bg-surface-container transition-colors col-span-2 lg:col-span-2"
          >
            초기화
          </button>
        </div>

        {/* Result count (filters applied only) */}
        {hasActiveFilter && (
          <div className="text-center">
            {showEmpty ? (
              <p className="text-body-md text-muted">
                검색 조건에 맞는 여행지가 없습니다. 필터를 완화하거나 다른 키워드로 시도해보세요.
              </p>
            ) : (
              <p className="text-body-md text-body">
                총 {results.length}건의 여행지를 찾았습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
