import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

type Props = {
  onGooglePress: () => void;
  onApplePress: () => void;
  loading?: boolean;
};

export function SocialButtons({ onGooglePress, onApplePress, loading }: Props) {
  return (
    <View style={styles.container}>
      <Button
        mode="contained-tonal"
        icon="google"
        onPress={onGooglePress}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Continuar com Google
      </Button>
      <Button
        mode="contained-tonal"
        icon="apple"
        onPress={onApplePress}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Continuar com Apple
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  button: { borderRadius: 28 },
  buttonContent: { paddingVertical: 6 },
});
