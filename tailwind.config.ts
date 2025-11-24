import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tesla: {
          bg: '#000000',
          text: '#ffffff',
          accent: '#e50914',
          border: '#333333',
          hover: '#1a1a1a',
        }
      },
      backgroundColor: {
        dark: '#000000',
        darker: '#0a0a0a',
      }
    },
  },
  plugins: [animate],
}

export default config

