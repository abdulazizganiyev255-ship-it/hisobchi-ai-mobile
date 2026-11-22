import {useRef, useState, type ElementRef} from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import {AppIcon} from '../components/AppIcon';
import {LedgerDateCalendar} from '../components/living/LedgerDateCalendar';
import {type Transaction} from '../data/demo';
import {
  CATEGORY_OPTIONS, type FormErrors, type TransactionDraft,
  type TransactionKind, toDraft, validateDraft, todayLocal,
} from '../data/transactions';
import {ledger} from '../theme/livingLedger';

type Props = {
  initial?: Transaction;
  onCancel: () => void;
  onSave: (draft: TransactionDraft) => void;
  onDelete: () => void;
};

/** A real session CRUD editor; it never claims cloud persistence. */
export function LedgerTransactionEditorScreen({initial, onCancel, onSave, onDelete}: Props) {
  const [draft, setDraft] = useState<TransactionDraft>(() => toDraft(initial));
  const [errors, setErrors] = useState<FormErrors>({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const scrollRef = useRef<ElementRef<typeof ScrollView>>(null);
  const saving = useRef(false);

  const change = <K extends keyof TransactionDraft>(key: K, value: TransactionDraft[K]) => {
    setDraft(previous => ({...previous, [key]: value}));
    setErrors(previous => ({...previous, [key]: undefined}));
  };
  const changeKind = (kind: TransactionKind) => {
    if (draft.kind === kind) return;
    setDraft(previous => ({
      ...previous, kind, category: CATEGORY_OPTIONS[kind][0].label,
    }));
    setErrors({});
  };
  const save = () => {
    if (saving.current) return;
    const validation = validateDraft(draft);
    setErrors(validation);
    if (Object.values(validation).some(Boolean)) {
      scrollRef.current?.scrollTo({y: 0, animated: true});
      return;
    }
    saving.current = true;
    try {
      onSave(draft);
    } finally {
      saving.current = false;
    }
  };

  const categories = CATEGORY_OPTIONS[draft.kind];
  const isExpense = draft.kind === 'expense';
  const saveLabel = initial ? 'O‘zgarishlarni saqlash' : 'Operatsiyani qo‘shish';

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        testID="ledger-editor-scroll"
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Operatsiyalar ro‘yxatiga qaytish"
            style={({pressed}) => [styles.backButton, pressed && styles.pressed]}
          >
            <AppIcon name="arrow-left" color={ledger.ink} size={21}/>
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>HISOBCHI · SESSIYA YOZUVI</Text>
            <Text accessibilityRole="header" style={styles.heading}>
              {initial ? 'Operatsiyani tahrirlash' : 'Yangi operatsiya'}
            </Text>
          </View>
        </View>

        <View style={styles.notice}>
          <AppIcon name="shield" color={ledger.dark} size={17}/>
          <Text style={styles.noticeText}>
            Namoyish rejimi · operatsiyalar serverga yuborilmaydi
          </Text>
        </View>

        <Text style={styles.groupLabel}>OPERATSIYA TURI</Text>
        <View style={styles.kindRow} accessibilityRole="radiogroup">
          {(['expense', 'income'] as const).map(kind => {
            const selected = draft.kind === kind;
            return (
              <Pressable
                key={kind}
                accessibilityRole="radio"
                accessibilityState={{selected, checked: selected}}
                accessibilityLabel={kind === 'expense' ? 'Xarajat operatsiyasi' : 'Daromad operatsiyasi'}
                onPress={() => changeKind(kind)}
                style={[styles.kindOption, selected && styles.kindActive]}
              >
                <Text style={[styles.kindText, selected && styles.kindTextActive]}>
                  {kind === 'expense' ? '− Xarajat' : '+ Daromad'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.moneyPanel}>
          <Text style={styles.moneyLabel}>
            {isExpense ? 'XARAJAT SUMMASI' : 'DAROMAD SUMMASI'}
          </Text>
          <View style={styles.moneyInputRow}>
            <TextInput
              testID="ledger-editor-amount"
              value={draft.amountText}
              onChangeText={value => change('amountText', value)}
              accessibilityLabel="Operatsiya summasi, so‘m"
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={ledger.subtext}
              maxLength={17}
              style={styles.moneyInput}
            />
            <Text style={styles.moneyUnit}>so‘m</Text>
          </View>
          <Text style={styles.fieldHint}>Faqat musbat, butun summa · 1 dan 999 999 999 999 gacha</Text>
          {errors.amountText && (
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>
              {errors.amountText}
            </Text>
          )}
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.fieldTitle}>Kategoriya</Text>
          <Text style={styles.fieldDescription}>Operatsiya nimaga tegishli?</Text>
          <View style={styles.categories}>
            {categories.map(option => {
              const selected = draft.category === option.label;
              return (
                <Pressable
                  key={option.label}
                  accessibilityRole="button"
                  accessibilityLabel={'Kategoriya: ' + option.label}
                  accessibilityState={{selected}}
                  onPress={() => change('category', option.label)}
                  style={({pressed}) => [
                    styles.category,
                    selected && styles.categoryActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.categoryIcon}>
                    <AppIcon name={option.icon} size={17} color={ledger.dark}/>
                  </View>
                  <Text style={[styles.categoryText, selected && styles.categoryTextActive]}>
                    {option.label}
                  </Text>
                  {selected && <AppIcon name="check" color={ledger.dark} size={17}/>}
                </Pressable>
              );
            })}
          </View>
          {errors.category && (
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.fieldTitle}>Sana</Text>
          <View style={styles.dateRow}>
            <Pressable
              testID="ledger-editor-calendar-trigger"
              accessibilityRole="button"
              accessibilityLabel={'Operatsiya sanasi: ' + draft.occurredOn + '. Kalendarni ochish'}
              accessibilityHint="Sanani taqvimdan tanlash"
              onPress={() => setCalendarOpen(true)}
              style={[styles.dateButton, errors.occurredOn && styles.invalidBorder]}
            >
              <AppIcon name="calendar" color={ledger.dark} size={19}/>
              <Text style={styles.dateText}>{draft.occurredOn.slice(8, 10) + '.' + draft.occurredOn.slice(5, 7) + '.' + draft.occurredOn.slice(0, 4)}</Text>
              <AppIcon name="chevron-down" color={ledger.dark} size={14}/>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sanani bugungi kunga o‘rnatish"
              onPress={() => change('occurredOn', todayLocal())}
              style={styles.todayShortcut}
            >
              <Text style={styles.todayLabel}>Bugun</Text>
            </Pressable>
          </View>
          <Text style={styles.fieldHint}>Sana ustiga bosing. Kelajak sanasi tanlanmaydi.</Text>
          {errors.occurredOn && (
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>
              {errors.occurredOn}
            </Text>
          )}
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.fieldTitle}>Izoh <Text style={styles.optional}>(ixtiyoriy)</Text></Text>
          <TextInput
            value={draft.note}
            onChangeText={value => change('note', value)}
            placeholder="Masalan: do‘kondan xarid"
            placeholderTextColor={ledger.subtext}
            multiline
            maxLength={180}
            accessibilityLabel="Operatsiyaga izoh"
            style={styles.noteInput}
          />
        </View>

        <Pressable
          testID="ledger-editor-save"
          accessibilityRole="button"
          accessibilityLabel={saveLabel}
          onPress={save}
          style={({pressed}) => [styles.saveButton, pressed && styles.pressed]}
        >
          <AppIcon name="check" color="#FFFFFF" size={21}/>
          <Text style={styles.saveText}>{saveLabel}</Text>
        </Pressable>
        {Object.values(errors).some(Boolean) && (
          <Text accessibilityLiveRegion="polite" style={styles.feedback}>
            Ma’lumotlarni tekshiring. Xatolar tegishli maydonlarda ko‘rsatilgan.
          </Text>
        )}

        {initial && (
          <View style={styles.deleteZone}>
            {!confirmDelete ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Operatsiyani o‘chirishni tasdiqlash oynasini ochish"
                onPress={() => setConfirmDelete(true)}
                style={styles.deleteTrigger}
              >
                <Text style={styles.deleteText}>Operatsiyani o‘chirish</Text>
              </Pressable>
            ) : (
              <View style={styles.confirmPanel}>
                <Text accessibilityRole="header" style={styles.confirmTitle}>Rostdan o‘chirasizmi?</Text>
                <Text style={styles.confirmBody}>Ushbu operatsiya demo sessiyadan olib tashlanadi.</Text>
                <View style={styles.confirmActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="O‘chirishni bekor qilish"
                    onPress={() => setConfirmDelete(false)}
                    style={styles.confirmCancel}
                  >
                    <Text style={styles.confirmCancelText}>Bekor qilish</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Operatsiyani butunlay o‘chirish"
                    onPress={onDelete}
                    style={styles.confirmDelete}
                  >
                    <Text style={styles.confirmDeleteText}>Ha, o‘chirish</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}
        <Text style={styles.disclaimer}>
          O‘zgarishlar faqat ushbu sessiyada saqlanadi; qayta ishga tushirilganda demo yozuvlar tiklanadi.
        </Text>
      </ScrollView>

      {calendarOpen && (
        <LedgerDateCalendar
          selectedDate={draft.occurredOn}
          onSelect={date => {
            change('occurredOn', date);
            setCalendarOpen(false);
          }}
          onCancel={() => setCalendarOpen(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: ledger.paper},
  scroll: {flex: 1},
  content: {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 15},
  header: {flexDirection: 'row', alignItems: 'center', gap: 12},
  backButton: {
    height: 46, width: 46, borderWidth: 1, borderColor: ledger.rule,
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
  },
  pressed: {opacity: 0.7},
  headerCopy: {flex: 1, gap: 5},
  eyebrow: {fontSize: 11, fontWeight: '800', letterSpacing: 1, color: ledger.subtext},
  heading: {fontSize: 23, fontWeight: '800', letterSpacing: -0.5, color: ledger.ink},
  notice: {
    backgroundColor: ledger.paleSage, padding: 12, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  noticeText: {color: ledger.dark, fontSize: 13, lineHeight: 18, flex: 1, fontWeight: '600'},
  groupLabel: {fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: ledger.subtext, marginTop: 3},
  kindRow: {flexDirection: 'row', backgroundColor: ledger.paleSage, borderRadius: 14, gap: 5, padding: 4},
  kindOption: {flex: 1, minHeight: 48, borderRadius: 11, justifyContent: 'center', alignItems: 'center'},
  kindActive: {backgroundColor: ledger.dark},
  kindText: {fontSize: 15, fontWeight: '800', color: ledger.ink},
  kindTextActive: {color: '#FFFFFF'},
  moneyPanel: {
    padding: 17, borderWidth: 1, borderColor: ledger.rule, borderRadius: 18,
    backgroundColor: ledger.surface, gap: 7,
  },
  moneyLabel: {fontSize: 11, fontWeight: '800', color: ledger.subtext, letterSpacing: 1},
  moneyInputRow: {minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 9},
  moneyInput: {
    flex: 1, minWidth: 0, fontSize: 32, fontWeight: '800',
    color: ledger.ink, paddingVertical: 7, letterSpacing: -0.7,
  },
  moneyUnit: {fontSize: 17, fontWeight: '800', color: ledger.dark},
  fieldHint: {fontSize: 12, lineHeight: 18, color: ledger.subtext},
  errorText: {color: '#9C2738', fontSize: 13, fontWeight: '700', lineHeight: 19},
  invalidBorder: {borderColor: '#9C2738'},
  fieldSection: {gap: 9},
  fieldTitle: {fontSize: 17, fontWeight: '800', color: ledger.ink},
  fieldDescription: {fontSize: 13, color: ledger.subtext},
  categories: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  category: {
    minHeight: 48, paddingVertical: 7, paddingHorizontal: 10,
    borderWidth: 1, borderColor: ledger.rule, borderRadius: 14,
    backgroundColor: ledger.surface, flexDirection: 'row', alignItems: 'center', gap: 7,
  },
  categoryActive: {borderWidth: 2, borderColor: ledger.dark, backgroundColor: ledger.paleSage},
  categoryIcon: {
    width: 31, height: 31, backgroundColor: ledger.paleSage,
    alignItems: 'center', justifyContent: 'center', borderRadius: 10,
  },
  categoryText: {fontSize: 14, fontWeight: '600', color: ledger.ink},
  categoryTextActive: {fontWeight: '800', color: ledger.dark},
  dateRow: {flexDirection: 'row', alignItems: 'center', gap: 9},
  dateButton: {
    flex: 1, minWidth: 0, minHeight: 50, paddingHorizontal: 11,
    backgroundColor: ledger.surface, borderWidth: 1, borderColor: ledger.rule,
    borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 9,
  },
  dateText: {flex: 1, color: ledger.ink, fontSize: 15, fontWeight: '700'},
  todayShortcut: {
    minHeight: 50, minWidth: 70, borderRadius: 12, backgroundColor: ledger.paleSage,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10,
  },
  todayLabel: {fontWeight: '800', color: ledger.dark, fontSize: 13},
  noteInput: {
    minHeight: 90, padding: 14, textAlignVertical: 'top',
    backgroundColor: ledger.surface, borderRadius: 14, borderWidth: 1,
    borderColor: ledger.rule, fontSize: 15, lineHeight: 22, color: ledger.ink,
  },
  optional: {color: ledger.subtext, fontWeight: '400', fontSize: 13},
  saveButton: {
    marginTop: 6, minHeight: 56, backgroundColor: ledger.dark, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10,
  },
  saveText: {fontSize: 16, fontWeight: '800', color: '#FFFFFF'},
  feedback: {fontSize: 13, fontWeight: '700', color: '#9C2738', lineHeight: 19},
  deleteZone: {paddingTop: 6},
  deleteTrigger: {
    minHeight: 49, borderColor: '#B54C51', borderWidth: 1, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  deleteText: {color: '#9C2738', fontSize: 14, fontWeight: '800'},
  confirmPanel: {padding: 16, borderRadius: 15, backgroundColor: '#F9E4DF', gap: 11},
  confirmTitle: {fontSize: 18, fontWeight: '800', color: ledger.ink},
  confirmBody: {color: ledger.subtext, fontSize: 14, lineHeight: 20},
  confirmActions: {flexDirection: 'row', gap: 9},
  confirmCancel: {flex: 1, minHeight: 48, borderRadius: 12, backgroundColor: ledger.surface, alignItems: 'center', justifyContent: 'center'},
  confirmCancelText: {color: ledger.ink, fontSize: 14, fontWeight: '700'},
  confirmDelete: {flex: 1, minHeight: 48, borderRadius: 12, backgroundColor: '#B43A3A', alignItems: 'center', justifyContent: 'center'},
  confirmDeleteText: {color: '#FFFFFF', fontSize: 14, fontWeight: '800'},
  disclaimer: {color: ledger.subtext, fontSize: 12, textAlign: 'center', lineHeight: 18, paddingHorizontal: 10},
});
