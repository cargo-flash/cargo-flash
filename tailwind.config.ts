import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Matrix Theme Colors
                matrix: {
                    black: '#0a0a0a',
                    dark: '#0d1117',
                    green: '#00ff41',
                    'green-dim': '#00cc33',
                    'green-glow': 'rgba(0, 255, 65, 0.5)',
                    cyan: '#00ffff',
                    amber: '#ffb000',
                    red: '#ff0040',
                },
                // Public Theme Colors  
                brand: {
                    primary: '#2563eb',
                    secondary: '#1e40af',
                    accent: '#3b82f6',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
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
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            boxShadow: {
                'glow-green': '0 0 20px rgba(0, 255, 65, 0.25), 0 0 40px rgba(0, 255, 65, 0.125)',
                'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.25), 0 0 40px rgba(0, 255, 255, 0.125)',
                'glow-red': '0 0 20px rgba(255, 0, 64, 0.25), 0 0 40px rgba(255, 0, 64, 0.125)',
            },
            animation: {
                'matrix-rain': 'matrix-rain 20s linear infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'typing': 'typing 0.5s steps(20) forwards',
                'scan': 'scan 8s linear infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                'matrix-rain': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 255, 65, 0.5)' },
                    '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(0, 255, 65, 0.8)' },
                },
                'typing': {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                },
                'scan': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
