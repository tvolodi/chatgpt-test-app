/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Walnut Retro Color Palette
            colors: {
                walnut: {
                    50: '#faf8f5',   // Cream white
                    100: '#f5f0e8',  // Light cream
                    200: '#e8dcc8',  // Warm beige
                    300: '#d4c4a8',  // Sand
                    400: '#b8a07a',  // Tan
                    500: '#8b6914',  // Walnut brown (primary)
                    600: '#6d5a3a',  // Dark walnut
                    700: '#5c4a2e',  // Deep brown
                    800: '#4a3b24',  // Espresso
                    900: '#3d2f1c',  // Dark espresso
                },
                retro: {
                    orange: '#d97706', // Burnt orange accent
                    teal: '#0d9488',   // Vintage teal
                    rust: '#b45309',   // Rust accent
                    olive: '#65a30d',  // Olive green
                    mustard: '#ca8a04', // Mustard yellow
                    cream: '#fffbeb',  // Warm cream background
                }
            },
            fontFamily: {
                'retro': ['var(--font-retro)', 'Georgia', 'serif'],
                'retro-sans': ['var(--font-retro-sans)', '"Helvetica Neue"', 'sans-serif'],
            },
            boxShadow: {
                'retro': '4px 4px 0px 0px rgba(139, 105, 20, 0.3)',
                'retro-lg': '6px 6px 0px 0px rgba(139, 105, 20, 0.3)',
                'retro-hover': '2px 2px 0px 0px rgba(139, 105, 20, 0.3)',
            },
            borderRadius: {
                'retro': '2px',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
