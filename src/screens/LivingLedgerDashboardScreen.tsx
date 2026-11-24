import {useState} from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, View,
  useWindowDimensions,
} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {PremiumCashFlowChart} from '../components/finance/PremiumCashFlowChart';
import {MidnightOrbit} from '../components/finance/MidnightOrbit';
import {LedgerTransactionRow, SourceTag} from '../components/living/LedgerPrimitives';
import {demo, formatMoney, type Transaction} from '../data/demo';
import {filterAndSortTransactions} from '../data/transactions';
import {night} from '../theme/night';

type Props = {
  transactions: Transaction[];
  onAdd: () => void;
  onOpenTransactions: () => void;
};

/**
 * Midnight Finance V03 visual direction (original layout).
 * Fixed Home balance, safety amount and chart remain labelled DEMO values.
 * Session transaction rows are deliberately distinct and dynamic.
 * No bank balance, Safe-to-Spend result or real AI insight is implied.
 */
export function LivingLedgerDashboardScreen({
  transactions, onAdd, onOpenTransactions,
}: Props) {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [period, setPeriod] = useState<'current' | 'previous'>('current');
  const {width, height} = useWindowDimensions();
  const compact = width < 365;
  const shortScreen = height < 720;
  const month = demo.months[period];
  const otherMonth = demo.months[period === 'current' ? 'previous' : 'current'];
  const recent = filterAndSortTransactions(transactions, 'all', '').slice(0, 3);
  const amount = formatMoney(demo.safeToSpendToday).replace(/ so‘m$/, '');
  const balance = formatMoney(demo.balance).replace(/ so‘m$/, '');
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
            <View style={styles.brandSymbol}>
              <Text style={styles.brandSymbolText}>h.</Text>
            </View>
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>hisobchi<Text style={styles.brandAI}> ai</Text></Text>
              <Text style={styles.brandKicker}>PULINGIZNI TUSHUNING</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demo rejimi haqida ma’lumot"
            onPress={() => setExplanationOpen(true)}
            style={({pressed}) => [styles.helpButton, pressed && styles.pressed]}
          >
            <AppIcon name="shield" color={night.lime} size={19}/>
          </Pressable>
        </View>

        <View testID="living-ledger-demo-notice" style={styles.demoNotice}>
          <View style={styles.demoDot}/>
          <Text style={styles.demoNoticeText}>DEMO MUHIT — HAQIQIY HISOB EMAS</Text>
        </View>

        <LinearGradient
          colors={[night.heroStart, night.heroEnd, '#101820']}
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          testID="midnight-home-balance-card"
          style={[styles.hero, shortScreen && styles.heroShort]}
        >
          <View
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.orbitLayer}
          >
            <MidnightOrbit/>
          </View>
          <View style={styles.heroCopy}>
            <View style={styles.heroTop}>
              <Text style={styles.balanceEyebrow}>UMUMIY BALANS</Text>
              <View style={styles.heroStatusDot}/>
            </View>
            <View accessible accessibilityLabel={'Demo balans: ' + formatMoney(demo.balance)}>
              <Text style={[styles.balanceValue, compact && styles.balanceValueCompact]}
                accessibilityElementsHidden importantForAccessibility="no">{balance}</Text>
              <Text style={styles.currencyLabel}
                accessibilityElementsHidden importantForAccessibility="no">so‘m</Text>
            </View>
            <View style={styles.heroFoot}>
              <View style={styles.heroFootLine}/>
              <Text style={styles.heroFootText}>NAMUNA · BANK ULANMAGAN</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.safetyCard, shortScreen && styles.safetyCardShort]}>
          <View style={styles.safetyAccent}/>
          <View style={styles.safetyCopy}>
            <View style={styles.safetyHeading}>
              <AppIcon name="shield" color={night.lime} size={16}/>
              <Text testID="midnight-home-safety-title" style={styles.safetyLabel}>
                Bugun xavfsiz sarflash
              </Text>
            </View>
            <View style={styles.safetyFigure} accessible accessibilityLabel={
              'Xavfsiz sarflash, hisoblanmagan namuna: ' +
              formatMoney(demo.safeToSpendToday)
            }>
              <Text style={styles.safetyValue}
                accessibilityElementsHidden importantForAccessibility="no">{amount}</Text>
              <Text style={styles.safetyUnit}
                accessibilityElementsHidden importantForAccessibility="no">so‘m</Text>
            </View>
            <SourceTag label="DEMO · hisoblanmagan" tone="night"/>
          </View>
          <Pressable
            testID="living-ledger-safe-explainer"
            accessibilityRole="button"
            accessibilityLabel="Xavfsiz sarflash namunasi qanday ishlashi haqida"
            onPress={() => setExplanationOpen(true)}
            style={({pressed}) => [styles.safetyInfoButton, pressed && styles.pressed]}
          >
            <AppIcon name="chevron" color={night.lime} size={21}/>
          </Pressable>
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
          <View style={styles.addCircle}>
            <AppIcon name="plus" size={21} color={night.canvas}/>
          </View>
          <View style={styles.addCopy}>
            <Text style={styles.addTitle}>Xarajat qo‘shish</Text>
            <Text style={styles.addDetail}>Bir necha soniyada qayd eting</Text>
          </View>
          <View style={styles.addChevron}>
            <AppIcon name="chevron" color={night.canvas} size={19}/>
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionKicker}>SARF-XARAJATLAR · NAMUNA</Text>
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
          <View style={styles.chartTopRow}>
            <View>
              <Text style={styles.chartEyebrow}>OYLIK XARAJAT · NAMUNA</Text>
              <Text
                testID="living-ledger-period-total"
                style={[styles.chartAmount, compact && styles.chartAmountCompact]}
                accessibilityLabel={'Namuna xarajat: ' + formatMoney(month.total)}
              >
                {formatMoney(month.total)}
              </Text>
            </View>
            <View style={styles.chartAccent}>
              <AppIcon name="chart" color={night.lime} size={19}/>
            </View>
          </View>
          <PremiumCashFlowChart
            tone="night"
            values={month.chart}
            previousValues={otherMonth.chart}
            description={
              'Ikkita oyning 9 tadan shartli, normallashtirilgan nuqtasi. ' +
              month.label + ': ' + formatMoney(month.total) +
              '. Egri chiziq va nuqtalar real sanalar yoki so‘m summalarini bildirmaydi.'
            }
          />
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendLine}/>
              <Text style={styles.legendText}>{month.label}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendDot}/>
              <Text style={styles.legendText}>{otherMonth.label} · nuqtalar</Text>
            </View>
          </View>
          <Text style={styles.chartNote}>
            DEMO GRAFIK · 9 SHARTLI NUQTA · SESSIYADAN HISOBLANMAGAN
          </Text>
        </View>

        <View style={styles.activityHeading}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionKicker}>JONLI SESSIYA</Text>
            <Text style={styles.sectionTitle}>So‘nggi operatsiyalar</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Barcha sessiya operatsiyalarini ochish"
            onPress={onOpenTransactions}
            style={({pressed}) => [styles.allButton, pressed && styles.pressed]}
          >
            <Text style={styles.allText}>Barchasi</Text>
            <AppIcon name="chevron" color={night.lime} size={16}/>
          </Pressable>
        </View>
        <View style={styles.activityCard}>
          {recent.length > 0 ? recent.map(item =>
            <LedgerTransactionRow key={item.id} item={item} tone="night"/>
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
            accessibilityLabel="Izoh oynasini yopish"
            accessibilityRole="button"
            onPress={closeExplainer}
          />
          <View style={styles.modalSheet}>
            <SourceTag label="DEMO · hisoblanmagan" tone="night"/>
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
  screen: {flex: 1, backgroundColor: night.canvas},
  container: {paddingHorizontal: 19, paddingTop: 9, paddingBottom: 40},
  containerShort: {paddingTop: 5},
  header: {minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  brand: {flexDirection: 'row', alignItems: 'center', gap: 11},
  brandSymbol: {width: 41, height: 41, borderRadius: 13, backgroundColor: night.lime, justifyContent: 'center', alignItems: 'center'},
  brandSymbolText: {fontSize: 25, letterSpacing: -2, fontWeight: '900', color: night.canvas, marginTop: -4},
  brandCopy: {gap: 2},
  brandName: {fontSize: 23, fontWeight: '900', letterSpacing: -1.15, color: night.ink},
  brandAI: {color: night.lime},
  brandKicker: {color: night.subtext, fontSize: 9, fontWeight: '800', letterSpacing: 1.75},
  helpButton: {height: 44, width: 44, borderRadius: 15, backgroundColor: night.surface, borderWidth: 1, borderColor: night.line, justifyContent: 'center', alignItems: 'center'},
  pressed: {opacity: 0.7},
  demoNotice: {alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 9, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#202A22'},
  demoDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: night.lime},
  demoNoticeText: {fontSize: 10, fontWeight: '800', color: '#D4EFAD', letterSpacing: 0.15},
  hero: {marginTop: 12, minHeight: 177, borderRadius: 24, borderWidth: 1, borderColor: '#34463F', paddingHorizontal: 18, paddingVertical: 17, overflow: 'hidden', justifyContent: 'center'},
  heroShort: {minHeight: 174, paddingVertical: 14},
  orbitLayer: {position: 'absolute', right: -84, top: -56, opacity: 0.63},
  heroCopy: {zIndex: 1},
  heroTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  heroStatusDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: night.lime},
  balanceEyebrow: {fontSize: 10, fontWeight: '800', letterSpacing: 1.3, color: '#D5E9D4', marginBottom: 10},
  balanceValue: {fontSize: 34, letterSpacing: -1.5, color: night.ink, fontWeight: '900', includeFontPadding: false},
  balanceValueCompact: {fontSize: 30},
  currencyLabel: {fontSize: 14, fontWeight: '700', color: '#D4DFD9', marginTop: 1},
  heroFoot: {flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 20},
  heroFootLine: {width: 16, height: 2, borderRadius: 2, backgroundColor: night.lime},
  heroFootText: {fontSize: 10, fontWeight: '800', letterSpacing: 0.35, color: '#D9E5DC'},
  safetyCard: {marginTop: 10, minHeight: 107, backgroundColor: night.surface, borderWidth: 1, borderColor: night.line, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 8, overflow: 'hidden'},
  safetyCardShort: {minHeight: 101, paddingVertical: 8},
  safetyAccent: {position: 'absolute', top: 18, bottom: 18, left: 0, width: 3, borderRadius: 3, backgroundColor: night.lime},
  safetyCopy: {flex: 1, gap: 5, minWidth: 0},
  safetyHeading: {flexDirection: 'row', alignItems: 'center', gap: 7},
  safetyLabel: {fontSize: 12, color: night.subtext, fontWeight: '700', flexShrink: 1},
  safetyFigure: {flexDirection: 'row', alignItems: 'baseline', gap: 6},
  safetyValue: {color: night.ink, fontSize: 28, fontWeight: '900', letterSpacing: -1.05, includeFontPadding: false},
  safetyUnit: {color: night.subtext, fontWeight: '700', fontSize: 13},
  safetyInfoButton: {width: 44, height: 44, borderRadius: 15, backgroundColor: night.surfaceRaised, alignItems: 'center', justifyContent: 'center'},
  addButton: {minHeight: 61, borderRadius: 20, backgroundColor: night.lime, marginTop: 11, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10},
  addButtonShort: {marginTop: 9},
  addPressed: {backgroundColor: night.limePressed},
  addCircle: {width: 40, height: 40, borderRadius: 14, backgroundColor: '#E7FFAE', alignItems: 'center', justifyContent: 'center'},
  addCopy: {flex: 1, gap: 3, minWidth: 0},
  addTitle: {fontSize: 16, fontWeight: '900', color: night.canvas},
  addDetail: {fontSize: 11, fontWeight: '600', color: '#26351C'},
  addChevron: {width: 29, height: 29, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DFFF94'},
  sectionHeader: {marginTop: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8},
  sectionCopy: {flex: 1, minWidth: 0, gap: 4},
  sectionKicker: {fontSize: 10, fontWeight: '800', letterSpacing: 1.05, color: night.faint},
  sectionTitle: {fontSize: 20, fontWeight: '800', letterSpacing: -0.5, color: night.ink},
  periodSelector: {flexDirection: 'row', borderRadius: 15, backgroundColor: night.surfaceRaised, padding: 3, gap: 2},
  periodItem: {minHeight: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 7},
  periodActive: {backgroundColor: night.lime},
  periodLabel: {fontSize: 11, fontWeight: '800', color: night.subtext},
  periodLabelActive: {color: night.canvas},
  chartCard: {marginTop: 13, backgroundColor: night.surface, borderWidth: 1, borderColor: night.line, borderRadius: 24, paddingHorizontal: 14, paddingTop: 17, paddingBottom: 16},
  chartTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  chartEyebrow: {fontSize: 10, fontWeight: '800', color: night.subtext, letterSpacing: 0.6},
  chartAmount: {marginTop: 5, fontSize: 28, letterSpacing: -0.9, fontWeight: '900', color: night.ink},
  chartAmountCompact: {fontSize: 24},
  chartAccent: {width: 40, height: 40, borderRadius: 14, backgroundColor: '#22301D', alignItems: 'center', justifyContent: 'center'},
  legendRow: {marginTop: 0, flexDirection: 'row', alignItems: 'center', gap: 14},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 6},
  legendLine: {width: 18, height: 3, borderRadius: 3, backgroundColor: night.lime},
  legendDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: night.chartSecondary},
  legendText: {fontSize: 11, fontWeight: '600', color: night.subtext},
  chartNote: {marginTop: 12, fontSize: 10, color: night.subtext, fontWeight: '600', lineHeight: 16},
  activityHeading: {marginTop: 26, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8},
  allButton: {minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2},
  allText: {fontSize: 13, fontWeight: '800', color: night.lime},
  activityCard: {backgroundColor: night.surface, borderRadius: 22, borderWidth: 1, borderColor: night.line, paddingHorizontal: 13, overflow: 'hidden'},
  emptyState: {padding: 13, gap: 10},
  emptyTitle: {fontSize: 16, color: night.ink, fontWeight: '800'},
  emptyText: {fontSize: 14, color: night.subtext},
  emptyAction: {minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center'},
  emptyActionText: {fontWeight: '800', color: night.lime, fontSize: 14},
  footer: {marginTop: 18, fontSize: 12, color: night.subtext, lineHeight: 19},
  modalRoot: {flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'flex-end'},
  modalSheet: {paddingTop: 24, paddingHorizontal: 23, paddingBottom: 34, backgroundColor: night.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 14},
  modalTitle: {fontSize: 25, color: night.ink, fontWeight: '900', letterSpacing: -0.6},
  modalBody: {fontSize: 15, color: night.subtext, lineHeight: 23},
  closeButton: {minHeight: 52, borderRadius: 16, backgroundColor: night.lime, alignItems: 'center', justifyContent: 'center'},
  closeText: {fontSize: 16, color: night.canvas, fontWeight: '900'},
});
