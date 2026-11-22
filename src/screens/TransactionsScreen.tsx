import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon} from '../components/AppIcon';
import {TransactionRow} from '../components/TransactionRow';
import {Transaction, formatMoney} from '../data/demo';
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
  const filtered = filterAndSortTransactions(transactions, filter, search);
  const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum - t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const groups: {day: string; items: Transaction[]}[] = [];
  for (const item of filtered) {
    const last = groups[groups.length - 1];
    if (last && last.day === item.occurredOn) last.items.push(item);
    else groups.push({day: item.occurredOn, items: [item]});
  }

  return (
    <ScrollView
      style={styles.fill}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.icon}><AppIcon name="receipt" color={colors.primary} size={24}/></View>
        <View style={styles.heading}>
          <Text style={styles.title}>Operatsiyalar</Text>
          <Text style={styles.caption}>Demo sessiya · {transactions.length} ta yozuv</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>Xarajatlar · demo</Text>
          <Text style={styles.summaryExpense} numberOfLines={1} adjustsFontSizeToFit>
            {formatMoney(expenses)}
          </Text>
        </View>
        <View style={styles.summaryDivider}/>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>Daromadlar · demo</Text>
          <Text style={styles.summaryIncome} numberOfLines={1} adjustsFontSizeToFit>
            {formatMoney(income)}
          </Text>
        </View>
      </View>

      <Pressable onPress={onAdd} accessibilityRole="button" accessibilityLabel="Yangi operatsiya qo‘shish">
        <LinearGradient
          colors={['#A1E9FF','#4DBFEF']}
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          style={styles.cta}
        >
          <AppIcon name="plus" color={colors.ink} size={22} strokeWidth={2.5}/>
          <Text style={styles.ctaLabel}>Operatsiya qo‘shish</Text>
        </LinearGradient>
      </Pressable>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Kategoriya yoki izoh bo‘yicha qidirish"
        placeholderTextColor={colors.faint}
        accessibilityLabel="Operatsiyalarni qidirish"
        autoCapitalize="none"
        style={styles.search}
      />

      <View style={styles.filters}>
        {FILTERS.map(option => {
          const selected = filter === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => setFilter(option.key)}
              accessibilityRole="button"
              accessibilityState={{selected}}
              style={[styles.filter, selected && styles.filterActive]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><AppIcon name="receipt" size={27} color={colors.primarySoft}/></View>
          <Text style={styles.emptyTitle}>Operatsiya topilmadi</Text>
          <Text style={styles.emptyBody}>
            {transactions.length
              ? 'Filtrni yoki qidiruv matnini o‘zgartiring.'
              : 'Birinchi demo operatsiyani qo‘shishdan boshlang.'}
          </Text>
          {(search || filter !== 'all') && (
            <Pressable onPress={() => {setSearch(''); setFilter('all');}} style={styles.clear}>
              <Text style={styles.clearText}>Filtrni tozalash</Text>
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
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  content: {padding: 20, paddingTop: 21, paddingBottom: 45, gap: 14},
  header: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 3},
  icon: {width: 48, height: 48, borderRadius: 15, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  heading: {flex: 1},
  title: {fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.6},
  caption: {color: colors.muted, fontSize: 11, marginTop: 3},
  summary: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider, borderRadius: radius.lg, minHeight: 96, padding: 15, flexDirection: 'row', alignItems: 'center'},
  summaryColumn: {flex: 1, minWidth: 0, gap: 7},
  summaryLabel: {fontSize: 10, fontWeight: '600', color: colors.muted},
  summaryExpense: {fontSize: 16, fontWeight: '800', color: '#FFB2B2'},
  summaryIncome: {fontSize: 16, fontWeight: '800', color: '#6BE4BE'},
  summaryDivider: {height: 44, width: 1, backgroundColor: colors.divider, marginHorizontal: 14},
  cta: {minHeight: 51, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8},
  ctaLabel: {fontSize: 14, fontWeight: '800', color: colors.ink},
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
