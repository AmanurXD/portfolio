/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-glow': '#6c40ee',
        'secondary-glow': '#00c6ff',
        'about-main': '#0fe4d2', // For the headline animation
        'about-dark-mix': 'color-mix(in oklab, #0fe4d2 40%, black)', // For the headline animation
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'], // Add Montserrat
        mono: ['Cutive Mono', 'monospace'], // For paragraph animation
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out forwards',
        'letter-glow': 'letter-glow 0.7s ease both', // For paragraph animation
      },
      keyframes: { // Add custom keyframes directly here
        // Your existing keyframes (float, particle-float, wave, scroll-wheel, bounce, fadeInUp)
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '25%': { transform: 'translate(20px, 20px)' },
            '50%': { transform: 'translate(-20px, 10px)' },
            '75%': { transform: 'translate(10px, -20px)' },
        },
        'particle-float': {
            '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
            '10%': { opacity: '0.7' },
            '90%': { opacity: '0.3' },
            '100%': { transform: 'translateY(-150px) translateX(30px)', opacity: '0' },
        },
        wave: {
            '0%, 100%': { transform: 'rotate(0)' },
            '20%': { transform: 'rotate(-20deg)' },
            '30%': { transform: 'rotate(15deg)' },
            '50%': { transform: 'rotate(-10deg)' },
            '60%': { transform: 'rotate(5deg)' },
        },
        'scroll-wheel': {
            '0%': { top: '5px', opacity: '1' },
            '100%': { top: '25px', opacity: '0' },
        },
        bounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0) translateX(-50%)' },
          '40%': { transform: 'translateY(-10px) translateX(-50%)' },
          '60%': { transform: 'translateY(-5px) translateX(-50%)' },
        },
        // New keyframes for text animations
        revealRTL: {
          '0%': { width: '0', right: '0' },
          '65%': { width: '100%', right: '0' },
          '100%': { width: '0', right: '100%' },
        },
        revealLTR: {
          '0%': { width: '0', left: '0' },
          '65%': { width: '100%', left: '0' },
          '100%': { width: '0', left: '100%' },
        },
        textHidden: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'letter-glow': {
          '0%': { opacity: '0', textShadow: '0px 0px 1px rgba(255,255,255,0.1)' },
          '66%': { opacity: '1', textShadow: '0px 0px 20px rgba(255,255,255,0.9)' },
          '77%': { opacity: '1' },
          '100%': { opacity: '0.7', textShadow: '0px 0px 20px rgba(255,255,255,0.0)' },
        }
      }
    },
  },
  plugins: [],
}