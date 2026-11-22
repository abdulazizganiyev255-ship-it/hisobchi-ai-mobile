import {useState} from 'react';
import {
  Modal, Pressable, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import {AppIcon} from '../AppIcon';
import {
  buildCalendarCells, calendarMonthTitle, canNavigateMonth,
  currentCalendarMonth, isSelectableCalendarDate, monthOffset,
} from '../../data/calendar';
import {todayLocal} from '../../data/transactions';
import {ledger} from '../../theme/livingLedger';

type Props = {
  selectedDate: string;
  onSelect: (iso: string) => void;
  onCancel: () => void;
};

const DAYS = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];

/** Existing deterministic calendar rules with an accessible Living Ledger skin. */
export function LedgerDateCalendar({selectedDate, onSelect, onCancel}: Props) {
  const today = todayLocal();
  const initial = isSelectableCalendarDate(selectedDate, today) ? selectedDate : today;
  const [monthId, setMonthId] = useState(() => currentCalendarMonth(initial));
  const {width, height} = useWindowDimensions();
  const narrow = width < 350;
  const short = height < 670;
  const cells = buildCalendarCells(monthId, today);
  const canPrev = canNavigateMonth(monthId, -1, today);
  const canNext = canNavigateMonth(monthId, 1, today);

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      accessibilityViewIsModal
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          testID="ledger-calendar-sheet"
          style={[styles.sheet, narrow && styles.sheetNarrow, short && styles.sheetShort]}
        >
          <View style={styles.heading}>
            <View style={styles.headingCopy}>
              <Text accessibilityRole="header" style={styles.title}>Sanani tanlang</Text>
              <Text style={styles.subtitle}>2000-yildan bugungacha · kelajak sanasi yopiq</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kalendarni yopish"
              onPress={onCancel}
              style={styles.close}
            >
              <Text style={styles.closeText}>✕</Text>
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
            {DAYS.map(day =>
              <Text key={day} style={styles.weekText}>{day}</Text>
            )}
          </View>
          <View style={styles.days}>
            {cells.map(cell => {
              const selected = cell.enabled && cell.iso === selectedDate;
              const todayCell = cell.iso === today;
              return (
                <View key={cell.iso} style={styles.dayColumn}>
                  {cell.currentMonth ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={cell.iso + (todayCell ? ', bugun' : '')}
                      accessibilityState={{selected, disabled: !cell.enabled}}
                      disabled={!cell.enabled}
                      onPress={() => onSelect(cell.iso)}
                      style={[
                        styles.day,
                        selected && styles.selectedDay,
                        todayCell && !selected && styles.todayDay,
                        !cell.enabled && styles.disabled,
                      ]}
                    >
                      <Text style={[styles.dayText, selected && styles.selectedText]}>
                        {cell.day}
                      </Text>
                    </Pressable>
                  ) : <View style={styles.day}/>}
                </View>
              );
            })}
          </View>
          <View style={styles.bottom}>
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
              style={styles.today}
            >
              <AppIcon name="check" color="#FFFFFF" size={17}/>
              <Text style={styles.todayText}>Bugun</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(8,24,18,0.68)', paddingHorizontal: 8,
  },
  sheet: {
    backgroundColor: ledger.paper, borderRadius: 23, padding: 12,
    width: '100%', maxWidth: 418, gap: 13,
    shadowColor: '#000000', shadowOpacity: 0.15, shadowRadius: 18,
    elevation: 8,
  },
  sheetNarrow: {paddingHorizontal: 4, borderRadius: 16},
  sheetShort: {gap: 8},
  heading: {paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', gap: 10},
  headingCopy: {flex: 1, gap: 4},
  title: {fontSize: 21, fontWeight: '800', color: ledger.ink},
  subtitle: {fontSize: 12, lineHeight: 17, color: ledger.subtext},
  close: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: ledger.paleSage,
    justifyContent: 'center', alignItems: 'center',
  },
  closeText: {fontSize: 20, fontWeight: '700', color: ledger.dark},
  monthRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  monthButton: {
    minHeight: 44, minWidth: 44, borderRadius: 13, alignItems: 'center',
    justifyContent: 'center', backgroundColor: ledger.paleSage,
  },
  monthArrow: {color: ledger.dark, fontSize: 26, fontWeight: '700'},
  monthTitle: {fontSize: 16, fontWeight: '800', color: ledger.ink},
  weekRow: {flexDirection: 'row', alignItems: 'center'},
  weekText: {flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: ledger.subtext},
  days: {flexDirection: 'row', flexWrap: 'wrap'},
  dayColumn: {width: '14.285714%', alignItems: 'stretch', justifyContent: 'center'},
  day: {
    width: '100%', minHeight: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  todayDay: {borderColor: ledger.dark, borderWidth: 1},
  selectedDay: {backgroundColor: ledger.dark},
  dayText: {color: ledger.ink, fontSize: 14, fontWeight: '600'},
  selectedText: {color: '#FFFFFF', fontWeight: '800'},
  disabled: {opacity: 0.3},
  bottom: {flexDirection: 'row', gap: 9, paddingHorizontal: 5},
  cancel: {
    flex: 1, minHeight: 48, backgroundColor: ledger.paleSage,
    borderRadius: 13, alignItems: 'center', justifyContent: 'center',
  },
  cancelText: {color: ledger.dark, fontSize: 14, fontWeight: '700'},
  today: {
    flex: 1, minHeight: 48, backgroundColor: ledger.dark,
    borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    gap: 6, flexDirection: 'row',
  },
  todayText: {color: '#FFFFFF', fontSize: 14, fontWeight: '800'},
});
