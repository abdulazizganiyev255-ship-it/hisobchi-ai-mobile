import {useState} from 'react';
import {
  Pressable, ScrollView, StyleSheet, Text, View,
  type DimensionValue,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon} from '../components/AppIcon';
import type {Transaction} from '../data/demo';
import {formatMoney} from '../data/demo';
import {
  ANALYTICS_PERIODS, calculateAnalytics, analyticsRangeLabel,
  formatDayCompact, type AnalyticsPeriod,
} from '../data/analytics';
import {todayLocal} from '../data/transactions';
import {colors, radius} from '../theme/tokens';

type Props = {
  transactions: Transaction[];
  onOpenTransactions: () => void;
};

type ChartMetric = 'expense' | 'income' | 'turnover';

export function AnalyticsScreen({transactions, onOpenTransactions}: Props) {
  const [period, setPeriod] = useState<AnalyticsPeriod>('all');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [chartMetric, setChartMetric] = useState<ChartMetric>('expense');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const report = calculateAnalytics(transactions, period, todayLocal());
  const metricAmount = (day: {income: number; expense: number; turnover: number}) =>
    chartMetric === 'expense' ? day.expense : chartMetric === 'income' ? day.income : day.turnover;
  // Keep the x-axis consistent when switching metrics: recorded days do not disappear.
  const chartDays = report.days;
  const maxBarValue = Math.max(1, ...chartDays.map(metricAmount));
  const highlightedDay = chartDays.find(day => day.date === selectedDay) ?? chartDays[chartDays.length - 1];
  const chartMetricLabel = chartMetric === 'expense' ? 'Chiqim' : chartMetric === 'income' ? 'Kirim' : 'Aylanma';
  const metricTotal = chartMetric === 'expense' ? report.expense : chartMetric === 'income' ? report.income : report.turnover;
  const hasMetricData = chartDays.some(day => metricAmount(day) > 0);
  const hasExpense = report.expense > 0;

  return (
    <ScrollView
      style={styles.fill}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <AppIcon name="chart" color={colors.primarySoft} size={24}/>
        </View>
        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Tahlil</Text>
          <Text style={styles.subheading}>Qayd etilgan operatsiyalar · demo</Text>
        </View>
        <View style={styles.demoPill}><Text style={styles.demoPillText}>UI v0.6.4</Text></View>
      </View>

      <View style={styles.periodPanel}>
        <View style={styles.periodLine}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={'Muddatni tanlash. Hozir: ' + (ANALYTICS_PERIODS.find(option => option.key === period)?.label ?? 'Barchasi')}
            accessibilityState={{expanded: periodOpen}}
            onPress={() => setPeriodOpen(value => !value)}
            style={[styles.periodTrigger, periodOpen && styles.periodTriggerActive]}
          >
            <Text style={styles.periodTriggerLabel}>
              {ANALYTICS_PERIODS.find(option => option.key === period)?.label ?? 'Barchasi'}
            </Text>
            <AppIcon name="chevron-down" color={colors.primarySoft} size={15}/>
          </Pressable>
          <Text style={styles.periodDate} numberOfLines={1}>{analyticsRangeLabel(report)}</Text>
        </View>
        {periodOpen && (
          <View style={styles.periodOptions}>
            {ANALYTICS_PERIODS.map(option => {
              const active = period === option.key;
              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="button"
                  accessibilityLabel={'Tahlil davri: ' + option.label}
                  accessibilityState={{selected: active}}
                  onPress={() => {setPeriod(option.key); setPeriodOpen(false); setSelectedDay(null);}}
                  style={[styles.periodButton, active && styles.periodButtonActive]}
                >
                  <Text style={[styles.periodButtonText, active && styles.periodButtonTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <LinearGradient
        colors={['#1B537A', '#0E3454', '#0C2945']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <Text style={styles.heroEyebrow}>SOF FARQ · NAMUNA</Text>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>{report.transactionsCount} yozuv</Text></View>
        </View>
        <Text
          style={[styles.netAmount, report.net < 0 && styles.netNegative]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatMoney(report.net)}
        </Text>
        <Text style={styles.heroHint}>Kirim − chiqim · tanlangan davr</Text>
        <View style={styles.heroRule}/>
        <View style={styles.heroMetrics}>
          <View style={styles.heroMetric}>
            <View style={styles.metricTitleRow}>
              <View style={[styles.dot, styles.incomeDot]}/>
              <Text style={styles.metricLabel}>Kirim</Text>
            </View>
            <Text style={styles.metricAmount} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(report.income)}</Text>
          </View>
          <View style={styles.metricDivider}/>
          <View style={styles.heroMetric}>
            <View style={styles.metricTitleRow}>
              <View style={[styles.dot, styles.expenseDot]}/>
              <Text style={styles.metricLabel}>Chiqim</Text>
            </View>
            <Text style={styles.metricAmount} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(report.expense)}</Text>
          </View>
        </View>
        <View style={styles.turnoverRow}>
          <Text style={styles.turnoverLabel}>Umumiy aylanma</Text>
          <Text style={styles.turnoverInline} numberOfLines={1} adjustsFontSizeToFit>
            {formatMoney(report.turnover)}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.card}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIcon}><AppIcon name="chart" color={colors.primary} size={17}/></View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Kunlik dinamika</Text>
              <Text style={styles.sectionSub}>Sanani bosib summani ko‘ring</Text>
            </View>
          </View>
          <Text style={styles.smallCount}>{chartDays.length} kun</Text>
        </View>

        <View style={styles.chartControls}>
          {([
            {key: 'expense', label: 'Chiqim'},
            {key: 'income', label: 'Kirim'},
            {key: 'turnover', label: 'Aylanma'},
          ] as const).map(option => {
            const active = chartMetric === option.key;
            return (
              <Pressable
                key={option.key}
                accessibilityRole="button"
                accessibilityState={{selected: active}}
                accessibilityLabel={'Grafik: ' + option.label}
                onPress={() => {setChartMetric(option.key); setSelectedDay(null);}}
                style={[styles.chartChoice, active && styles.chartChoiceActive]}
              >
                <Text style={[styles.chartChoiceText, active && styles.chartChoiceTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {chartDays.length > 0 && hasMetricData ? (
          <>
            <View style={styles.chart}>
              {chartDays.map(day => {
                const value = metricAmount(day);
                const highlighted = highlightedDay?.date === day.date;
                return (
                  <Pressable
                    key={day.date}
                    accessibilityRole="button"
                    accessibilityState={{selected: highlighted}}
                    accessibilityLabel={formatDayCompact(day.date) + ', ' + chartMetricLabel + ': ' + formatMoney(value) + ', aylanma: ' + formatMoney(day.turnover)}
                    onPress={() => setSelectedDay(day.date)}
                    style={styles.chartColumn}
                  >
                    <View style={styles.bars}>
                      {value > 0 ? (
                        <View
                          style={[
                            styles.bar,
                            chartMetric === 'expense' ? styles.barExpense : chartMetric === 'income' ? styles.barIncome : styles.barTurnover,
                            highlighted && styles.barHighlighted,
                            {height: Math.max(4, Math.round(value / maxBarValue * 98))},
                          ]}
                        />
                      ) : <View style={styles.zeroMarker}/>}
                    </View>
                    <Text style={[styles.chartDate, highlighted && styles.chartDateActive]} numberOfLines={1}>
                      {formatDayCompact(day.date)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.selectedRow}>
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedDate}>{highlightedDay ? formatDayCompact(highlightedDay.date) : ''} · {chartMetricLabel}</Text>
                <Text style={styles.selectedTurnover}>
                  Kunlik aylanma: {highlightedDay ? formatMoney(highlightedDay.turnover) : ''}
                </Text>
              </View>
              <Text style={styles.selectedAmount} numberOfLines={1} adjustsFontSizeToFit>
                {highlightedDay ? formatMoney(metricAmount(highlightedDay)) : ''}
              </Text>
            </View>
            <Text style={styles.chartNote}>
              {report.chartTruncated ? 'Oxirgi 7 ta qayd etilgan kun ko‘rsatildi. ' : ''}
              Sanalar barcha rejimda bir xil. Har bir rejim o‘z shkalasida chiziladi; rejimlar balandligini bevosita taqqoslamang.
            </Text>
          </>
        ) : (
          <View style={styles.empty}>
            <AppIcon name="receipt" color={colors.primarySoft} size={26}/>
            <Text style={styles.emptyTitle}>
              {chartMetric === 'expense' ? 'Bu davrda chiqim yo‘q' : chartMetric === 'income' ? 'Bu davrda kirim yo‘q' : 'Bu davrda aylanma yo‘q'}
            </Text>
            <Text style={styles.emptyCaption}>Boshqa muddatni tanlang yoki yangi operatsiya kiriting.</Text>
            <Pressable accessibilityRole="button" onPress={onOpenTransactions} style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Operatsiyalarga o‘tish</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.categoryCard}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIcon, styles.categorySectionIcon]}><AppIcon name="wallet" color="#12698C" size={18}/></View>
            <View style={styles.sectionCopy}>
              <Text style={[styles.sectionTitle, styles.categoryHeading]}>Xarajatlar tarkibi</Text>
              <Text style={[styles.sectionSub, styles.categorySubheading]}>Qaysi kategoriyaga ko‘proq pul ketgan?</Text>
            </View>
          </View>
        </View>

        {hasExpense ? (
          <>
            <View style={styles.categorySummary}>
              <Text style={styles.categoryCaption}>{report.expensesCount} ta xarajat · demo</Text>
              <Text style={styles.categoryTotal} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(report.expense)}</Text>
            </View>
            {report.categories.map(row => (
              <View style={styles.categoryRow} key={row.name}>
                <View style={[styles.categoryIcon, {backgroundColor: row.iconBg}]}>
                  <AppIcon name={row.icon} size={18} color={row.iconColor}/>
                </View>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryTop}>
                    <Text style={styles.categoryName} numberOfLines={1}>{row.name}</Text>
                    <Text style={styles.categoryPercent}>{row.percent}%</Text>
                  </View>
                  <Text style={styles.categoryAmount}>{formatMoney(row.amount)}</Text>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.progress,
                        {
                          width: (String(report.expense > 0 ? row.amount / report.expense * 100 : 0) + '%') as DimensionValue,
                          backgroundColor: row.iconColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyCompact}>
            <Text style={[styles.emptyTitle, styles.emptyTitleInk]}>Xarajat qayd etilmagan</Text>
            <Text style={[styles.emptyCaption, styles.emptyCaptionInk]}>Tanlangan davr uchun xarajat kategoriyalari mavjud emas.</Text>
          </View>
        )}
      </View>

      <View style={styles.comparison}>
        <AppIcon name="shield" color={colors.primarySoft} size={20}/>
        <View style={styles.comparisonContent}>
          <Text style={styles.comparisonTitle}>Oldingi davr bilan taqqoslash</Text>
          <Text style={styles.comparisonBody}>
            Hozircha ishonchli tarix qamrovi tasdiqlanmagan. Shuning uchun oldingi davr
            chizig‘i va o‘zgarish foizini taxminan ko‘rsatmaymiz.
          </Text>
        </View>
      </View>
      <Text style={styles.footer}>
        Hisobchi AI · UI v0.6.4 demo. Natijalar shu sessiyadagi operatsiyalardan hisoblanadi,
        serverda saqlanmaydi. Dashboard balansi va Safe-to-Spend hali mustaqil namuna.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  content: {paddingHorizontal: 18, paddingTop: 16, paddingBottom: 32, gap: 12},
  header: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 1},
  headerIcon: {height: 45, width: 45, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  heading: {flex: 1, minWidth: 0},
  pageTitle: {fontSize: 24, color: colors.text, fontWeight: '800', letterSpacing: -0.5},
  subheading: {fontSize: 11, marginTop: 4, color: colors.muted},
  demoPill: {paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999, backgroundColor: '#163C5C'},
  demoPillText: {fontSize: 10, color: colors.primarySoft, fontWeight: '700'},
  periodPanel: {gap: 8},
  periodLine: {flexDirection: 'row', alignItems: 'center', gap: 10},
  periodTrigger: {minWidth: 108, minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, gap: 8, backgroundColor: colors.surface, borderRadius: 13, borderWidth: 1, borderColor: colors.divider},
  periodTriggerActive: {borderColor: colors.primary},
  periodTriggerLabel: {fontSize: 12, fontWeight: '700', color: colors.text},
  periodOptions: {flexDirection: 'row', flexWrap: 'wrap', backgroundColor: colors.surface, borderRadius: 15, padding: 7, gap: 7},
  periodButton: {minHeight: 39, borderRadius: 11, flexGrow: 1, paddingHorizontal: 9, justifyContent: 'center', alignItems: 'center'},
  periodButtonActive: {backgroundColor: '#235B81'},
  periodButtonText: {fontSize: 11, fontWeight: '700', color: colors.muted},
  periodButtonTextActive: {color: colors.text},
  periodDate: {fontSize: 11, color: colors.muted, textAlign: 'right', flex: 1, minWidth: 0},
  hero: {borderRadius: radius.lg, padding: 16, borderColor: 'rgba(160,224,250,0.17)', borderWidth: 1, overflow: 'hidden'},
  heroTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  heroEyebrow: {fontSize: 10, color: '#A8DBF0', fontWeight: '800', letterSpacing: 0.9},
  heroBadge: {borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: 'rgba(202,241,255,0.12)'},
  heroBadgeText: {fontSize: 10, color: '#D6F0FF', fontWeight: '600'},
  netAmount: {fontSize: 29, color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.7, marginTop: 11},
  netNegative: {color: '#FFB2B2'},
  heroHint: {fontSize: 11, color: '#B8D8EA', marginTop: 5},
  heroRule: {height: 1, backgroundColor: 'rgba(187,230,255,0.18)', marginTop: 13, marginBottom: 11},
  heroMetrics: {flexDirection: 'row', gap: 12},
  heroMetric: {flex: 1, minWidth: 0, gap: 4},
  metricTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  dot: {width: 6, height: 6, borderRadius: 3},
  incomeDot: {backgroundColor: '#65E2B7'},
  expenseDot: {backgroundColor: '#FFB5B5'},
  metricLabel: {color: '#B6D4E4', fontSize: 11},
  metricAmount: {fontSize: 15, color: colors.text, fontWeight: '800'},
  metricDivider: {width: 1, backgroundColor: 'rgba(187,230,255,0.17)'},
  card: {backgroundColor: colors.surface, padding: 15, borderWidth: 1, borderColor: colors.divider, borderRadius: radius.lg},
  sectionHeading: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8},
  sectionTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1},
  sectionIcon: {height: 34, width: 34, borderRadius: 11, backgroundColor: '#193B59', alignItems: 'center', justifyContent: 'center'},
  sectionCopy: {flex: 1, minWidth: 0},
  sectionTitle: {fontSize: 16, color: colors.text, fontWeight: '800'},
  sectionSub: {fontSize: 10, marginTop: 3, color: colors.muted},
  smallCount: {fontSize: 11, fontWeight: '700', color: colors.primarySoft},
  turnoverRow: {marginTop: 12, paddingTop: 11, borderTopWidth: 1, borderTopColor: 'rgba(187,230,255,0.18)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10},
  turnoverLabel: {fontSize: 11, fontWeight: '700', color: '#B5D7E9'},
  turnoverInline: {fontSize: 15, fontWeight: '800', color: colors.text, flexShrink: 1, textAlign: 'right'},
  chartControls: {marginTop: 11, flexDirection: 'row', gap: 7, alignSelf: 'flex-start'},
  chartChoice: {minWidth: 74, minHeight: 39, paddingHorizontal: 12, borderRadius: 11, backgroundColor: '#0A223A', alignItems: 'center', justifyContent: 'center'},
  chartChoiceActive: {backgroundColor: '#1A567C'},
  chartChoiceText: {fontSize: 12, fontWeight: '700', color: colors.muted},
  chartChoiceTextActive: {color: colors.text},

  chart: {flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', gap: 7, height: 150, marginTop: 12, borderBottomWidth: 1, borderBottomColor: colors.divider},
  chartColumn: {flex: 1, minWidth: 0, minHeight: 143, alignItems: 'center', justifyContent: 'flex-end', gap: 9},
  bars: {height: 101, width: '100%', justifyContent: 'flex-end', alignItems: 'center'},
  bar: {width: 21, maxWidth: '62%', borderTopLeftRadius: 7, borderTopRightRadius: 7, opacity: 0.74},
  barHighlighted: {opacity: 1},
  barIncome: {backgroundColor: '#65E2B7'},
  barExpense: {backgroundColor: '#56C9FC'},
  barTurnover: {backgroundColor: '#9DBBFF'},
  zeroMarker: {height: 2, width: 18, backgroundColor: 'rgba(166,206,230,0.27)', borderRadius: 2},
  chartDate: {fontSize: 10, color: colors.muted, textAlign: 'center', marginBottom: 9},
  chartDateActive: {color: colors.text, fontWeight: '800'},
  selectedRow: {marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, backgroundColor: '#173956', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12},
  selectedInfo: {flex: 1, minWidth: 0, gap: 4},
  selectedDate: {fontSize: 11, fontWeight: '700', color: colors.muted},
  selectedTurnover: {fontSize: 10, color: colors.primarySoft},
  selectedAmount: {fontSize: 12, fontWeight: '800', color: colors.text, flexShrink: 1, maxWidth: '48%'},
  chartNote: {fontSize: 10, color: colors.faint, lineHeight: 16, marginTop: 8},
  categoryCard: {backgroundColor: '#E8F6FF', borderRadius: radius.lg, padding: 16, gap: 6},
  categorySectionIcon: {backgroundColor: '#CAE9F7'},
  categoryHeading: {color: colors.ink},
  categorySubheading: {color: '#55788D'},
  categorySummary: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 9, paddingBottom: 6},
  categoryTotal: {fontSize: 15, color: colors.ink, fontWeight: '800', textAlign: 'right', flexShrink: 1},
  categoryCaption: {fontSize: 11, color: '#52778E'},
  categoryRow: {flexDirection: 'row', gap: 10, paddingVertical: 7, alignItems: 'center'},
  categoryIcon: {height: 36, width: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  categoryInfo: {flex: 1, minWidth: 0, gap: 4},
  categoryTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 9},
  categoryName: {fontSize: 13, fontWeight: '700', color: colors.ink, flex: 1},
  categoryPercent: {fontSize: 12, fontWeight: '800', color: '#426D84'},
  categoryAmount: {fontSize: 12, fontWeight: '700', color: '#466F86'},
  track: {height: 5, borderRadius: 5, backgroundColor: '#C7E2F0', overflow: 'hidden'},
  progress: {height: 5, borderRadius: 5},
  empty: {alignItems: 'center', paddingVertical: 25, paddingHorizontal: 10, gap: 9},
  emptyCompact: {paddingVertical: 20, gap: 8},
  emptyTitleInk: {color: colors.ink},
  emptyCaptionInk: {color: '#587A90'},
  emptyTitle: {fontSize: 14, color: colors.text, fontWeight: '800'},
  emptyCaption: {fontSize: 11, lineHeight: 18, color: colors.muted},
  emptyButton: {paddingVertical: 11, paddingHorizontal: 15, backgroundColor: '#235B81', borderRadius: 12, marginTop: 7},
  emptyButtonText: {fontSize: 12, color: colors.text, fontWeight: '700'},
  comparison: {flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 13, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider},
  comparisonContent: {flex: 1, gap: 5},
  comparisonTitle: {fontSize: 13, color: colors.text, fontWeight: '800'},
  comparisonBody: {fontSize: 11, lineHeight: 18, color: colors.muted},
  footer: {fontSize: 10, lineHeight: 17, color: colors.faint, textAlign: 'center', paddingHorizontal: 10, marginTop: 2},
});
