/**
 * Pure, device-local calendar-date helpers. Dates are calendar strings, never UTC instants.
 * All public UI choices are bounded to 2000-01-01..today.
 */
export type CalendarCell = {
  iso: string;
  day: number;
  currentMonth: boolean;
  enabled: boolean;
};

const MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
] as const;
const MIN_DATE = '2000-01-01';

export function isoDateUTC(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10);
}

export function currentCalendarMonth(iso: string): string {
  return iso.slice(0, 7);
}

export function calendarMonthTitle(monthId: string): string {
  const [year, month] = monthId.split('-').map(Number);
  return MONTH_NAMES[month - 1] + ' ' + year;
}

export function monthOffset(monthId: string, delta: number): string {
  const [year, month] = monthId.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

export function canNavigateMonth(monthId: string, direction: -1 | 1, today: string): boolean {
  const next = monthOffset(monthId, direction);
  return next >= MIN_DATE.slice(0, 7) && next <= currentCalendarMonth(today);
}

export function isSelectableCalendarDate(iso: string, today: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || iso < MIN_DATE || iso > today) return false;
  const [year, month, day] = iso.split('-').map(Number);
  return month >= 1 && month <= 12 && isoDateUTC(year, month, day) === iso;
}

/** 35/42 positions, Monday-first; neighbouring month days are placeholders. */
export function buildCalendarCells(monthId: string, today: string): CalendarCell[] {
  const [year, month] = monthId.split('-').map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const shiftToMonday = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const count = Math.ceil((shiftToMonday + daysInMonth) / 7) * 7;
  return Array.from({length: count}, (_, index) => {
    const iso = isoDateUTC(year, month, index + 1 - shiftToMonday);
    const currentMonth = iso.startsWith(monthId);
    return {
      iso,
      day: Number(iso.slice(-2)),
      currentMonth,
      enabled: currentMonth && isSelectableCalendarDate(iso, today),
    };
  });
}
