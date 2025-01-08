/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        poppins : ['Poppins', 'sans-serif'],
        montserrat : ['Montserrat', 'sans-serif'],
      },
      spacing: {
        '0.128': '0.128rem',
      },
      margin: {
        '4.5' : '4.5rem',
      },
    },
    borderWidth: {
      1: "1px",
      1.5: "1.5px",
    },
  },
  plugins: [],
};
