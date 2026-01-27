/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors
                brand: {
                    blue: '#2563EB', // Blue - Navigation, Headings, Icons
                    yellow: '#FACC15', // Yellow - Primary CTA, Highlights
                    green: '#22C55E', // Green - Success, Completed
                    red: '#EF4444', // Red - Danger, Error
                    lightblue: '#3B82F6', // Light Blue - Info
                },
                // Neutral Scale
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
