import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF9FF",
          100: "#D9F2FF",
          200: "#B3E5FF",
          300: "#85D4FF",
          400: "#53BFFF",
          500: "#2FA7FF",
          600: "#1C85DB",
          700: "#1368AD",
          800: "#0E4E83",
          900: "#0B3A62"
        }
      },
      boxShadow: {
        card: "0 2px 10px rgba(0,0,0,0.06), 0 12px 24px rgba(0,0,0,0.05)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      backgroundImage: {
        "aurora":
          "radial-gradient(60% 60% at 100% 0%, rgba(99,102,241,0.20) 0%, rgba(0,0,0,0) 60%), radial-gradient(40% 40% at 0% 100%, rgba(16,185,129,0.20) 0%, rgba(0,0,0,0) 60%)",
        "grid": "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
