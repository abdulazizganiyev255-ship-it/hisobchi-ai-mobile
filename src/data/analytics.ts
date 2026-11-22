import type {Transaction} from './demo';
import {
  PERIOD_OPTIONS, getPeriodRange, sumTransactionTotals, transactionsInPeriod,
  validateCustomRange, type PeriodKey, type DateRange,
} from './periods';

export type AnalyticsPeriod = PeriodKey;

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

export const ANALYTICS_PERIODS: ReadonlyArray<{key: AnalyticsPeriod; label: string}> = PERIOD_OPTIONS;

export function calculateAnalytics(
  transactions: readonly Transaction[],
  period: AnalyticsPeriod,
  today: string,
  customRange: DateRange | null = null,
): AnalyticsReport {
  if (period === 'custom' && (
    customRange === null ||
    validateCustomRange(customRange.start, customRange.end, today) !== null
  )) {
    throw new Error('Custom analytics range must be validated before calculation');
  }
  const range = getPeriodRange(period, today, customRange);
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
  if (report.period === 'custom') {
    const display = (date: string) => formatDayCompact(date) + '.' + date.slice(2, 4);
    return display(report.start) + ' — ' + display(report.end);
  }
  return formatDayCompact(report.start) + ' — ' + formatDayCompact(report.end);
}
