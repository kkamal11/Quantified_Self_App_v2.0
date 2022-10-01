/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/*.js","./index.html",'./views/*.js'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor:['responsive','hover','focus','active'] 
  },
  plugins: [],
}

