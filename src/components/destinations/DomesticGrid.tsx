"use client";

import Image from "next/image";
import { useState } from "react";
import type { Destination } from "@/data/destinations";
import { domesticDestinations } from "@/data/destinations";
import { DestinationDrawer } from "./DestinationDrawer";

export function DomesticGrid() {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        {domesticDestinations.slice(0, 6).map((dest) => (
          <button
            key={dest.id}
            onClick={() => {
              setSelectedDest(dest);
              setDrawerOpen(true);
            }}
            className="group text-left transition-transform hover:scale-105"
          >
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={dest.image.url}
                alt={dest.image.alt}
                width={280}
                height={160}
                className="h-40 w-full object-cover"
              />
            </div>
            <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600">
              {dest.name}
            </h3>
            <p className="text-sm text-gray-600">{dest.country}</p>
          </button>
        ))}
      </div>
      <DestinationDrawer
        destination={selectedDest}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
