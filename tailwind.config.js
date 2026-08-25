/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#14140F',
        surface: {
          DEFAULT: '#1F1E17',
          elevated: '#26251D',
          sunken: '#181712',
        },
        border: {
          DEFAULT: '#3A3830',
          muted: '#2D2B24',
        },
        'text-primary': '#EDE8DD',
        'text-secondary': '#8C897C',
        'accent-primary': {
          DEFAULT: '#4A6741',
          hover: '#3D5536',
          light: '#5B7E50',
        },
        'accent-data': {
          DEFAULT: '#C98A3D',
          hover: '#B57B34',
        },
        'accent-water': {
          DEFAULT: '#34445C',
          hover: '#2B394E',
        },
      },
      fontFamily: {
        slab: ['"Roboto Slab"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '2px',
        md: '3px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        '3xl': '4px',
        full: '4px', // Hard capped at 4px
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}
