/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F0',
          200: '#F5EED8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#334155',
            '--tw-prose-body': '#334155',
            '--tw-prose-headings': '#0369a1',
            '--tw-prose-links': '#0284c7',
            '--tw-prose-bold': '#0369a1',
            '--tw-prose-counters': '#0369a1',
            '--tw-prose-bullets': '#0369a1',
            '--tw-prose-quotes': '#0369a1',
            '--tw-prose-code': '#0369a1',
            '--tw-prose-pre-code': '#0369a1',
            '--tw-prose-pre-bg': '#FAF7F0',
            a: {
              color: '#0284c7',
              '&:hover': {
                color: '#0369a1',
              },
              textDecoration: 'none',
            },
            h1: {
              color: '#0369a1',
              fontWeight: '600',
            },
            h2: {
              color: '#0369a1',
              fontWeight: '600',
            },
            h3: {
              color: '#0369a1',
              fontWeight: '600',
            },
            strong: {
              color: '#0369a1',
              fontWeight: '600',
            },
            code: {
              color: '#0369a1',
              backgroundColor: '#FAF7F0',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: '#FAF7F0',
              code: {
                backgroundColor: 'transparent',
              },
            },
            blockquote: {
              color: '#0369a1',
              borderLeftColor: '#0284c7',
            },
          },
        },
        dark: {
          css: {
            color: '#94a3b8',
            '--tw-prose-body': '#94a3b8',
            '--tw-prose-headings': '#e0f2fe',
            '--tw-prose-links': '#7dd3fc',
            '--tw-prose-bold': '#e0f2fe',
            '--tw-prose-counters': '#e0f2fe',
            '--tw-prose-bullets': '#e0f2fe',
            '--tw-prose-quotes': '#e0f2fe',
            '--tw-prose-code': '#e0f2fe',
            '--tw-prose-pre-code': '#e0f2fe',
            '--tw-prose-pre-bg': '#1e293b',
            a: {
              color: '#7dd3fc',
              '&:hover': {
                color: '#bae6fd',
              },
            },
            h1: {
              color: '#e0f2fe',
            },
            h2: {
              color: '#e0f2fe',
            },
            h3: {
              color: '#e0f2fe',
            },
            strong: {
              color: '#e0f2fe',
            },
            code: {
              color: '#e0f2fe',
              backgroundColor: '#1e293b',
            },
            pre: {
              backgroundColor: '#1e293b',
            },
            blockquote: {
              color: '#e0f2fe',
              borderLeftColor: '#7dd3fc',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};