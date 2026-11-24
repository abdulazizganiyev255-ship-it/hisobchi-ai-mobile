/**
 * S10-01: pure module/contract tests. No network, no Supabase, no real users.
 * TypeScript is transpiled in-memory using the repo's existing TS dependency.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const loaded = new Map();
function load(relativePath) {
  const normalized = path.posix.normalize(relativePath);
  if (loaded.has(normalized)) return loaded.get(normalized);
  const source = fs.readFileSync(path.join(root, normalized), "utf8");
  const emitted = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
    reportDiagnostics: true,
    fileName: normalized,
  });
  const diagnostics = (emitted.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(diagnostics.length, 0, normalized + " must transpile without errors");
  const module = {exports: {}};
  loaded.set(normalized, module.exports);
  const localRequire = spec => {
    assert.ok(spec.startsWith("."), "Only local imports allowed: " + spec);
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(normalized), spec)) + ".ts";
    return load(resolved);
  };
  vm.runInNewContext(emitted.outputText, {
    module, exports: module.exports, require: localRequire, console,
  }, {filename: normalized, timeout: 1000});
  loaded.set(normalized, module.exports);
  return module.exports;
}

const money = load("src/domain/finance/provenance.ts");
const {semanticV1: theme} = load("src/theme/semantic.ts");
const {DemoFinanceRepository} = load("src/services/finance/demoRepository.ts");
const {demo} = load("src/data/demo.ts");

const max = "9223372036854775807";
assert.equal(money.parseUzs(" 1 250 000 "), "1250000");
assert.equal(money.parseUzs("9\u202f007\u202f199\u202f254\u202f740\u202f993"), "9007199254740993");
assert.equal(money.parseUzs(max), max);
assert.equal(money.parseUzs("9223372036854775808"), null);
for (const bad of ["", "0", "-1", "1.5", "1e9", "1,200", "NaN", "10\n20", "12 so‘m"]) {
  assert.equal(money.parseUzs(bad), null, "must reject: " + bad);
}
assert.equal(money.parseUzs("000", {allowZero: true}), "0");
assert.equal(money.parseUzs("-12500", {allowNegative: true}), "-12500");
assert.equal(money.formatUzs(money.fromSafeDemoNumber(-12500)), "−12 500 so‘m");
assert.throws(() => money.fromSafeDemoNumber(Number.MAX_SAFE_INTEGER + 1), /UNSAFE_DEMO_AMOUNT/);
assert.equal(money.demoMoney(money.parseUzs("25"), "Namuna").kind, "demo_fixed");
assert.equal(money.sessionMoney(money.parseUzs("25"), "test", "all").kind, "session_calculated");
assert.throws(() => money.verifiedMoney(money.parseUzs("25"), "", "2026-11-24T00:00:00Z"), /METADATA/);
assert.equal(money.unavailableMoney("insufficient_data").amountUzs, null);

function luminance(hex) {
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = rgb.map(x => x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}
for (const [name, foreground, background, target] of [
  ["primary text", theme.text.primary, theme.bg.canvas, 4.5],
  ["secondary text", theme.text.secondary, theme.bg.canvas, 4.5],
  ["primary CTA", theme.text.inverse, theme.brand.primary, 4.5],
  ["negative label", theme.status.negative, theme.bg.surface, 4.5],
  ["control outline", theme.border.control, theme.bg.surface, 3.0],
]) {
  assert.ok(contrast(foreground, background) >= target, name + " contrast failed");
}

(async () => {
  const records = [...demo.transactions];
  const repository = new DemoFinanceRepository(() => records);
  const homeBefore = await repository.getHomeSummary();
  assert.equal(homeBefore.mode, "demo");
  assert.equal(homeBefore.balance.kind, "demo_fixed");
  assert.equal(homeBefore.balance.amountUzs, "12850000");
  assert.equal(homeBefore.safeToSpend.amountUzs, "145000");
  const query = {period: "all", today: "2026-11-24"};
  const analyticsBefore = await repository.getAnalytics(query);
  assert.equal(analyticsBefore.source, "session");
  assert.equal(analyticsBefore.expense.amountUzs, "259000");
  assert.equal(analyticsBefore.income.amountUzs, "3000000");
  assert.equal(analyticsBefore.net.amountUzs, "2741000");

  records.push({...demo.transactions[0], id: "foundation-test", amount: -100000});
  const analyticsAfter = await repository.getAnalytics(query);
  assert.equal(analyticsAfter.expense.amountUzs, "359000");
  assert.equal(analyticsAfter.net.amountUzs, "2641000");
  assert.equal(analyticsAfter.transactionCount, 6);
  const homeAfter = await repository.getHomeSummary();
  assert.equal(homeAfter.balance.amountUzs, homeBefore.balance.amountUzs);
  assert.equal(homeAfter.safeToSpend.amountUzs, homeBefore.safeToSpend.amountUzs);
  assert.equal(homeAfter.monthExpense.amountUzs, homeBefore.monthExpense.amountUzs);
  await assert.rejects(repository.createTransaction({}, "request-1"), /DEMO_READ_ONLY/);
  console.log("S10 foundation money, provenance, contrast and demo isolation tests passed.");
})().catch(error => {console.error(error); process.exitCode = 1;});
