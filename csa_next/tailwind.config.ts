import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        blink: 'blink 1.5s infinite',
        'blink-delay-1': 'blink 1.5s infinite 0.5s',
        'blink-delay-2': 'blink 1.5s infinite 1s',
      },
    },
    fontFamily: {
      sans: ["impact"],
      ListComponent: ["sans-serif"],
    },
    
  },
  plugins: [],
};
export default config;
