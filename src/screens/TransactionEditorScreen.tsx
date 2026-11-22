import {useState} from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon} from '../components/AppIcon';
import {ChoiceChip, SurfaceCard} from '../components/ds';
import {FormHeader} from '../components/ds/FormHeader';
import {Transaction} from '../data/demo';
import {
  CATEGORY_OPTIONS, FormErrors, TransactionDraft, TransactionKind,
  toDraft, validateDraft, todayLocal,
} from '../data/transactions';
import {colors, layout, radius, semantic, typography} from '../theme/tokens';

type Props = {
  initial?: Transaction;
  onCancel: () => void;
  onSave: (draft: TransactionDraft) => void;
  onDelete: () => void;
};

export function TransactionEditorScreen({initial, onCancel, onSave, onDelete}: Props) {
  const [draft, setDraft] = useState<TransactionDraft>(() => toDraft(initial));
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const change = <K extends keyof TransactionDraft>(key: K, value: TransactionDraft[K]) => {
    setDraft(previous => ({...previous, [key]: value}));
    setErrors(previous => ({...previous, [key]: undefined}));
  };
  const changeKind = (kind: TransactionKind) => {
    setDraft(previous => ({...previous, kind, category: CATEGORY_OPTIONS[kind][0].label}));
    setErrors({});
  };
  const save = () => {
    const validation = validateDraft(draft);
    setErrors(validation);
    if (Object.keys(validation).length === 0) onSave(draft);
  };
  const options = CATEGORY_OPTIONS[draft.kind];

  return (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.fill}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <FormHeader
          title={initial ? 'Operatsiyani tahrirlash' : 'Yangi operatsiya'}
          subtitle="Demo · serverga yuborilmaydi · DS v1.2"
          onBack={onCancel}
          backLabel="Operatsiyalar ro‘yxatiga qaytish"
        />

        <View style={styles.kindRow}>
          {(['expense', 'income'] as const).map(kind => (
            <ChoiceChip
              key={kind}
              label={kind === 'expense' ? '− Xarajat' : '+ Daromad'}
              accessibilityLabel={kind === 'expense' ? 'Xarajat operatsiyasi' : 'Daromad operatsiyasi'}
              active={draft.kind === kind}
              onPress={() => changeKind(kind)}
              flex
            />
          ))}
        </View>

        <SurfaceCard tone="light" style={styles.amountCard}>
          <Text style={styles.lightLabel}>SUMMA</Text>
          <View style={styles.amountRow}>
            <TextInput
              value={draft.amountText}
              onChangeText={value => change('amountText', value)}
              placeholder="0"
              placeholderTextColor="#7596AD"
              keyboardType="numeric"
              maxLength={17}
              selectTextOnFocus={false}
              accessibilityLabel="Operatsiya summasi, so‘m"
              style={styles.amountInput}
            />
            <Text style={styles.currency}>so‘m</Text>
          </View>
          <Text style={styles.lightHint}>Faqat musbat, butun summa kiriting</Text>
          {errors.amountText && <Text accessibilityLiveRegion="polite" style={styles.errorDark}>{errors.amountText}</Text>}
        </SurfaceCard>

        <Text style={styles.fieldHeading}>Kategoriya</Text>
        <View style={styles.categories}>
          {options.map(option => {
            const active = draft.category === option.label;
            return (
              <Pressable
                key={option.label}
                accessibilityRole="button"
                accessibilityState={{selected: active}}
                onPress={() => change('category', option.label)}
                style={[styles.category, active && styles.categoryActive]}
              >
                <View style={[styles.categoryIcon, {backgroundColor: option.iconBg}]}>
                  <AppIcon name={option.icon} color={option.iconColor} size={19}/>
                </View>
                <Text style={[styles.categoryText, active && styles.categoryActiveText]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.category && <Text accessibilityLiveRegion="polite" style={styles.error}>{errors.category}</Text>}

        <Text style={styles.fieldHeading}>Sana</Text>
        <View style={styles.dateRow}>
          <TextInput
            value={draft.occurredOn}
            onChangeText={value => change('occurredOn', value)}
            accessibilityLabel="Operatsiya sanasi, yil-oy-kun"
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.faint}
            autoCapitalize="none"
            maxLength={10}
            style={[styles.field, styles.dateField, Boolean(errors.occurredOn) && styles.fieldInvalid]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sanani bugungi kunga o‘rnatish"
            onPress={() => change('occurredOn', todayLocal())}
            style={styles.todayAction}
          >
            <Text style={styles.todayText}>Bugun</Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>YYYY-MM-DD · Kelajak sanasi qabul qilinmaydi.</Text>
        {errors.occurredOn && <Text accessibilityLiveRegion="polite" style={styles.error}>{errors.occurredOn}</Text>}

        <Text style={styles.fieldHeading}>Izoh (ixtiyoriy)</Text>
        <TextInput
          value={draft.note}
          onChangeText={value => change('note', value)}
          placeholder="Masalan: do‘kondan xarid"
          placeholderTextColor={colors.faint}
          multiline
          maxLength={180}
          accessibilityLabel="Operatsiyaga izoh"
          style={[styles.field, styles.noteInput]}
        />

        <Pressable onPress={save} accessibilityRole="button" accessibilityLabel={initial ? 'O‘zgarishlarni saqlash' : 'Operatsiyani qo‘shish'}>
          <LinearGradient
            colors={['#82DFFF', '#35B7E9']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.save}
          >
            <AppIcon name="check" color={colors.ink} size={21} strokeWidth={2.4}/>
            <Text style={styles.saveText}>{initial ? 'O‘zgarishlarni saqlash' : 'Operatsiyani qo‘shish'}</Text>
          </LinearGradient>
        </Pressable>

        {Object.keys(errors).length > 0 && (
          <Text accessibilityLiveRegion="polite" style={styles.formFeedback}>
            Ma’lumotlarni tekshiring. Xatolar tegishli maydonlar ostida ko‘rsatilgan.
          </Text>
        )}

        {initial && (
          <View style={styles.deleteArea}>
            {!confirmDelete ? (
              <Pressable
                onPress={() => setConfirmDelete(true)}
                accessibilityRole="button"
                accessibilityLabel="Operatsiyani o‘chirishni tasdiqlash oynasini ochish"
                style={styles.deleteOutline}
              >
                <Text style={styles.deleteText}>Operatsiyani o‘chirish</Text>
              </Pressable>
            ) : (
              <View style={styles.confirmCard}>
                <Text style={styles.confirmTitle}>Rostdan o‘chirasizmi?</Text>
                <Text style={styles.confirmCaption}>Ushbu demo sessiyadan operatsiya olib tashlanadi.</Text>
                <View style={styles.confirmActions}>
                  <Pressable accessibilityRole="button" accessibilityLabel="O‘chirishni bekor qilish" onPress={() => setConfirmDelete(false)} style={styles.cancelDelete}>
                    <Text style={styles.cancelDeleteText}>Bekor qilish</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel="Operatsiyani butunlay o‘chirish" onPress={onDelete} style={styles.confirmDelete}>
                    <Text style={styles.confirmDeleteText}>Ha, o‘chirish</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}

        <Text style={styles.disclaimer}>
          Namoyish rejimi: sahifani yangilasangiz yoki ilovani yopib qayta ochsangiz o‘zgarishlar saqlanmaydi.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  content: {
    paddingHorizontal: layout.screenGutter, paddingTop: 18, paddingBottom: 38,
    gap: 10,
  },
  kindRow: {flexDirection: 'row', gap: 8, marginTop: 10},
  amountCard: {padding: 17, marginTop: 4},
  lightLabel: {color: semantic.lightSubtext, fontSize: typography.size.micro, fontWeight: '800', letterSpacing: 1},
  amountRow: {flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 62},
  amountInput: {color: colors.ink, fontSize: 31, fontWeight: '800', flex: 1, minWidth: 0, paddingVertical: 5},
  currency: {color: '#406F90', fontSize: 15, fontWeight: '700'},
  lightHint: {color: semantic.lightSubtext, fontSize: typography.size.caption},
  errorDark: {color: '#A32439', fontSize: typography.size.caption, fontWeight: '600', marginTop: 5},
  fieldHeading: {color: colors.text, fontWeight: '700', fontSize: typography.size.body, marginTop: 8},
  categories: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  category: {
    borderRadius: radius.sm, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.divider, padding: 7, paddingRight: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: layout.touchTarget,
  },
  categoryActive: {borderColor: colors.primary, backgroundColor: '#18486A'},
  categoryIcon: {height: 30, width: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
  categoryText: {fontSize: typography.size.caption, fontWeight: '600', color: colors.muted},
  categoryActiveText: {color: colors.text},
  field: {
    borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.surface,
    borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 12,
    minHeight: 48, fontSize: 15, color: colors.text,
  },
  fieldInvalid: {borderColor: colors.negative},
  dateRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  dateField: {flex: 1, minWidth: 0},
  todayAction: {
    minHeight: layout.touchTarget, minWidth: 72, borderRadius: radius.sm,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.divider,
    paddingHorizontal: 10,
  },
  todayText: {fontSize: typography.size.caption, fontWeight: '700', color: colors.primarySoft},
  noteInput: {minHeight: 76, textAlignVertical: 'top'},
  hint: {fontSize: typography.size.caption, color: colors.muted},
  error: {fontSize: typography.size.caption, color: '#FFADAD', fontWeight: '600'},
  formFeedback: {color: colors.negative, fontSize: typography.size.caption, lineHeight: 18, marginTop: 2},
  save: {
    minHeight: 52, marginTop: 10, borderRadius: radius.md,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9,
  },
  saveText: {color: colors.ink, fontWeight: '800', fontSize: typography.size.body},
  deleteArea: {marginTop: 8},
  deleteOutline: {minHeight: 48, borderRadius: radius.sm, borderWidth: 1, borderColor: 'rgba(244,153,153,0.35)', alignItems: 'center', justifyContent: 'center'},
  deleteText: {color: '#FFB4B4', fontWeight: '700', fontSize: typography.size.label},
  confirmCard: {borderRadius: radius.md, backgroundColor: '#3B263B', padding: 14, gap: 10},
  confirmTitle: {color: '#FFFFFF', fontSize: typography.size.section, fontWeight: '800'},
  confirmCaption: {color: '#FFD1D1', fontSize: typography.size.caption},
  confirmActions: {flexDirection: 'row', gap: 10},
  cancelDelete: {flex: 1, minHeight: layout.touchTarget, padding: 12, borderRadius: radius.sm, backgroundColor: '#534153', alignItems: 'center', justifyContent: 'center'},
  cancelDeleteText: {color: '#FFFFFF', fontWeight: '600', fontSize: typography.size.caption},
  confirmDelete: {flex: 1, minHeight: layout.touchTarget, padding: 12, borderRadius: radius.sm, backgroundColor: '#F6B5B5', alignItems: 'center', justifyContent: 'center'},
  confirmDeleteText: {color: '#572020', fontWeight: '800', fontSize: typography.size.caption},
  disclaimer: {textAlign: 'center', fontSize: typography.size.caption, lineHeight: 18, color: colors.muted, paddingHorizontal: 10, marginTop: 8},
});
