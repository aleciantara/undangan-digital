import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        gold: {
          50:  "#FEFCE8",
          100: "#FEF9C3",
          300: "#FDE047",
          400: "#FACC15",
          500: "#D4AF37",
          600: "#B8960C",
          700: "#926800",
        },
        batik: {
          brown: "#8B5E3C",
          dark:  "#5C3317",
          cream: "#F5E6D3",
        },
      },
      animation: {
        "fade-in":    "fadeIn 1s ease-in-out",
        "slide-up":   "slideUp 0.8s ease-out",
        "petal-fall": "petalFall 6s linear infinite",
      },
      keyframes: {
        fadeIn:    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp:   { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        petalFall: { "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" }, "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: "0" } },
      },
    },
  },
  plugins: [],
};

export default config;
