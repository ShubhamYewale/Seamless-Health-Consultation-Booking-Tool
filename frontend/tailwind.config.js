/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors:{
        'primary':"#3CB371"
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill,minmax(150px , 1fr))'
      }
    },
  },

  plugins: [],
  
}

