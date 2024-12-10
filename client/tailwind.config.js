/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'flash-color': '#ff0000', // Customize the flash color here
      },
      keyframes: {
        flash: {
          '0%': { color: 'inherit' }, // Normal color
          '50%': { color: '#ff0000' }, // Flash color
          '100%': { color: 'inherit' }, // Normal color
        },
      },
      animation: {
        flash: 'flash 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
