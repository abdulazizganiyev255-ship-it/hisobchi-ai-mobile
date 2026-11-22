const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const src = fs.readFileSync(path.join(__dirname, '../src/data/calendar.ts'), 'utf8');
const output = ts.transpileModule(src, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText;
const context = {module: {exports: {}}};
context.exports = context.module.exports;
vm.runInNewContext(output, context, {filename: 'calendar.js'});
const {
  buildCalendarCells, canNavigateMonth, calendarMonthTitle, monthOffset,
  isSelectableCalendarDate,
} = context.module.exports;

const today = '2026-11-22';
assert.equal(calendarMonthTitle('2026-11'), 'Noyabr 2026');
assert.equal(monthOffset('2026-01', -1), '2025-12');
assert.equal(monthOffset('2026-12', 1), '2027-01');
assert.equal(canNavigateMonth('2026-11', 1, today), false, 'No future months');
assert.equal(canNavigateMonth('2026-11', -1, today), true);
assert.equal(canNavigateMonth('2000-01', -1, today), false, 'No dates before 2000');

assert.equal(isSelectableCalendarDate('2026-11-22', today), true);
assert.equal(isSelectableCalendarDate('2026-11-23', today), false);
assert.equal(isSelectableCalendarDate('1999-12-31', today), false);
assert.equal(isSelectableCalendarDate('2024-02-29', today), true, 'Leap day');
assert.equal(isSelectableCalendarDate('2025-02-29', today), false);
assert.equal(isSelectableCalendarDate('2026-13-01', today), false);
assert.equal(isSelectableCalendarDate('bad', today), false);

const days = buildCalendarCells('2026-11', today);
assert.equal(days.length, 42, 'Monday-first November 2026 needs six calendar weeks');
assert.equal(days[0].iso, '2026-10-26', 'Calendar starts Monday');
assert.equal(days[6].iso, '2026-11-01', 'Nov 1 is Sunday');
assert.equal(days.find(day => day.iso === '2026-11-22').enabled, true);
assert.equal(days.find(day => day.iso === '2026-11-23').enabled, false);
assert.equal(days.find(day => day.iso === '2026-11-30').enabled, false);
assert.equal(days.filter(day => day.enabled).length, 22);
assert.ok(days.filter(day => !day.currentMonth).every(day => !day.enabled));

const leap = buildCalendarCells('2024-02', today);
assert.equal(leap.find(day => day.iso === '2024-02-29').enabled, true);
const earliest = buildCalendarCells('2000-01', today);
assert.equal(earliest.find(day => day.iso === '2000-01-01').enabled, true);
assert.ok(earliest.filter(day => !day.currentMonth).every(day => !day.enabled));

console.log('Calendar date boundaries, leap year, week grid and future-day checks passed.');
