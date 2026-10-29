/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#09090b', // Ultra-clean matte charcoal (Zinc 950)
          900: '#111115', // Premium dark surface
          850: '#18181b', // Elevated card / row surface
          800: '#27272a', // Subtle clean border (Zinc 800)
          750: '#3f3f46', // Border active (Zinc 700)
          700: '#52525b', // Muted text / icons
          600: '#71717a',
        },
        brand: {
          indigo: '#6366f1',
          'indigo-glow': '#818cf8',
          purple: '#8b5cf6',
          'purple-glow': '#a78bfa',
          cyan: '#06b6d4',
          'cyan-glow': '#38bdf8',
          emerald: '#10b981',
          pink: '#ec4899',
          gold: '#f59e0b',
        },
        gaming: {
          available: '#10b981',
          inuse: '#00f0ff',
          booked: '#a855f7',
          maintenance: '#f59e0b',
          offline: '#ff2a5f',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        gaming: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 30px -5px rgba(147, 51, 234, 0.5)',
        'glow-cyan': '0 0 30px -5px rgba(0, 240, 255, 0.5)',
        'glow-pink': '0 0 30px -5px rgba(255, 0, 127, 0.5)',
        'glow-gold': '0 0 30px -5px rgba(245, 158, 11, 0.5)',
        'glow-crimson': '0 0 30px -5px rgba(255, 42, 95, 0.5)',
        'glow-green': '0 0 30px -5px rgba(16, 185, 129, 0.5)',
        'card-dark': '0 12px 35px -8px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'card-elevated': '0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cycle': 'glow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
