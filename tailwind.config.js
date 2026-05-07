/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark:    '#0A3D52',
        primary: '#0D7A8C',
        mid:     '#1CA8BB',
        accent:  '#F2A541',
        light:   '#F0F7F8',
        natext:  '#1A2E35',
        muted:   '#5A7A85',
        border:  '#C8DDE2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
