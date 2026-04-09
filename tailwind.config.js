/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Manrope"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.08)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.5)'
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)', opacity: 0.4 },
          '100%': { transform: 'rotateX(0deg)', opacity: 1 }
        },
        pulseSoft: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(0,0,0,0.08)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0,0,0,0.02)' }
        }
      },
      animation: {
        flip: 'flip 420ms ease-in-out',
        pulseSoft: 'pulseSoft 2.6s ease-in-out infinite'
      }
    }
  },
  plugins: [],
};
