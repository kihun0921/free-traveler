"use client";

import { useState } from "react";

const THEMES = [
  { id: "nature", label: "자연·야외", icon: "🏔️" },
  { id: "culture", label: "문화·역사", icon: "🏛️" },
  { id: "city", label: "도시·야경", icon: "🌆" },
  { id: "food", label: "음식·맛", icon: "🍜" },
  { id: "adventure", label: "액티비티", icon: "🎯" },
  { id: "relax", label: "휴식·여유", icon: "☀️" },
];

export function ThemeChips() {
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());

  const toggleTheme = (themeId: string) => {
    const newSelected = new Set(selectedThemes);
    if (newSelected.has(themeId)) {
      newSelected.delete(themeId);
    } else {
      newSelected.add(themeId);
    }
    setSelectedThemes(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {THEMES.map((theme) => {
        const isActive = selectedThemes.has(theme.id);
        return (
          <button
            key={theme.id}
            onClick={() => toggleTheme(theme.id)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors ${
              isActive
                ? "border-[1.5px] border-ink bg-canvas"
                : "border border-transparent bg-surface-container hover:bg-surface-container-high"
            }`}
          >
            <span aria-hidden="true">{theme.icon}</span>
            {theme.label}
          </button>
        );
      })}
    </div>
  );
}
