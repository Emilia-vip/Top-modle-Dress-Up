/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ändra beroende på var dina filer ligger
  ],
  theme: {
    extend: {
      fontFamily: {
        'italiana': ['Italiana', 'sans-serif'],
      },
    }
    },

  plugins: [],
};


