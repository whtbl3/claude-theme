#!/usr/bin/env node
// Fails if a theme or the MPE dark palette uses a color outside palette.json.
// Alpha suffixes are allowed (#d9775733 counts as #d97757); fully transparent
// colors (#xxxxxx00) are ignored.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const palette = JSON.parse(fs.readFileSync(path.join(root, 'palette.json'), 'utf8'));
const allowed = new Set(Object.values(palette).flatMap((group) => Object.values(group)).map((c) => c.toLowerCase()));

const offenders = [];
const check = (where, value) => {
  if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}/.test(value)) return;
  const v = value.toLowerCase();
  if (v.length === 9 && v.endsWith('00')) return;
  if (!allowed.has(v.slice(0, 7))) offenders.push(`${where}: ${value}`);
};

for (const file of ['themes/velin-dark-color-theme.json', 'themes/velin-dimmed-color-theme.json']) {
  const theme = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  for (const [key, value] of Object.entries(theme.colors)) check(`${file} colors.${key}`, value);
  theme.tokenColors.forEach((rule, i) => check(`${file} tokenColors[${i}] ${rule.scope[0]}`, rule.settings.foreground));
  for (const [key, value] of Object.entries(theme.semanticTokenColors)) {
    check(`${file} semanticTokenColors.${key}`, typeof value === 'string' ? value : value.foreground);
  }
}

const less = fs.readFileSync(path.join(root, 'mpe/style.less'), 'utf8');
const dark = less.match(/\.velin-dark\(\) \{[\s\S]*?\n\}/)[0];
for (const m of dark.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6,8})/g)) check(`mpe/style.less ${m[1]}`, m[2]);

if (offenders.length) {
  console.error(`${offenders.length} color(s) outside palette.json:\n  ${offenders.join('\n  ')}`);
  process.exit(1);
}
console.log(`OK: every color is one of the ${allowed.size} palette colors`);
