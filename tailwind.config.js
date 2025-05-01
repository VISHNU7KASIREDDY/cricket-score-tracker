/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        cricket: {
          field: '#1E5631',
          pitch: '#E8DDB5',
          ball: '#B91C1C',
          accent: '#1A75FF',
          wood: '#8B4513',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-once': 'bounce 0.5s ease-in-out 1',
        'pulse-once': 'pulse 0.5s ease-in-out 1',
      }
    },
  },
  plugins: [],
}