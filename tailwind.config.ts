import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F8F4ED",
        paper: "#FDFAF3",
        lavender: "#C8B6E2",
        sky: "#B8D4E3",
        mint: "#B5DDC4",
        dove: "#C9C6C3",
        gold: "#C9A24B",
        ink: {
          deep: "#3A3A4A",
          soft: "#6B6B7A",
          whisper: "#9A9AA8",
        },
        rarity: {
          common: "#B8D4E3",
          uncommon: "#B5DDC4",
          rare: "#C8B6E2",
          legendary: "#C9A24B",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "page-title": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "section-title": ["2rem", { lineHeight: "1.15" }],
      },
      borderRadius: {
        btn: "12px",
        card: "16px",
        portrait: "24px",
      },
      boxShadow: {
        "paper-sm": "0 1px 2px 0 rgba(58, 58, 74, 0.05)",
        "paper-md": "0 4px 16px -2px rgba(200, 182, 226, 0.35)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(3%, -2%, 0) scale(1.05)" },
          "66%": { transform: "translate3d(-2%, 2%, 0) scale(0.97)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bloom-in": {
          "0%": { opacity: "0", transform: "scale(0.92)", filter: "blur(8px)" },
          "60%": { filter: "blur(0)" },
          "100%": { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        },
        stamp: {
          "0%": { opacity: "0", transform: "scale(1.6) rotate(-8deg)" },
          "70%": { opacity: "1", transform: "scale(0.94) rotate(1deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        drift: "drift 75s ease-in-out infinite",
        "scale-in": "scale-in 600ms ease-out both",
        "fade-up": "fade-up 400ms ease-out both",
        "bloom-in": "bloom-in 900ms ease-out both",
        stamp: "stamp 600ms cubic-bezier(0.2, 1.4, 0.4, 1) both",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
