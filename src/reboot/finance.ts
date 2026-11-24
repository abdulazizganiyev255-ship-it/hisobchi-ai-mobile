import {calculateAnalytics} from '../data/analytics';
import {demo, type Transaction} from '../data/demo';
import {filterAndSortTransactions, todayLocal} from '../data/transactions';

export function sessionReport(items: readonly Transaction[]) {
  return calculateAnalytics(items, 'all', todayLocal());
}

export function monthReport(items: readonly Transaction[]) {
  return calculateAnalytics(items, 'month', todayLocal());
}

export function recentRecords(items: readonly Transaction[], limit = 3) {
  return filterAndSortTransactions(items, 'all', '').slice(0, limit);
}

export function sampleItems(): Transaction[] {
  return demo.transactions.map(item => ({...item}));
}
