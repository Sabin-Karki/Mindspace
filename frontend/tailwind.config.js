// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors:{
        'bg-pri': 'rgb(var(--bg-pri) / <alpha-value>)',
        'bg-sec': 'rgb(var(--bg-sec) / <alpha-value>)',
        'bg-tri': 'rgb(var(--bg-tri) / <alpha-value>)',
        
        'text-pri': 'rgb(var(--text-pri) / <alpha-value>)',
        'text-sec': 'rgb(var(--text-sec) / <alpha-value>)',
        'text-tri': 'rgb(var(--text-tri) / <alpha-value>)',
        
        'border-pri': 'rgb(var(--border-pri) / <alpha-value>)',
        'border-sec': 'rgb(var(--border-sec) / <alpha-value>)',
        
        'input-bg': 'rgb(var(--input-bg) / <alpha-value>)',
        'input-border': 'rgb(var(--input-border) / <alpha-value>)',
        
        'card-bg': 'rgb(var(--card-bg) / <alpha-value>)',
        'hover-bg': 'rgb(var(--hover-bg) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}