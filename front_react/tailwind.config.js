/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#1E1E1E', // Темно-серый для фона
        'light-gray': '#2B2B2B', // Светло-серый для элементов
        'accent-orange': '#FF4D00', // Акцентный оранжевый
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'], // Основной шрифт Roboto
      },
      spacing: {
        '48': '12rem', // Дополнительный размер для высоты
      },
      transitionTimingFunction: {
        'inertia': 'cubic-bezier(0.25, 1, 0.5, 1)', // Добавление плавной инерции
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in',
      },
    },
  },
  plugins: [],
};
