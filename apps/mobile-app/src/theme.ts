import type { ViewStyle } from 'react-native';

export const theme = {
  colors: {
    background: '#f4f7ff',
    surface: '#ffffff',
    surfaceSoft: '#eef4ff',
    surfaceMuted: '#f7f9fe',
    border: '#e3e7f2',
    borderStrong: '#cfd9ef',
    navy: '#0c1224',
    primary: '#1e4af5',
    primarySoft: '#5fa9ff',
    accent: '#1bb36f',
    muted: '#5d6682',
    textSoft: '#9aa7c2',
    success: '#0f7a4a',
    successSurface: '#e8faf0',
    warning: '#b45309',
    warningSurface: '#fff1dc',
    danger: '#b42318',
    dangerSurface: '#fdecec',
    refunded: '#4254d0',
    refundedSurface: '#eef0ff',
  },
  radius: {
    md: 18,
    lg: 24,
    xl: 28,
  },
  spacing: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
} as const;

export const cardShadow: ViewStyle = {
  shadowColor: theme.colors.navy,
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.08,
  shadowRadius: 24,
  elevation: 4,
};
