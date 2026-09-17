"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "여행지 검색" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/about", label: "대표 소개" },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx={11}
        cy={11}
        r={6.5}
        stroke="currentColor"
        strokeWidth={1.75}
      />
      <path
        d="M20 20L16 16"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx={12}
        cy={8.5}
        r={3.5}
        stroke="currentColor"
        strokeWidth={1.75}
      />
      <path
        d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b border-[#EEEEF0] bg-white md:h-[72px]">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[#FF6B4A]"
          />
          <span className="text-[16px] font-semibold text-[#24242A]">
            Free Traveler
          </span>
        </Link>

        <nav
          aria-label="주요 내비게이션"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[#45454C] transition-colors hover:text-[#24242A]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            aria-label="여행지 검색"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#45454C] transition-colors hover:bg-[#FAFAFA] md:hidden"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/account"
            aria-label="계정"
            className="hidden h-11 w-11 items-center justify-center rounded-full text-[#45454C] transition-colors hover:bg-[#FAFAFA] md:inline-flex"
          >
            <AccountIcon />
          </Link>
          <button
            type="button"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#24242A] transition-colors hover:bg-[#FAFAFA] md:hidden"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-30 flex flex-col gap-1 border-t border-[#EEEEF0] bg-white p-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-[8px] px-3 py-3 text-[16px] font-medium text-[#24242A] hover:bg-[#FAFAFA]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-[8px] px-3 py-3 text-[16px] font-medium text-[#24242A] hover:bg-[#FAFAFA]"
          >
            계정
          </Link>
        </div>
      )}
    </header>
  );
}
