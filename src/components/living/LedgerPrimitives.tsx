import {StyleSheet, Text, View} from 'react-native';
import {AppIcon} from '../AppIcon';
import {type Transaction, formatMoney} from '../../data/demo';
import {ledger} from '../../theme/livingLedger';

/** Exposes visible financial provenance; the meaning is not color alone. */
export function SourceTag({label}: {label: string}) {
  return <View style={styles.tag}><Text style={styles.tagText}>{label}</Text></View>;
}

/** Illustrative normalized series. Its 9 bars DO NOT encode days or currency. */
export function LedgerMiniBars({
  values, description,
}: {values: readonly number[]; description: string}) {
  if (values.length === 0) {
    return <Text style={styles.empty}>Grafik uchun namuna nuqtalari yo‘q</Text>;
  }
  const safe = values.map(value =>
    Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
  );
  const maxIndex = safe.indexOf(Math.max(...safe));
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={description}
      style={styles.bars}
      testID="living-ledger-chart"
    >
      {safe.map((value, index) => (
        <View key={index} style={styles.barSlot} accessible={false}>
          <View
            style={[
              styles.bar,
              {height: 9 + Math.round(59 * value)},
              index === maxIndex && styles.activeBar,
            ]}
          />
        </View>
      ))}
    </View>
  );
}

/** Responsive two-part ledger row. No color-only positive/negative signal. */
export function LedgerTransactionRow({item}: {item: Transaction}) {
  // Always use the immutable ISO date; seeded "Bugun/Kecha" labels go stale.
  const stableDate = item.occurredOn.slice(8, 10) + '.' +
    item.occurredOn.slice(5, 7) + '.' + item.occurredOn.slice(0, 4);
  return (
    <View style={styles.transactionRow}>
      <View style={styles.transactionIcon}>
        <AppIcon name={item.icon} size={19} color={ledger.dark}/>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{stableDate}</Text>
      </View>
      <Text
        style={styles.transactionAmount}
        accessibilityLabel={(item.amount > 0 ? 'Daromad: ' : 'Xarajat: ') +
          formatMoney(Math.abs(item.amount))}
      >
        {item.amount > 0 ? '+' : '−'}{formatMoney(Math.abs(item.amount))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: ledger.badge, borderRadius: 999,
  },
  tagText: {color: ledger.badgeText, fontSize: 12, fontWeight: '700'},
  bars: {
    height: 86, flexDirection: 'row', alignItems: 'flex-end',
    gap: 7, paddingTop: 9, borderBottomWidth: 1,
    borderBottomColor: ledger.rule,
  },
  barSlot: {flex: 1, alignItems: 'stretch', justifyContent: 'flex-end'},
  bar: {
    minHeight: 8, backgroundColor: ledger.barFaint,
    borderTopLeftRadius: 4, borderTopRightRadius: 4,
  },
  activeBar: {backgroundColor: ledger.chartActive},
  empty: {color: ledger.subtext, fontSize: 14, paddingVertical: 14},
  transactionRow: {
    minHeight: 66, flexDirection: 'row', alignItems: 'center',
    paddingVertical: 9, gap: 10,
    borderBottomColor: ledger.rule, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  transactionIcon: {
    height: 42, width: 42, borderRadius: 14, backgroundColor: ledger.paleSage,
    alignItems: 'center', justifyContent: 'center',
  },
  transactionInfo: {flex: 1, minWidth: 0, gap: 4},
  transactionTitle: {color: ledger.ink, fontWeight: '700', fontSize: 15},
  transactionDate: {color: ledger.subtext, fontSize: 13},
  transactionAmount: {
    color: ledger.ink, fontSize: 14, fontWeight: '700',
    textAlign: 'right', flexShrink: 1, maxWidth: '46%',
  },
});
