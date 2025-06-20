module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E60023',
          dark: '#AD081B',
          light: '#FFEAED'
        },
        secondary: {
          DEFAULT: '#111111',
          light: '#767676'
        },
        background: '#FFFFFF'
      }
    },
  },
  plugins: [],
};