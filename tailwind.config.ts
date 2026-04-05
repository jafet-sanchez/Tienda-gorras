import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#111111',
        'surface-light': '#1A1A1A',
        'surface-lighter': '#242424',
        border: '#333333',
        'text-primary': '#F5F5F5',
        'text-secondary': '#AAAAAA',
        'text-muted': '#888888',
        neon: '#BFDB38',
        'neon-hover': '#AECB28',
        'neon-dim': '#BFDB3820',
        danger: '#FF3B3B',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Barlow', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        ultra: '0.35em',
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-up': 'fade-up 0.5s ease-out both',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        marquee: 'marquee 20s linear infinite',
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
