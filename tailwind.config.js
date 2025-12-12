/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Git-themed colors (inspired by GitHub/GitLab)
                git: {
                    primary: 'rgb(var(--primary) / <alpha-value>)',
                    secondary: 'rgb(var(--secondary) / <alpha-value>)',
                    danger: 'rgb(var(--danger) / <alpha-value>)',
                    dark: '#0d1117', // GitHub dark bg
                    gray: '#161b22', // GitHub dark secondary bg
                    border: '#30363d', // GitHub dark border
                    text: '#c9d1d9', // GitHub dark text
                    muted: '#8b949e', // GitHub muted text
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
