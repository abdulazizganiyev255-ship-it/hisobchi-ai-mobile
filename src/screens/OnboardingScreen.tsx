import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon, type IconName} from '../components/AppIcon';
import {ScreenHeader, SurfaceCard} from '../components/ds';
import {colors, layout, radius, semantic, typography} from '../theme/tokens';

type Props = {
  onExit: () => void;
};

type Step = {
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
  points: readonly string[];
};

const STEPS: readonly Step[] = [
  {
    icon: 'wallet',
    eyebrow: '01 · PULINGIZNI TUSHUNING',
    title: 'Moliyaviy holat bir ekranda',
    description: 'Bosh sahifada balans, xavfsiz sarflash va xarajatlar umumiy ko‘rinishini topasiz.',
    points: [
      'Asosiy ko‘rsatkichlarni bir joyda ko‘ring.',
      'Hozirgi balans va Safe-to-Spend faqat namuna.',
      'Haqiqiy bank hisoblari ulanmagan.',
    ],
  },
  {
    icon: 'receipt',
    eyebrow: '02 · QAYD ETING',
    title: 'Kirim va chiqimlarni kiriting',
    description: 'Operatsiyalar bo‘limida xarajat yoki daromad qo‘shib, kategoriya va sanasini tanlaysiz.',
    points: [
      'Yozuvlarni qo‘shish, tahrirlash va o‘chirish mumkin.',
      'Filtr va qidiruv bilan ro‘yxatni ko‘ring.',
      'Hozirgi o‘zgarishlar faqat sessiyada saqlanadi.',
    ],
  },
  {
    icon: 'chart',
    eyebrow: '03 · NATIJANI KO‘RING',
    title: 'Xarajatlaringizni tahlil qiling',
    description: 'Tahlil bo‘limida kirim, chiqim, umumiy aylanma va kategoriya ulushlarini ko‘rasiz.',
    points: [
      'Hafta, oy yoki 30 kunlik davrni tanlang.',
      'Kunlik grafikdan aniq summalarni tekshiring.',
      'Analitika sessiyadagi demo yozuvlardan hisoblanadi.',
    ],
  },
];

export function OnboardingScreen({onExit}: Props) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;

  const forward = () => {
    if (isLast) {
      onExit();
    } else {
      setIndex(previous => Math.min(previous + 1, STEPS.length - 1));
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ScreenHeader
          title="Boshlash"
          subtitle="Hisobchi AI · qisqa qo‘llanma · UI v1.4"
          icon="wallet"
          trailing={
            <Pressable
              onPress={onExit}
              accessibilityRole="button"
              accessibilityLabel="Qo‘llanmadan chiqish"
              style={styles.exit}
            >
              <Text style={styles.exitText}>Yopish</Text>
            </Pressable>
          }
        />

        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Ilova bilan tanishing</Text>
          <Text style={styles.progressCount}>{index + 1} / {STEPS.length}</Text>
        </View>
        <View style={styles.progressTrack}>
          {STEPS.map((item, stepIndex) => (
            <View
              key={item.eyebrow}
              style={[styles.progressSegment, stepIndex <= index && styles.progressFilled]}
            />
          ))}
        </View>

        <SurfaceCard style={styles.hero}>
          <View style={styles.heroVisual}>
            <LinearGradient
              colors={['#1D638B', '#0E375B']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.heroIcon}
            >
              <AppIcon name={step.icon} color={colors.primarySoft} size={40} strokeWidth={1.7}/>
            </LinearGradient>
            <View style={styles.visualAccentA}/>
            <View style={styles.visualAccentB}/>
          </View>
          <Text style={styles.eyebrow}>{step.eyebrow}</Text>
          <Text accessibilityRole="header" style={styles.heroTitle}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </SurfaceCard>

        <SurfaceCard style={styles.pointsCard}>
          <Text style={styles.pointsTitle}>Nimalarni bilib olasiz?</Text>
          {step.points.map(point => (
            <View key={point} style={styles.pointRow}>
              <View style={styles.checkIcon}>
                <AppIcon name="check" color={colors.positive} size={15} strokeWidth={2.4}/>
              </View>
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </SurfaceCard>

        <Text style={styles.disclosure}>
          Namoyish rejimi: bu qo‘llanma hisob yaratmaydi, bankka ulanmaydi va
          sizning ma’lumotlaringizni serverga yubormaydi.
        </Text>
      </ScrollView>

      <View style={styles.actions}>
        {!isFirst ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Oldingi qadam"
            onPress={() => setIndex(previous => Math.max(0, previous - 1))}
            style={styles.back}
          >
            <AppIcon name="arrow-left" color={colors.primarySoft} size={18}/>
            <Text style={styles.backText}>Ortga</Text>
          </Pressable>
        ) : (
          <View style={styles.spacer}/>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Qo‘llanmani tugatish' : 'Keyingi qadam'}
          onPress={forward}
          style={styles.next}
        >
          <LinearGradient
            colors={['#A0E9FF', '#44BEEB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.nextInner}
          >
            <Text style={styles.nextText}>{isLast ? 'Boshlash' : 'Davom etish'}</Text>
            <AppIcon name="chevron" color={colors.ink} size={18} strokeWidth={2.3}/>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  scroll: {flex: 1},
  content: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: 18,
    paddingBottom: 24,
    gap: layout.sectionGap,
  },
  exit: {
    minHeight: layout.touchTarget, minWidth: 58, paddingHorizontal: 10,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.surfaceRaised, borderRadius: radius.sm,
  },
  exitText: {color: colors.primarySoft, fontSize: typography.size.caption, fontWeight: '700'},
  progressHeader: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 8},
  progressTitle: {color: colors.text, fontSize: typography.size.label, fontWeight: '700'},
  progressCount: {color: colors.primarySoft, fontSize: typography.size.caption, fontWeight: '700'},
  progressTrack: {height: 5, flexDirection: 'row', gap: 6},
  progressSegment: {flex: 1, backgroundColor: colors.surfaceRaised, borderRadius: 999},
  progressFilled: {backgroundColor: colors.primary},
  hero: {gap: 9, padding: 18},
  heroVisual: {height: 132, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'},
  heroIcon: {
    width: 94, height: 94, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: semantic.strongBorder, zIndex: 1,
  },
  visualAccentA: {
    position: 'absolute', width: 170, height: 170, borderRadius: 85,
    borderWidth: 1, borderColor: 'rgba(158,227,255,0.13)', top: -18,
  },
  visualAccentB: {
    position: 'absolute', width: 235, height: 235, borderRadius: 118,
    borderWidth: 1, borderColor: 'rgba(158,227,255,0.08)', top: -50,
  },
  eyebrow: {color: colors.primarySoft, fontSize: typography.size.micro, fontWeight: '800', letterSpacing: 0.8},
  heroTitle: {color: colors.text, fontSize: 22, fontWeight: '800', lineHeight: 28},
  description: {color: colors.muted, fontSize: typography.size.body, lineHeight: typography.lineHeight.body},
  pointsCard: {gap: 12},
  pointsTitle: {color: colors.text, fontSize: typography.size.section, fontWeight: '800'},
  pointRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 9},
  checkIcon: {
    width: 25, height: 25, backgroundColor: '#143F4C',
    borderRadius: 9, justifyContent: 'center', alignItems: 'center',
  },
  pointText: {color: colors.muted, fontSize: typography.size.label, lineHeight: typography.lineHeight.body, flex: 1},
  disclosure: {color: colors.muted, fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption, textAlign: 'center'},
  actions: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    paddingHorizontal: layout.screenGutter, paddingTop: 8, paddingBottom: 10,
  },
  spacer: {flex: 1},
  back: {
    minHeight: layout.touchTarget, paddingHorizontal: 12, borderRadius: radius.sm,
    backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 7,
  },
  backText: {color: colors.primarySoft, fontSize: typography.size.label, fontWeight: '700'},
  next: {flex: 1, maxWidth: 200, borderRadius: radius.md, overflow: 'hidden'},
  nextInner: {
    minHeight: 52, paddingHorizontal: 15, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  nextText: {color: colors.ink, fontSize: typography.size.body, fontWeight: '800'},
});
