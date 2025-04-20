import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { COLORS, DARK_COLORS } from './colors';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.secondary,
    error: COLORS.error,
    background: COLORS.background,
    surface: COLORS.surface,
    surfaceVariant: COLORS.surfaceVariant,
    onSurface: COLORS.text.primary,
    onSurfaceVariant: COLORS.text.secondary,
    outline: COLORS.border.default,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: DARK_COLORS.primary,
    primaryContainer: DARK_COLORS.primaryLight,
    secondary: DARK_COLORS.secondary,
    error: DARK_COLORS.error,
    background: DARK_COLORS.background,
    surface: DARK_COLORS.surface,
    surfaceVariant: DARK_COLORS.surfaceVariant,
    onSurface: DARK_COLORS.text.primary,
    onSurfaceVariant: DARK_COLORS.text.secondary,
    outline: DARK_COLORS.border.default,
  },
}; 