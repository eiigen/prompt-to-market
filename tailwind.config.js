/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          base: '#0a0a0a',
          elevated: '#141414',
          sunken: '#050505',
          border: '#262626',
          'border-subtle': '#1a1a1a',
        },
        ink: {
          primary: '#fafafa',
          secondary: '#a3a3a3',
          muted: '#525252',
        },
      },
      boxShadow: {
        glow: '0 0 32px rgba(249, 115, 22, 0.25)',
        'glow-sm': '0 0 16px rgba(249, 115, 22, 0.18)',
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left': 'slide-in-left 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
