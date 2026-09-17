"use client";

import Link from "next/link";
import REPRESENTATIVE from "@/data/about";

export function AboutTeaser() {
  return (
    <section className="grid grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-20">
      {/* Left: Text content */}
      <div className="flex flex-col justify-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            {REPRESENTATIVE.name}
          </h2>
          <p className="mt-2 text-lg text-gray-600">{REPRESENTATIVE.tagline}</p>
        </div>

        <p className="text-gray-700 leading-relaxed line-clamp-3">
          {REPRESENTATIVE.introduction}
        </p>

        <div className="flex gap-8">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {REPRESENTATIVE.tripsCompleted}+
            </p>
            <p className="text-sm text-gray-600">Trips</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {REPRESENTATIVE.countriesVisited}+
            </p>
            <p className="text-sm text-gray-600">Countries</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {REPRESENTATIVE.yearsOfExperience}+
            </p>
            <p className="text-sm text-gray-600">Years</p>
          </div>
        </div>

        <Link
          href="/about"
          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors w-fit"
        >
          전체 소개 읽기
        </Link>
      </div>

      {/* Right: Visual emphasis space */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🌍</p>
            <p className="text-gray-600 font-semibold">
              {REPRESENTATIVE.yearsOfExperience}년의 여행 경험
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
