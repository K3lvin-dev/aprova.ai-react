import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Text } from 'react-native-paper';

export function AuthHero() {
  return (
    <View style={styles.hero}>
      <Image source={require('@/assets/images/logo.svg')} style={styles.logo} />
      <Text style={styles.brand}>
        APROVA.AI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    paddingBottom: 0,
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
    fontSize: 30,
    letterSpacing: 2,
    color: '#6750A4',
    textTransform: 'uppercase',
  },
});
