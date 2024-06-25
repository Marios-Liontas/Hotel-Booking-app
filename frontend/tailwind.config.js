/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Corrected file extension glob pattern
  theme: {
    extend: {},
    container: {
      padding: {
        md: "10rem"
      },
    }
  },
  plugins: [],
}
