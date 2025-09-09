import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Product Sans"', 'sans-serif'],
      },
      backgroundImage: {
        eclipse: "url('/eclipse.svg')",
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        offwhite: '#F8F6E2',
        'core-green': '#34a853',
        'core-blue': '#4285f4',
        'core-red': '#ea4335',
        'core-yellow': '#f9ab00',
        'halftone-blue': '#57caff',
        'halftone-green': '#5cdb6d',
        'halftone-yellow': '#ffd427',
        'halftone-red': '#ff7daf',
        'pastel-blue': '#c3ecf6',
        'pastel-green': '#ccf6c5',
        'pastel-yellow': '#ffe7a5',
        'pastel-red': '#f8d8d8',
        'social-dark': '#1e1e1e',
        accordionContent1: 'var(--accordion-content-1)',
        accordionContent2: 'var(--accordion-content-2)',
        accordionContent3: 'var(--accordion-content-3)',
        accordionContent4: 'var(--accordion-content-4)',
        accordionButton1: 'var(--accordion-button-1)',
        accordionButton2: 'var(--accordion-button-2)',
        accordionButton3: 'var(--accordion-button-3)',
        accordionButton4: 'var(--accordion-button-4)',
        'accordion-item-border': 'var(--accordion-item-border)',
        red: '#EA4335',
        green: '#0F9D58',
        black: '#060606',
        yellow: '#FBBC04',
        blue: '#4285F4',
        white: '#ffffff',
        paragraph: '#C3C3C3',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        full: '50%',
      },
      spacing: {
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '28': '28px',
        '32': '32px',
        '36': '36px',
        '40': '40px',
        '44': '44px',
        '48': '48px',
        '52': '52px',
        '56': '56px',
        '60': '60px',
        '64': '64px',
        '72': '72px',
        '80': '80px',
        '96': '96px',
        '100': '100px',
        '104': '104px',
        '108': '108px',
        '112': '112px',
        '116': '116px',
        '120': '120px',
        '124': '124px',
        px: '1px',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      screens: {
        '3xl': '2000px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
