import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",

  // Or if using `src` directory:
  // "./node_modules/@nextui-org/theme/dist/components/button.js",
  './node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js',
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {},
};
export const plugins = [nextui()];
