/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content:
    [
      // "./src/**/*.{html,js}"
      "./src/**/*.{js,jsx,ts,tsx}"

    ],
  theme: {
    extend: {
      // Custom colors

      colors: {

        // 🌞 Light Mode
        lightBackground: '#f0f8ed',    
        primary: '#00bc7d',            
        primaryHover: '#00bc84',       
        accent: '#00bb9f',             
        secondaryBackground: '#a1f2d1',

        // 🌚 Dark Mode
        darkBackground: '#2a3048',     
        darkPrimary: '#3fc361',        
        darkAccent: '#7dd55d',


      },
    },
    plugins: [
      require('tailwindcss-rtl'),
    ],
  }
}