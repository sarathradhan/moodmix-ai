/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        moodmix: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
