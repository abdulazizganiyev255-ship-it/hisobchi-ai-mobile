import {useState} from 'react';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, View,
  useWindowDimensions,
} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {
  LedgerMiniBars, LedgerTransactionRow, SourceTag,
} from '../components/living/LedgerPrimitives';
import {demo, formatMoney, type Transaction} from '../data/demo';
import {filterAndSortTransactions} from '../data/transactions';
import {ledger} from '../theme/livingLedger';

type Props = {
  transactions: Transaction[];
  onAdd: () => void;
  onOpenTransactions: () => void;
};

/**
 * First Living Ledger screen: no remote money, no real Safe-to-Spend engine.
 * Sample balance, daily sample amount and monthly demo chart stay immutable.
 * Recent transaction rows are derived from the mutable session ledger only.
 */
export function LivingLedgerDashboardScreen({
  transactions, onAdd, onOpenTransactions,
}: Props) {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [period, setPeriod] = useState<'current' | 'previous'>('current');
  const {width} = useWindowDimensions();
  const compact = width < 365;
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
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brand} accessible accessibilityLabel="Hisobchi AI">
            <View style={styles.brandMark}>
              <View style={[styles.brandBar, {height: 11}]}/>
              <View style={[styles.brandBar, {height: 17}]}/>
              <View style={[styles.brandBar, {height: 24}]}/>
            </View>
            <Text style={styles.brandText}>Hisobchi AI</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demo rejimi haqida ma’lumot"
            onPress={() => setExplanationOpen(true)}
            style={({pressed}) => [styles.iconButton, pressed && styles.pressed]}
          >
            <AppIcon name="shield" color={ledger.ink} size={21}/>
          </Pressable>
        </View>

        <View style={styles.notice} testID="living-ledger-demo-notice">
          <View style={styles.noticeDot}/>
          <Text style={styles.noticeText}>DEMO MUHIT — HAQIQIY HISOB EMAS</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>BUGUN XAVFSIZ SARFLASH</Text>
          <View style={styles.figure} accessible accessibilityLabel={
            'Xavfsiz sarflash, hisoblanmagan namuna: ' +
            formatMoney(demo.safeToSpendToday)
          }>
            <Text
              style={[styles.amount, compact && styles.amountCompact]}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >{amount}</Text>
            <Text
              style={[styles.unit, compact && styles.unitCompact]}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >so‘m</Text>
          </View>
          <SourceTag label="DEMO · hisoblanmagan"/>
          <Text style={styles.heroHelp}>
            Bu ko‘rsatkich hozir hisob-kitob emas, faqat dizayn namunasi.
          </Text>
          <Pressable
            testID="living-ledger-safe-explainer"
            accessibilityRole="button"
            accessibilityLabel="Xavfsiz sarflash namunasi qanday ishlashi haqida"
            onPress={() => setExplanationOpen(true)}
            style={({pressed}) => [styles.explainButton, pressed && styles.pressed]}
          >
            <AppIcon name="shield" color={ledger.dark} size={18}/>
            <Text style={styles.explainText}>Bu raqam haqida</Text>
            <AppIcon name="chevron" color={ledger.dark} size={17}/>
          </Pressable>
        </View>

        <View style={styles.rule}/>

        <View style={styles.balanceBlock}>
          <View style={styles.balanceCopy}>
            <Text style={styles.eyebrow}>UMUMIY BALANS · NAMUNA</Text>
            <Text
              style={[styles.balanceValue, compact && styles.balanceCompact]}
              accessibilityLabel={balanceVisible ?
                'Demo balans: ' + balance :
                'Demo balans yashirilgan'
              }
            >
              {balanceVisible ? balance : '••••••'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={balanceVisible ?
              'Namuna balansni yashirish' : 'Namuna balansni ko‘rsatish'
            }
            accessibilityState={{selected: balanceVisible}}
            onPress={() => setBalanceVisible(value => !value)}
            style={({pressed}) => [styles.eyeButton, pressed && styles.pressed]}
          >
            <AppIcon name={balanceVisible ? 'eye' : 'eye-off'} size={21} color={ledger.ink}/>
          </Pressable>
        </View>

        <Pressable
          testID="living-ledger-add-expense"
          accessibilityRole="button"
          accessibilityLabel="Xarajat qo‘shish, ushbu sessiya uchun"
          onPress={onAdd}
          style={({pressed}) => [styles.addButton, pressed && styles.addPressed]}
        >
          <View style={styles.addIcon}><AppIcon name="plus" size={20} color={ledger.ink}/></View>
          <View style={styles.addCopy}>
            <Text style={styles.addTitle}>Xarajat qo‘shish</Text>
            <Text style={styles.addSubtitle}>Sessiyadagi yozuvlarga saqlanadi</Text>
          </View>
          <AppIcon name="chevron" color={ledger.ink} size={20}/>
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
        <Text
          testID="living-ledger-period-total"
          style={styles.chartAmount}
          accessibilityLabel={'Namuna xarajat: ' + formatMoney(month.total)}
        >
          {formatMoney(month.total)}
        </Text>
        <LedgerMiniBars
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
            <AppIcon name="chevron" color={ledger.dark} size={17}/>
          </Pressable>
        </View>
        {recent.length > 0 ? recent.map(item =>
          <LedgerTransactionRow key={item.id} item={item}/>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Hozircha yozuv yo‘q</Text>
            <Text style={styles.emptyText}>Birinchi sessiya xarajatingizni kiriting.</Text>
            <Pressable accessibilityRole="button" onPress={onAdd} style={styles.emptyAction}>
              <Text style={styles.emptyActionText}>Xarajat qo‘shish</Text>
            </Pressable>
          </View>
        )}
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
            <SourceTag label="DEMO · hisoblanmagan"/>
            <Text accessibilityRole="header" style={styles.modalTitle}>Bu raqam nimani bildiradi?</Text>
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
  screen: {flex: 1, backgroundColor: ledger.paper},
  container: {paddingHorizontal: 22, paddingTop: 18, paddingBottom: 40},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48},
  brand: {flexDirection: 'row', alignItems: 'center', gap: 10},
  brandMark: {width: 28, height: 28, flexDirection: 'row', alignItems: 'flex-end', gap: 3},
  brandBar: {width: 5, borderRadius: 2, backgroundColor: ledger.dark, transform: [{skewX: '-12deg'}]},
  brandText: {fontSize: 21, fontWeight: '800', letterSpacing: -0.5, color: ledger.ink},
  iconButton: {width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: ledger.rule},
  pressed: {opacity: 0.65},
  notice: {marginTop: 20, backgroundColor: ledger.paleSage, paddingVertical: 12, paddingHorizontal: 13, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 9},
  noticeDot: {height: 8, width: 8, borderRadius: 4, backgroundColor: ledger.dark},
  noticeText: {fontSize: 12, fontWeight: '800', color: ledger.dark, letterSpacing: 0.2, flexShrink: 1},
  hero: {paddingTop: 30},
  eyebrow: {fontSize: 12, fontWeight: '800', letterSpacing: 1.4, color: ledger.subtext},
  figure: {flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 7, marginTop: 8, marginBottom: 10},
  amount: {fontSize: 54, fontWeight: '800', color: ledger.ink, letterSpacing: -2.2, includeFontPadding: false},
  amountCompact: {fontSize: 47},
  unit: {fontSize: 23, fontWeight: '700', color: ledger.ink},
  unitCompact: {fontSize: 20},
  heroHelp: {fontSize: 14, lineHeight: 21, color: ledger.subtext, marginTop: 12},
  explainButton: {alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 48, marginTop: 10, paddingRight: 7},
  explainText: {fontSize: 15, fontWeight: '800', color: ledger.dark},
  rule: {height: 1, backgroundColor: ledger.rule, marginTop: 22, marginBottom: 20},
  balanceBlock: {flexDirection: 'row', alignItems: 'center', gap: 8},
  balanceCopy: {flex: 1, minWidth: 0},
  balanceValue: {fontSize: 30, fontWeight: '800', letterSpacing: -0.9, color: ledger.ink, marginTop: 7},
  balanceCompact: {fontSize: 26},
  eyeButton: {width: 44, height: 44, alignItems: 'center', justifyContent: 'center'},
  addButton: {marginTop: 20, backgroundColor: ledger.coral, borderRadius: 16, minHeight: 66, paddingHorizontal: 16, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 12},
  addPressed: {opacity: 0.78},
  addIcon: {height: 38, width: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center'},
  addCopy: {flex: 1, gap: 3},
  addTitle: {fontSize: 16, fontWeight: '800', color: ledger.ink},
  addSubtitle: {fontSize: 12, fontWeight: '600', color: ledger.ink},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginTop: 32},
  sectionHeadCopy: {flex: 1, minWidth: 0, gap: 6},
  sectionOverline: {fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: ledger.subtext},
  sectionTitle: {fontSize: 20, fontWeight: '800', color: ledger.ink, letterSpacing: -0.4},
  periodSelector: {flexDirection: 'row', padding: 3, backgroundColor: ledger.paleSage, borderRadius: 15, gap: 3},
  periodItem: {minHeight: 44, paddingHorizontal: 9, justifyContent: 'center', alignItems: 'center', borderRadius: 12},
  periodActive: {backgroundColor: ledger.dark},
  periodLabel: {fontSize: 12, fontWeight: '800', color: ledger.ink},
  periodLabelActive: {color: '#FFFFFF'},
  chartAmount: {fontSize: 27, fontWeight: '800', color: ledger.ink, letterSpacing: -0.5, marginTop: 16},
  chartNote: {fontSize: 10, fontWeight: '700', letterSpacing: 0.35, lineHeight: 15, color: ledger.subtext, marginTop: 10},
  activityHeading: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, gap: 10, marginBottom: 5},
  allButton: {minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2},
  allText: {fontSize: 13, fontWeight: '800', color: ledger.dark},
  emptyState: {padding: 20, gap: 10, backgroundColor: ledger.paleSage, borderRadius: 16, marginTop: 12},
  emptyTitle: {fontSize: 16, fontWeight: '800', color: ledger.ink},
  emptyText: {fontSize: 14, color: ledger.subtext},
  emptyAction: {minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center'},
  emptyActionText: {fontWeight: '800', color: ledger.dark, fontSize: 14},
  footer: {fontSize: 12, lineHeight: 19, color: ledger.subtext, marginTop: 20},
  modalRoot: {flex: 1, backgroundColor: 'rgba(8,20,15,0.56)', justifyContent: 'flex-end'},
  modalSheet: {paddingTop: 24, paddingHorizontal: 24, paddingBottom: 34, backgroundColor: ledger.paper, borderTopLeftRadius: 26, borderTopRightRadius: 26, gap: 16},
  modalTitle: {fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: ledger.ink},
  modalBody: {fontSize: 15, lineHeight: 23, color: ledger.subtext},
  closeButton: {minHeight: 52, backgroundColor: ledger.dark, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 4},
  closeText: {color: '#FFFFFF', fontSize: 16, fontWeight: '800'},
});
