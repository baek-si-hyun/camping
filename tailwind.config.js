module.exports = {
  content: ['./public/index.html', './public/legacy/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary, 255 122 69) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary, 74 144 226) / <alpha-value>)',
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px',
        button: '8px',
      },
    },
  },
  plugins: [],
};
