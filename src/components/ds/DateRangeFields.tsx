import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AppIcon} from '../AppIcon';
import {colors, layout, radius, typography} from '../../theme/tokens';

type Props = {
  start: string;
  end: string;
  onOpenStart: () => void;
  onOpenEnd: () => void;
};

/** Reusable accessible date range triggers for Transactions and Analytics. */
export function DateRangeFields({start, end, onOpenStart, onOpenEnd}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.label}>Boshlanish</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={'Boshlanish sanasi: ' + start + '. Kalendarni ochish'}
          onPress={onOpenStart}
          style={styles.trigger}
        >
          <AppIcon name="calendar" color={colors.primarySoft} size={17}/>
          <Text style={styles.date} numberOfLines={1} adjustsFontSizeToFit>{start}</Text>
        </Pressable>
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>Tugash</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={'Tugash sanasi: ' + end + '. Kalendarni ochish'}
          onPress={onOpenEnd}
          style={styles.trigger}
        >
          <AppIcon name="calendar" color={colors.primarySoft} size={17}/>
          <Text style={styles.date} numberOfLines={1} adjustsFontSizeToFit>{end}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 8},
  column: {flex: 1, minWidth: 0, gap: 7},
  label: {color: colors.muted, fontSize: typography.size.caption, fontWeight: '600'},
  trigger: {
    minHeight: layout.touchTarget + 2, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.surfaceRaised,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 9, gap: 6,
  },
  date: {fontSize: typography.size.caption, color: colors.text, fontWeight: '700', flexShrink: 1},
});
