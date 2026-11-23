import assert from 'node:assert/strict';
import test from 'node:test';
import {INITIAL_LEDGER, deriveLedger, parseAmount, money} from '../src/design-os06/ledger.ts';
test('demo ledger reconciles', () => {
 const v=deriveLedger(INITIAL_LEDGER);
 assert.deepEqual([v.income,v.expenses,v.balance,v.bank,v.cash,v.remaining], [3600000,1150000,2450000,2150000,300000,650000]);
 assert.equal(Object.values(v.categories).reduce((a,b)=>a+b,0),v.expenses);
});
test('transfers do not change total cash or count as income', () => {
 const v=deriveLedger(INITIAL_LEDGER),without=deriveLedger(INITIAL_LEDGER.filter(x=>x.kind!=='transfer'));
 assert.equal(v.balance,without.balance); assert.equal(v.income,without.income); assert.equal(v.expenses,without.expenses);
});
test('expense and income updates reconcile', () => {
 const v=deriveLedger([...INITIAL_LEDGER,{id:'new',kind:'expense',amount:12500,title:'Test',date:'2026-11-23',account:'bank',category:'Transport'}]);
 assert.equal(v.balance,2437500); assert.equal(v.expenses,1162500); assert.equal(v.remaining,637500);
});
test('strict amount validation', () => {
 for(const x of ['', '1.5','-1','0','1e9','1,000','12so‘m'])assert.equal(parseAmount(x),null,x);
 assert.equal(parseAmount('1 250 000'),1250000);
 assert.equal(parseAmount('100'),100);
 assert.equal(money(-12500),'−12 500 so‘m');
});
test('invalid transfer rejected',()=>{
 assert.throws(()=>deriveLedger([{id:'a',kind:'transfer',amount:5,title:'x',date:'2026-11-23',from:'bank',to:'bank'}]));
});
