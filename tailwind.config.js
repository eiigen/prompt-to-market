/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          base: '#0A0A0A',
          elevated: '#121212',
          sunken: '#050505',
          border: '#1E1E1E',
          'border-subtle': '#161616',
        },
        ink: {
          primary: '#EAEAEA',
          secondary: '#909090',
          muted: '#505050',
        },
        hazard: {
          DEFAULT: '#E61919',
          dim: '#CC1414',
          glow: 'rgba(230, 25, 25, 0.25)',
        },
        phosphor: '#4AF626',
      },
      animation: {
        'terminal-blink': 'terminal-blink 1s step-end infinite',
        'scan-reveal': 'scan-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'type-in': 'type-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'crt-on': 'crt-on 0.3s ease-out',
        'data-fade': 'data-fade 0.5s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'pulse-bar': 'pulse-bar 1.2s ease-in-out infinite',
        'fade-up': 'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        'terminal-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scan-reveal': {
          '0%': { opacity: '0', clipPath: 'inset(0 0 100% 0)' },
          '100%': { opacity: '1', clipPath: 'inset(0)' },
        },
        'type-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'crt-on': {
          '0%': { transform: 'scaleY(0.01) scaleX(0.5)', filter: 'brightness(4)' },
          '60%': { transform: 'scaleY(1.02) scaleX(1)', filter: 'brightness(1.5)' },
          '100%': { transform: 'scaleY(1) scaleX(1)', filter: 'brightness(1)' },
        },
        'data-fade': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-bar': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};