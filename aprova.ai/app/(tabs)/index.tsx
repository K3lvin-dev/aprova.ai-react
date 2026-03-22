import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type ConcursoVariant = 'primary' | 'tertiary';

type Concurso = {
  id: string;
  sigla: string;
  nome: string;
  cargo: string;
  banca: string;
  vagas: string;
  icon: string;
  variant: ConcursoVariant;
};

const CONCURSOS: Concurso[] = [
  {
    id: 'pf',
    sigla: 'PF',
    nome: 'Policia Federal',
    cargo: 'Agente Administrativo',
    banca: 'CEBRASPE',
    vagas: '1.500 vagas',
    icon: '🦅',
    variant: 'primary',
  },
  {
    id: 'inss',
    sigla: 'INSS',
    nome: 'Seg. Social',
    cargo: 'Tecnico do Seguro Social',
    banca: 'CEBRASPE',
    vagas: '7.500 vagas',
    icon: '🏛️',
    variant: 'tertiary',
  },
];

function ConcursoCard({ concurso, index }: { concurso: Concurso; index: number }) {
  const theme = useTheme();

  const containerBg =
    concurso.variant === 'primary' ? theme.colors.primaryContainer : theme.colors.tertiaryContainer;

  const onContainerColor =
    concurso.variant === 'primary'
      ? theme.colors.onPrimaryContainer
      : theme.colors.onTertiaryContainer;

  const accentColor = concurso.variant === 'primary' ? theme.colors.primary : theme.colors.tertiary;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: criar tela /(tabs)/trilha-loading
    router.push(`/(tabs)/trilha-loading?concursoId=${concurso.id}` as never);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 120).springify()}>
      <Card
        mode="contained"
        style={[styles.card, { backgroundColor: containerBg }]}
        onPress={handlePress}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardLeft}>
            <View style={[styles.siglaBadge, { borderColor: accentColor + '55' }]}>
              <Text variant="labelMedium" style={{ color: accentColor, letterSpacing: 1 }}>
                {concurso.sigla}
              </Text>
            </View>
            <Text style={styles.cardIcon}>{concurso.icon}</Text>
          </View>

          <View style={styles.cardRight}>
            <Text variant="titleLarge" style={[styles.cardNome, { color: onContainerColor }]}>
              {concurso.nome}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: onContainerColor, opacity: 0.7, marginTop: 2 }}>
              {concurso.cargo}
            </Text>

            <View style={styles.cardMeta}>
              <View style={styles.metaTag}>
                <View style={[styles.metaDot, { backgroundColor: accentColor }]} />
                <Text variant="labelSmall" style={{ color: onContainerColor, opacity: 0.7 }}>
                  {concurso.banca}
                </Text>
              </View>
              <View style={styles.metaTag}>
                <View style={[styles.metaDot, { backgroundColor: accentColor }]} />
                <Text variant="labelSmall" style={{ color: onContainerColor, opacity: 0.7 }}>
                  {concurso.vagas}
                </Text>
              </View>
            </View>

            <View style={styles.ctaRow}>
              <Text variant="labelLarge" style={{ color: accentColor }}>
                Gerar minha trilha
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

export default function ConcursosScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[styles.screen, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <Text variant="labelMedium" style={[styles.brandLabel, { color: theme.colors.primary }]}>
            APROVA.AI
          </Text>
          <Text
            variant="headlineLarge"
            style={[styles.headline, { color: theme.colors.onBackground }]}>
            Qual concurso{'\n'}voce vai passar?
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subheadline, { color: theme.colors.onSurfaceVariant }]}>
            Geramos sua trilha de estudos personalizada a partir do edital oficial.
          </Text>
        </Animated.View>

        <View style={styles.list}>
          {CONCURSOS.map((c, i) => (
            <ConcursoCard key={c.id} concurso={c} index={i + 1} />
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.footer}>
          <View style={[styles.footerDivider, { backgroundColor: theme.colors.outline }]} />
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Mais concursos chegando em breve
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 28,
    gap: 8,
  },
  brandLabel: {
    letterSpacing: 2,
    marginBottom: 4,
  },
  headline: {
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 40,
  },
  subheadline: {
    lineHeight: 20,
    marginTop: 4,
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 20,
    minHeight: 140,
  },
  cardLeft: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  siglaBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardIcon: {
    fontSize: 36,
  },
  cardRight: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  cardNome: {
    fontFamily: 'Nunito_800ExtraBold',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  footerDivider: {
    width: 40,
    height: 1,
  },
});
