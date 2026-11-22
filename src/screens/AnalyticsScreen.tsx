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

export function AnalyticsScreen({transactions, onOpenTransactions}: Props) {
  const [period, setPeriod] = useState<AnalyticsPeriod>('all');
  const report = calculateAnalytics(transactions, period, todayLocal());
  const maxBarValue = Math.max(1, ...report.days.flatMap(day => [day.expense, day.income]));
  const hasAnyData = report.transactionsCount > 0;
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
        <View style={styles.demoPill}><Text style={styles.demoPillText}>UI v0.6</Text></View>
      </View>

      <View style={styles.periodPanel}>
        <Text style={styles.periodTitle}>DAVRNI TANLANG</Text>
        <View style={styles.periodOptions}>
          {ANALYTICS_PERIODS.map(option => {
            const active = period === option.key;
            return (
              <Pressable
                key={option.key}
                accessibilityRole="button"
                accessibilityLabel={'Tahlil davri: ' + option.label}
                accessibilityState={{selected: active}}
                onPress={() => setPeriod(option.key)}
                style={[styles.periodButton, active && styles.periodButtonActive]}
              >
                <Text style={[styles.periodButtonText, active && styles.periodButtonTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.periodDate}>{analyticsRangeLabel(report)}</Text>
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
      </LinearGradient>

      <View style={styles.card}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIcon}><AppIcon name="chart" color={colors.primary} size={17}/></View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Pul oqimi</Text>
              <Text style={styles.sectionSub}>Qayd etilgan faol kunlar</Text>
            </View>
          </View>
          <Text style={styles.smallCount}>{report.days.length} kun</Text>
        </View>
        {hasAnyData ? (
          <>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}><View style={[styles.legendDot, styles.legendIncome]}/><Text style={styles.legendText}>Kirim</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, styles.legendExpense]}/><Text style={styles.legendText}>Chiqim</Text></View>
            </View>
            <View style={styles.chart}>
              {report.days.map(day => (
                <View style={styles.chartColumn} key={day.date}>
                  <View style={styles.bars}>
                    <View style={styles.barSlot}>
                      {day.income > 0 && <View style={[styles.bar, styles.barIncome, {height: Math.max(4, Math.round(day.income / maxBarValue * 102))}]}/>}
                    </View>
                    <View style={styles.barSlot}>
                      {day.expense > 0 && <View style={[styles.bar, styles.barExpense, {height: Math.max(4, Math.round(day.expense / maxBarValue * 102))}]}/>}
                    </View>
                  </View>
                  <Text style={styles.chartDate} numberOfLines={1}>{formatDayCompact(day.date)}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.chartNote}>
              {report.chartTruncated ? 'Oxirgi 7 ta faol kun ko‘rsatildi.' : 'Faqat yozuv mavjud kunlar ko‘rsatildi.'} Bo‘sh kunlarga sun’iy 0 qo‘yilmadi.
            </Text>
          </>
        ) : (
          <View style={styles.empty}>
            <AppIcon name="receipt" color={colors.primarySoft} size={26}/>
            <Text style={styles.emptyTitle}>Bu davrda operatsiya yo‘q</Text>
            <Text style={styles.emptyCaption}>Boshqa muddatni tanlang yoki yangi yozuv qo‘shing.</Text>
            <Pressable accessibilityRole="button" onPress={onOpenTransactions} style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Operatsiyalarga o‘tish</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.categoryCard}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIcon}><AppIcon name="wallet" color={colors.primary} size={18}/></View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Xarajatlar tarkibi</Text>
              <Text style={styles.sectionSub}>Qaysi kategoriyaga ko‘proq pul ketgan?</Text>
            </View>
          </View>
        </View>

        {hasExpense ? (
          <>
            <Text style={styles.categoryTotal}>{formatMoney(report.expense)}</Text>
            <Text style={styles.categoryCaption}>{report.expensesCount} ta xarajat operatsiyasi · demo</Text>
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
                          width: (String(Math.max(3, row.percent)) + '%') as DimensionValue,
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
            <Text style={styles.emptyTitle}>Xarajat qayd etilmagan</Text>
            <Text style={styles.emptyCaption}>Tanlangan davr uchun xarajat kategoriyalari mavjud emas.</Text>
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
        Hisobchi AI · UI v0.6 demo. Natijalar shu sessiyadagi operatsiyalardan hisoblanadi,
        serverda saqlanmaydi. Dashboard balansi va Safe-to-Spend hali mustaqil namuna.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  content: {paddingHorizontal: 19, paddingTop: 20, paddingBottom: 42, gap: 15},
  header: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 2},
  headerIcon: {height: 49, width: 49, borderRadius: 15, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  heading: {flex: 1, minWidth: 0},
  pageTitle: {fontSize: 24, color: colors.text, fontWeight: '800', letterSpacing: -0.5},
  subheading: {fontSize: 11, marginTop: 4, color: colors.muted},
  demoPill: {paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999, backgroundColor: '#163C5C'},
  demoPillText: {fontSize: 10, color: colors.primarySoft, fontWeight: '700'},
  periodPanel: {gap: 9},
  periodTitle: {fontSize: 10, color: colors.faint, fontWeight: '800', letterSpacing: 1},
  periodOptions: {flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 15, padding: 4, gap: 4},
  periodButton: {minHeight: 40, borderRadius: 11, flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 0},
  periodButtonActive: {backgroundColor: '#235B81'},
  periodButtonText: {fontSize: 11, fontWeight: '700', color: colors.muted},
  periodButtonTextActive: {color: colors.text},
  periodDate: {fontSize: 11, color: colors.muted},
  hero: {borderRadius: radius.lg, padding: 20, borderColor: 'rgba(160,224,250,0.17)', borderWidth: 1, overflow: 'hidden'},
  heroTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  heroEyebrow: {fontSize: 10, color: '#A8DBF0', fontWeight: '800', letterSpacing: 0.9},
  heroBadge: {borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: 'rgba(202,241,255,0.12)'},
  heroBadgeText: {fontSize: 10, color: '#D6F0FF', fontWeight: '600'},
  netAmount: {fontSize: 31, color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.7, marginTop: 15},
  netNegative: {color: '#FFB2B2'},
  heroHint: {fontSize: 11, color: '#B8D8EA', marginTop: 5},
  heroRule: {height: 1, backgroundColor: 'rgba(187,230,255,0.18)', marginTop: 18, marginBottom: 14},
  heroMetrics: {flexDirection: 'row', gap: 12},
  heroMetric: {flex: 1, minWidth: 0, gap: 6},
  metricTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  dot: {width: 6, height: 6, borderRadius: 3},
  incomeDot: {backgroundColor: '#65E2B7'},
  expenseDot: {backgroundColor: '#FFB5B5'},
  metricLabel: {color: '#B6D4E4', fontSize: 11},
  metricAmount: {fontSize: 15, color: colors.text, fontWeight: '800'},
  metricDivider: {width: 1, backgroundColor: 'rgba(187,230,255,0.17)'},
  card: {backgroundColor: colors.surface, padding: 17, borderWidth: 1, borderColor: colors.divider, borderRadius: radius.lg},
  sectionHeading: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8},
  sectionTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1},
  sectionIcon: {height: 34, width: 34, borderRadius: 11, backgroundColor: '#193B59', alignItems: 'center', justifyContent: 'center'},
  sectionCopy: {flex: 1, minWidth: 0},
  sectionTitle: {fontSize: 16, color: colors.text, fontWeight: '800'},
  sectionSub: {fontSize: 10, marginTop: 3, color: colors.muted},
  smallCount: {fontSize: 11, fontWeight: '700', color: colors.primarySoft},
  legendRow: {flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginTop: 17},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 6},
  legendDot: {height: 7, width: 7, borderRadius: 3.5},
  legendIncome: {backgroundColor: '#65E2B7'},
  legendExpense: {backgroundColor: '#56C9FC'},
  legendText: {fontSize: 10, color: colors.muted},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 4, height: 148, marginTop: 9, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.divider},
  chartColumn: {flex: 1, alignItems: 'center', gap: 7, minWidth: 0},
  bars: {height: 105, alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row', gap: 4},
  barSlot: {height: 104, width: 11, justifyContent: 'flex-end'},
  bar: {width: 11, borderTopLeftRadius: 5, borderTopRightRadius: 5},
  barIncome: {backgroundColor: '#65E2B7'},
  barExpense: {backgroundColor: '#56C9FC'},
  chartDate: {fontSize: 10, color: colors.muted, textAlign: 'center'},
  chartNote: {fontSize: 10, color: colors.faint, lineHeight: 16, marginTop: 10},
  categoryCard: {backgroundColor: '#E8F6FF', borderRadius: radius.lg, padding: 18, gap: 8},
  categoryTotal: {fontSize: 26, color: colors.ink, fontWeight: '800', marginTop: 10},
  categoryCaption: {fontSize: 11, color: '#52778E', marginBottom: 11},
  categoryRow: {flexDirection: 'row', gap: 10, paddingVertical: 10, alignItems: 'center'},
  categoryIcon: {height: 39, width: 39, borderRadius: 13, justifyContent: 'center', alignItems: 'center'},
  categoryInfo: {flex: 1, minWidth: 0, gap: 5},
  categoryTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 9},
  categoryName: {fontSize: 13, fontWeight: '700', color: colors.ink, flex: 1},
  categoryPercent: {fontSize: 12, fontWeight: '800', color: '#426D84'},
  categoryAmount: {fontSize: 12, fontWeight: '700', color: '#466F86'},
  track: {height: 5, borderRadius: 5, backgroundColor: '#C7E2F0', overflow: 'hidden'},
  progress: {height: 5, borderRadius: 5},
  empty: {alignItems: 'center', paddingVertical: 25, paddingHorizontal: 10, gap: 9},
  emptyCompact: {paddingVertical: 20, gap: 8},
  emptyTitle: {fontSize: 14, color: colors.text, fontWeight: '800'},
  emptyCaption: {fontSize: 11, lineHeight: 18, color: colors.muted},
  emptyButton: {paddingVertical: 11, paddingHorizontal: 15, backgroundColor: '#235B81', borderRadius: 12, marginTop: 7},
  emptyButtonText: {fontSize: 12, color: colors.text, fontWeight: '700'},
  comparison: {flexDirection: 'row', alignItems: 'flex-start', gap: 11, padding: 15, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider},
  comparisonContent: {flex: 1, gap: 5},
  comparisonTitle: {fontSize: 13, color: colors.text, fontWeight: '800'},
  comparisonBody: {fontSize: 11, lineHeight: 18, color: colors.muted},
  footer: {fontSize: 10, lineHeight: 17, color: colors.faint, textAlign: 'center', paddingHorizontal: 10, marginTop: 2},
});
