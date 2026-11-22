// Fake, deterministic values. Never present these as a user's real financial data.
export type Transaction = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  icon: 'cart' | 'bus' | 'wallet' | 'coffee' | 'heart';
  iconBg: string;
  iconColor: string;
};

export const demo = {
  balance: 12_850_000,
  safeToSpendToday: 145_000,
  transactions: [
    {id: '1', title: 'Oziq-ovqat', category: 'Xarid', date: 'Bugun, 08:24', amount: -85_000, icon: 'cart', iconBg: '#D5F2E7', iconColor: '#148B65'},
    {id: '2', title: 'Transport', category: 'Yo‘l haqi', date: 'Bugun, 07:51', amount: -12_000, icon: 'bus', iconBg: '#D8EBFF', iconColor: '#3178D8'},
    {id: '3', title: 'Kafe', category: 'Ovqatlanish', date: 'Kecha, 18:10', amount: -42_000, icon: 'coffee', iconBg: '#FFF1DB', iconColor: '#AC7531'},
    {id: '4', title: 'Ish haqi', category: 'Daromad', date: '20-noy., 12:00', amount: 3_000_000, icon: 'wallet', iconBg: '#DAF4EA', iconColor: '#158365'},
    {id: '5', title: 'Salomatlik', category: 'Xizmatlar', date: '19-noy., 16:30', amount: -120_000, icon: 'heart', iconBg: '#FFE6E6', iconColor: '#BA5151'}
  ] satisfies Transaction[],
  months: {
    current: {label: 'Bu oy', total: 3_840_000, change: -8, chart: [0.25,0.2,0.4,0.32,0.85,0.43,0.3,0.57,0.66]},
    previous: {label: 'O‘tgan oy', total: 4_180_000, change: 5, chart: [0.46,0.31,0.47,0.55,0.39,0.78,0.7,0.53,0.64]}
  }
};

export function formatMoney(n: number): string {
  const magnitude = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${n < 0 ? '−' : ''}${magnitude} so‘m`;
}
