import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon} from '../components/AppIcon';
import {ScreenHeader} from '../components/ds/ScreenHeader';
import {ChoiceChip} from '../components/ds/ChoiceChip';
import {TransactionRow} from '../components/TransactionRow';
import {type Transaction, formatMoney} from '../data/demo';
import {todayLocal} from '../data/transactions';
import {
  PERIOD_OPTIONS, getPeriodRange, validateCustomRange, transactionsInPeriod,
  sumTransactionTotals, shiftCalendarDate, type PeriodKey, type DateRange,
} from '../data/periods';
import {
  displayDay, filterAndSortTransactions, TransactionFilter,
} from '../data/transactions';
import {colors, radius} from '../theme/tokens';

type Props = {
  transactions: Transaction[];
  onAdd: () => void;
  onEdit: (item: Transaction) => void;
};

const FILTERS: {key: TransactionFilter; label: string}[] = [
  {key: 'all', label: 'Barchasi'},
  {key: 'expense', label: 'Xarajat'},
  {key: 'income', label: 'Daromad'},
];

export function TransactionsScreen({transactions, onAdd, onEdit}: Props) {
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<PeriodKey>('all');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(() => shiftCalendarDate(todayLocal(), -6));
  const [customEnd, setCustomEnd] = useState(() => todayLocal());
  const [customApplied, setCustomApplied] = useState<DateRange | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const today = todayLocal();
  const range = getPeriodRange(period, today, customApplied);
  const selectedPeriodLabel = PERIOD_OPTIONS.find(option => option.key === period)?.label ?? 'Barchasi';
  const compactDate = (iso: string) => iso.slice(8, 10) + '.' + iso.slice(5, 7);
  const rangeLabel = range ? compactDate(range.start) + '–' + compactDate(range.end) : 'Barcha sanalar';
  const periodItems = transactionsInPeriod(transactions, range);
  const filtered = filterAndSortTransactions(periodItems, filter, search);
  const {income, expense: expenses} = sumTransactionTotals(periodItems);
  const hasFilters = period !== 'all' || filter !== 'all' || search.trim().length > 0;

  const selectPeriod = (key: PeriodKey) => {
    if (key === 'custom') {
      setCustomOpen(true);
      setPeriodOpen(true);
      setDateError(null);
      return;
    }
    setPeriod(key);
    setPeriodOpen(false);
    setCustomOpen(false);
    setDateError(null);
  };
  const applyCustom = () => {
    const start = customStart.trim();
    const end = customEnd.trim();
    const error = validateCustomRange(start, end, today);
    setDateError(error);
    if (error) return;
    setCustomApplied({start, end});
    setPeriod('custom');
    setCustomOpen(false);
    setPeriodOpen(false);
  };
  const resetFilters = () => {
    setPeriod('all');
    setFilter('all');
    setSearch('');
    setPeriodOpen(false);
    setCustomOpen(false);
    setDateError(null);
  };
  const groups: {day: string; items: Transaction[]}[] = [];
  for (const item of filtered) {
    const last = groups[groups.length - 1];
    if (last && last.day === item.occurredOn) last.items.push(item);
    else groups.push({day: item.occurredOn, items: [item]});
  }

  return (
    <View style={styles.fill}>
      <View style={styles.headerBar}>
        <ScreenHeader
          title="Operatsiyalar"
          subtitle={'Demo sessiya · ' + transactions.length + ' ta yozuv · DS v1.1'}
          icon="receipt"
        />
      </View>
      <ScrollView
        style={styles.fill}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
      <View style={styles.searchPeriodRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Qidirish..."
          placeholderTextColor={colors.faint}
          accessibilityLabel="Kategoriya yoki izoh bo‘yicha qidirish"
          autoCapitalize="none"
          style={[styles.search, styles.searchInline]}
        />
        <Pressable
          onPress={() => {
            setPeriodOpen(previous => !previous);
            setCustomOpen(false);
            setDateError(null);
          }}
          accessibilityRole="button"
          accessibilityLabel={'Muddatni tanlash. Hozir: ' + selectedPeriodLabel + '. ' + rangeLabel}
          accessibilityState={{expanded: periodOpen}}
          style={[styles.periodTrigger, periodOpen && styles.periodTriggerActive]}
        >
          <Text style={styles.periodTitle} numberOfLines={1}>{selectedPeriodLabel === 'Barchasi' ? 'Muddat' : selectedPeriodLabel}</Text>
          <AppIcon name="chevron-down" color={colors.primarySoft} size={15}/>
        </Pressable>
      </View>
      {periodOpen && (
        <View style={styles.periodPanel}>
          <Text style={styles.periodPanelTitle}>Muddatni tanlang · {rangeLabel}</Text>
          <View style={styles.periodChips}>
            {PERIOD_OPTIONS.map(option => {
              const active = customOpen ? option.key === 'custom' : period === option.key;
              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="button"
                  accessibilityState={{selected: active}}
                  accessibilityLabel={'Muddat: ' + option.label}
                  onPress={() => selectPeriod(option.key)}
                  style={[styles.periodChip, active && styles.periodChipActive]}
                >
                  <Text style={[styles.periodChipText, active && styles.periodChipActiveText]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {customOpen && (
            <View style={styles.rangePanel}>
              <Text style={styles.rangeTitle}>Sana oralig‘ini tanlash</Text>
              <View style={styles.rangeInputs}>
                <View style={styles.rangeField}>
                  <Text style={styles.rangeLabel}>Boshlanish</Text>
                  <TextInput
                    value={customStart}
                    onChangeText={setCustomStart}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.faint}
                    autoCapitalize="none"
                    maxLength={10}
                    accessibilityLabel="Boshlanish sanasi"
                    style={styles.rangeInput}
                  />
                </View>
                <View style={styles.rangeField}>
                  <Text style={styles.rangeLabel}>Tugash</Text>
                  <TextInput
                    value={customEnd}
                    onChangeText={setCustomEnd}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.faint}
                    autoCapitalize="none"
                    maxLength={10}
                    accessibilityLabel="Tugash sanasi"
                    style={styles.rangeInput}
                  />
                </View>
              </View>
              {dateError && <Text style={styles.rangeError}>{dateError}</Text>}
              <Pressable onPress={applyCustom} accessibilityRole="button" style={styles.rangeApply}>
                <Text style={styles.rangeApplyText}>Oraliqni qo‘llash</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      <View style={styles.filters}>
        {FILTERS.map(option => (
          <ChoiceChip
            key={option.key}
            label={option.label}
            active={filter === option.key}
            onPress={() => setFilter(option.key)}
            flex
          />
        ))}
      </View>

      <View style={styles.totalsWrap}>
        <Text style={styles.totalsCaption}>TANLANGAN MUDDAT · DEMO YOZUVLARI</Text>
        <View style={styles.summary}>
          <View style={styles.summaryColumn}>
            <View style={styles.metricHeading}>
              <View style={[styles.metricDot, styles.incomeDot]}/>
              <Text style={styles.summaryLabel}>Jami kirim</Text>
            </View>
            <Text style={styles.summaryIncome} numberOfLines={1} adjustsFontSizeToFit>
              {formatMoney(income)}
            </Text>
          </View>
          <View style={styles.summaryColumn}>
            <View style={styles.metricHeading}>
              <View style={[styles.metricDot, styles.expenseDot]}/>
              <Text style={styles.summaryLabel}>Jami chiqim</Text>
            </View>
            <Text style={styles.summaryExpense} numberOfLines={1} adjustsFontSizeToFit>
              {formatMoney(expenses)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>{filtered.length} ta operatsiya topildi</Text>
        {hasFilters && (
          <Pressable onPress={resetFilters} accessibilityRole="button" accessibilityLabel="Filtrni bekor qilish, barcha operatsiyalarni ko‘rsatish" style={styles.resetButton}>
            <Text style={styles.resetText}>Filtrni bekor qilish</Text>
          </Pressable>
        )}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><AppIcon name="receipt" size={27} color={colors.primarySoft}/></View>
          <Text style={styles.emptyTitle}>Operatsiya topilmadi</Text>
          <Text style={styles.emptyBody}>
            {transactions.length
              ? 'Bu muddat yoki filtrga mos demo yozuv topilmadi.'
              : 'Birinchi demo operatsiyani qo‘shishdan boshlang.'}
          </Text>
          {hasFilters && (
            <Pressable onPress={resetFilters} accessibilityRole="button" style={styles.clear}>
              <Text style={styles.clearText}>Filtrni bekor qilish</Text>
            </Pressable>
          )}
        </View>
      ) : groups.map(group => (
        <View key={group.day} style={styles.group}>
          <View style={styles.groupHeading}>
            <Text style={styles.groupDay}>{displayDay(group.day)}</Text>
            <Text style={styles.groupCount}>{group.items.length} ta</Text>
          </View>
          <View style={styles.lightCard}>
            {group.items.map((item, index) => (
              <View key={item.id}>
                {index > 0 && <View style={styles.divider}/>}
                <Pressable
                  onPress={() => onEdit(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.title + ', ' + formatMoney(item.amount) + '. Tahrirlash'}
                >
                  <TransactionRow item={item} light/>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.footer}>
        Ma’lumotlar faqat shu sessiya xotirasida. Yangilaganda dastlabki demo yozuvlar qaytadi.
      </Text>
      </ScrollView>
      <View style={styles.actionArea}>
        <Pressable
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Yangi operatsiya qo‘shish"
          style={styles.fab}
        >
          <LinearGradient
            colors={['#A0E9FF', '#44BEEB']}
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
            style={styles.fabContent}
          >
            <AppIcon name="plus" color={colors.ink} size={21} strokeWidth={2.5}/>
            <Text style={styles.fabLabel}>Qo‘shish</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  content: {paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 12},
  headerBar: {paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12},
  header: {flexDirection: 'row', alignItems: 'center', gap: 10},
  icon: {width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  heading: {flex: 1, minWidth: 0},
  title: {fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.6},
  caption: {color: colors.muted, fontSize: 10, marginTop: 3},
  searchPeriodRow: {flexDirection: 'row', gap: 9, alignItems: 'center'},
  searchInline: {flex: 1, minWidth: 0},
  periodTrigger: {minWidth: 100, maxWidth: 112, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 10, borderRadius: 13, borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.surface},
  periodTriggerActive: {borderColor: colors.primary},
  periodTitle: {fontSize: 11, fontWeight: '800', color: colors.primarySoft, flexShrink: 1},
  periodPanel: {borderRadius: 15, borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.surface, padding: 12, gap: 12},
  periodPanelTitle: {fontSize: 11, fontWeight: '700', color: colors.muted},
  periodChips: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 7},
  periodChip: {minHeight: 37, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider, justifyContent: 'center'},
  periodChipActive: {backgroundColor: '#1D5679', borderColor: 'rgba(126,224,255,0.55)'},
  periodChipText: {fontSize: 11, color: colors.muted, fontWeight: '700'},
  periodChipActiveText: {color: colors.text},
  rangePanel: {borderWidth: 1, borderColor: colors.divider, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, gap: 11},
  rangeTitle: {color: colors.text, fontSize: 13, fontWeight: '800'},
  rangeInputs: {flexDirection: 'row', gap: 10},
  rangeField: {flex: 1, minWidth: 0, gap: 5},
  rangeLabel: {color: colors.muted, fontSize: 11},
  rangeInput: {borderWidth: 1, borderColor: colors.divider, borderRadius: 11, minHeight: 44, backgroundColor: '#153956', color: colors.text, paddingHorizontal: 9, fontSize: 13},
  rangeError: {color: '#FFB2B2', fontSize: 11},
  rangeApply: {borderRadius: 12, backgroundColor: '#79D7F7', minHeight: 43, alignItems: 'center', justifyContent: 'center'},
  rangeApplyText: {color: colors.ink, fontSize: 13, fontWeight: '800'},
  resultsBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 2},
  resultsText: {fontSize: 11, color: colors.muted},
  resetButton: {paddingVertical: 8, paddingHorizontal: 9, borderRadius: 9, backgroundColor: colors.surfaceRaised},
  resetText: {fontSize: 11, fontWeight: '700', color: colors.primarySoft},
  totalsWrap: {gap: 8, marginTop: 1, marginBottom: 4},
  totalsCaption: {fontSize: 9, fontWeight: '700', letterSpacing: 0.9, color: colors.faint, marginLeft: 3},
  summary: {flexDirection: 'row', gap: 10},
  summaryColumn: {
    flex: 1, minWidth: 0, minHeight: 83, paddingHorizontal: 13, paddingVertical: 13,
    gap: 9, backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.divider, borderRadius: 17, justifyContent: 'center',
  },
  metricHeading: {flexDirection: 'row', alignItems: 'center', gap: 7},
  metricDot: {width: 6, height: 6, borderRadius: 3},
  incomeDot: {backgroundColor: colors.positive},
  expenseDot: {backgroundColor: colors.negative},
  summaryLabel: {fontSize: 11, fontWeight: '600', color: colors.muted},
  summaryExpense: {fontSize: 17, fontWeight: '800', color: '#FFB2B2'},
  summaryIncome: {fontSize: 17, fontWeight: '800', color: '#6BE4BE'},
  actionArea: {
    flexDirection: 'row', justifyContent: 'flex-end',
    paddingHorizontal: 20, paddingTop: 5, paddingBottom: 6,
    backgroundColor: 'transparent',
  },
  fab: {borderRadius: 999, overflow: 'hidden', shadowColor: '#20B4ED', shadowOpacity: 0.28, shadowRadius: 12, shadowOffset: {width: 0, height: 5}, elevation: 7},
  fabContent: {minWidth: 134, minHeight: 52, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9},
  fabLabel: {fontSize: 14, fontWeight: '800', color: colors.ink},
  search: {minHeight: 49, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.surface, color: colors.text, fontSize: 12},
  filters: {flexDirection: 'row', padding: 4, gap: 5, backgroundColor: colors.surface, borderRadius: 15},
  filter: {flex: 1, minHeight: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  filterActive: {backgroundColor: '#205478'},
  filterText: {fontSize: 12, fontWeight: '600', color: colors.muted},
  filterTextActive: {color: colors.text, fontWeight: '800'},
  group: {gap: 9},
  groupHeading: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 3, alignItems: 'center'},
  groupDay: {fontSize: 13, color: colors.primarySoft, fontWeight: '700'},
  groupCount: {fontSize: 11, color: colors.faint},
  lightCard: {backgroundColor: colors.cardLight, borderRadius: radius.lg, paddingHorizontal: 15, paddingVertical: 7},
  divider: {height: 1, backgroundColor: '#CEE1EB', marginLeft: 57},
  empty: {padding: 25, alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.lg},
  emptyIcon: {height: 52, width: 52, borderRadius: 15, backgroundColor: '#1B4C70', justifyContent: 'center', alignItems: 'center'},
  emptyTitle: {color: colors.text, fontSize: 16, fontWeight: '800'},
  emptyBody: {textAlign: 'center', color: colors.muted, fontSize: 12, lineHeight: 19},
  clear: {backgroundColor: colors.surfaceRaised, borderRadius: 12, padding: 12, marginTop: 5},
  clearText: {color: colors.primarySoft, fontSize: 12, fontWeight: '700'},
  footer: {fontSize: 10, lineHeight: 17, color: colors.faint, textAlign: 'center', paddingHorizontal: 8, marginTop: 6},
});
