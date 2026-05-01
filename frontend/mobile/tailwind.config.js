/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        calm: {
          background: '#F8F9FE',
          surface: '#ffffff',
          text: '#3d4255',
          muted: '#8b90a7',
          primary: '#7c9cf5',
          border: '#e5e7f0',
          label: '#6b7280',
          error: '#f87171',
          'error-light': '#FEF2F2',
          success: '#6EE7B7',
        },
      },
    },
  },
};
