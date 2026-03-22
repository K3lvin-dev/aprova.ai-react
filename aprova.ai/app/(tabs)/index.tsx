import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const CONCURSOS = [
  {
    id: 'pf',
    sigla: 'PF',
    nome: 'Policia Federal',
    cargo: 'Agente Administrativo',
    banca: 'CEBRASPE',
    ano: '2024',
    vagas: '1.500 vagas',
    icon: '🦅',
    cardBg: '#1A1035',
    accentColor: '#9C6FFF',
    dotColor: '#7C4DFF',
    available: true,
  },
  {
    id: 'inss',
    sigla: 'INSS',
    nome: 'Seg. Social',
    cargo: 'Tecnico do Seguro Social',
    banca: 'CEBRASPE',
    ano: '2024',
    vagas: '7.500 vagas',
    icon: '🏛️',
    cardBg: '#0B2240',
    accentColor: '#29B6D4',
    dotColor: '#00ACC1',
    available: true,
  },
];

function ConcursoCard({
  concurso,
  index,
}: {
  concurso: (typeof CONCURSOS)[number];
  index: number;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/(tabs)/trilha-loading?concursoId=${concurso.id}`);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 120).springify()}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={[styles.card, { backgroundColor: concurso.cardBg }]}
        >
          {/* Decorative blob */}
          <View
            style={[styles.blob, { backgroundColor: concurso.accentColor + '22' }]}
          />

          {/* Accent line */}
          <View style={[styles.accentLine, { backgroundColor: concurso.accentColor }]} />

          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              <View style={[styles.siglaBadge, { borderColor: concurso.accentColor + '55' }]}>
                <Text style={[styles.siglaText, { color: concurso.accentColor }]}>
                  {concurso.sigla}
                </Text>
              </View>
              <Text style={styles.cardIcon}>{concurso.icon}</Text>
            </View>

            <View style={styles.cardRight}>
              <Text style={styles.cardNome}>{concurso.nome}</Text>
              <Text style={styles.cardCargo}>{concurso.cargo}</Text>

              <View style={styles.cardMeta}>
                <View style={styles.metaTag}>
                  <View style={[styles.metaDot, { backgroundColor: concurso.dotColor }]} />
                  <Text style={styles.metaText}>{concurso.banca}</Text>
                </View>
                <View style={styles.metaTag}>
                  <View style={[styles.metaDot, { backgroundColor: concurso.dotColor }]} />
                  <Text style={styles.metaText}>{concurso.vagas}</Text>
                </View>
              </View>

              <View style={[styles.ctaRow]}>
                <Text style={[styles.ctaText, { color: concurso.accentColor }]}>
                  Gerar minha trilha
                </Text>
                <Text style={[styles.ctaArrow, { color: concurso.accentColor }]}>→</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function ConcursosScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <Text style={styles.brandLabel}>aprova.AI</Text>
          <Text style={styles.headline}>Qual concurso{'\n'}voce vai passar?</Text>
          <Text style={styles.subheadline}>
            Geramos sua trilha de estudos personalizada a partir do edital oficial.
          </Text>
        </Animated.View>

        <View style={styles.list}>
          {CONCURSOS.map((c, i) => (
            <ConcursoCard key={c.id} concurso={c} index={i + 1} />
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.footer}
        >
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>
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
    backgroundColor: '#0B0B14',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 32,
    gap: 8,
  },
  brandLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    letterSpacing: 2,
    color: '#6750A4',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headline: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 34,
    lineHeight: 40,
    color: '#F0EEFF',
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 14,
    lineHeight: 20,
    color: '#9890B0',
    marginTop: 4,
  },
  list: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 160,
  },
  blob: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -40,
    top: -40,
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
    paddingLeft: 24,
    gap: 16,
    minHeight: 160,
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
  siglaText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    letterSpacing: 1,
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
    fontSize: 22,
    color: '#F0EEFF',
    lineHeight: 26,
  },
  cardCargo: {
    fontSize: 12,
    color: '#9890B0',
    marginTop: 2,
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
  metaText: {
    fontSize: 11,
    color: '#9890B0',
    letterSpacing: 0.3,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaArrow: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  footerDivider: {
    width: 40,
    height: 1,
    backgroundColor: '#2A2440',
  },
  footerText: {
    fontSize: 12,
    color: '#4A4460',
    letterSpacing: 0.5,
  },
});
