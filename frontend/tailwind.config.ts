import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#ffffff',
            maxWidth: 'none',
            fontSize: '1.125rem',
            lineHeight: '1.75',
            p: {
              color: '#ffffff',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            a: {
              color: '#FFE100',
              textDecoration: 'none',
              '&:hover': {
                color: '#FFE100',
                textDecoration: 'underline',
              },
            },
            h1: {
              color: '#FFE100',
              fontWeight: '800',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '0.8em',
              lineHeight: '1.1',
            },
            h2: {
              color: '#FFE100',
              fontWeight: '700',
              fontSize: '1.8em',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              lineHeight: '1.2',
            },
            h3: {
              color: '#FFE100',
              fontWeight: '600',
              fontSize: '1.5em',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              lineHeight: '1.3',
            },
            h4: {
              color: '#FFE100',
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              lineHeight: '1.4',
            },
            strong: {
              color: '#FFE100',
              fontWeight: '600',
            },
            code: {
              color: '#FFE100',
              backgroundColor: '#1a1a1a',
              borderRadius: '0.25rem',
              padding: '0.2em 0.4em',
              border: '1px solid #262626',
              fontWeight: '400',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #262626',
              borderRadius: '0.5rem',
              padding: '1rem',
              code: {
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0',
                color: 'inherit',
                fontSize: 'inherit',
              }
            },
            blockquote: {
              borderLeftColor: '#FFE100',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              borderRadius: '0 0.5rem 0.5rem 0',
              padding: '1rem',
              fontStyle: 'italic',
              fontSize: '1.1em',
              marginTop: '2em',
              marginBottom: '2em',
            },
            hr: {
              borderColor: '#262626',
              marginTop: '3em',
              marginBottom: '3em',
            },
            ul: {
              color: '#ffffff',
              li: {
                marginTop: '0.5em',
                marginBottom: '0.5em',
                '&::marker': {
                  color: '#FFE100',
                },
              },
            },
            ol: {
              color: '#ffffff',
              li: {
                marginTop: '0.5em',
                marginBottom: '0.5em',
                '&::marker': {
                  color: '#FFE100',
                },
              },
            },
            table: {
              fontSize: '0.9em',
              thead: {
                borderBottomColor: '#262626',
                th: {
                  color: '#FFE100',
                  padding: '0.75em 1em',
                },
              },
              tbody: {
                tr: {
                  borderBottomColor: '#262626',
                },
                td: {
                  color: '#ffffff',
                  padding: '0.75em 1em',
                },
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config; 