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
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => toggleTheme(theme.id)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors ${
            selectedThemes.has(theme.id)
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
        >
          <span>{theme.icon}</span>
          {theme.label}
        </button>
      ))}
    </div>
  );
}
