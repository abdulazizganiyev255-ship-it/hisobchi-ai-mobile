import type {ReactNode} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AppIcon, type IconName} from '../components/AppIcon';
import {T} from './theme';
import type {Transaction} from '../data/demo';
import {formatMoney} from '../data/demo';

export function Eyebrow({children, light = false}: {children: ReactNode; light?: boolean}) {
  return <Text style={[s.eyebrow, light && {color: '#B4C3ED'}]}>{children}</Text>;
}

export function SectionHead({title, note, action, onAction}: {
  title: string; note?: string; action?: string; onAction?: () => void;
}) {
  return (
    <View style={s.sectionHead}>
      <View style={{flex: 1, minWidth: 0}}>
        {note ? <Eyebrow>{note}</Eyebrow> : null}
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {action && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction}
          style={s.actionLink} accessibilityLabel={action}>
          <Text style={s.actionLinkText}>{action}</Text>
          <AppIcon name="chevron" size={17} color={T.cobalt}/>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ActionButton({title, subtitle, onPress, icon = 'plus', secondary = false, testID}: {
  title: string; subtitle?: string; onPress: () => void; icon?: IconName;
  secondary?: boolean; testID?: string;
}) {
  return (
    <Pressable
      testID={testID} accessibilityRole="button" accessibilityLabel={title}
      onPress={onPress}
      style={({pressed}) => [
        s.actionButton, secondary ? s.actionSecondary : s.actionPrimary,
        pressed && {opacity: 0.83},
      ]}
    >
      <View style={[s.actionGlyph, secondary && s.actionGlyphSecondary]}>
        <AppIcon name={icon} size={18} color={secondary ? T.cobalt : T.white}/>
      </View>
      <View style={{flex: 1, gap: 3, minWidth: 0}}>
        <Text style={[s.actionTitle, secondary && {color: T.ink}]}>{title}</Text>
        {subtitle ? <Text style={[s.actionSub, secondary && {color: T.muted}]}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

export function FilterPill({title, active, onPress, testID}: {
  title: string; active: boolean; onPress: () => void; testID?: string;
}) {
  return (
    <Pressable testID={testID} accessibilityRole="button"
      accessibilityState={{selected: active}} accessibilityLabel={title}
      onPress={onPress} style={[s.filter, active && s.filterActive]}>
      <Text style={[s.filterText, active && s.filterTextActive]}>{title}</Text>
    </Pressable>
  );
}

export function TransactionLine({item, onPress}: {
  item: Transaction; onPress: () => void;
}) {
  const plus = item.amount > 0;
  const day = item.occurredOn.slice(8, 10) + '.' + item.occurredOn.slice(5, 7);
  return (
    <Pressable testID={'reboot-item-' + item.id} onPress={onPress} accessibilityRole="button"
      accessibilityLabel={item.title + ', ' + (plus ? 'kirim ' : 'xarajat ') + formatMoney(Math.abs(item.amount)) + ', ' + day}
      style={({pressed}) => [s.transaction, pressed && {backgroundColor: T.cobaltWash}]}>
      <View style={[s.transactionIcon, plus && s.transactionPlus]}>
        <AppIcon name={item.icon} color={plus ? T.positive : T.cobalt} size={19}/>
      </View>
      <View style={s.transactionInfo}>
        <Text style={s.transactionTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={s.transactionMeta}>{day} · {item.category}</Text>
      </View>
      <View style={{alignItems: 'flex-end', gap: 3, flexShrink: 1}}>
        <Text style={[s.transactionAmount, plus && {color: T.positive}]}>
          {plus ? '+' : '−'}{formatMoney(Math.abs(item.amount))}
        </Text>
        <Text style={s.transactionDetails}>TAHRIRLASH</Text>
      </View>
    </Pressable>
  );
}

export function SampleFlag() {
  return (
    <View style={s.sampleFlag} testID="reboot-demo-flag">
      <View style={s.sampleDot}/>
      <Text style={s.sampleText}>NAMUNA MA’LUMOTLAR · OFFLINE SESSIYA</Text>
    </View>
  );
}

export function Header({section = 'PUL NAZORATI', rightLabel = 'DEMO'}: {section?: string; rightLabel?: string}) {
  return (
    <View style={s.header}>
      <View style={s.brandRow}>
        <View style={s.mark}>
          <View style={s.markSmall}/>
          <View style={s.markLarge}/>
        </View>
        <View>
          <Text style={s.brandName}>hisobchi<Text style={s.brandPunct}>.</Text></Text>
          <Text style={s.brandDescriptor}>{section}</Text>
        </View>
      </View>
      <View style={s.status}><Text style={s.statusText}>{rightLabel}</Text></View>
    </View>
  );
}

const s = StyleSheet.create({
  eyebrow: {fontSize: 10, fontWeight: '800', letterSpacing: 1.45, color: T.muted},
  sectionHead: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 9, marginBottom: 12},
  sectionTitle: {fontSize: 21, fontWeight: '800', color: T.ink, letterSpacing: -0.75, marginTop: 6},
  actionLink: {minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 4},
  actionLinkText: {color: T.cobalt, fontWeight: '800', fontSize: 13},
  actionButton: {flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 58, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 8},
  actionPrimary: {backgroundColor: T.cobalt},
  actionSecondary: {backgroundColor: T.white, borderWidth: 1, borderColor: T.border},
  actionGlyph: {height: 38, width: 38, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 11, alignItems: 'center', justifyContent: 'center'},
  actionGlyphSecondary: {borderColor: T.border, backgroundColor: T.cobaltWash},
  actionTitle: {fontSize: 14, fontWeight: '800', color: T.white},
  actionSub: {fontSize: 10, fontWeight: '600', color: '#DFE6FF'},
  filter: {minHeight: 41, paddingHorizontal: 14, justifyContent: 'center', borderWidth: 1, borderColor: T.border, borderRadius: 11, backgroundColor: T.white},
  filterActive: {backgroundColor: T.ink, borderColor: T.ink},
  filterText: {fontSize: 12, fontWeight: '700', color: T.secondary},
  filterTextActive: {color: T.white},
  transaction: {flexDirection: 'row', minHeight: 74, gap: 10, alignItems: 'center', borderBottomColor: T.border, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 9},
  transactionIcon: {height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: T.cobaltWash},
  transactionPlus: {backgroundColor: T.softPositive},
  transactionInfo: {flex: 1, minWidth: 0, gap: 4},
  transactionTitle: {fontSize: 14, fontWeight: '800', color: T.ink},
  transactionMeta: {fontSize: 11, color: T.muted, fontWeight: '600'},
  transactionAmount: {fontSize: 12, fontWeight: '800', color: T.ink, textAlign: 'right'},
  transactionDetails: {fontSize: 8, fontWeight: '800', color: T.muted, letterSpacing: 0.9},
  sampleFlag: {flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, backgroundColor: T.cobaltWash, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 5},
  sampleDot: {width: 5, height: 5, borderRadius: 3, backgroundColor: T.cobalt},
  sampleText: {fontSize: 9, fontWeight: '800', letterSpacing: 0.5, color: T.cobaltDeep},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56},
  brandRow: {flexDirection: 'row', alignItems: 'center', gap: 9},
  mark: {width: 31, height: 37, flexDirection: 'row', gap: 4, alignItems: 'flex-end'},
  markSmall: {width: 10, height: 18, backgroundColor: T.cobalt, borderRadius: 3},
  markLarge: {width: 12, height: 31, backgroundColor: T.ink, borderRadius: 3},
  brandName: {fontSize: 23, fontWeight: '900', letterSpacing: -1.25, color: T.ink, includeFontPadding: false},
  brandPunct: {color: T.cobalt},
  brandDescriptor: {fontSize: 8, fontWeight: '800', letterSpacing: 1.45, color: T.muted, marginTop: 3},
  status: {borderWidth: 1, borderColor: T.border, borderRadius: 7, paddingHorizontal: 11, paddingVertical: 7},
  statusText: {fontSize: 10, fontWeight: '800', letterSpacing: 1.1, color: T.secondary},
});
