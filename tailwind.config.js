const defaultTheme = require("tailwindcss/defaultTheme");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

const plugin = require("tailwindcss/plugin")

const iOsHeight = plugin(function ({ addUtilities }) {
  const supportsTouchRule = "@supports (-webkit-touch-callout: none)"
  const webkitFillAvailable = "-webkit-fill-available"

  const utilities = {
    ".min-h-screen-ios": {
      [supportsTouchRule]: {
        minHeight: webkitFillAvailable,
      },
    },
    ".h-screen-ios": {
      [supportsTouchRule]: {
        height: webkitFillAvailable,
      },
    },
  }

  addUtilities(utilities, ["responsive"])
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    addVariablesForColors,
    iOsHeight
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}