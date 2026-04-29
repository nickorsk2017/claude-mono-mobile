import type { Config } from 'tailwindcss';

const tailwindConfiguration: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../_common/ui-kit/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          primary: '#7C9CF5',
          'primary-hover': '#6389F0',
          'primary-light': '#EEF2FF',
          secondary: '#B5AEED',
          background: '#F8F9FE',
          surface: '#FFFFFF',
          text: '#3D4255',
          muted: '#8B90A7',
          disabled: '#C2C5D4',
          border: '#E5E7F0',
          success: '#6EE7B7',
          'success-light': '#ECFDF5',
          error: '#F87171',
          'error-light': '#FEF2F2',
        },
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(124,156,245,0.08)',
        soft: '0 2px 8px rgba(124,156,245,0.12)',
        medium: '0 4px 16px rgba(124,156,245,0.18)',
        lifted: '0 8px 24px rgba(124,156,245,0.22)',
      },
      fontSize: {
        caption: ['12px', { lineHeight: '1.5' }],
        body: ['15px', { lineHeight: '1.5' }],
        medium: ['17px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};

export default tailwindConfiguration;
