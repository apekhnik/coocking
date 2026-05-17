import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Manrope', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', '"Cormorant Garamond"', '"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-muted': 'var(--ink-muted)',
        'ink-soft': 'var(--ink-soft)',
        terracotta: 'var(--terracotta)',
        'terracotta-deep': 'var(--terracotta-deep)',
        olive: 'var(--olive)',
        honey: 'var(--honey)',
        plum: 'var(--plum)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
      },
    },
  },
}

export default config
