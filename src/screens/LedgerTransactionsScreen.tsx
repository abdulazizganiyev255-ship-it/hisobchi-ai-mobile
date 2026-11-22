import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {LedgerDateCalendar} from '../components/living/LedgerDateCalendar';
import {LedgerTransactionRow} from '../components/living/LedgerPrimitives';
import {type Transaction, formatMoney} from '../data/demo';
import {
  PERIOD_OPTIONS, getPeriodRange, validateCustomRange, transactionsInPeriod,
  sumTransactionTotals, shiftCalendarDate, type PeriodKey, type DateRange,
} from '../data/periods';
import {
  displayDay, filterAndSortTransactions, todayLocal, type TransactionFilter,
} from '../data/transactions';
import {ledger} from '../theme/livingLedger';

type Props = {
  transactions: Transaction[];
  onAdd: () => void;
  onEdit: (item: Transaction) => void;
};

const TYPES: {key: TransactionFilter; label: string}[] = [
  {key: 'all', label: 'Barchasi'},
  {key: 'expense', label: 'Xarajat'},
  {key: 'income', label: 'Daromad'},
];

/** Ledger history: totals explicitly correspond to *visible filtered rows*. */
export function LedgerTransactionsScreen({transactions, onAdd, onEdit}: Props) {
  const {width, height} = useWindowDimensions();
  const compact = width <= 330 || height < 700;
  const [type, setType] = useState<TransactionFilter>('all');
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<PeriodKey>('all');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(() => shiftCalendarDate(todayLocal(), -6));
  const [customEnd, setCustomEnd] = useState(() => todayLocal());
  const [appliedRange, setAppliedRange] = useState<DateRange | null>(null);
  const [calendarTarget, setCalendarTarget] = useState<'start' | 'end' | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const today = todayLocal();
  const range = getPeriodRange(period, today, appliedRange);
  const visible = filterAndSortTransactions(
    transactionsInPeriod(transactions, range), type, search
  );
  const {income, expense} = sumTransactionTotals(visible);
  const hasFilters = period !== 'all' || type !== 'all' || search.trim().length > 0;
  const periodLabel = PERIOD_OPTIONS.find(option => option.key === period)?.label ?? 'Barchasi';
  const groups: {date: string; rows: Transaction[]}[] = [];

  for (const item of visible) {
    const last = groups[groups.length - 1];
    if (last && last.date === item.occurredOn) last.rows.push(item);
    else groups.push({date: item.occurredOn, rows: [item]});
  }

  const resetFilters = () => {
    setPeriod('all');
    setType('all');
    setSearch('');
    setPeriodOpen(false);
    setCustomOpen(false);
    setDateError(null);
  };
  const choosePeriod = (key: PeriodKey) => {
    if (key === 'custom') {
      setCustomOpen(true);
      setDateError(null);
      return;
    }
    setPeriod(key);
    setCustomOpen(false);
    setPeriodOpen(false);
    setDateError(null);
  };
  const applyRange = () => {
    const issue = validateCustomRange(customStart, customEnd, today);
    setDateError(issue);
    if (issue) return;
    setAppliedRange({start: customStart, end: customEnd});
    setPeriod('custom');
    setPeriodOpen(false);
    setCustomOpen(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        testID="ledger-transactions-scroll"
        style={styles.scroll}
        contentContainerStyle={[styles.content, compact && styles.compactContent]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topLine}>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>HISOBCHI · DEMO SESSIYA</Text>
            <Text accessibilityRole="header" style={[styles.title, compact && styles.compactTitle]}>Operatsiyalar</Text>
            <Text style={styles.description}>{compact ? 'Kirim va chiqimlar · demo' : 'Kirim va chiqimlar · faqat ushbu sessiya'}</Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{transactions.length} ta</Text>
          </View>
        </View>

        <Pressable
          testID="ledger-transactions-add"
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Yangi operatsiya qo‘shish"
          style={({pressed}) => [styles.primaryButton, compact && styles.primaryCompact, pressed && styles.pressed]}
        >
          <View style={styles.primaryIcon}>
            <AppIcon name="plus" color={ledger.ink} size={21}/>
          </View>
          <View style={styles.primaryCopy}>
            <Text style={styles.primaryText}>Yangi operatsiya</Text>
            <Text style={styles.primaryCaption}>Sessiya daftariga kiritish</Text>
          </View>
          <AppIcon name="chevron" color={ledger.ink} size={19}/>
        </Pressable>

        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <AppIcon name="receipt" color={ledger.subtext} size={17}/>
            <TextInput
              testID="ledger-transactions-search"
              value={search}
              onChangeText={setSearch}
              placeholder="Qidirish..."
              placeholderTextColor={ledger.subtext}
              accessibilityLabel="Kategoriya yoki izoh bo‘yicha qidirish"
              autoCapitalize="none"
              style={styles.search}
            />
          </View>
          <Pressable
            onPress={() => {
              setPeriodOpen(value => !value);
              setCustomOpen(false);
              setDateError(null);
            }}
            accessibilityRole="button"
            accessibilityLabel={'Muddatni tanlash. Hozir: ' + periodLabel}
            accessibilityState={{expanded: periodOpen}}
            style={[styles.periodTrigger, periodOpen && styles.periodTriggerOpen]}
          >
            <Text style={styles.periodTriggerText}>{periodLabel === 'Barchasi' ? 'Muddat' : periodLabel}</Text>
            <AppIcon name="chevron-down" color={ledger.dark} size={14}/>
          </Pressable>
        </View>
        {periodOpen && (
          <View style={styles.periodPanel}>
            <Text style={styles.panelLabel}>OPERATSIYA SANASI</Text>
            <View style={styles.periodOptions}>
              {PERIOD_OPTIONS.map(option => {
                const selected = customOpen
                  ? option.key === 'custom'
                  : period === option.key;
                return (
                  <Pressable
                    key={option.key}
                    accessibilityRole="button"
                    accessibilityLabel={'Muddat: ' + option.label}
                    accessibilityState={{selected}}
                    onPress={() => choosePeriod(option.key)}
                    style={[styles.option, selected && styles.optionActive]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {customOpen && (
              <View style={styles.customPanel}>
                <Text style={styles.inputLabel}>Sana oralig‘i</Text>
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
                        style={styles.dateInput}
                      >
                        <AppIcon name="calendar" color={ledger.dark} size={16}/>
                        <Text style={styles.dateValue}>{field.value.slice(8, 10) + '.' + field.value.slice(5, 7) + '.' + field.value.slice(0, 4)}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
                {dateError && (
                  <Text accessibilityLiveRegion="polite" style={styles.error}>{dateError}</Text>
                )}
                <Pressable
                  onPress={applyRange}
                  accessibilityRole="button"
                  accessibilityLabel="Tanlangan sana oralig‘ini qo‘llash"
                  style={styles.applyButton}
                >
                  <Text style={styles.applyText}>Oraliqni qo‘llash</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
        <View style={styles.typeRow} accessibilityRole="radiogroup">
          {TYPES.map(option => {
            const selected = type === option.key;
            return (
              <Pressable
                key={option.key}
                accessibilityRole="radio"
                accessibilityState={{selected, checked: selected}}
                accessibilityLabel={option.label}
                onPress={() => setType(option.key)}
                style={[styles.typeOption, selected && styles.typeSelected]}
              >
                <Text style={[styles.typeText, selected && styles.typeTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.summary, compact && styles.summaryCompact]}>
          <Text style={styles.summaryOverline}>KO‘RINAYOTGAN YOZUVLAR BO‘YICHA</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryColumn}>
              <Text style={styles.summaryLabel}>Kirim</Text>
              <Text style={styles.summaryValue}>{formatMoney(income)}</Text>
            </View>
            <View style={styles.summaryDivider}/>
            <View style={styles.summaryColumn}>
              <Text style={styles.summaryLabel}>Chiqim</Text>
              <Text style={styles.summaryValue}>{formatMoney(expense)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.results}>
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsTitle}>{visible.length} ta operatsiya topildi</Text>
            <Text style={styles.resultsSub}>Ma’lumotlar sessiya yozuvlaridan</Text>
          </View>
          {hasFilters && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filtrlarni tozalash"
              onPress={resetFilters}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>Tozalash</Text>
            </Pressable>
          )}
        </View>

        {visible.length === 0 ? (
          <View style={styles.emptyState}>
            <AppIcon name="receipt" color={ledger.dark} size={25}/>
            <Text style={styles.emptyTitle}>
              {hasFilters ? 'Mos operatsiya topilmadi' : 'Operatsiyalar hali yo‘q'}
            </Text>
            <Text style={styles.emptyCaption}>
              {hasFilters
                ? 'Qidiruv, tur yoki davrni o‘zgartiring.'
                : 'Birinchi kirim yoki chiqimni qo‘shing.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hasFilters ? 'Filtrlarni tozalash' : 'Yangi operatsiya qo‘shish'}
              onPress={hasFilters ? resetFilters : onAdd}
              style={styles.emptyAction}
            >
              <Text style={styles.emptyActionText}>
                {hasFilters ? 'Filtrlarni tozalash' : 'Operatsiya qo‘shish'}
              </Text>
            </Pressable>
          </View>
        ) : groups.map(group => (
          <View key={group.date} style={styles.group}>
            <View style={styles.groupTitle}>
              <Text style={styles.dayHeading}>{displayDay(group.date)}</Text>
              <Text style={styles.groupCount}>{group.rows.length} ta</Text>
            </View>
            <View style={styles.ledgerRows}>
              {group.rows.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => onEdit(item)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    item.title + ', ' +
                    (item.amount >= 0 ? 'daromad ' : 'xarajat ') +
                    formatMoney(Math.abs(item.amount)) + '. Tahrirlash'
                  }
                  style={({pressed}) => [styles.ledgerRow, pressed && styles.rowPressed]}
                >
                  <LedgerTransactionRow item={item}/>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          Bu ilova demo rejimida. Yozuvlar faqat joriy sessiyada saqlanadi;
          ilova qayta ishga tushirilganda boshlang‘ich namuna tiklanadi.
        </Text>
      </ScrollView>

      {calendarTarget !== null && (
        <LedgerDateCalendar
          selectedDate={calendarTarget === 'start' ? customStart : customEnd}
          onSelect={date => {
            if (calendarTarget === 'start') setCustomStart(date);
            else setCustomEnd(date);
            setDateError(null);
            setCalendarTarget(null);
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
  content: {paddingHorizontal: 20, paddingTop: 15, paddingBottom: 34, gap: 16},
  compactContent: {paddingTop: 10, gap: 11},
  topLine: {flexDirection: 'row', alignItems: 'center', gap: 8},
  headingCopy: {flex: 1, gap: 6},
  eyebrow: {color: ledger.dark, letterSpacing: 1.15, fontSize: 11, fontWeight: '800'},
  title: {color: ledger.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.8},
  compactTitle: {fontSize: 28},
  description: {color: ledger.subtext, fontSize: 13},
  countPill: {paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, backgroundColor: ledger.paleSage},
  countText: {color: ledger.dark, fontSize: 13, fontWeight: '700'},
  primaryButton: {backgroundColor: ledger.coral, minHeight: 63, borderRadius: 16, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 11},
  primaryCompact: {minHeight: 58},
  pressed: {opacity: 0.74},
  primaryIcon: {width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.53)', alignItems: 'center', justifyContent: 'center'},
  primaryCopy: {flex: 1, gap: 3},
  primaryText: {color: ledger.ink, fontSize: 16, fontWeight: '800'},
  primaryCaption: {color: ledger.ink, fontSize: 12},
  searchRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  searchWrap: {
    flex: 1, minWidth: 0, minHeight: 49, borderRadius: 13,
    borderWidth: 1, borderColor: ledger.rule, backgroundColor: ledger.surface,
    paddingHorizontal: 10, alignItems: 'center', flexDirection: 'row', gap: 7,
  },
  search: {flex: 1, minWidth: 0, height: 48, color: ledger.ink, fontSize: 14, paddingVertical: 6},
  periodTrigger: {
    minHeight: 49, minWidth: 92, maxWidth: 112, borderRadius: 13,
    backgroundColor: ledger.paleSage, borderWidth: 1, borderColor: ledger.paleSage,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 8, gap: 6,
  },
  periodTriggerOpen: {borderColor: ledger.dark},
  periodTriggerText: {color: ledger.dark, fontSize: 13, fontWeight: '800', flexShrink: 1},
  periodPanel: {backgroundColor: ledger.surface, borderWidth: 1, borderColor: ledger.rule, borderRadius: 15, padding: 12, gap: 13},
  panelLabel: {fontSize: 11, fontWeight: '800', color: ledger.subtext, letterSpacing: 1},
  periodOptions: {flexDirection: 'row', flexWrap: 'wrap', gap: 7},
  option: {minHeight: 44, borderRadius: 12, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: ledger.paleSage},
  optionActive: {backgroundColor: ledger.dark},
  optionText: {fontSize: 13, color: ledger.ink, fontWeight: '700'},
  optionTextActive: {color: '#FFFFFF'},
  customPanel: {gap: 11, borderTopWidth: 1, borderTopColor: ledger.rule, paddingTop: 12},
  inputLabel: {color: ledger.ink, fontSize: 15, fontWeight: '800'},
  dateRow: {flexDirection: 'row', gap: 8},
  dateColumn: {flex: 1, minWidth: 0, gap: 6},
  dateLabel: {fontSize: 12, color: ledger.subtext, fontWeight: '700'},
  dateInput: {
    minHeight: 47, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: ledger.paper, borderRadius: 11, borderWidth: 1, borderColor: ledger.rule,
  },
  dateValue: {fontSize: 12, fontWeight: '700', color: ledger.ink, flexShrink: 1},
  error: {fontSize: 13, lineHeight: 19, fontWeight: '700', color: '#9C2738'},
  applyButton: {minHeight: 48, backgroundColor: ledger.dark, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  applyText: {fontWeight: '800', fontSize: 14, color: '#FFFFFF'},
  typeRow: {flexDirection: 'row', backgroundColor: ledger.paleSage, borderRadius: 14, padding: 4, gap: 5},
  typeOption: {flex: 1, minHeight: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center'},
  typeSelected: {backgroundColor: ledger.dark},
  typeText: {fontSize: 14, fontWeight: '700', color: ledger.ink},
  typeTextSelected: {color: '#FFFFFF'},
  summary: {borderTopWidth: 1, borderBottomWidth: 1, borderColor: ledger.rule, paddingVertical: 17, gap: 12},
  summaryOverline: {color: ledger.subtext, fontSize: 11, fontWeight: '800', letterSpacing: 0.8},
  summaryCompact: {paddingVertical: 12, gap: 10},
  summaryRow: {flexDirection: 'row', alignItems: 'stretch', gap: 10},
  summaryColumn: {flex: 1, minWidth: 0, gap: 8},
  summaryDivider: {width: 1, backgroundColor: ledger.rule},
  summaryLabel: {color: ledger.subtext, fontSize: 13, fontWeight: '600'},
  summaryValue: {fontSize: 17, fontWeight: '800', color: ledger.ink, lineHeight: 23, flexWrap: 'wrap'},
  results: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 9},
  resultsInfo: {flex: 1, gap: 4},
  resultsTitle: {color: ledger.ink, fontWeight: '800', fontSize: 16},
  resultsSub: {color: ledger.subtext, fontSize: 12},
  clearButton: {paddingHorizontal: 12, minHeight: 44, alignItems: 'center', justifyContent: 'center'},
  clearText: {color: ledger.dark, fontWeight: '800', fontSize: 13},
  group: {gap: 7},
  groupTitle: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  dayHeading: {fontSize: 14, fontWeight: '800', color: ledger.dark},
  groupCount: {fontSize: 12, fontWeight: '600', color: ledger.subtext},
  ledgerRows: {gap: 0},
  ledgerRow: {minHeight: 66},
  rowPressed: {opacity: 0.67},
  emptyState: {padding: 20, backgroundColor: ledger.paleSage, borderRadius: 15, gap: 9, alignItems: 'flex-start'},
  emptyTitle: {fontSize: 17, fontWeight: '800', color: ledger.ink},
  emptyCaption: {fontSize: 14, color: ledger.subtext, lineHeight: 20},
  emptyAction: {minHeight: 44, alignItems: 'center', justifyContent: 'center'},
  emptyActionText: {fontSize: 14, fontWeight: '800', color: ledger.dark},
  footer: {fontSize: 12, lineHeight: 18, color: ledger.subtext, paddingBottom: 6},
});
