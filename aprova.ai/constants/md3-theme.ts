import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',
    tertiary: '#006978',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#9EEFFD',
    onTertiaryContainer: '#001F26',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    secondaryContainer: '#4A4458',
    onSecondaryContainer: '#E8DEF8',
    tertiary: '#4FD8EB',
    onTertiary: '#00363D',
    tertiaryContainer: '#004F5A',
    onTertiaryContainer: '#B2EBFC',
    background: '#0B0B14',
    onBackground: '#F0EEFF',
    surface: '#1A1033',
    onSurface: '#F0EEFF',
    surfaceVariant: '#2A2440',
    onSurfaceVariant: '#9890B0',
    outline: '#3D3A4A',
  },
};
