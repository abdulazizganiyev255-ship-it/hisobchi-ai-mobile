import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {ActionRow, ScreenHeader, SectionHeader, SurfaceCard} from '../components/ds';
import {demo} from '../data/demo';
import {colors, layout, radius, semantic, typography} from '../theme/tokens';

export type Tab = 'home' | 'transactions' | 'analytics' | 'profile';

type Props = {
  tab: 'profile';
  transactionCount: number;
  onOpenTransactions: () => void;
  onOpenAnalytics: () => void;
  onOpenOnboarding: () => void;
  onResetDemo: () => void;
};

export function OtherScreen({
  tab: _tab, transactionCount, onOpenTransactions, onOpenAnalytics, onOpenOnboarding, onResetDemo,
}: Props) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const reset = () => {
    onResetDemo();
    setConfirmReset(false);
    setResetDone(true);
  };

  return (
    <ScrollView
      style={styles.fill}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <ScreenHeader
        title="Profil"
        icon="user"
        subtitle="Hisobchi AI · Namoyish rejimi · DS v1.3"
      />

      <SurfaceCard tone="light" style={styles.identityCard}>
        <View style={styles.avatar}>
          <AppIcon name="user" size={28} color={colors.ink}/>
        </View>
        <View style={styles.identityCopy}>
          <Text style={styles.identityTitle}>Namoyish profili</Text>
          <Text style={styles.identityCaption}>Hisobga kirilmagan</Text>
        </View>
        <View style={styles.demoTag}><Text style={styles.demoTagText}>Demo</Text></View>
      </SurfaceCard>

      <SurfaceCard style={styles.statusCard}>
        <SectionHeader icon="wallet" title="Ma’lumotlar holati" subtitle="Joriy sessiyadagi yozuvlar"/>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Operatsiyalar</Text>
            <Text style={styles.metricValue}>{transactionCount} ta</Text>
          </View>
          <View style={styles.metricDivider}/>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Saqlash holati</Text>
            <Text style={styles.metricValueSmall}>Vaqtincha</Text>
          </View>
        </View>
        <Text style={styles.statusNote}>
          Operatsiyalar faqat ilova sessiyasida turadi. Sahifani yangilasangiz demo yozuvlar qaytadi.
        </Text>
      </SurfaceCard>

      <SurfaceCard style={styles.sectionCard}>
        <SectionHeader icon="chart" title="Tezkor amallar"/>
        <ActionRow
          icon="receipt"
          title="Operatsiyalar"
          subtitle="Qo‘shish va tahrirlash"
          onPress={onOpenTransactions}
        />
        <View style={styles.separator}/>
        <ActionRow
          icon="chart"
          title="Tahlil"
          subtitle="Kirim, chiqim va aylanma"
          onPress={onOpenAnalytics}
        />
        <View style={styles.separator}/>
        <ActionRow
          icon="home"
          title="Ilova bo‘yicha qo‘llanma"
          subtitle="3 qadamli tanishtirish · demo"
          onPress={onOpenOnboarding}
        />
      </SurfaceCard>

      <SurfaceCard style={styles.sectionCard}>
        <SectionHeader
          icon="shield"
          title="Xavfsizlik va sozlamalar"
          subtitle="Joriy imkoniyatlar"
        />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bank hisoblari</Text>
          <Text style={styles.infoValue}>Ulanmagan</Text>
        </View>
        <View style={styles.separator}/>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>AI tahlili</Text>
          <Text style={styles.infoValue}>Yoqilmagan</Text>
        </View>
        <View style={styles.separator}/>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bulutga saqlash</Text>
          <Text style={styles.infoValue}>Mavjud emas</Text>
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.sectionCard}>
        <SectionHeader
          icon="receipt"
          title="Demo ma’lumotlarini tiklash"
          subtitle="Joriy sessiyadagi o‘zgarishlarni bekor qiladi"
        />
        {confirmReset ? (
          <View style={styles.confirmArea}>
            <Text style={styles.confirmText}>
              Hozirgi operatsiyalar o‘rniga {demo.transactions.length} ta namunaviy yozuv qaytariladi.
              Bu amalni ushbu sessiyada ortga qaytarib bo‘lmaydi.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tiklashni bekor qilish"
                onPress={() => setConfirmReset(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Bekor qilish</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Demo yozuvlarini tiklashni tasdiqlash"
                onPress={reset}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>Tiklash</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demo ma’lumotlarini tiklashni boshlash"
            onPress={() => {setResetDone(false); setConfirmReset(true);}}
            style={styles.resetButton}
          >
            <AppIcon name="receipt" color={colors.primarySoft} size={18}/>
            <Text style={styles.resetText}>{demo.transactions.length} ta namuna yozuviga qaytish</Text>
          </Pressable>
        )}
        {resetDone && (
          <Text accessibilityLiveRegion="polite" style={styles.successText}>
            {demo.transactions.length} ta demo yozuv tiklandi.
          </Text>
        )}
      </SurfaceCard>

      <Text style={styles.footer}>
        Hisobchi AI · Design System v1.3. Haqiqiy bank hisoblari, foydalanuvchi
        akkaunti yoki server ma’lumotlari ulanmagan.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  content: {
    paddingHorizontal: layout.screenGutter, paddingTop: 18, paddingBottom: 36,
    gap: layout.sectionGap,
  },
  identityCard: {flexDirection: 'row', alignItems: 'center', gap: 12},
  avatar: {
    width: 52, height: 52, borderRadius: radius.md, backgroundColor: '#CDEAF9',
    alignItems: 'center', justifyContent: 'center',
  },
  identityCopy: {flex: 1, minWidth: 0, gap: 4},
  identityTitle: {fontSize: typography.size.section, fontWeight: typography.weight.heavy, color: colors.ink},
  identityCaption: {fontSize: typography.size.caption, color: semantic.lightSubtext},
  demoTag: {backgroundColor: '#CCE7F4', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6},
  demoTagText: {fontSize: typography.size.micro, color: colors.ink, fontWeight: typography.weight.bold},
  statusCard: {gap: 12},
  metrics: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 3},
  metric: {flex: 1, minWidth: 0, gap: 5},
  metricLabel: {fontSize: typography.size.caption, color: colors.muted},
  metricValue: {fontSize: 23, fontWeight: typography.weight.heavy, color: colors.text},
  metricValueSmall: {fontSize: typography.size.section, fontWeight: typography.weight.heavy, color: colors.primarySoft},
  metricDivider: {width: 1, height: 40, backgroundColor: colors.divider},
  statusNote: {fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption, color: colors.muted},
  sectionCard: {gap: 10},
  separator: {height: 1, backgroundColor: colors.divider},
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    gap: 10, minHeight: layout.touchTarget,
  },
  infoLabel: {fontSize: typography.size.label, color: colors.text, flex: 1},
  infoValue: {fontSize: typography.size.caption, fontWeight: typography.weight.bold, color: colors.muted, textAlign: 'right'},
  resetButton: {
    minHeight: layout.touchTarget, backgroundColor: colors.surfaceRaised,
    borderRadius: radius.sm, flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 8, paddingHorizontal: 12,
  },
  resetText: {fontSize: typography.size.label, fontWeight: typography.weight.bold, color: colors.text},
  confirmArea: {gap: 12},
  confirmText: {fontSize: typography.size.caption, lineHeight: typography.lineHeight.body, color: colors.muted},
  confirmActions: {flexDirection: 'row', gap: 10},
  cancelButton: {
    minHeight: layout.touchTarget, flex: 1, borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center',
  },
  confirmButton: {
    minHeight: layout.touchTarget, flex: 1, borderRadius: radius.sm,
    backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center',
  },
  cancelText: {fontSize: typography.size.label, fontWeight: typography.weight.bold, color: colors.text},
  confirmButtonText: {fontSize: typography.size.label, fontWeight: typography.weight.heavy, color: colors.ink},
  successText: {fontSize: typography.size.caption, fontWeight: typography.weight.bold, color: colors.positive},
  footer: {color: colors.muted, fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption, textAlign: 'center', marginTop: 2},
});
