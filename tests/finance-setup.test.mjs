import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseOpeningBalance,validateAccountDraft,createMockAccount,
  validateGoalDraft,createMockGoal,goalPercent
} from '../src/data/financeSetup.ts';

const today='2026-11-24';

test('unknown opening balance must differ from confirmed zero',()=>{
  assert.equal(parseOpeningBalance(''),null);
  assert.equal(parseOpeningBalance('0'),0);
  assert.equal(parseOpeningBalance('120000'),120000);
  assert.equal(parseOpeningBalance('120 000'),120000);
  assert.equal(parseOpeningBalance('   '),null);
});

test('unsafe opening balances must not be silently coerced',()=>{
  for(const bad of ['-500','12.5','1e3','text','1000000000000','9007199254740993']){
    assert.equal(parseOpeningBalance(bad),undefined,bad);
  }
});

test('account creation accepts optional balance but requires title',()=>{
  assert.equal(validateAccountDraft({name:'  ',kind:'card',openingBalanceDigits:''}),'Hisob nomini kiriting');
  const empty=createMockAccount({name:'Yangi karta',kind:'card',openingBalanceDigits:''},'id1');
  assert.equal(empty.openingBalanceUzs,null);
  const zero=createMockAccount({name:'Naqd',kind:'cash',openingBalanceDigits:'0'},'id2');
  assert.equal(zero.openingBalanceUzs,0);
  assert.equal(zero.name,'Naqd');
});

test('optional goal deadline is valid',()=>{
  assert.equal(validateGoalDraft({title:'Noutbuk',targetDigits:'5000000',savedDigits:'',dueOn:null},today),null);
  const goal=createMockGoal({title:'Noutbuk',targetDigits:'5000000',savedDigits:'0',dueOn:null},'g1',today);
  assert.equal(goal.dueOn,null);
  assert.equal(goal.savedUzs,0);
  assert.equal(goalPercent(goal),0);
  assert.equal(validateGoalDraft({title:'Maqsad',targetDigits:'5 000 000',savedDigits:'1 000 000',dueOn:null},today),null);
});

test('future deadline is permitted and past deadline rejected',()=>{
  assert.equal(validateGoalDraft({title:'Yangi maqsad',targetDigits:'5000',savedDigits:'',dueOn:'2027-02-28'},today),null);
  assert.equal(validateGoalDraft({title:'Yangi maqsad',targetDigits:'5000',savedDigits:'',dueOn:'2026-11-23'},today),'Maqsad uchun o‘tgan sana tanlanmaydi');
  assert.equal(validateGoalDraft({title:'Yangi maqsad',targetDigits:'5000',savedDigits:'',dueOn:'2027-02-29'},today),'Maqsad sanasi noto‘g‘ri');
});

test('goal values are exact positive whole UZS',()=>{
  for(const amount of ['0','-100','10.2','1e4','1000000000000']){
    assert.notEqual(validateGoalDraft({title:'Test',targetDigits:amount,savedDigits:'0',dueOn:null},today),null,amount);
  }
});

test('goal progress is capped visually at 100 percent',()=>{
  assert.equal(goalPercent({id:'x',title:'X',targetUzs:100,savedUzs:125,dueOn:null}),100);
  assert.equal(goalPercent({id:'y',title:'Y',targetUzs:100,savedUzs:35,dueOn:null}),35);
});
