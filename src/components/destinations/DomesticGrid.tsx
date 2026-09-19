/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Destination } from "@/data/destinations";
import { domesticDestinations } from "@/data/destinations";
import { DestinationDrawer } from "./DestinationDrawer";

export function DomesticGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 공유 가능한 딥링크: ?destination=seoul 로 접속하면 해당 카드 상세가 바로 열린다.
  useEffect(() => {
    const destId = searchParams.get("destination");
    if (!destId) return;
    const match = domesticDestinations.find((d) => d.id === destId);
    if (match) {
      setSelectedDest(match);
      setDrawerOpen(true);
    }
  }, [searchParams]);

  const openDestination = (dest: Destination) => {
    setSelectedDest(dest);
    setDrawerOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("destination", dest.id);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("destination");
    const query = params.toString();
    router.replace(query ? `?${query}` : "/", { scroll: false });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        {domesticDestinations.slice(0, 6).map((dest) => {
          const oneLineSummary =
            dest.summary.length > 60
              ? `${dest.summary.slice(0, 60)}…`
              : dest.summary;
          const themeChips = dest.attractions.slice(0, 2);

          return (
            <button
              key={dest.id}
              onClick={() => openDestination(dest)}
              className="group rounded-md border border-hairline text-left transition-shadow hover:shadow-card"
            >
              <div className="overflow-hidden rounded-t-md bg-surface-container">
                <Image
                  src={dest.image.url}
                  alt={dest.image.alt}
                  width={280}
                  height={210}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-ink group-hover:text-primary">
                  {dest.name}
                </h3>
                <p className="mt-1 text-sm text-body">{dest.country}</p>
                <p className="mt-2 text-sm text-body line-clamp-1">
                  {oneLineSummary}
                </p>
                {themeChips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {themeChips.map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-ink"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <DestinationDrawer
        destination={selectedDest}
        isOpen={drawerOpen}
        onClose={closeDrawer}
      />
    </>
  );
}
