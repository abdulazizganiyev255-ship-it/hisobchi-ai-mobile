import {useState} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppIcon} from './AppIcon';
import {
  buildCalendarCells, calendarMonthTitle, canNavigateMonth,
  currentCalendarMonth, isSelectableCalendarDate, monthOffset,
} from '../data/calendar';
import {todayLocal} from '../data/transactions';
import {colors, layout, radius, semantic, typography} from '../theme/tokens';

type Props = {
  selectedDate: string;
  onSelect: (iso: string) => void;
  onCancel: () => void;
};

const WEEK_DAYS = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];

export function DateCalendar({selectedDate, onSelect, onCancel}: Props) {
  const today = todayLocal();
  const initial = isSelectableCalendarDate(selectedDate, today) ? selectedDate : today;
  const [monthId, setMonthId] = useState(() => currentCalendarMonth(initial));
  const cells = buildCalendarCells(monthId, today);
  const canPrev = canNavigateMonth(monthId, -1, today);
  const canNext = canNavigateMonth(monthId, 1, today);

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.heading}>
            <View style={styles.titleCopy}>
              <Text accessibilityRole="header" style={styles.title}>Sanani tanlang</Text>
              <Text style={styles.subtitle}>2000-yildan bugungacha · kelajak sanasi yopiq</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kalendarni yopish"
              onPress={onCancel}
              style={styles.close}
            >
              <Text style={styles.closeLabel}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.monthRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Oldingi oy"
              accessibilityState={{disabled: !canPrev}}
              disabled={!canPrev}
              onPress={() => setMonthId(value => monthOffset(value, -1))}
              style={[styles.monthButton, !canPrev && styles.disabled]}
            >
              <Text style={styles.monthArrow}>‹</Text>
            </Pressable>
            <Text style={styles.monthTitle}>{calendarMonthTitle(monthId)}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Keyingi oy"
              accessibilityState={{disabled: !canNext}}
              disabled={!canNext}
              onPress={() => setMonthId(value => monthOffset(value, 1))}
              style={[styles.monthButton, !canNext && styles.disabled]}
            >
              <Text style={styles.monthArrow}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {WEEK_DAYS.map(day => <Text key={day} style={styles.weekLabel}>{day}</Text>)}
          </View>
          <View style={styles.days}>
            {cells.map(cell => {
              const selected = cell.enabled && selectedDate === cell.iso;
              const isToday = cell.iso === today;
              return (
                <View key={cell.iso} style={styles.dayColumn}>
                  {cell.currentMonth ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={cell.iso + (isToday ? ', bugun' : '')}
                      accessibilityState={{selected, disabled: !cell.enabled}}
                      disabled={!cell.enabled}
                      onPress={() => onSelect(cell.iso)}
                      style={[
                        styles.day,
                        selected && styles.selectedDay,
                        isToday && !selected && styles.todayDay,
                        !cell.enabled && styles.disabled,
                      ]}
                    >
                      <Text style={[styles.dayLabel, selected && styles.selectedLabel]}>
                        {cell.day}
                      </Text>
                    </Pressable>
                  ) : <View style={styles.day}/>}
                </View>
              );
            })}
          </View>

          <View style={styles.bottomActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sana tanlashni bekor qilish"
              onPress={onCancel}
              style={styles.cancel}
            >
              <Text style={styles.cancelText}>Bekor qilish</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Bugungi sanani tanlash"
              onPress={() => onSelect(today)}
              style={styles.todayButton}
            >
              <AppIcon name="check" color={colors.ink} size={16}/>
              <Text style={styles.todayButtonText}>Bugun</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,10,21,0.76)', justifyContent: 'center',
    alignItems: 'center', paddingHorizontal: 8, paddingVertical: 20,
  },
  sheet: {
    width: '100%', maxWidth: 410, backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: semantic.strongBorder, padding: 12, gap: 15,
    shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  heading: {flexDirection: 'row', alignItems: 'center', gap: 8},
  titleCopy: {flex: 1, minWidth: 0, gap: 4},
  title: {fontSize: typography.size.section, fontWeight: '800', color: colors.text},
  subtitle: {fontSize: typography.size.caption, color: colors.muted, lineHeight: 17},
  close: {
    width: layout.touchTarget, height: layout.touchTarget, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised,
  },
  closeLabel: {fontSize: 19, fontWeight: '700', color: colors.primarySoft},
  monthRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  monthButton: {
    height: layout.touchTarget, width: layout.touchTarget, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised,
  },
  monthArrow: {fontSize: 26, color: colors.primarySoft, fontWeight: '700'},
  monthTitle: {color: colors.text, fontSize: typography.size.body, fontWeight: '800'},
  disabled: {opacity: 0.28},
  weekRow: {flexDirection: 'row', justifyContent: 'space-between'},
  weekLabel: {
    flex: 1, textAlign: 'center', color: colors.muted,
    fontSize: typography.size.caption, fontWeight: '700',
  },
  days: {flexDirection: 'row', flexWrap: 'wrap'},
  dayColumn: {width: '14.285714%', alignItems: 'center', justifyContent: 'center'},
  day: {
    minHeight: layout.touchTarget, width: '100%', maxWidth: 46,
    borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
  },
  dayLabel: {fontSize: typography.size.label, color: colors.text, fontWeight: '600'},
  selectedDay: {backgroundColor: colors.primary},
  selectedLabel: {color: colors.ink, fontWeight: '800'},
  todayDay: {borderWidth: 1, borderColor: colors.primary},
  bottomActions: {flexDirection: 'row', gap: 10, marginTop: 2},
  cancel: {
    minHeight: layout.touchTarget, flex: 1, borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center',
  },
  cancelText: {color: colors.text, fontSize: typography.size.label, fontWeight: '700'},
  todayButton: {
    minHeight: layout.touchTarget, flex: 1, borderRadius: radius.sm,
    backgroundColor: colors.primarySoft, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 7,
  },
  todayButtonText: {color: colors.ink, fontWeight: '800', fontSize: typography.size.label},
});
