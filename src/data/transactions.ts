import type {Transaction} from './demo';

export type TransactionKind = 'expense' | 'income';
export type TransactionFilter = 'all' | TransactionKind;
export type TransactionDraft = {
  kind: TransactionKind;
  amountText: string;
  category: string;
  occurredOn: string;
  note: string;
};
export type FormErrors = Partial<Record<'amountText' | 'category' | 'occurredOn', string>>;

export type CategoryOption = {
  label: string;
  icon: Transaction['icon'];
  iconBg: string;
  iconColor: string;
};

export const CATEGORY_OPTIONS: Record<TransactionKind, readonly CategoryOption[]> = {
  expense: [
    {label: 'Oziq-ovqat', icon: 'cart', iconBg: '#D5F2E7', iconColor: '#148B65'},
    {label: 'Transport', icon: 'bus', iconBg: '#D8EBFF', iconColor: '#3178D8'},
    {label: 'Kafe', icon: 'coffee', iconBg: '#FFF1DB', iconColor: '#AC7531'},
    {label: 'Salomatlik', icon: 'heart', iconBg: '#FFE6E6', iconColor: '#BA5151'},
    {label: 'Boshqa xarajat', icon: 'wallet', iconBg: '#E4E8F9', iconColor: '#526FC0'},
  ],
  income: [
    {label: 'Ish haqi', icon: 'wallet', iconBg: '#DAF4EA', iconColor: '#158365'},
    {label: 'Sovg‘a', icon: 'wallet', iconBg: '#D8EBFF', iconColor: '#3178D8'},
    {label: 'Boshqa daromad', icon: 'wallet', iconBg: '#DAF4EA', iconColor: '#158365'},
  ],
};

export function todayLocal(): string {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}

export function parseUZS(text: string): number | null {
  const cleaned = text.replace(/[\s\u00a0]/g, '');
  if (!/^\d+$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isSafeInteger(value) && value > 0 && value <= 999_999_999_999 ? value : null;
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 2000 || year > 2100 || month < 1 || month > 12) return false;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day >= 1 && day <= lastDay;
}

export function validateDraft(draft: TransactionDraft): FormErrors {
  const errors: FormErrors = {};
  if (parseUZS(draft.amountText) === null) {
    errors.amountText = '1 dan 999 999 999 999 so‘mgacha butun summa kiriting';
  }
  if (!CATEGORY_OPTIONS[draft.kind].some(x => x.label === draft.category)) {
    errors.category = 'Kategoriyani tanlang';
  }
  if (!isValidISODate(draft.occurredOn)) {
    errors.occurredOn = 'Sanani YYYY-MM-DD shaklida kiriting';
  } else if (draft.occurredOn > todayLocal()) {
    errors.occurredOn = 'Kelajak sanasiga operatsiya kiritib bo‘lmaydi';
  }
  return errors;
}

const MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

export function displayDay(iso: string): string {
  if (!isValidISODate(iso)) return iso;
  const [, month, day] = iso.split('-').map(Number);
  return String(day) + ' ' + MONTHS[month - 1];
}

export function transactionFromDraft(
  draft: TransactionDraft,
  id: string,
  previous?: Transaction,
): Transaction {
  const errors = validateDraft(draft);
  if (Object.keys(errors).length > 0) throw new Error('Operatsiya maydonlari noto‘g‘ri');
  const category = CATEGORY_OPTIONS[draft.kind].find(x => x.label === draft.category);
  const amount = parseUZS(draft.amountText);
  if (!category || amount === null) throw new Error('Operatsiya qiymatlari noto‘g‘ri');
  const signedAmount = draft.kind === 'expense' ? -amount : amount;
  return {
    ...previous,
    id,
    title: category.label,
    category: category.label,
    date: displayDay(draft.occurredOn),
    occurredOn: draft.occurredOn,
    amount: signedAmount,
    note: draft.note.trim().slice(0, 180),
    icon: category.icon,
    iconBg: category.iconBg,
    iconColor: category.iconColor,
  };
}

export function toDraft(item?: Transaction): TransactionDraft {
  const kind: TransactionKind = item && item.amount > 0 ? 'income' : 'expense';
  const options = CATEGORY_OPTIONS[kind];
  return {
    kind,
    amountText: item ? String(Math.abs(item.amount)) : '',
    category: item && options.some(o => o.label === item.title) ? item.title : options[0].label,
    occurredOn: item?.occurredOn ?? todayLocal(),
    note: item?.note ?? '',
  };
}

export function filterAndSortTransactions(
  items: readonly Transaction[], kind: TransactionFilter, search: string,
): Transaction[] {
  const query = search.trim().toLocaleLowerCase();
  return items.filter(item => {
    if (kind === 'expense' && item.amount >= 0) return false;
    if (kind === 'income' && item.amount <= 0) return false;
    return !query || [item.title, item.category, item.date, item.note ?? '']
      .some(v => v.toLocaleLowerCase().includes(query));
  }).sort((a, b) => b.occurredOn.localeCompare(a.occurredOn) || b.id.localeCompare(a.id));
}
