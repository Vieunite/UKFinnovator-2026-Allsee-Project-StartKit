import type { Config } from 'tailwindcss'

// Plugin to support opacity modifiers with CSS variables
// Uses RGB values for better browser compatibility
const cssVariableOpacityPlugin = ({ addUtilities }: any) => {
  const utilities: Record<string, Record<string, string>> = {}

  // Generate opacity variants from 0 to 100 (step by 10, then add 90)
  const opacityValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  opacityValues.forEach((opacity) => {
    const opacityDecimal = opacity / 100
    utilities[`.bg-primary\\/${opacity}`] = {
      backgroundColor: `rgba(var(--color-primary-r), var(--color-primary-g), var(--color-primary-b), ${opacityDecimal})`,
    }
    utilities[`.text-primary\\/${opacity}`] = {
      color: `rgba(var(--color-primary-r), var(--color-primary-g), var(--color-primary-b), ${opacityDecimal})`,
    }
    utilities[`.border-primary\\/${opacity}`] = {
      borderColor: `rgba(var(--color-primary-r), var(--color-primary-g), var(--color-primary-b), ${opacityDecimal})`,
    }
  })

  addUtilities(utilities)
}

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utility/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',

        textLightMode: '#000000',
        textDarkMode: '#ffffff',
        // Dashboard colors
        dashboard: {
          bg: {
            light: '#f4f6fa',
            dark: '#1a1d23',
          },
          sidebar: {
            light: '#ffffff',
            dark: '#252831',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        'open-sans': ['var(--font-open-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [cssVariableOpacityPlugin],
}
export default config
