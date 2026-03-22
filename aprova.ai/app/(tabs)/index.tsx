import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
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
    nome: 'Polícia Federal',
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
    cargo: 'Técnico do Seguro Social',
    banca: 'CEBRASPE',
    vagas: '7.500 vagas',
    icon: '🏛️',
    variant: 'tertiary',
  },
];

function ConcursoCard({ concurso, index }: { concurso: Concurso; index: number }) {
  const theme = useTheme();

  const isPrimary = concurso.variant === 'primary';

  // Camada 1 — hero sólido saturado
  const heroColor = isPrimary ? theme.colors.primary : theme.colors.tertiary;
  const onHeroColor = isPrimary ? theme.colors.onPrimary : theme.colors.onTertiary;

  // Camada 2 — body tinted container
  const containerBg = isPrimary ? theme.colors.primaryContainer : theme.colors.tertiaryContainer;
  const onContainer = isPrimary
    ? theme.colors.onPrimaryContainer
    : theme.colors.onTertiaryContainer;

  // Camada 3 — meta chips tintados com a cor do card
  const chipBg = heroColor + '28';
  const onChip = onContainer;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: criar tela /(tabs)/trilha-loading
    router.push(`/(tabs)/trilha-loading?concursoId=${concurso.id}` as never);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 140).springify()}>
      <View style={[styles.card, { backgroundColor: containerBg }]}>
        {/* Camada 1: hero sólido */}
        <View style={[styles.heroArea, { backgroundColor: heroColor }]}>
          <Text style={[styles.watermark, { color: onHeroColor }]}>{concurso.sigla}</Text>
          <Text style={styles.heroIcon}>{concurso.icon}</Text>
        </View>

        {/* Camada 2: body container */}
        <View style={styles.cardBody}>
          <Text variant="headlineSmall" style={[styles.cardNome, { color: onContainer }]}>
            {concurso.nome}
          </Text>
          <Text variant="bodyMedium" style={{ color: onContainer, opacity: 0.7, marginTop: 2 }}>
            {concurso.cargo}
          </Text>

          {/* Camada 3: meta chips em secondaryContainer */}
          <View style={styles.chipsRow}>
            <View style={[styles.chip, { backgroundColor: chipBg }]}>
              <Text variant="labelSmall" style={{ color: onChip }}>
                {concurso.banca}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: chipBg }]}>
              <Text variant="labelSmall" style={{ color: onChip }}>
                {concurso.vagas}
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handlePress}
            buttonColor={heroColor}
            textColor={onHeroColor}
            style={styles.ctaButton}
            contentStyle={styles.ctaButtonContent}>
            Gerar minha trilha
          </Button>
        </View>
      </View>
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
        <Animated.View entering={FadeInUp.delay(0).springify()} style={styles.header}>
          <Text variant="labelLarge" style={[styles.brandLabel, { color: theme.colors.primary }]}>
            APROVA.AI
          </Text>
          <Text
            variant="displaySmall"
            style={[styles.headline, { color: theme.colors.onBackground }]}>
            Qual concurso você vai passar?
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceVariant, lineHeight: 24 }}>
            Trilha de estudos gerada a partir do edital oficial.
          </Text>
        </Animated.View>

        <View style={styles.list}>
          {CONCURSOS.map((c, i) => (
            <ConcursoCard key={c.id} concurso={c} index={i + 1} />
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.footer}>
          <View style={[styles.footerDivider, { backgroundColor: theme.colors.outlineVariant }]} />
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
    paddingTop: 40,
    paddingBottom: 32,
    gap: 10,
  },
  brandLabel: {
    letterSpacing: 3,
    marginBottom: 4,
  },
  headline: {
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 44,
  },
  list: {
    gap: 16,
  },

  // Card
  card: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  heroArea: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    fontSize: 130,
    fontFamily: 'Nunito_800ExtraBold',
    opacity: 0.07,
    right: -8,
    bottom: -24,
    letterSpacing: -4,
  },
  heroIcon: {
    fontSize: 64,
  },
  cardBody: {
    padding: 20,
    paddingTop: 18,
    gap: 14,
  },
  cardNome: {
    fontFamily: 'Nunito_800ExtraBold',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ctaButton: {
    borderRadius: 20,
    marginTop: 2,
  },
  ctaButtonContent: {
    paddingVertical: 6,
  },

  // Footer
  footer: {
    marginTop: 36,
    alignItems: 'center',
    gap: 12,
  },
  footerDivider: {
    width: 40,
    height: 1,
  },
});
