import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DESIGN.md Color Tokens
        canvas: "#FFFFFF",
        "surface-soft": "#FAFAFA",
        "surface-container": "#EEEEF0",
        "surface-container-high": "#E8E8EA",
        hairline: "#EEEEF0",
        "hairline-strong": "#E5E5EA",
        ink: "#24242A",
        body: "#45454C",
        muted: "#6B6B72",
        primary: "#FF6B4A",
        "primary-hover": "#E85837",
        "primary-disabled": "#FFD5C7",
        "on-primary": "#FFFFFF",
        "caution-text": "#B8720A",
        "caution-surface": "#FEF7EC",
        "caution-border": "#FCE4C0",
        "critical-text": "#C13515",
        "critical-surface": "#FDF2F0",
        "critical-border": "#F8CCC6",
        "success-text": "#137A54",
        "success-surface": "#F0F9F5",
        "focus-ring": "#24242A",
        scrim: "rgba(0, 0, 0, 0.5)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Pretendard",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["40px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.02em" }],
        "display-mobile": ["30px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.02em" }],
        "headline-lg": ["32px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.015em" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.015em" }],
        "headline-md": ["22px", { lineHeight: "1.36", fontWeight: "600", letterSpacing: "-0.01em" }],
        "headline-sm": ["18px", { lineHeight: "1.44", fontWeight: "600", letterSpacing: "-0.005em" }],
        "body-lg": ["16px", { lineHeight: "1.625", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.57", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "1.4", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "1.3", fontWeight: "600" }],
        button: ["14px", { lineHeight: "1.25", fontWeight: "600" }],
      },
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        base: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "40px",
        "section-desktop-min": "64px",
        "section-desktop-max": "96px",
        "section-mobile-min": "40px",
        "section-mobile-max": "64px",
        "content-max-desktop-min": "1200px",
        "content-max-desktop-max": "1280px",
      },
      borderRadius: {
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      maxWidth: {
        "content-desktop": "1280px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(36, 36, 42, 0.04), 0 8px 24px -4px rgba(36, 36, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
