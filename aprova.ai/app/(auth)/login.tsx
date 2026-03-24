import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Divider, HelperText, useTheme } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { authApi } from '@/lib/supertokens';

import { AuthHero } from '@/components/auth/auth-hero';
import { SocialButtons } from '@/components/auth/social-buttons';

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const theme = useTheme();

  const onSubmit = async ({ email, password }: FormData) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await authApi.signIn(email, password);
      if (response.status === 'OK') {
        router.replace('/');
      } else {
        setApiError('E-mail ou senha incorretos.');
      }
    } catch {
      setApiError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    // TODO: implementar OAuth com expo-auth-session
  };

  const onApplePress = async () => {
    // TODO: implementar OAuth com expo-auth-session
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <AuthHero />

        <View style={styles.body}>
          <SocialButtons
            onGooglePress={onGooglePress}
            onApplePress={onApplePress}
            loading={loading}
          />

          <View style={styles.dividerRow}>
            <Divider style={styles.divider} />
            <Text variant="bodyMedium" style={[styles.orText, { color: theme.colors.primary }]}>ou entre com e-mail</Text>
            <Divider style={styles.divider} />
          </View>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'E-mail obrigatorio',
              pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail invalido' },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  label="E-mail"
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.email}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email?.message}
                </HelperText>
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Senha obrigatoria',
              minLength: { value: 6, message: 'Minimo 6 caracteres' },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  label="Senha"
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(v => !v)}
                    />
                  }
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.password}
                />
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password?.message}
                </HelperText>
              </>
            )}
          />

          {apiError ? (
            <HelperText type="error" visible>
              {apiError}
            </HelperText>
          ) : null}

          <Button mode="text" onPress={() => {}} style={styles.forgotButton}>
            Esqueci minha senha
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.primaryButton}
            contentStyle={styles.primaryButtonContent}
          >
            Entrar
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>Nao tem conta? </Text>
            <Link href="/(auth)/sign-up">
              <Text variant="bodyLarge" style={[styles.link, { color: theme.colors.primary }]}>Cadastre-se</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  body: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
    gap: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 20,
  },
  divider: { flex: 1 },
  orText: { opacity: 0.5, textAlign: 'center' },
  forgotButton: { alignSelf: 'center', marginTop: -4 },
  primaryButton: { marginTop: 16, borderRadius: 28 },
  primaryButtonContent: { paddingVertical: 6 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  link: { fontWeight: 'bold' },
});
