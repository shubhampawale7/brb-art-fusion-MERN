/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        "text-primary": "#991B1B", // Dark Slate Blue
        "text-secondary": "#64748B", // Lighter Slate Gray
        "brand-gold": "#BFA181", // Muted Gold for highlights
      },

      // --- UPDATED MARQUEE ANIMATION ---
      animation: {
        // Updated animation definition for a 20-second cycle with easing
        "marquee-paused": "marquee 20s ease-in-out infinite",
      },
      keyframes: {
        // New keyframes for the "pause-then-scroll" effect
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "20%": { transform: "translateX(0%)" }, // <-- Pauses here
          "80%": { transform: "translateX(-110%)" }, // <-- Scrolls off-screen
          "81%": { transform: "translateX(110%)" }, // <-- Jumps back instantly (hidden)
          "100%": { transform: "translateX(0%)" }, // <-- Scrolls back in to pause
        },
      },
      // --- END OF UPDATED CODE ---
    },
  },
  plugins: [],
};
