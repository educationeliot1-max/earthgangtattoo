import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // EARTHGANG Brand Colors
        brand: {
          black:   '#0A0A0A',
          red:     '#D70000',
          'red-dark': '#AA0000',
          'red-light': '#FF2020',
          gold:    '#D4AF37',
          'gold-light': '#F0D060',
          dark:    '#191919',
          'dark-2': '#222222',
          'dark-3': '#2E2E2E',
          gray:    '#888888',
          'gray-light': '#CCCCCC',
          white:   '#F5F5F5',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        thai:    ['var(--font-noto-thai)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('/noise.png')",
        'hero-gradient': 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'pulse-red':  'pulseRed 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        glow: {
          '0%':   { textShadow: '0 0 10px #D70000, 0 0 20px #D70000' },
          '100%': { textShadow: '0 0 20px #D70000, 0 0 40px #D70000, 0 0 60px #D70000' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(215, 0, 0, 0.4)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(215, 0, 0, 0)' },
        },
      },
      boxShadow: {
        'red-glow':  '0 0 20px rgba(215, 0, 0, 0.5)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.4)',
        'dark':      '0 4px 24px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
};

export default config;
