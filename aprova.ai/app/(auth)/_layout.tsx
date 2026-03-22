import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true, contentStyle: { backgroundColor: '#0B0B14' } }} />
  );
}
