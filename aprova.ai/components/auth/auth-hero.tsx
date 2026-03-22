import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Text, useTheme } from 'react-native-paper';

export function AuthHero() {
  const theme = useTheme();

  return (
    <View style={[styles.hero, { backgroundColor: theme.colors.primary }]}>
      <Image source={require('@/assets/images/logo.svg')} style={styles.logo} />
      <Text style={[styles.brand, { color: theme.colors.onPrimary }]}>
        aprova.AI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 4,
  },
  logo: {
    width: 280,
    height: 153,
    resizeMode: 'contain',
  },
  brand: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 32,
    letterSpacing: 0.5,
  },
});
