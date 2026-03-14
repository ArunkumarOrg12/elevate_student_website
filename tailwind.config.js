/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#1E293B',
          text: '#CBD5E1',
          active: '#6366F1',
          border: '#334155',
        },
        content: {
          bg: '#F8FAFC',
        },
        primary: '#6366F1',
        brand: {
          indigo: '#6366F1',
          purple: '#8B5CF6',
          green: '#10B981',
          teal: '#14B8A6',
          blue: '#3B82F6',
          orange: '#F59E0B',
          red: '#EF4444',
        },
        badge: {
          'tech-bg': '#DBEAFE',
          'tech-text': '#2563EB',
          'apt-bg': '#D1FAE5',
          'apt-text': '#059669',
          'beh-bg': '#EDE9FE',
          'beh-text': '#7C3AED',
          'com-bg': '#FEF3C7',
          'com-text': '#D97706',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': '14px',
        'btn': '9px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px 0 rgba(0,0,0,0.10), 0 2px 6px -2px rgba(0,0,0,0.08)',
        'sidebar': '4px 0 24px rgba(0,0,0,0.12)',
      },
      animation: {
        'count-up': 'countUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'bar-fill': 'barFill 0.8s ease-out forwards',
      },
      keyframes: {
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        barFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        },
      },
    },
  },
  plugins: [],
}
