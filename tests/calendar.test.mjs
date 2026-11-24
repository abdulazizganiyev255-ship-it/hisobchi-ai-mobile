import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toLocalISODate,parseISODate,monthCells,shiftMonth,monthTitle,formatUzDate
} from '../src/data/calendar.ts';

test('local date-only formatter roundtrips a leap day',()=>{
  const d=parseISODate('2024-02-29');
  assert.ok(d);
  assert.equal(toLocalISODate(d),'2024-02-29');
});

test('invalid and impossible dates are rejected',()=>{
  for(const s of ['2025-02-29','2026-13-01','2026-00-01','2026-04-31','2026-1-1','garbage']){
    assert.equal(parseISODate(s),null,s);
  }
});

test('Monday-first month grid has 42 distinct ascending day cells',()=>{
  const cells=monthCells('2026-11');
  assert.equal(cells.length,42);
  assert.equal(cells[0].dateISO,'2026-10-26');
  assert.equal(cells[6].dateISO,'2026-11-01');
  assert.equal(cells[7].dateISO,'2026-11-02');
  assert.equal(cells[41].dateISO,'2026-12-06');
  assert.equal(new Set(cells.map(c=>c.dateISO)).size,42);
});

test('calendar month navigation handles year boundaries',()=>{
  assert.equal(shiftMonth('2026-12',1),'2027-01');
  assert.equal(shiftMonth('2027-01',-1),'2026-12');
  assert.equal(shiftMonth('2026-02',1),'2026-03');
});

test('Uzbek date copy is deterministic',()=>{
  assert.equal(monthTitle('2026-11'),'Noyabr 2026');
  assert.equal(formatUzDate('2026-11-24'),'24 noyabr 2026');
  assert.equal(formatUzDate('invalid'),'Sana belgilanmagan');
});
