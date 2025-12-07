
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          darkest: '#000000',
          DEFAULT: '#050505',
          light: '#121212',
          glass: 'rgba(5, 5, 5, 0.7)',
        },
        soul: {
          ice: 'rgb(var(--color-soul-ice) / <alpha-value>)',
          fire: 'rgb(var(--color-soul-fire) / <alpha-value>)',
          deep: 'rgb(var(--color-soul-deep) / <alpha-value>)',
        },
        bone: {
          DEFAULT: '#e5e7eb', // gray-200
          dark: '#9ca3af',    // gray-400
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'rise': 'rise 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rise: {
          '0%': { transform: 'translateY(100%) opacity(0)' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'translateY(-20%) opacity(0)' },
        }
      }
    }
  },
  plugins: [],
}
