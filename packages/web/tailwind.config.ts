import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#111111",
        accent: "#FB923C", // Soft Orange
        "accent-dim": "rgba(251, 146, 60, 0.15)",
        muted: "#F9FAFB",
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};

export default config;
