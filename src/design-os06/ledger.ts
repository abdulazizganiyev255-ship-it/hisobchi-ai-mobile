/** Synthetic ledger for UI QA only. All amounts are integer UZS. */
export type Kind = 'income' | 'expense' | 'transfer';
export type Account = 'bank' | 'cash';
export type Category = 'Oziq-ovqat' | 'Transport' | 'Uy-joy' | 'Boshqa';
export type Entry = {
  id: string;
  kind: Kind;
  amount: number;
  title: string;
  date: string;
  category?: Category;
  account?: Account;
  from?: Account;
  to?: Account;
};
export const LIMITS: Record<Category, number> = {
  'Oziq-ovqat': 600_000,
  Transport: 300_000,
  'Uy-joy': 400_000,
  Boshqa: 500_000,
};
export const CATEGORIES = Object.keys(LIMITS) as Category[];
export const INITIAL_LEDGER: Entry[] = [
  {id:'salary',kind:'income',amount:3_600_000,title:'Ish haqi (demo)',date:'2026-11-20',account:'bank'},
  {id:'food',kind:'expense',amount:460_000,title:'Oziq-ovqat (demo)',date:'2026-11-21',account:'bank',category:'Oziq-ovqat'},
  {id:'transport',kind:'expense',amount:184_000,title:'Transport (demo)',date:'2026-11-21',account:'bank',category:'Transport'},
  {id:'housing',kind:'expense',amount:161_000,title:'Uy-joy (demo)',date:'2026-11-22',account:'bank',category:'Uy-joy'},
  {id:'other',kind:'expense',amount:345_000,title:'Boshqa (demo)',date:'2026-11-22',account:'bank',category:'Boshqa'},
  {id:'transfer',kind:'transfer',amount:300_000,title:'Naqd pulga o‘tkazma',date:'2026-11-22',from:'bank',to:'cash'},
];

export function parseAmount(input: string): number | null {
  const normalized = input.trim().replace(/\s/g, '');
  if (!/^[0-9]{1,12}$/.test(normalized)) return null;
  const n = Number(normalized);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}
export function money(n: number): string {
  const s = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ');
  return (n < 0 ? '−' : '') + s + ' so‘m';
}
export function deriveLedger(rows: Entry[]) {
  let bank = 0, cash = 0, income = 0, expenses = 0;
  const categories: Record<Category, number> = {'Oziq-ovqat':0, Transport:0, 'Uy-joy':0, Boshqa:0};
  for (const item of rows) {
    if (!Number.isSafeInteger(item.amount) || item.amount <= 0) throw new Error('Invalid ledger amount');
    if (item.kind === 'transfer') {
      if (!item.from || !item.to || item.from === item.to) throw new Error('Invalid transfer');
      if (item.from === 'bank') bank -= item.amount; else cash -= item.amount;
      if (item.to === 'bank') bank += item.amount; else cash += item.amount;
    } else if (item.kind === 'income') {
      income += item.amount;
      if (item.account === 'cash') cash += item.amount; else bank += item.amount;
    } else {
      expenses += item.amount;
      if (item.account === 'cash') cash -= item.amount; else bank -= item.amount;
      if (!item.category) throw new Error('Missing expense category');
      categories[item.category] += item.amount;
    }
  }
  const limit = Object.values(LIMITS).reduce((a,b)=>a+b,0);
  return {bank,cash,balance:bank+cash,income,expenses,limit,remaining:limit-expenses,categories};
}
