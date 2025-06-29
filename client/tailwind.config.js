/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // tailwind.config.js
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        "brand-accent": "#991B1B", // Crimson Red
        "page-bg": "#F8F7F4", // Off-White / Light Beige
        "card-bg": "#FFFFFF", // Pure White for cards
        "text-primary": "#334155", // Dark Slate Blue
        "text-secondary": "#64748B", // Lighter Slate Gray
        "brand-gold": "#BFA181", // Muted Gold for highlights
      },
    },
  },
  plugins: [],
};
