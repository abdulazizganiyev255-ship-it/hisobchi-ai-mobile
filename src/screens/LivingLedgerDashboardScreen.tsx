import {useState} from 'react';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, View,
  useWindowDimensions,
} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {SculpturalRibbon} from '../components/finance/SculpturalRibbon';
import {
  LedgerMiniBars, LedgerTransactionRow, SourceTag,
} from '../components/living/LedgerPrimitives';
import {demo, formatMoney, type Transaction} from '../data/demo';
import {filterAndSortTransactions} from '../data/transactions';
import {semanticV1} from '../theme/semantic';

type Props = {
  transactions: Transaction[];
  onAdd: () => void;
  onOpenTransactions: () => void;
};
const palette = semanticV1;
const plum = palette.brand.primary;
const deep = palette.brand.deep;

/**
 * Hisobchi Home D01: ivory/plum editorial composition with sculptural ribbon.
 * Strictly demo-only. Fixed Home amounts remain independent of the local
 * transaction array; recent rows use the mutable session ledger.
 * No invented bank balance or Safe-to-Spend calculation.
 */
export function LivingLedgerDashboardScreen({
  transactions, onAdd, onOpenTransactions,
}: Props) {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [period, setPeriod] = useState<'current' | 'previous'>('current');
  const {width, height} = useWindowDimensions();
  const compact = width < 365;
  const shortScreen = height < 720;
  const month = demo.months[period];
  const recent = filterAndSortTransactions(transactions, 'all', '').slice(0, 3);
  const amount = formatMoney(demo.safeToSpendToday).replace(/ so‘m$/, '');
  const balance = formatMoney(demo.balance);
  const closeExplainer = () => setExplanationOpen(false);

  return (
    <>
      <ScrollView
        testID="living-ledger-home-scroll"
        style={styles.screen}
        contentContainerStyle={[styles.container, shortScreen && styles.containerShort]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brand} accessible accessibilityLabel="Hisobchi AI">
            <View style={styles.brandGlyph}>
              <Text style={styles.brandGlyphText}>h.</Text>
            </View>
            <View style={styles.brandCopy}>
              <Text style={styles.brandLabel}>PULINGIZNI TUSHUNING</Text>
              <Text style={styles.brandText}>Hisobchi AI</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demo rejimi haqida ma’lumot"
            onPress={() => setExplanationOpen(true)}
            style={({pressed}) => [styles.iconButton, pressed && styles.pressed]}
          >
            <AppIcon name="shield" color={plum} size={21}/>
          </Pressable>
        </View>

        <View style={[styles.notice, shortScreen && styles.noticeShort]} testID="living-ledger-demo-notice">
          <View style={styles.noticeDot}/>
          <Text style={styles.noticeText}>DEMO MUHIT — HAQIQIY HISOB EMAS</Text>
        </View>

        <View style={[styles.balanceHero, shortScreen && styles.balanceHeroShort]} testID="plum-home-balance-card">
          <View
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.ribbonLayer}
          >
            <SculpturalRibbon/>
          </View>
          <View style={styles.balanceTop}>
            <View style={styles.balanceLabelRow}>
              <AppIcon name="wallet" color="#F6E5E8" size={17}/>
              <Text style={styles.balanceOverline}>UMUMIY BALANS · NAMUNA</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={balanceVisible ?
                'Namuna balansni yashirish' : 'Namuna balansni ko‘rsatish'}
              accessibilityState={{selected: balanceVisible}}
              onPress={() => setBalanceVisible(value => !value)}
              style={({pressed}) => [styles.eyeButton, pressed && styles.pressed]}
            >
              <AppIcon name={balanceVisible ? 'eye' : 'eye-off'} color="#FFF7F5" size={20}/>
            </Pressable>
          </View>
          <View style={styles.balanceValues} accessible accessibilityLabel={
            balanceVisible ? 'Demo balans: ' + balance : 'Demo balans yashirilgan'
          }>
            <Text
              style={[styles.balanceDigits, compact && styles.balanceDigitsCompact]}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              {balanceVisible ? balance.replace(/ so‘m$/, '') : '••• •••'}
            </Text>
            <Text style={styles.balanceCurrency} accessibilityElementsHidden importantForAccessibility="no">so‘m</Text>
          </View>
          <Text style={styles.balanceDisclosure}>
            Bank bilan ulanmagan · ko‘rgazmali qiymat
          </Text>
        </View>

        <View style={[styles.safetyCard, shortScreen && styles.safetyCardShort]}>
          <View style={styles.safetyHeader}>
            <View style={styles.safetyLabelRow}>
              <View style={styles.shieldTile}><AppIcon name="shield" size={17} color={plum}/></View>
              <Text testID="plum-home-safety-title" style={styles.safetyTitle}>Bugun xavfsiz sarflash</Text>
            </View>
          </View>
          <View style={styles.safetyBottom}>
            <View style={styles.safetyAmountRow} accessible accessibilityLabel={
              'Xavfsiz sarflash, hisoblanmagan namuna: ' + formatMoney(demo.safeToSpendToday)
            }>
              <Text style={[styles.safetyAmount, compact && styles.safetyAmountCompact]}
                accessibilityElementsHidden importantForAccessibility="no">{amount}</Text>
              <Text style={styles.safetyCurrency}
                accessibilityElementsHidden importantForAccessibility="no">so‘m</Text>
            </View>
            <Pressable
              testID="living-ledger-safe-explainer"
              accessibilityRole="button"
              accessibilityLabel="Xavfsiz sarflash namunasi qanday ishlashi haqida"
              onPress={() => setExplanationOpen(true)}
              style={({pressed}) => [styles.explainButton, pressed && styles.pressed]}
            >
              <Text style={styles.explainText}>Bu raqam haqida</Text>
              <AppIcon name="chevron" color={plum} size={15}/>
            </Pressable>
          </View>
          <SourceTag label="DEMO · hisoblanmagan" tone="plum"/>
        </View>

        <Pressable
          testID="living-ledger-add-expense"
          accessibilityRole="button"
          accessibilityLabel="Xarajat qo‘shish, ushbu sessiya uchun"
          onPress={onAdd}
          style={({pressed}) => [
            styles.addButton, shortScreen && styles.addButtonShort,
            pressed && styles.addPressed,
          ]}
        >
          <View style={styles.addIcon}><AppIcon name="plus" size={20} color={plum}/></View>
          <View style={styles.addCopy}>
            <Text style={styles.addTitle}>Xarajat qo‘shish</Text>
            <Text style={styles.addSubtitle}>Sessiyadagi yozuvlarga saqlanadi</Text>
          </View>
          <AppIcon name="chevron" color="#FFFFFF" size={19}/>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeadCopy}>
            <Text style={styles.sectionOverline}>OYLIK XARAJAT · NAMUNA</Text>
            <Text style={styles.sectionTitle}>Xarajatlar ritmi</Text>
          </View>
          <View style={styles.periodSelector} accessibilityRole="radiogroup">
            {(['current', 'previous'] as const).map(key => {
              const active = period === key;
              return (
                <Pressable
                  testID={'living-ledger-period-' + key}
                  key={key}
                  accessibilityRole="radio"
                  accessibilityState={{selected: active, checked: active}}
                  accessibilityLabel={'Namunaviy davr: ' + demo.months[key].label}
                  onPress={() => setPeriod(key)}
                  style={({pressed}) => [
                    styles.periodItem, active && styles.periodActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.periodLabel, active && styles.periodLabelActive]}>
                    {demo.months[key].label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.chartCard}>
          <Text
            testID="living-ledger-period-total"
            style={[styles.chartAmount, compact && styles.chartAmountCompact]}
            accessibilityLabel={'Namuna xarajat: ' + formatMoney(month.total)}
          >
            {formatMoney(month.total)}
          </Text>
          <LedgerMiniBars
            tone="plum"
            values={month.chart}
            description={
              'Oylik xarajatlarning 9 ta shartli namuna nuqtasi. ' +
              month.label + '. ' + formatMoney(month.total) +
              '. Real sessiya operatsiyalaridan olinmagan.'
            }
          />
          <Text style={styles.chartNote}>
            DEMO GRAFIK · 9 SHARTLI NUQTA · SESSIYADAN HISOBLANMAGAN
          </Text>
        </View>

        <View style={styles.activityHeading}>
          <View style={styles.sectionHeadCopy}>
            <Text style={styles.sectionOverline}>JONLI SESSIYA</Text>
            <Text style={styles.sectionTitle}>So‘nggi operatsiyalar</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Barcha sessiya operatsiyalarini ochish"
            onPress={onOpenTransactions}
            style={({pressed}) => [styles.allButton, pressed && styles.pressed]}
          >
            <Text style={styles.allText}>Barchasi</Text>
            <AppIcon name="chevron" color={plum} size={17}/>
          </Pressable>
        </View>
        <View style={styles.activityCard}>
          {recent.length > 0 ? recent.map(item =>
            <LedgerTransactionRow key={item.id} item={item} tone="plum"/>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Hozircha yozuv yo‘q</Text>
              <Text style={styles.emptyText}>Birinchi sessiya xarajatingizni kiriting.</Text>
              <Pressable accessibilityRole="button" onPress={onAdd} style={styles.emptyAction}>
                <Text style={styles.emptyActionText}>Xarajat qo‘shish</Text>
              </Pressable>
            </View>
          )}
        </View>
        <Text style={styles.footer}>
          Namuna balans va xavfsiz sarflash hisoblanmaydi. Sessiya tugasa yoki ilova qayta ishga tushsa, yozuvlar boshlang‘ich namunaga qaytadi.
        </Text>
      </ScrollView>

      <Modal
        visible={explanationOpen}
        transparent
        animationType="fade"
        onRequestClose={closeExplainer}
        accessibilityViewIsModal
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Izoh oynasini yopish"
            onPress={closeExplainer}
          />
          <View style={styles.modalSheet}>
            <SourceTag label="DEMO · hisoblanmagan" tone="plum"/>
            <Text accessibilityRole="header" style={styles.modalTitle}>
              Bu raqam nimani bildiradi?
            </Text>
            <Text style={styles.modalBody}>
              {formatMoney(demo.safeToSpendToday)} hozir faqat namuna. Hisobchi AI real daromad,
              majburiy to‘lovlar yoki bank hisobingiz asosida ushbu qiymatni hisoblamayapti.
            </Text>
            <Text style={styles.modalBody}>
              Ushbu sessiyada xarajat qo‘shsangiz, operatsiyalar va Tahlil yangilanadi.
              Namuna balans, Safe-to-Spend va namunaviy grafik esa o‘zgarmaydi.
            </Text>
            <Pressable
              testID="living-ledger-explainer-close"
              accessibilityRole="button"
              accessibilityLabel="Tushunarli, izohni yopish"
              onPress={closeExplainer}
              style={({pressed}) => [styles.closeButton, pressed && styles.addPressed]}
            >
              <Text style={styles.closeText}>Tushunarli</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: palette.bg.canvas},
  container: {paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40},
  containerShort: {paddingTop: 8},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 46},
  brand: {flexDirection: 'row', alignItems: 'center', gap: 10},
  brandGlyph: {
    width: 38, height: 38, borderRadius: 14, backgroundColor: plum,
    alignItems: 'center', justifyContent: 'center',
  },
  brandGlyphText: {fontSize: 25, fontWeight: '800', letterSpacing: -2, color: '#FFFFFF', marginTop: -5},
  brandCopy: {gap: 2},
  brandLabel: {fontSize: 9, fontWeight: '800', letterSpacing: 1.35, color: palette.text.secondary},
  brandText: {fontSize: 21, fontWeight: '800', letterSpacing: -0.6, color: palette.text.primary},
  iconButton: {
    width: 44, height: 44, borderRadius: 15,
    backgroundColor: palette.bg.surface, borderWidth: 1, borderColor: palette.border.subtle,
    alignItems: 'center', justifyContent: 'center',
  },
  pressed: {opacity: 0.74},
  notice: {
    alignSelf: 'flex-start', marginTop: 9, paddingHorizontal: 9, paddingVertical: 6,
    backgroundColor: palette.brand.tint, borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', gap: 7,
  },
  noticeShort: {marginTop: 6, paddingVertical: 5},
  noticeDot: {width: 6, height: 6, backgroundColor: plum, borderRadius: 3},
  noticeText: {color: plum, fontSize: 10, fontWeight: '800', letterSpacing: 0.25},
  balanceHero: {
    marginTop: 12, minHeight: 158, borderRadius: 27,
    backgroundColor: deep, paddingHorizontal: 19, paddingTop: 16, paddingBottom: 16,
    overflow: 'hidden', justifyContent: 'space-between',
  },
  balanceHeroShort: {marginTop: 9, minHeight: 148},
  ribbonLayer: {
    position: 'absolute', right: -39, top: -15, opacity: 0.52,
  },
  balanceTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 1},
  balanceLabelRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  balanceOverline: {fontSize: 10, fontWeight: '800', letterSpacing: 0.75, color: '#F4E3E9'},
  eyeButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center', justifyContent: 'center',
  },
  balanceValues: {flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, zIndex: 1},
  balanceDigits: {
    fontSize: 35, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1.7,
    includeFontPadding: false,
  },
  balanceDigitsCompact: {fontSize: 30},
  balanceCurrency: {color: '#F3DFE6', fontSize: 17, fontWeight: '700'},
  balanceDisclosure: {color: '#EAD9E0', fontSize: 11, fontWeight: '500', zIndex: 1},
  safetyCard: {
    marginTop: 11, backgroundColor: palette.bg.surface, borderRadius: 23,
    borderWidth: 1, borderColor: '#E5D9D9', paddingHorizontal: 14, paddingVertical: 12,
    minHeight: 122, gap: 6,
  },
  safetyCardShort: {minHeight: 116, paddingVertical: 10, gap: 5},
  safetyHeader: {flexDirection: 'row', alignItems: 'center', gap: 5},
  safetyLabelRow: {flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 1},
  shieldTile: {
    height: 29, width: 29, borderRadius: 10, backgroundColor: palette.brand.tint,
    alignItems: 'center', justifyContent: 'center',
  },
  safetyTitle: {fontSize: 13, fontWeight: '800', color: palette.text.primary, flexShrink: 1},
  safetyBottom: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5},
  safetyAmountRow: {flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 4, flexShrink: 1},
  safetyAmount: {
    fontSize: 28, letterSpacing: -1.1, fontWeight: '800', color: palette.text.primary,
    includeFontPadding: false,
  },
  safetyAmountCompact: {fontSize: 25},
  safetyCurrency: {fontSize: 13, fontWeight: '700', color: palette.text.secondary},
  explainButton: {
    minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 2, paddingHorizontal: 3, flexShrink: 1,
  },
  explainText: {fontSize: 12, fontWeight: '800', color: plum},
  addButton: {
    marginTop: 11, minHeight: 62, borderRadius: 17, backgroundColor: plum,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, gap: 11,
  },
  addButtonShort: {marginTop: 9},
  addPressed: {opacity: 0.8},
  addIcon: {
    width: 40, height: 40, backgroundColor: '#F5E8ED', borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  addCopy: {flex: 1, gap: 3, minWidth: 0},
  addTitle: {fontSize: 16, fontWeight: '800', color: '#FFFFFF'},
  addSubtitle: {fontSize: 11, fontWeight: '500', color: '#F3E0E7'},
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    gap: 8, marginTop: 28,
  },
  sectionHeadCopy: {flex: 1, minWidth: 0, gap: 5},
  sectionOverline: {fontSize: 11, fontWeight: '800', letterSpacing: 0.9, color: palette.text.secondary},
  sectionTitle: {fontSize: 21, fontWeight: '800', letterSpacing: -0.5, color: palette.text.primary},
  periodSelector: {
    flexDirection: 'row', backgroundColor: palette.brand.tint,
    borderRadius: 15, padding: 3, gap: 2,
  },
  periodItem: {
    minHeight: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 9,
  },
  periodActive: {backgroundColor: plum},
  periodLabel: {fontSize: 11, fontWeight: '800', color: plum},
  periodLabelActive: {color: '#FFFFFF'},
  chartCard: {
    backgroundColor: palette.bg.surface, borderRadius: 24,
    borderWidth: 1, borderColor: '#E5D9D9', padding: 17, marginTop: 15,
  },
  chartAmount: {fontSize: 28, color: palette.text.primary, fontWeight: '800', letterSpacing: -0.6},
  chartAmountCompact: {fontSize: 25},
  chartNote: {
    fontSize: 10, lineHeight: 15, letterSpacing: 0.25, fontWeight: '600',
    color: palette.text.secondary, marginTop: 12,
  },
  activityHeading: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 28, marginBottom: 10, gap: 8,
  },
  allButton: {minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2},
  allText: {fontSize: 13, fontWeight: '800', color: plum},
  activityCard: {
    backgroundColor: palette.bg.surface, borderRadius: 22,
    borderWidth: 1, borderColor: '#E5D9D9', paddingHorizontal: 13, overflow: 'hidden',
  },
  emptyState: {padding: 12, gap: 10},
  emptyTitle: {fontSize: 16, fontWeight: '800', color: palette.text.primary},
  emptyText: {fontSize: 14, color: palette.text.secondary},
  emptyAction: {minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start'},
  emptyActionText: {fontSize: 14, fontWeight: '800', color: plum},
  footer: {fontSize: 12, lineHeight: 19, color: palette.text.secondary, marginTop: 19},
  modalRoot: {flex: 1, backgroundColor: 'rgba(30,16,25,0.58)', justifyContent: 'flex-end'},
  modalSheet: {
    backgroundColor: palette.bg.canvas, paddingHorizontal: 23, paddingTop: 23,
    paddingBottom: 34, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 14,
  },
  modalTitle: {fontSize: 26, fontWeight: '800', letterSpacing: -0.55, color: palette.text.primary},
  modalBody: {fontSize: 15, lineHeight: 23, color: palette.text.secondary},
  closeButton: {
    minHeight: 54, borderRadius: 16, backgroundColor: plum,
    alignItems: 'center', justifyContent: 'center', marginTop: 3,
  },
  closeText: {color: '#FFFFFF', fontSize: 16, fontWeight: '800'},
});
