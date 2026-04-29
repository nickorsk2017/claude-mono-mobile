export const softCalmTheme = {
  colors: {
    primary: '#7C9CF5',
    primaryHover: '#6389F0',
    primaryLight: '#EEF2FF',
    secondary: '#B5AEED',
    background: '#F8F9FE',
    surface: '#FFFFFF',
    textPrimary: '#3D4255',
    textSecondary: '#8B90A7',
    textDisabled: '#C2C5D4',
    error: '#F87171',
    errorLight: '#FEF2F2',
    success: '#6EE7B7',
    successLight: '#ECFDF5',
    border: '#E5E7F0',
    borderFocus: '#7C9CF5',
    placeholder: '#B8BBD0',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '24px',
    full: '9999px',
  },
  shadows: {
    subtle: '0 1px 3px rgba(124,156,245,0.08)',
    soft: '0 2px 8px rgba(124,156,245,0.12)',
    medium: '0 4px 16px rgba(124,156,245,0.18)',
    lifted: '0 8px 24px rgba(124,156,245,0.22)',
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    fontSizes: {
      caption: '12px',
      small: '13px',
      body: '15px',
      medium: '17px',
      large: '22px',
      extraLarge: '28px',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    extraSmall: '4px',
    small: '8px',
    medium: '16px',
    large: '24px',
    extraLarge: '32px',
    huge: '48px',
  },
  transitions: {
    fast: 'all 0.1s ease',
    normal: 'all 0.15s ease',
    slow: 'all 0.25s ease',
  },
} as const;

export type SoftCalmTheme = typeof softCalmTheme;
