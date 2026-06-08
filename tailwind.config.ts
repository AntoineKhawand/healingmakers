import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Brand palette — red · black · white · light grey */
        cream: "#F4F4F4",            // light grey (section backgrounds)
        "dusty-rose": "#CC1111",     // brand red (primary accent)
        charcoal: "#2C2C2C",         // dark grey text
        "soft-black": "#111111",     // near-black (headings, buttons)
        "warm-white": "#FFFFFF",     // pure white
        "muted-rose": "#F0F0F0",     // very light grey (tinted backgrounds)
        "deep-rose": "#A30000",      // dark red (hover states)
        sand: "#E4E4E4",             // light grey (borders, dividers)
        "light-sand": "#EEEEEE",     // very light grey (card backgrounds)
      },
      fontFamily: {
        playfair: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        ticker: "ticker 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
