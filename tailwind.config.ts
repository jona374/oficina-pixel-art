import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crt: {
          bg: "#0d0d14",
          panel: "#16161f",
          border: "#2a2a3a",
          green: "#7ee787",
          greenDim: "#3fa15a",
          purple: "#6e5a9e",
          purpleDark: "#3b2f5c",
          amber: "#e0b060",
          red: "#e06060",
          beige: "#e8dcc8",
          floor: "#b8c9ae",
          floorLine: "#a5b89b",
          wood: "#c99a5b",
          woodDark: "#8a6236",
        },
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "'Courier New'", "monospace"],
        term: ["var(--font-term)", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
