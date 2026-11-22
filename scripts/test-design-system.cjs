const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const raw = fs.readFileSync(path.join(__dirname, '../src/theme/tokens.ts'), 'utf8');
const compiled = ts.transpileModule(raw, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText;

const context = {module: {exports: {}}};
context.exports = context.module.exports;
vm.runInNewContext(compiled, context, {filename: 'tokens.js'});
const {colors, layout, typography, radius, semantic} = context.module.exports;

assert.ok(layout.touchTarget >= 44, 'Minimum tap target must be at least 44dp');
assert.ok(layout.screenGutter >= 16 && layout.screenGutter <= 24);
assert.ok(layout.smallViewport <= 320);
assert.ok(typography.size.body >= 14);
assert.ok(typography.size.page > typography.size.section);
assert.equal(semantic.darkPanel, colors.surface);
assert.equal(semantic.lightPanel, colors.cardLight);
assert.ok(radius.sm < radius.lg && radius.lg < radius.xl);

function rgb(hex) {
  assert.match(hex, /^#[0-9a-fA-F]{6}$/);
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
function luminance(hex) {
  const channels = rgb(hex).map(value => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
assert.ok(contrast(semantic.darkText, semantic.darkPanel) >= 4.5, 'Dark surface text contrast');
assert.ok(contrast(semantic.lightText, semantic.lightPanel) >= 4.5, 'Light surface text contrast');
assert.ok(contrast(semantic.darkSubtext, semantic.darkPanel) >= 4.5, 'Dark secondary text contrast');
assert.ok(contrast(semantic.lightSubtext, semantic.lightPanel) >= 4.5, 'Light secondary text contrast');
assert.ok(contrast(colors.text, semantic.activeControl) >= 4.5, 'Active chip text contrast');

console.log('Design tokens and baseline contrast checks passed.');
