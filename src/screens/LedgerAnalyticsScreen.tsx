import {useState} from 'react';
import {
  Pressable, ScrollView, StyleSheet, Text, View,
  type DimensionValue, useWindowDimensions,
} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {LedgerDateCalendar} from '../components/living/LedgerDateCalendar';
import {type Transaction, formatMoney} from '../data/demo';
import {
  ANALYTICS_PERIODS, calculateAnalytics, analyticsRangeLabel,
  formatDayCompact, type AnalyticsPeriod,
} from '../data/analytics';
import {todayLocal} from '../data/transactions';
import {shiftCalendarDate, validateCustomRange, type DateRange} from '../data/periods';
import {ledger} from '../theme/livingLedger';

type Props = {transactions: Transaction[]; onOpenTransactions: () => void};
type Metric = 'expense' | 'income' | 'turnover';

const METRICS: ReadonlyArray<{key: Metric; label: string}> = [
  {key: 'expense', label: 'Chiqim'},
  {key: 'income', label: 'Kirim'},
  {key: 'turnover', label: 'Aylanma'},
];
const percentWidth = (value: number): DimensionValue =>
  (Math.max(0, Math.min(100, value)).toFixed(2) + '%') as DimensionValue;

/**
 * Living Ledger Analytics: deterministic local session report only.
 * No bank balance, no live Safe-to-Spend or externally sourced forecasts.
 */
export function LedgerAnalyticsScreen({transactions, onOpenTransactions}: Props) {
  const [period, setPeriod] = useState<AnalyticsPeriod>('all');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(() => shiftCalendarDate(todayLocal(), -6));
  const [customEnd, setCustomEnd] = useState(() => todayLocal());
  const [appliedRange, setAppliedRange] = useState<DateRange | null>(null);
  const [calendarTarget, setCalendarTarget] = useState<'start' | 'end' | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [chartMetric, setChartMetric] = useState<Metric>('expense');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const {width} = useWindowDimensions();
  const compact = width < 360;

  const report = calculateAnalytics(transactions, period, todayLocal(), appliedRange);
  const periodLabel = ANALYTICS_PERIODS.find(x => x.key === period)?.label ?? 'Barchasi';
  const days = report.days;
  const getDayValue = (day: {expense: number; income: number; turnover: number}) =>
    chartMetric === 'expense' ? day.expense : chartMetric === 'income' ? day.income : day.turnover;
  const maxValue = Math.max(1, ...days.map(getDayValue));
  const selected = days.find(x => x.date === selectedDay) ?? days[days.length - 1];
  const hasValues = days.some(day => getDayValue(day) > 0);
  const metricLabel = METRICS.find(x => x.key === chartMetric)?.label ?? 'Chiqim';

  const selectPeriod = (next: AnalyticsPeriod) => {
    if (next === 'custom') {
      setCustomStart(appliedRange?.start ?? shiftCalendarDate(todayLocal(), -6));
      setCustomEnd(appliedRange?.end ?? todayLocal());
      setCustomOpen(true);
      setPeriodOpen(false);
      setDateError(null);
      return;
    }
    setPeriod(next);
    setSelectedDay(null);
    setCustomOpen(false);
    setPeriodOpen(false);
    setDateError(null);
  };
  const applyRange = () => {
    const issue = validateCustomRange(customStart, customEnd, todayLocal());
    setDateError(issue);
    if (issue) return;
    setAppliedRange({start: customStart, end: customEnd});
    setPeriod('custom');
    setSelectedDay(null);
    setCustomOpen(false);
    setPeriodOpen(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        testID="ledger-analytics-scroll"
        style={styles.scroll}
        contentContainerStyle={[styles.content, compact && styles.contentCompact]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>HISOBCHI · SESSIYA TAHLILI</Text>
            <Text accessibilityRole="header" style={styles.title}>Tahlil</Text>
            <Text style={styles.subtitle}>Qayd etilgan kirim va chiqimlar</Text>
          </View>
          <View style={styles.demoPill}><Text style={styles.demoText}>DEMO</Text></View>
        </View>

        <View style={styles.periodRow}>
          <View style={styles.periodDescription}>
            <Text style={styles.periodEyebrow}>HISOBOT DAVRI</Text>
            <Text style={styles.periodDate}>{analyticsRangeLabel(report)}</Text>
          </View>
          <Pressable
            testID="ledger-analytics-period-trigger"
            accessibilityRole="button"
            accessibilityLabel={'Muddatni tanlash. Hozir: ' + periodLabel}
            accessibilityState={{expanded: periodOpen}}
            onPress={() => {setPeriodOpen(value => !value); setCustomOpen(false); setDateError(null);}}
            style={[styles.periodButton, periodOpen && styles.periodButtonOpen]}
          >
            <Text style={styles.periodButtonText}>{periodLabel === 'Barchasi' ? 'Muddat' : periodLabel}</Text>
            <AppIcon name="chevron-down" color={ledger.dark} size={15}/>
          </Pressable>
        </View>
        {periodOpen && (
          <View style={styles.periodOptions}>
            {ANALYTICS_PERIODS.map(option => (
              <Pressable
                key={option.key}
                accessibilityRole="button"
                accessibilityLabel={'Tahlil davri: ' + option.label}
                accessibilityState={{selected: period === option.key}}
                onPress={() => selectPeriod(option.key)}
                style={[styles.periodOption, period === option.key && styles.periodOptionActive]}
              >
                <Text style={[
                  styles.periodOptionText, period === option.key && styles.periodOptionTextActive,
                ]}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {customOpen && (
          <View style={styles.customPanel}>
            <View style={styles.customHeading}>
              <Text accessibilityRole="header" style={styles.customTitle}>Ixtiyoriy muddat</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sana oralig‘ini tanlashni bekor qilish"
                onPress={() => {setCustomOpen(false); setDateError(null);}}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelLabel}>Bekor qilish</Text>
              </Pressable>
            </View>
            <View style={styles.dateRow}>
              {([
                {key: 'start' as const, label: 'Boshlanish', value: customStart},
                {key: 'end' as const, label: 'Tugash', value: customEnd},
              ]).map(field => (
                <View key={field.key} style={styles.dateColumn}>
                  <Text style={styles.dateLabel}>{field.label}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={field.label + ' sanasi: ' + field.value + '. Kalendarni ochish'}
                    onPress={() => setCalendarTarget(field.key)}
                    style={styles.dateButton}
                  >
                    <AppIcon name="calendar" color={ledger.dark} size={16}/>
                    <Text style={styles.dateButtonText}>
                      {field.value.slice(8, 10)}.{field.value.slice(5, 7)}.{field.value.slice(0, 4)}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
            {dateError && <Text accessibilityLiveRegion="polite" style={styles.error}>{dateError}</Text>}
            <Pressable
              testID="ledger-analytics-apply-period"
              accessibilityRole="button"
              accessibilityLabel="Tanlangan sana oralig‘ini tahlilga qo‘llash"
              onPress={applyRange}
              style={styles.applyButton}
            >
              <Text style={styles.applyText}>Oraliqni qo‘llash</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.hero}>
          <View style={styles.heroHeading}>
            <Text style={styles.heroEyebrow}>SOF FARQ · SESSIYADAN HISOBLANGAN</Text>
            <Text style={styles.counter}>{report.transactionsCount} yozuv</Text>
          </View>
          <Text testID="ledger-analytics-net" style={[
            styles.net, compact && styles.netCompact,
            report.net < 0 && styles.netNegative,
          ]} accessibilityLabel={'Sof farq: ' + formatMoney(report.net)}>
            {formatMoney(report.net)}
          </Text>
          <Text style={styles.heroNote}>Kirim − chiqim · hisobdagi mavjud mablag‘ emas</Text>
          <View style={styles.divider}/>
          <View style={styles.metricRow}>
            <View style={styles.metric}>
              <Text style={styles.metricName}>Kirim</Text>
              <Text style={styles.metricMoney} accessibilityLabel={'Kirim: ' + formatMoney(report.income)}>
                {formatMoney(report.income)}
              </Text>
            </View>
            <View style={styles.metricSeparator}/>
            <View style={styles.metric}>
              <Text style={styles.metricName}>Chiqim</Text>
              <Text style={styles.metricMoney} accessibilityLabel={'Chiqim: ' + formatMoney(report.expense)}>
                {formatMoney(report.expense)}
              </Text>
            </View>
          </View>
          <View style={styles.turnoverRow}>
            <Text style={styles.turnoverLabel}>Umumiy aylanma</Text>
            <Text style={styles.turnoverValue}>{formatMoney(report.turnover)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionOverline}>FAOLLIK VA KUNLAR</Text>
              <Text accessibilityRole="header" style={styles.sectionTitle}>Kunlik dinamika</Text>
            </View>
            <Text style={styles.sectionCount}>{days.length} kun</Text>
          </View>
          <View style={styles.metricPicker} accessibilityRole="radiogroup">
            {METRICS.map(option => {
              const active = chartMetric === option.key;
              return (
                <Pressable
                  key={option.key}
                  testID={'ledger-metric-' + option.key}
                  accessibilityRole="radio"
                  accessibilityState={{selected: active, checked: active}}
                  accessibilityLabel={'Grafik: ' + option.label}
                  onPress={() => {setChartMetric(option.key); setSelectedDay(null);}}
                  style={[styles.metricChoice, active && styles.metricChoiceActive]}
                >
                  <Text style={[styles.metricChoiceText, active && styles.metricChoiceTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {days.length > 0 && hasValues ? (
            <>
              <View style={styles.chart}>
                {days.map(day => {
                  const value = getDayValue(day);
                  const active = selected?.date === day.date;
                  return (
                    <Pressable
                      key={day.date}
                      testID={'ledger-chart-day-' + day.date}
                      accessibilityRole="button"
                      accessibilityState={{selected: active}}
                      accessibilityLabel={
                        formatDayCompact(day.date) + ', ' + metricLabel + ': ' +
                        formatMoney(value) + ', aylanma: ' + formatMoney(day.turnover)
                      }
                      onPress={() => setSelectedDay(day.date)}
                      style={[styles.chartColumn, active && styles.chartColumnActive]}
                    >
                      <View style={styles.barArea}>
                        {value > 0 ? (
                          <View style={[
                            styles.bar,
                            active && styles.barSelected,
                            {height: Math.max(5, Math.round(value / maxValue * 104))},
                          ]}/>
                        ) : <View style={styles.zeroBar}/>}
                      </View>
                      <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>
                        {formatDayCompact(day.date)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.chartDetail}>
                <View style={styles.chartDetailCopy}>
                  <Text style={styles.detailDay}>{selected ? formatDayCompact(selected.date) : ''} · {metricLabel}</Text>
                  <Text style={styles.detailTurnover}>
                    Kunlik aylanma: {selected ? formatMoney(selected.turnover) : ''}
                  </Text>
                </View>
                <Text style={styles.detailValue}>{selected ? formatMoney(getDayValue(selected)) : ''}</Text>
              </View>
              <Text style={styles.graphNote}>
                {report.chartTruncated ? 'Faqat oxirgi 7 qayd etilgan kun. ' : ''}
                Barcha rejimlar bir xil sanalarni ko‘rsatadi, lekin har birining vertikal shkalasi alohida.
              </Text>
            </>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {chartMetric === 'expense'
                  ? 'Bu davrda chiqim yo‘q'
                  : chartMetric === 'income'
                    ? 'Bu davrda kirim yo‘q'
                    : 'Bu davrda aylanma yo‘q'}
              </Text>
              <Text style={styles.emptyCopy}>Boshqa muddat tanlang yoki yangi operatsiya kiriting.</Text>
              <Pressable accessibilityRole="button" onPress={onOpenTransactions} style={styles.emptyAction}>
                <Text style={styles.emptyActionText}>Operatsiyalarga o‘tish</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionOverline}>XARAJATLAR TAQSIMOTI</Text>
              <Text accessibilityRole="header" style={styles.sectionTitle}>Kategoriyalar</Text>
            </View>
            <Text style={styles.sectionCount}>{report.expensesCount} ta chiqim</Text>
          </View>
          {report.expense > 0 ? (
            <>
              <Text style={styles.categoryTotal}>{formatMoney(report.expense)}</Text>
              {report.categories.map(row => (
                <View
                  key={row.name}
                  style={styles.categoryRow}
                  accessible
                  accessibilityLabel={
                    row.name + ', ' + formatMoney(row.amount) + ', ' +
                    row.percent + ' foiz'
                  }
                >
                  <View style={styles.categoryIcon}>
                    <AppIcon name={row.icon} color={ledger.dark} size={19}/>
                  </View>
                  <View style={styles.categoryCopy}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{row.name}</Text>
                      <Text style={styles.categoryPercent}>{row.percent}%</Text>
                    </View>
                    <Text style={styles.categoryAmount}>{formatMoney(row.amount)}</Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressValue, {width: percentWidth(row.amount / report.expense * 100)}]}/>
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Xarajat qayd etilmagan</Text>
              <Text style={styles.emptyCopy}>Tanlangan davrda xarajat kategoriyalari mavjud emas.</Text>
            </View>
          )}
        </View>

        <View style={styles.disclosure}>
          <AppIcon name="shield" color={ledger.dark} size={20}/>
          <View style={styles.disclosureCopy}>
            <Text style={styles.disclosureTitle}>Oldingi davr bilan taqqoslash</Text>
            <Text style={styles.disclosureText}>
              Taqqoslash uchun yetarli va tasdiqlangan tarix mavjud emas.
              Shu sabab o‘zgarish foizini taxminan ko‘rsatmaymiz.
            </Text>
          </View>
        </View>
        <Text style={styles.footer}>
          Hisobchi AI · demo sessiya. Tahlil operatsiyalardan hisoblanadi,
          serverga saqlanmaydi. Bosh sahifadagi balans va Safe-to-Spend mustaqil namuna.
        </Text>
      </ScrollView>
      {calendarTarget !== null && (
        <LedgerDateCalendar
          selectedDate={calendarTarget === 'start' ? customStart : customEnd}
          onSelect={value => {
            if (calendarTarget === 'start') setCustomStart(value);
            else setCustomEnd(value);
            setCalendarTarget(null);
            setDateError(null);
          }}
          onCancel={() => setCalendarTarget(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: ledger.paper},
  scroll: {flex: 1},
  content: {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 18},
  contentCompact: {paddingTop: 11, gap: 14},
  header: {flexDirection: 'row', alignItems: 'center', gap: 10},
  headerCopy: {flex: 1, gap: 4},
  eyebrow: {color: ledger.dark, letterSpacing: 1.1, fontSize: 11, fontWeight: '800'},
  title: {fontSize: 31, fontWeight: '800', color: ledger.ink, letterSpacing: -0.8},
  subtitle: {color: ledger.subtext, fontSize: 13},
  demoPill: {backgroundColor: ledger.paleSage, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9},
  demoText: {color: ledger.dark, fontSize: 12, fontWeight: '800'},
  periodRow: {flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between'},
  periodDescription: {flex: 1, gap: 4},
  periodEyebrow: {fontSize: 10, fontWeight: '800', color: ledger.subtext, letterSpacing: 1},
  periodDate: {fontSize: 13, fontWeight: '700', color: ledger.ink},
  periodButton: {minHeight: 47, paddingHorizontal: 11, backgroundColor: ledger.paleSage, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 7},
  periodButtonOpen: {borderWidth: 1, borderColor: ledger.dark},
  periodButtonText: {fontSize: 14, fontWeight: '800', color: ledger.dark},
  periodOptions: {backgroundColor: ledger.surface, padding: 12, borderRadius: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8, borderWidth: 1, borderColor: ledger.rule},
  periodOption: {minHeight: 44, justifyContent: 'center', paddingHorizontal: 13, borderRadius: 12, backgroundColor: ledger.paleSage},
  periodOptionActive: {backgroundColor: ledger.dark},
  periodOptionText: {fontSize: 13, fontWeight: '700', color: ledger.ink},
  periodOptionTextActive: {color: '#FFFFFF'},
  customPanel: {backgroundColor: ledger.surface, borderRadius: 15, borderWidth: 1, borderColor: ledger.rule, padding: 13, gap: 11},
  customHeading: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  customTitle: {fontSize: 17, color: ledger.ink, fontWeight: '800'},
  cancelButton: {minHeight: 44, justifyContent: 'center', paddingHorizontal: 8},
  cancelLabel: {fontSize: 13, fontWeight: '800', color: ledger.dark},
  dateRow: {flexDirection: 'row', gap: 8},
  dateColumn: {flex: 1, minWidth: 0, gap: 6},
  dateLabel: {fontSize: 12, color: ledger.subtext, fontWeight: '600'},
  dateButton: {minHeight: 48, backgroundColor: ledger.paper, borderRadius: 11, borderWidth: 1, borderColor: ledger.rule, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 5},
  dateButtonText: {fontSize: 12, flexShrink: 1, color: ledger.ink, fontWeight: '700'},
  error: {color: '#9C2738', fontSize: 13, fontWeight: '700'},
  applyButton: {minHeight: 49, backgroundColor: ledger.dark, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  applyText: {color: '#FFFFFF', fontSize: 14, fontWeight: '800'},
  hero: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: ledger.rule, paddingTop: 17, paddingBottom: 18, gap: 9},
  heroHeading: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8},
  heroEyebrow: {fontSize: 11, fontWeight: '800', letterSpacing: 0.8, color: ledger.subtext, flexShrink: 1},
  counter: {fontSize: 12, fontWeight: '700', color: ledger.dark},
  net: {fontSize: 34, fontWeight: '800', letterSpacing: -1.2, color: ledger.ink},
  netCompact: {fontSize: 31},
  netNegative: {color: '#9C2738'},
  heroNote: {fontSize: 13, lineHeight: 19, color: ledger.subtext},
  divider: {height: 1, backgroundColor: ledger.rule, marginVertical: 5},
  metricRow: {flexDirection: 'row', gap: 12},
  metric: {flex: 1, minWidth: 0, gap: 7},
  metricSeparator: {width: 1, backgroundColor: ledger.rule},
  metricName: {fontSize: 13, fontWeight: '700', color: ledger.subtext},
  metricMoney: {fontSize: 16, lineHeight: 23, fontWeight: '800', color: ledger.ink},
  turnoverRow: {flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between'},
  turnoverLabel: {fontSize: 13, fontWeight: '600', color: ledger.subtext},
  turnoverValue: {fontSize: 15, fontWeight: '800', color: ledger.ink, flexShrink: 1},
  section: {paddingTop: 4, gap: 13},
  sectionTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8},
  sectionHeading: {flex: 1, minWidth: 0, gap: 5},
  sectionOverline: {fontSize: 11, fontWeight: '800', letterSpacing: 0.8, color: ledger.subtext},
  sectionTitle: {fontSize: 23, fontWeight: '800', letterSpacing: -0.5, color: ledger.ink},
  sectionCount: {color: ledger.dark, fontSize: 12, fontWeight: '700'},
  metricPicker: {flexDirection: 'row', gap: 5, padding: 4, backgroundColor: ledger.paleSage, borderRadius: 14},
  metricChoice: {flex: 1, minHeight: 44, borderRadius: 11, justifyContent: 'center', alignItems: 'center'},
  metricChoiceActive: {backgroundColor: ledger.dark},
  metricChoiceText: {fontSize: 14, color: ledger.ink, fontWeight: '700'},
  metricChoiceTextActive: {color: '#FFFFFF'},
  chart: {flexDirection: 'row', alignItems: 'flex-end', gap: 4, borderBottomWidth: 1, borderBottomColor: ledger.rule, marginTop: 5},
  chartColumn: {flex: 1, minWidth: 0, minHeight: 149, alignItems: 'center', justifyContent: 'flex-end', gap: 9},
  chartColumnActive: {backgroundColor: ledger.paleSage, borderTopLeftRadius: 9, borderTopRightRadius: 9},
  barArea: {height: 108, width: '100%', justifyContent: 'flex-end', alignItems: 'center'},
  bar: {width: '62%', maxWidth: 27, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: ledger.sage},
  barSelected: {backgroundColor: ledger.dark},
  zeroBar: {height: 2, width: 15, backgroundColor: ledger.rule},
  dayLabel: {fontSize: 11, color: ledger.subtext, paddingBottom: 9, textAlign: 'center'},
  dayLabelActive: {fontWeight: '800', color: ledger.dark},
  chartDetail: {backgroundColor: ledger.paleSage, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 12, flexDirection: 'row', gap: 8, alignItems: 'center'},
  chartDetailCopy: {flex: 1, gap: 5},
  detailDay: {fontSize: 13, color: ledger.ink, fontWeight: '800'},
  detailTurnover: {fontSize: 12, color: ledger.subtext},
  detailValue: {fontSize: 15, fontWeight: '800', color: ledger.ink, flexShrink: 1, maxWidth: '50%'},
  graphNote: {fontSize: 12, lineHeight: 18, color: ledger.subtext},
  categoryTotal: {fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: ledger.ink},
  categoryRow: {flexDirection: 'row', paddingVertical: 11, alignItems: 'center', gap: 12, borderBottomColor: ledger.rule, borderBottomWidth: StyleSheet.hairlineWidth},
  categoryIcon: {width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: ledger.paleSage},
  categoryCopy: {flex: 1, gap: 5},
  categoryHeader: {flexDirection: 'row', alignItems: 'center', gap: 10},
  categoryName: {flex: 1, fontSize: 15, fontWeight: '700', color: ledger.ink},
  categoryPercent: {fontSize: 13, fontWeight: '800', color: ledger.dark},
  categoryAmount: {fontSize: 14, color: ledger.subtext, fontWeight: '600'},
  progressTrack: {height: 6, borderRadius: 4, backgroundColor: ledger.paleSage, overflow: 'hidden'},
  progressValue: {height: 6, borderRadius: 4, backgroundColor: ledger.dark},
  empty: {padding: 18, borderRadius: 15, backgroundColor: ledger.paleSage, gap: 9},
  emptyTitle: {fontSize: 16, fontWeight: '800', color: ledger.ink},
  emptyCopy: {fontSize: 14, lineHeight: 20, color: ledger.subtext},
  emptyAction: {minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center'},
  emptyActionText: {fontSize: 14, fontWeight: '800', color: ledger.dark},
  disclosure: {backgroundColor: ledger.paleSage, borderRadius: 15, flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 11},
  disclosureCopy: {flex: 1, gap: 6},
  disclosureTitle: {fontSize: 15, fontWeight: '800', color: ledger.ink},
  disclosureText: {fontSize: 13, lineHeight: 20, color: ledger.subtext},
  footer: {fontSize: 12, lineHeight: 19, textAlign: 'center', color: ledger.subtext},
});
