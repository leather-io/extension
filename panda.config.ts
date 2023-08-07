import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    // 👇🏻 Define your tokens here
    tokens: {
      colors: {
        primary: { value: 'red' },
        secondary: { value: '#EE0F0F' }
      },
      fonts: {
        body: { value: 'system-ui, sans-serif' }
      }
    }
  },
  // The output directory for your css system
  outdir: 'styled-system',
  outExtension: 'js',
});
