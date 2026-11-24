/**
 * D03 profile mock finance setup — isolated from the real financial ledger.
 * All values in the starter dataset are illustrative, never bank balances.
 */

export type AccountKind='card'|'cash'|'savings';
export type MockAccount={
  id:string;
  name:string;
  kind:AccountKind;
  openingBalanceUzs:number|null; // null = unknown, never silently treat as zero
};

export type MockGoal={
  id:string;
  title:string;
  targetUzs:number;
  savedUzs:number;
  dueOn:string|null;
};

export type AccountDraft={
  name:string;
  kind:AccountKind;
  openingBalanceDigits:string; // empty string means unknown
};
export type GoalDraft={
  title:string;
  targetDigits:string;
  savedDigits:string;
  dueOn:string|null;
};

export const ACCOUNT_KINDS:{kind:AccountKind;label:string}[]=[
  {kind:'card',label:'Karta'},
  {kind:'cash',label:'Naqd'},
  {kind:'savings',label:'Jamg‘arma'},
];

export const initialMockAccounts:MockAccount[]=[
  {id:'sample-card',name:'Asosiy karta',kind:'card',openingBalanceUzs:7250000},
  {id:'sample-cash',name:'Naqd pul',kind:'cash',openingBalanceUzs:1600000},
  {id:'sample-save',name:'Jamg‘arma',kind:'savings',openingBalanceUzs:4000000},
];

export const initialMockGoals:MockGoal[]=[
  {id:'sample-laptop',title:'Noutbuk',targetUzs:12500000,savedUzs:4500000,dueOn:null},
  {id:'sample-trip',title:'Sayohat',targetUzs:6000000,savedUzs:1800000,dueOn:null},
];

export const MAX_SETUP_UZS=999_999_999_999;

function parseInteger(
  text:string,
  allowZero:boolean,
):number|null {
  if(!/^\d+$/.test(text))return null;
  const value=Number(text);
  if(!Number.isSafeInteger(value)||value>MAX_SETUP_UZS)return null;
  if(allowZero?value<0:value<=0)return null;
  return value;
}

export function parseOpeningBalance(text:string):number|null|undefined {
  if(text==='')return null; // unspecified, not 0
  const number=parseInteger(text,true);
  return number===null?undefined:number;
}

export function validateAccountDraft(draft:AccountDraft):string|null {
  if(!draft.name.trim())return 'Hisob nomini kiriting';
  if(draft.name.trim().length>40)return 'Hisob nomi 40 belgidan oshmasin';
  if(!ACCOUNT_KINDS.some(k=>k.kind===draft.kind))return 'Hisob turini tanlang';
  if(parseOpeningBalance(draft.openingBalanceDigits)===undefined){
    return 'Qoldiqni butun so‘mda kiriting yoki bo‘sh qoldiring';
  }
  return null;
}

export function validateGoalDraft(draft:GoalDraft,todayISO:string):string|null {
  if(!draft.title.trim())return 'Maqsad nomini kiriting';
  if(draft.title.trim().length>50)return 'Maqsad nomi 50 belgidan oshmasin';
  const target=parseInteger(draft.targetDigits,false);
  if(target===null)return 'Maqsad summasini kiriting';
  const saved=draft.savedDigits===''?0:parseInteger(draft.savedDigits,true);
  if(saved===null)return 'Yig‘ilgan summa noto‘g‘ri';
  if(draft.dueOn!==null){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(draft.dueOn))return 'Maqsad sanasi noto‘g‘ri';
    const [y,m,d]=draft.dueOn.split('-').map(Number);
    const date=new Date(y,m-1,d);
    if(y<1900||y>2100||date.getFullYear()!==y||date.getMonth()!==m-1||date.getDate()!==d){
      return 'Maqsad sanasi noto‘g‘ri';
    }
    if(draft.dueOn<todayISO)return 'Maqsad uchun o‘tgan sana tanlanmaydi';
  }
  return null;
}

export function createMockAccount(draft:AccountDraft,id:string):MockAccount {
  const error=validateAccountDraft(draft);
  if(error)throw new Error(error);
  const opening=parseOpeningBalance(draft.openingBalanceDigits);
  if(opening===undefined)throw new Error('Yaroqsiz summa');
  return {
    id,
    name:draft.name.trim(),
    kind:draft.kind,
    openingBalanceUzs:opening,
  };
}

export function createMockGoal(draft:GoalDraft,id:string,todayISO:string):MockGoal {
  const error=validateGoalDraft(draft,todayISO);
  if(error)throw new Error(error);
  return {
    id,
    title:draft.title.trim(),
    targetUzs:parseInteger(draft.targetDigits,false)!,
    savedUzs:draft.savedDigits===''?0:parseInteger(draft.savedDigits,true)!,
    dueOn:draft.dueOn,
  };
}

export function goalPercent(goal:MockGoal):number {
  if(goal.targetUzs<=0)return 0;
  return Math.min(100,Math.max(0,Math.round((goal.savedUzs/goal.targetUzs)*100)));
}
