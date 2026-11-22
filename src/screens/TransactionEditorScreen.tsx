import {useState} from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon} from '../components/AppIcon';
import {Transaction} from '../data/demo';
import {
  CATEGORY_OPTIONS, FormErrors, TransactionDraft, TransactionKind,
  toDraft, validateDraft,
} from '../data/transactions';
import {colors, radius} from '../theme/tokens';

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
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Operatsiyalar ro‘yxatiga qaytish"
            style={styles.back}
            onPress={onCancel}
          >
            <AppIcon name="arrow-left" color={colors.primarySoft} size={22}/>
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{initial ? 'Operatsiyani tahrirlash' : 'Yangi operatsiya'}</Text>
            <Text style={styles.caption}>Demo sessiya · ma’lumotlar serverga yuborilmaydi</Text>
          </View>
        </View>

        <View style={styles.segment}>
          {(['expense', 'income'] as const).map(kind => {
            const active = draft.kind === kind;
            return (
              <Pressable
                key={kind}
                onPress={() => changeKind(kind)}
                accessibilityRole="button"
                accessibilityState={{selected: active}}
                style={[styles.segmentItem, active && styles.segmentActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {kind === 'expense' ? '− Xarajat' : '+ Daromad'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.amountCard}>
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
          {errors.amountText && <Text style={styles.errorDark}>{errors.amountText}</Text>}
        </View>

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
        {errors.category && <Text style={styles.error}>{errors.category}</Text>}

        <Text style={styles.fieldHeading}>Sana</Text>
        <TextInput
          value={draft.occurredOn}
          onChangeText={value => change('occurredOn', value)}
          accessibilityLabel="Operatsiya sanasi"
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.faint}
          autoCapitalize="none"
          maxLength={10}
          style={styles.field}
        />
        <Text style={styles.hint}>Masalan: 2026-11-22. Kelajak sanasi qabul qilinmaydi.</Text>
        {errors.occurredOn && <Text style={styles.error}>{errors.occurredOn}</Text>}

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

        <Pressable onPress={save} accessibilityRole="button">
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

        {initial && (
          <View style={styles.deleteArea}>
            {!confirmDelete ? (
              <Pressable
                onPress={() => setConfirmDelete(true)}
                accessibilityRole="button"
                style={styles.deleteOutline}
              >
                <Text style={styles.deleteText}>Operatsiyani o‘chirish</Text>
              </Pressable>
            ) : (
              <View style={styles.confirmCard}>
                <Text style={styles.confirmTitle}>Rostdan o‘chirasizmi?</Text>
                <Text style={styles.confirmCaption}>Ushbu demo sessiyadan operatsiya olib tashlanadi.</Text>
                <View style={styles.confirmActions}>
                  <Pressable onPress={() => setConfirmDelete(false)} style={styles.cancelDelete}>
                    <Text style={styles.cancelDeleteText}>Bekor qilish</Text>
                  </Pressable>
                  <Pressable onPress={onDelete} style={styles.confirmDelete}>
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
  content: {paddingHorizontal: 20, paddingTop: 22, paddingBottom: 36, gap: 10},
  header: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10},
  back: {width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center'},
  headerCopy: {flex: 1, minWidth: 0},
  title: {color: colors.text, fontWeight: '800', fontSize: 20, letterSpacing: -0.35},
  caption: {color: colors.muted, fontSize: 11, marginTop: 4},
  segment: {flexDirection: 'row', padding: 5, backgroundColor: colors.surface, borderRadius: radius.lg, gap: 5},
  segmentItem: {flex: 1, minHeight: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center'},
  segmentActive: {backgroundColor: '#1B5379'},
  segmentText: {fontSize: 13, fontWeight: '700', color: colors.muted},
  segmentTextActive: {color: colors.text},
  amountCard: {backgroundColor: colors.cardLight, borderRadius: radius.lg, padding: 20, marginTop: 6},
  lightLabel: {color: '#557A96', fontSize: 10, fontWeight: '800', letterSpacing: 1},
  amountRow: {flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 65},
  amountInput: {color: colors.ink, fontSize: 32, fontWeight: '800', flex: 1, minWidth: 0, paddingVertical: 5},
  currency: {color: '#406F90', fontSize: 15, fontWeight: '700'},
  lightHint: {color: '#577A95', fontSize: 11},
  errorDark: {color: '#A32439', fontSize: 11, fontWeight: '600', marginTop: 5},
  fieldHeading: {color: colors.text, fontWeight: '700', fontSize: 14, marginTop: 10},
  categories: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  category: {borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider, padding: 8, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48},
  categoryActive: {borderColor: colors.primary, backgroundColor: '#18486A'},
  categoryIcon: {height: 30, width: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
  categoryText: {fontSize: 12, fontWeight: '600', color: colors.muted},
  categoryActiveText: {color: colors.text},
  field: {borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 15, paddingVertical: 13, minHeight: 48, fontSize: 15, color: colors.text},
  noteInput: {minHeight: 85, textAlignVertical: 'top'},
  hint: {fontSize: 10, color: colors.faint},
  error: {fontSize: 11, color: '#FFADAD', fontWeight: '600'},
  save: {minHeight: 54, marginTop: 12, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9},
  saveText: {color: colors.ink, fontWeight: '800', fontSize: 15},
  deleteArea: {marginTop: 8},
  deleteOutline: {minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(244,153,153,0.35)', alignItems: 'center', justifyContent: 'center'},
  deleteText: {color: '#FFB4B4', fontWeight: '700', fontSize: 13},
  confirmCard: {borderRadius: 15, backgroundColor: '#3B263B', padding: 14, gap: 10},
  confirmTitle: {color: '#FFFFFF', fontSize: 15, fontWeight: '800'},
  confirmCaption: {color: '#FFD1D1', fontSize: 11},
  confirmActions: {flexDirection: 'row', gap: 10},
  cancelDelete: {flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#534153', alignItems: 'center'},
  cancelDeleteText: {color: '#FFFFFF', fontWeight: '600', fontSize: 12},
  confirmDelete: {flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#F6B5B5', alignItems: 'center'},
  confirmDeleteText: {color: '#572020', fontWeight: '800', fontSize: 12},
  disclaimer: {textAlign: 'center', fontSize: 11, lineHeight: 18, color: colors.faint, paddingHorizontal: 12, marginTop: 9},
});
