/** Device-local, date-only helpers for the D02 mock transaction calendar. */
const two=(n:number)=>String(n).padStart(2,'0');

export const UZ_MONTHS=[
  'Yanvar','Fevral','Mart','Aprel','May','Iyun',
  'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr',
] as const;

export function toLocalISODate(date:Date):string {
  return `${date.getFullYear()}-${two(date.getMonth()+1)}-${two(date.getDate())}`;
}

export function parseISODate(value:string):Date|null {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const [year,month,day]=value.split('-').map(Number);
  if(year<1900||year>2100||month<1||month>12||day<1||day>31)return null;
  const date=new Date(year,month-1,day);
  if(date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day)return null;
  return date;
}

export function formatUzDate(iso:string):string {
  const d=parseISODate(iso);
  return d?`${d.getDate()} ${UZ_MONTHS[d.getMonth()].toLowerCase()} ${d.getFullYear()}`:'Sana belgilanmagan';
}

export function monthTitle(monthKey:string):string {
  const d=parseISODate(`${monthKey}-01`);
  return d?`${UZ_MONTHS[d.getMonth()]} ${d.getFullYear()}`:'Noma’lum oy';
}

export function shiftMonth(monthKey:string,by:number):string {
  const d=parseISODate(`${monthKey}-01`);
  if(!d)return monthKey;
  const next=new Date(d.getFullYear(),d.getMonth()+by,1);
  return toLocalISODate(next).slice(0,7);
}

export type CalendarCell={dateISO:string;day:number;isCurrentMonth:boolean};

export function monthCells(monthKey:string):CalendarCell[] {
  const first=parseISODate(`${monthKey}-01`);
  if(!first)return [];
  // Monday-first, 6 complete rows; local date constructors avoid UTC timezone drift.
  const mondayOffset=(first.getDay()+6)%7;
  const startDay=1-mondayOffset;
  return Array.from({length:42},(_,i)=>{
    const d=new Date(first.getFullYear(),first.getMonth(),startDay+i);
    return {
      dateISO:toLocalISODate(d),
      day:d.getDate(),
      isCurrentMonth:d.getMonth()===first.getMonth(),
    };
  });
}

export type DateSelectionMode='past'|'future';

export function isSelectableDay(
  dateISO:string,
  todayISO:string,
  mode:DateSelectionMode='past',
):boolean {
  if(!parseISODate(dateISO)||!parseISODate(todayISO))return false;
  return mode==='past'?dateISO<=todayISO:dateISO>=todayISO;
}
