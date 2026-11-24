import {useState} from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, View,
  useWindowDimensions,
} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {PremiumCashFlowChart} from '../components/finance/PremiumCashFlowChart';
import {SculpturalRibbon} from '../components/finance/SculpturalRibbon';
import {LedgerTransactionRow, SourceTag} from '../components/living/LedgerPrimitives';
import {demo, formatMoney, type Transaction} from '../data/demo';
import {filterAndSortTransactions} from '../data/transactions';
import {semanticV1} from '../theme/semantic';

type Props = {
  transactions: Transaction[];
  onAdd: () => void;
  onOpenTransactions: () => void;
};

const C = semanticV1;
const plum = C.brand.primary;
const ink = C.text.primary;

/**
 * Quiet Finance D02: distinct re-composition, not a palette swap.
 * Demo Home values are fixed reference examples; only recent records reflect
 * mutable session transactions. No live balance, AI conclusions or forecast.
 */
export function LivingLedgerDashboardScreen({
  transactions, onAdd, onOpenTransactions,
}: Props) {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [period, setPeriod] = useState<'current' | 'previous'>('current');
  const {width, height} = useWindowDimensions();
  const compact = width < 355;
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
            <View style={styles.brandSymbol}><Text style={styles.brandSymbolText}>h</Text></View>
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>Hisobchi<Text style={styles.brandAI}> AI</Text></Text>
              <Text style={styles.brandKicker}>PULINGIZNI TUSHUNING</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demo rejimi haqida ma’lumot"
            onPress={() => setExplanationOpen(true)}
            style={({pressed}) => [styles.helpButton, pressed && styles.pressed]}
          >
            <AppIcon name="shield" color={plum} size={19}/>
          </Pressable>
        </View>

        <View testID="living-ledger-demo-notice" style={styles.demoNotice}>
          <View style={styles.demoDot}/>
          <Text style={styles.demoNoticeText}>DEMO MUHIT — HAQIQIY HISOB EMAS</Text>
        </View>

        <LinearGradient
          colors={['#FFFCF8', '#F5EDE9', '#EEDFE4']}
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          testID="plum-home-balance-card"
          style={[styles.hero, shortScreen && styles.heroShort]}
        >
          <View
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.ribbonLayer}
          >
            <SculpturalRibbon/>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.balanceEyebrow}>UMUMIY BALANS</Text>
            <View accessible accessibilityLabel={'Demo balans: ' + formatMoney(demo.balance)}>
              <Text
                style={[styles.balanceValue, compact && styles.balanceValueCompact]}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >{balance}</Text>
              <Text
                style={styles.currencyLabel}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >so‘m</Text>
            </View>
            <View style={styles.heroDivider}/>
            <View style={styles.heroFoot}>
              <View style={styles.heroFootMark}/>
              <Text style={styles.heroFootText}>Namuna balans · bank ulanmagan</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.safetyCard, shortScreen && styles.safetyCardShort]}>
          <View style={styles.safetyCopy}>
            <Text testID="plum-home-safety-title" style={styles.safetyLabel}>
              Bugun xavfsiz sarflash
            </Text>
            <View style={styles.safetyFigure} accessible accessibilityLabel={
              'Xavfsiz sarflash, hisoblanmagan namuna: ' +
              formatMoney(demo.safeToSpendToday)
            }>
              <Text style={styles.safetyValue}
                accessibilityElementsHidden importantForAccessibility="no">{amount}</Text>
              <Text style={styles.safetyUnit}
                accessibilityElementsHidden importantForAccessibility="no">so‘m</Text>
            </View>
            <SourceTag label="DEMO · hisoblanmagan" tone="plum"/>
          </View>
          <Pressable
            testID="living-ledger-safe-explainer"
            accessibilityRole="button"
            accessibilityLabel="Xavfsiz sarflash namunasi qanday ishlashi haqida"
            onPress={() => setExplanationOpen(true)}
            style={({pressed}) => [styles.safetyInfoButton, pressed && styles.pressed]}
          >
            <AppIcon name="chevron" color={plum} size={22}/>
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
            <AppIcon name="plus" size={22} color={plum}/>
          </View>
          <View style={styles.addCopy}>
            <Text style={styles.addTitle}>Xarajat qo‘shish</Text>
            <Text style={styles.addDetail}>Tez va oddiy qayd etish</Text>
          </View>
          <AppIcon name="chevron" color="#FFFFFF" size={19}/>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionKicker}>SARF-XARAJATLAR</Text>
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
              <Text style={styles.chartEyebrow}>DAVR BO‘YICHA · NAMUNA</Text>
              <Text
                testID="living-ledger-period-total"
                style={[styles.chartAmount, compact && styles.chartAmountCompact]}
                accessibilityLabel={'Namuna xarajat: ' + formatMoney(month.total)}
              >
                {formatMoney(month.total)}
              </Text>
            </View>
            <View style={styles.chartAccent}>
              <AppIcon name="chart" color={plum} size={19}/>
            </View>
          </View>
          <PremiumCashFlowChart
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
            <Text style={styles.sectionKicker}>SESSIYADAGI YOZUVLAR</Text>
            <Text style={styles.sectionTitle}>So‘nggi operatsiyalar</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Barcha sessiya operatsiyalarini ochish"
            onPress={onOpenTransactions}
            style={({pressed}) => [styles.allButton, pressed && styles.pressed]}
          >
            <Text style={styles.allText}>Barchasi</Text>
            <AppIcon name="chevron" color={plum} size={16}/>
          </Pressable>
        </View>
        <View style={styles.activityCard}>
          {recent.length > 0 ? recent.map(item =>
            <LedgerTransactionRow key={item.id} item={item} tone="plum"/>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Hozircha yozuv yo‘q</Text>
              <Text style={styles.emptyText}>Birinchi sessiya xarajatingizni kiriting.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={onAdd}
                style={styles.emptyAction}
              >
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
  screen: {flex: 1, backgroundColor: C.bg.canvas},
  container: {paddingHorizontal: 20, paddingTop: 13, paddingBottom: 42},
  containerShort: {paddingTop: 7},
  header: {minHeight: 49, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  brand: {flexDirection: 'row', alignItems: 'center', gap: 10},
  brandSymbol: {
    width: 41, height: 41, borderRadius: 15, backgroundColor: plum,
    alignItems: 'center', justifyContent: 'center',
  },
  brandSymbolText: {
    fontSize: 29, fontWeight: '800', letterSpacing: -2.5,
    color: '#FFFFFF', marginTop: -5,
  },
  brandCopy: {gap: 2},
  brandName: {fontSize: 21, fontWeight: '800', letterSpacing: -0.8, color: ink},
  brandAI: {color: plum},
  brandKicker: {fontSize: 9, fontWeight: '800', letterSpacing: 1.4, color: C.text.secondary},
  helpButton: {
    height: 44, width: 44, borderRadius: 15, borderWidth: 1,
    borderColor: '#E4D8D7', backgroundColor: '#FFFCF8',
    justifyContent: 'center', alignItems: 'center',
  },
  pressed: {opacity: 0.7},
  demoNotice: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center',
    gap: 7, marginTop: 9, paddingVertical: 6, paddingHorizontal: 10,
    backgroundColor: C.brand.tint, borderRadius: 99,
  },
  demoDot: {height: 6, width: 6, borderRadius: 3, backgroundColor: plum},
  demoNoticeText: {fontSize: 10, fontWeight: '800', letterSpacing: 0.25, color: plum},
  hero: {
    marginTop: 12, minHeight: 190, padding: 20, borderRadius: 28,
    overflow: 'hidden', justifyContent: 'center', borderWidth: 1,
    borderColor: '#E8D9DD',
  },
  heroShort: {minHeight: 174, paddingVertical: 15},
  ribbonLayer: {position: 'absolute', right: -41, top: -28, opacity: 0.79},
  heroCopy: {zIndex: 1, width: '90%'},
  balanceEyebrow: {
    color: plum, fontSize: 10, fontWeight: '800',
    letterSpacing: 1.4, marginBottom: 13,
  },
  balanceValue: {
    fontSize: 37, fontWeight: '800', letterSpacing: -1.9, color: ink,
    includeFontPadding: false,
  },
  balanceValueCompact: {fontSize: 31},
  currencyLabel: {fontSize: 15, fontWeight: '700', color: C.text.secondary, marginTop: 2},
  heroDivider: {height: 1, backgroundColor: '#D8C7CD', marginTop: 15, width: '75%'},
  heroFoot: {flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10},
  heroFootMark: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#98677D'},
  heroFootText: {fontSize: 11, fontWeight: '600', color: C.text.secondary},
  safetyCard: {
    marginTop: 12, minHeight: 111, paddingVertical: 13, paddingHorizontal: 16,
    backgroundColor: C.bg.surface, borderRadius: 23, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#E6DADD',
  },
  safetyCardShort: {minHeight: 104, paddingVertical: 10},
  safetyCopy: {gap: 5},
  safetyLabel: {color: C.text.secondary, fontSize: 12, fontWeight: '700'},
  safetyFigure: {flexDirection: 'row', alignItems: 'baseline', gap: 6},
  safetyValue: {
    color: ink, fontSize: 29, fontWeight: '800',
    letterSpacing: -1.1, includeFontPadding: false,
  },
  safetyUnit: {color: C.text.secondary, fontSize: 13, fontWeight: '700'},
  safetyInfoButton: {
    width: 48, height: 48, borderRadius: 18,
    backgroundColor: C.brand.tint, alignItems: 'center', justifyContent: 'center',
  },
  addButton: {
    minHeight: 59, marginTop: 12, paddingVertical: 7, paddingHorizontal: 13,
    flexDirection: 'row', alignItems: 'center', gap: 11,
    borderRadius: 19, backgroundColor: plum,
  },
  addButtonShort: {marginTop: 10},
  addPressed: {opacity: 0.78},
  addCircle: {
    width: 39, height: 39, borderRadius: 14,
    backgroundColor: '#F6E9EB', justifyContent: 'center', alignItems: 'center',
  },
  addCopy: {flex: 1, minWidth: 0, gap: 3},
  addTitle: {fontSize: 15, fontWeight: '800', color: '#FFFFFF'},
  addDetail: {fontSize: 11, fontWeight: '600', color: '#F1DBE4'},
  sectionHeader: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    marginTop: 27, gap: 8,
  },
  sectionCopy: {flex: 1, minWidth: 0, gap: 5},
  sectionKicker: {
    fontSize: 10, color: C.text.secondary,
    fontWeight: '800', letterSpacing: 1.1,
  },
  sectionTitle: {fontSize: 20, color: ink, fontWeight: '800', letterSpacing: -0.55},
  periodSelector: {
    flexDirection: 'row', backgroundColor: C.brand.tint,
    padding: 3, gap: 2, borderRadius: 15,
  },
  periodItem: {
    minHeight: 44, justifyContent: 'center',
    paddingHorizontal: 8, borderRadius: 12,
  },
  periodActive: {backgroundColor: plum},
  periodLabel: {fontSize: 11, fontWeight: '800', color: plum},
  periodLabelActive: {color: '#FFFFFF'},
  chartCard: {
    marginTop: 13, borderRadius: 25, backgroundColor: C.bg.surface,
    paddingHorizontal: 16, paddingTop: 17, paddingBottom: 14,
    borderWidth: 1, borderColor: '#E7DCDC',
  },
  chartTopRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  chartEyebrow: {fontSize: 10, color: C.text.secondary, fontWeight: '800', letterSpacing: 0.6},
  chartAmount: {
    fontSize: 28, fontWeight: '800', letterSpacing: -1.0,
    color: ink, marginTop: 4,
  },
  chartAmountCompact: {fontSize: 25},
  chartAccent: {
    width: 38, height: 38, borderRadius: 14,
    backgroundColor: C.brand.tint, alignItems: 'center', justifyContent: 'center',
  },
  legendRow: {flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 2},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 6},
  legendLine: {backgroundColor: plum, width: 19, height: 3, borderRadius: 3},
  legendDot: {backgroundColor: '#C7B0BA', height: 6, width: 6, borderRadius: 3},
  legendText: {fontSize: 11, color: C.text.secondary, fontWeight: '600'},
  chartNote: {
    marginTop: 12, fontSize: 10, fontWeight: '600', letterSpacing: 0.1,
    color: C.text.secondary, lineHeight: 15,
  },
  activityHeading: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: 8, marginTop: 27, marginBottom: 11,
  },
  allButton: {minHeight: 44, alignItems: 'center', flexDirection: 'row', gap: 3},
  allText: {color: plum, fontSize: 13, fontWeight: '800'},
  activityCard: {
    backgroundColor: C.bg.surface, borderRadius: 23,
    paddingHorizontal: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: '#E7DCDC',
  },
  emptyState: {padding: 13, gap: 10},
  emptyTitle: {fontWeight: '800', fontSize: 16, color: ink},
  emptyText: {fontSize: 14, color: C.text.secondary},
  emptyAction: {minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start'},
  emptyActionText: {fontWeight: '800', fontSize: 14, color: plum},
  footer: {color: C.text.secondary, fontSize: 12, lineHeight: 19, marginTop: 18},
  modalRoot: {
    flex: 1, backgroundColor: 'rgba(33,21,30,0.55)', justifyContent: 'flex-end',
  },
  modalSheet: {
    paddingTop: 23, paddingHorizontal: 23, paddingBottom: 34,
    backgroundColor: C.bg.canvas, borderTopLeftRadius: 28,
    borderTopRightRadius: 28, gap: 14,
  },
  modalTitle: {fontSize: 25, fontWeight: '800', letterSpacing: -0.7, color: ink},
  modalBody: {fontSize: 15, lineHeight: 23, color: C.text.secondary},
  closeButton: {
    minHeight: 52, marginTop: 3, backgroundColor: plum, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  closeText: {color: '#FFFFFF', fontSize: 16, fontWeight: '800'},
});
