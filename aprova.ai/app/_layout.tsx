import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { useFonts, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { lightTheme, darkTheme } from '@/constants/md3-theme';
import { initSuperTokens } from '@/lib/supertokens';

initSuperTokens();
SplashScreen.preventAutoHideAsync();

const APP_BG = '#0B0B14';

const navLightTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: APP_BG },
};

const navDarkTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: APP_BG },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fontsLoaded] = useFonts({ Nunito_800ExtraBold });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <ThemeProvider value={isDark ? navDarkTheme : navLightTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: APP_BG } }} />
        <StatusBar style="light" />
      </ThemeProvider>
    </PaperProvider>
  );
}
