/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#1A1A1A", dark: "#0F0F13" },
        primary: "#FAFF00", secondary: "#7000FF", alert: "#FF4500",
        text: { main: "#EAEAEA", muted: "#A0A0A0" },
        card: { bg: "rgba(255, 255, 255, 0.02)", border: "rgba(255, 255, 255, 0.05)" }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      // NEW: Subtle shadows for feedback only. Reduced intensity significantly.
      boxShadow: {
        'feedback-purple': '0 0 8px rgba(112, 0, 255, 0.25)',
        'feedback-pink': '0 0 8px rgba(236, 72, 153, 0.25)',
        'feedback-blue': '0 0 8px rgba(59, 130, 246, 0.25)',
        'feedback-teal': '0 0 8px rgba(20, 184, 166, 0.25)',
        'feedback-orange': '0 0 8px rgba(249, 115, 22, 0.25)',
        'subtle-depth': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      // NEW: Animations for entry and subtle motion
      animation: {
        'enter-card': 'enter-fade-up 0.6s ease-out backwards',
        'float-slight': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'enter-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [
    // Required for delay utilities on entry animations
    require('tailwindcss-animate'), 
  ],
}