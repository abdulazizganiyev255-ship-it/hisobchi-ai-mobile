import type {Transaction} from './demo';

export type PeriodKey = 'all' | 'week' | 'month' | 'last30' | 'custom';
export type DateRange = {start: string; end: string};

export const PERIOD_OPTIONS: ReadonlyArray<{key: PeriodKey; label: string}> = [
  {key: 'all', label: 'Barchasi'},
  {key: 'week', label: 'Hafta'},
  {key: 'month', label: 'Oy'},
  {key: 'last30', label: '30 kun'},
  {key: 'custom', label: 'Oraliq'},
];

// UTC calendar arithmetic prevents daylight-saving/timezone hour shifts
// from changing the number of calendar days in a period.
export function shiftCalendarDate(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getPeriodRange(
  key: PeriodKey,
  today: string,
  custom: DateRange | null = null,
): DateRange | null {
  if (key === 'all') return null;
  if (key === 'custom') return custom;
  if (key === 'last30') return {start: shiftCalendarDate(today, -29), end: today};
  if (key === 'month') return {start: today.slice(0, 7) + '-01', end: today};
  const dow = new Date(today + 'T00:00:00Z').getUTCDay();
  const mondayOffset = (dow + 6) % 7;
  return {start: shiftCalendarDate(today, -mondayOffset), end: today};
}

export function validateCustomRange(
  start: string,
  end: string,
  today: string,
): string | null {
  if (!validISO(start) || !validISO(end)) return 'Sanalarni YYYY-MM-DD shaklida kiriting';
  if (start > end) return 'Boshlanish sanasi tugashdan keyin bo‘lmasin';
  if (end > today) return 'Kelajakdagi sana kiritilmaydi';
  return null;
}

// This validator is deliberately self-contained so the date range module
// remains directly testable without loading React Native / runtime modules.
function validISO(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 2000 || year > 2100 || month < 1 || month > 12) return false;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day >= 1 && day <= lastDay;
}

export function withinPeriod(date: string, range: DateRange | null): boolean {
  return range === null || (date >= range.start && date <= range.end);
}

export function transactionsInPeriod(
  items: readonly Transaction[],
  range: DateRange | null,
): Transaction[] {
  return items.filter(item => withinPeriod(item.occurredOn, range));
}

export function sumTransactionTotals(items: readonly Transaction[]) {
  return items.reduce(
    (acc, item) => {
      if (item.amount < 0) acc.expense += -item.amount;
      if (item.amount > 0) acc.income += item.amount;
      return acc;
    },
    {income: 0, expense: 0},
  );
}
