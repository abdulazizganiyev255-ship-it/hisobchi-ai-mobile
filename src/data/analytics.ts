import type {Transaction} from './demo';
import {getPeriodRange, sumTransactionTotals, transactionsInPeriod} from './periods';

export type AnalyticsPeriod = 'all' | 'week' | 'month' | 'last30';

export type AnalyticsCategory = {
  name: string;
  amount: number;
  percent: number;
  icon: Transaction['icon'];
  iconBg: string;
  iconColor: string;
};

export type AnalyticsDay = {
  date: string;
  expense: number;
  income: number;
  turnover: number;
};

export type AnalyticsReport = {
  period: AnalyticsPeriod;
  start: string | null;
  end: string | null;
  income: number;
  expense: number;
  turnover: number;
  net: number;
  transactionsCount: number;
  expensesCount: number;
  categories: AnalyticsCategory[];
  days: AnalyticsDay[];
  chartTruncated: boolean;
};

export const ANALYTICS_PERIODS: ReadonlyArray<{key: AnalyticsPeriod; label: string}> = [
  {key: 'all', label: 'Barchasi'},
  {key: 'week', label: 'Hafta'},
  {key: 'month', label: 'Oy'},
  {key: 'last30', label: '30 kun'},
];

export function calculateAnalytics(
  transactions: readonly Transaction[],
  period: AnalyticsPeriod,
  today: string,
): AnalyticsReport {
  const range = getPeriodRange(period, today);
  const included = transactionsInPeriod(transactions, range);
  const {income, expense} = sumTransactionTotals(included);
  const grouped = new Map<string, Omit<AnalyticsCategory, 'percent'>>();
  const daily = new Map<string, AnalyticsDay>();
  let expensesCount = 0;

  for (const item of included) {
    const day = daily.get(item.occurredOn) ?? {date: item.occurredOn, expense: 0, income: 0, turnover: 0};
    day.turnover += Math.abs(item.amount);
    if (item.amount < 0) {
      const amount = -item.amount;
      expensesCount += 1;
      day.expense += amount;
      const existing = grouped.get(item.title);
      if (existing) {
        existing.amount += amount;
      } else {
        grouped.set(item.title, {
          name: item.title, amount,
          icon: item.icon, iconBg: item.iconBg, iconColor: item.iconColor,
        });
      }
    } else if (item.amount > 0) {
      day.income += item.amount;
    }
    daily.set(item.occurredOn, day);
  }

  const categories = Array.from(grouped.values())
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
    .map(item => ({
      ...item,
      percent: expense > 0 ? Math.round(item.amount * 100 / expense) : 0,
    }));
  const activeDays = Array.from(daily.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    period,
    start: range?.start ?? null,
    end: range?.end ?? null,
    income,
    expense,
    turnover: income + expense,
    net: income - expense,
    transactionsCount: included.length,
    expensesCount,
    categories,
    days: activeDays.slice(-7),
    chartTruncated: activeDays.length > 7,
  };
}

export function formatDayCompact(iso: string): string {
  return iso.slice(8, 10) + '.' + iso.slice(5, 7);
}

export function analyticsRangeLabel(report: AnalyticsReport): string {
  if (!report.start || !report.end) return 'Barcha qayd etilgan sanalar';
  return formatDayCompact(report.start) + ' — ' + formatDayCompact(report.end);
}
