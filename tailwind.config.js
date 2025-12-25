/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F8FAFC",
        primary: "#6491DE",
        "primary-hover": "#4B7AC7",
        secondary: "#073D7F",
        "text-main": "#073D7F",
        "text-body": "#334155",
        "text-muted": "#64748B",
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-blue': '0 4px 14px 0 rgba(100, 145, 222, 0.39)',
      }
    },
  },
  plugins: [],
}