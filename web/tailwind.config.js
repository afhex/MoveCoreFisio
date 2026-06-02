/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#16a34a', // Verde deportivo vibrante (emerald-600)
          blue: '#2563eb',  // Azul eléctrico deportivo (blue-600)
        },
        light: {
          bg: '#f8fafc',    // Fondo principal claro y limpio (slate-50)
          card: '#ffffff',  // Fondo de tarjetas blanco puro
          border: '#e2e8f0' // Borde gris claro sutil (slate-200)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
