import type {IconName} from '../components/AppIcon';
import type {Transaction} from './demo';
import {formatUzDate,parseISODate,toLocalISODate} from './calendar';

export type EntryKind='expense'|'income';
export type CategoryOption={
  id:string;label:string;icon:IconName;iconBg:string;iconColor:string
};

export type MockEntryDraft={
  kind:EntryKind;
  amountDigits:string;
  categoryId:string;
  occurredOn:string;
  note:string;
};

export const categories:Record<EntryKind,CategoryOption[]>={
  expense:[
    {id:'food',label:'Oziq-ovqat',icon:'cart',iconBg:'#E8EFE5',iconColor:'#476F52'},
    {id:'transport',label:'Transport',icon:'bus',iconBg:'#F2E3EB',iconColor:'#6D2C4E'},
    {id:'cafe',label:'Kafe',icon:'coffee',iconBg:'#F8E9D9',iconColor:'#93633B'},
    {id:'health',label:'Salomatlik',icon:'heart',iconBg:'#F8E1E5',iconColor:'#A75063'},
    {id:'shopping',label:'Xarid',icon:'cart',iconBg:'#E9E6F4',iconColor:'#6F528A'},
    {id:'other',label:'Boshqa',icon:'receipt',iconBg:'#EEE8E5',iconColor:'#65575E'},
  ],
  income:[
    {id:'salary',label:'Ish haqi',icon:'wallet',iconBg:'#E1F0E8',iconColor:'#24785B'},
    {id:'extra',label:'Qo‘shimcha',icon:'plus',iconBg:'#E9E4F0',iconColor:'#6D2C4E'},
    {id:'other',label:'Boshqa',icon:'receipt',iconBg:'#EEE8E5',iconColor:'#65575E'},
  ],
};

export const MAX_MOCK_AMOUNT=999_999_999_999;

export function cleanMoneyInput(text:string):string {
  return text.replace(/[^0-9]/g,'').slice(0,12);
}

export function validateMockEntry(entry:MockEntryDraft,today=toLocalISODate(new Date())):string|null {
  if(!/^[0-9]+$/.test(entry.amountDigits))return 'Summani kiriting';
  const amount=Number(entry.amountDigits);
  if(!Number.isSafeInteger(amount)||amount<=0||amount>MAX_MOCK_AMOUNT)return '0 dan katta, to‘g‘ri summani kiriting';
  if(!categories[entry.kind]?.some(c=>c.id===entry.categoryId))return 'Kategoriyani tanlang';
  if(entry.note.length>120)return 'Izoh 120 belgidan oshmasin';
  if(!parseISODate(entry.occurredOn)||entry.occurredOn>today)return 'To‘g‘ri sanani tanlang';
  return null;
}

export function makeMockTransaction(entry:MockEntryDraft,id:string,today=toLocalISODate(new Date())):Transaction {
  const error=validateMockEntry(entry,today);
  if(error)throw new Error(error);
  const category=categories[entry.kind].find(c=>c.id===entry.categoryId);
  if(!category)throw new Error('Kategoriya topilmadi');
  const amount=Number(entry.amountDigits);
  return {
    id,
    title:entry.note.trim()||category.label,
    category:category.label,
    date:formatUzDate(entry.occurredOn),
    amount:entry.kind==='expense'?-amount:amount,
    icon:category.icon,
    iconBg:category.iconBg,
    iconColor:category.iconColor,
  };
}
