/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        "37rem": "37rem",
      },
      colors: {
        "04": "#04a6e2",
        ec: "#ec543d",
        ec9: "#EC9E09",
        cc: "#cccccc",
        "5e": "#5e7cde",
        "249B": "#249b69",
        d9: "#d9534f",
        "5c": "#5cb85c",
        "1d": "#1d235d",
        90: "#905c2c",
        f3: "#f3d88f",
        13: "#131313",
        d4: "#d4d4d4",
        ffe: "#ffefd5",
      },
      fontFamily: {
        roboto: ["Montserrat", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
        devnagri: ["Noto Sans", "sans-serif"],
      },
      boxShadow: {
        audioCardHeader1: "0px 4px 0px 1px rgba(190,242,87,0.22)",
        audioCardHeader2: "0px 4px 0px 1px rgba(69,79,230,0.14)",
      },
    },
  },
  plugins: [],
};
