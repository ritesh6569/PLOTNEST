module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          blue: '#2563eb', // deep blue
          green: '#10b981', // emerald
          yellow: '#fbbf24', // gold
          gray: '#f3f4f6', // light gray
        },
      },
    },
  },
  plugins: [],
}; 