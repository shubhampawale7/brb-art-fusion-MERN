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
        "brb-primary": "#BFA181",
        "brb-primary-dark": "#A08060",
        "gray-50": "#F9FAFB",
        "gray-100": "#F3F4F6",
        "gray-200": "#E5E7EB",
        "gray-300": "#D1D5DB",
        "gray-400": "#9CA3AF",
        "gray-500": "#6B7280",
        "gray-600": "#4B5563",
        "gray-700": "#374151",
        "gray-800": "#1F2937",
        "gray-900": "#991B1B",
        white: "#FFFFFF",
        "red-500": "#EF4444",
        "blue-500": "#3B82F6",
        "purple-500": "#8B5CF6",
        "green-500": "#22C55E",
      },

      // --- UPDATED MARQUEE ANIMATION ---
      animation: {
        "marquee-paused": "marquee 20s ease-in-out infinite",
        "ping-once": "ping-once 0.5s cubic-bezier(0.4, 0, 0.6, 1) 1",
        "pulse-once": "pulse-once 1.5s ease-out 1",
      },
      keyframes: {
        "ping-once": {
          // Animation for cart/wishlist badge
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.7" },
        },
        "pulse-once": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(191, 161, 129, 0.7)",
          } /* brb-primary color */,
          "70%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 0 10px rgba(191, 161, 129, 0)",
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(191, 161, 129, 0)",
          },
        },
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
