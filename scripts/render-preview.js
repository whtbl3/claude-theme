#!/usr/bin/env node
// Renders images/<theme>.svg: a small editor window showing sample Python code,
// colored from the theme files, for the README.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const THEMES = [
  ['themes/claude-dark-color-theme.json', 'images/claude-dark.svg'],
  ['themes/claude-dimmed-color-theme.json', 'images/claude-dimmed.svg'],
];

// Sample code as [text, role] tokens; '\n' ends a line. Brackets get their
// pair-colorization level from nesting.
const ROLE_SCOPE = {
  kw: 'keyword',
  deco: 'entity.name.function.decorator',
  cls: 'entity.name.class',
  builtin: 'support.type.python',
  fn: 'entity.name.function',
  var: 'variable',
  prop: 'variable.other.property',
  str: 'string',
  num: 'constant.numeric',
  op: 'keyword.operator',
  comment: 'comment',
};
const CODE = [
  ['from', 'kw'], [' '], ['pathlib', 'cls'], [' '], ['import', 'kw'], [' '], ['Path', 'cls'], ['\n'],
  ['\n'],
  ['@dataclass', 'deco'], ['\n'],
  ['class', 'kw'], [' '], ['Clip', 'cls'], [':', 'op'], ['\n'],
  ['    '], ['path', 'var'], [':', 'op'], [' '], ['Path', 'cls'], ['\n'],
  ['    '], ['fps', 'var'], [':', 'op'], [' '], ['int', 'builtin'], [' '], ['=', 'op'], [' '], ['30', 'num'], ['\n'],
  ['\n'],
  ['def', 'kw'], [' '], ['load', 'fn'], ['('], ['video_path', 'var'], [':', 'op'], [' '], ['str', 'builtin'], [')'],
  [' '], ['->', 'op'], [' '], ['list', 'builtin'], ['['], ['Clip', 'cls'], [']'], [':', 'op'], ['\n'],
  ['    '], ['# Skip empty files.', 'comment'], ['\n'],
  ['    '], ['files', 'var'], [' '], ['=', 'op'], [' '], ['sorted', 'fn'], ['('], ['Path', 'cls'], ['('], ['video_path', 'var'], [')'],
  ['.', 'op'], ['glob', 'fn'], ['('], ['"*.mp4"', 'str'], [')'], [')'], ['\n'],
  ['    '], ['return', 'kw'], [' '], ['['], ['Clip', 'cls'], ['('], ['f', 'var'], [')'], [' '], ['for', 'kw'], [' '], ['f', 'var'],
  [' '], ['in', 'kw'], [' '], ['files', 'var'], [' '], ['if', 'kw'], [' '], ['f', 'var'], ['.', 'op'], ['stat', 'fn'], ['('], [')'],
  ['.', 'op'], ['st_size', 'prop'], [' '], ['>', 'op'], [' '], ['0', 'num'], [']'], ['\n'],
];

// Longest-prefix match of a scope against the theme's tokenColors.
function tokenColor(theme, scope) {
  let best = null;
  let bestLen = -1;
  for (const rule of theme.tokenColors) {
    for (const s of rule.scope) {
      if ((scope === s || scope.startsWith(`${s}.`)) && s.length > bestLen && rule.settings.foreground) {
        best = rule.settings.foreground;
        bestLen = s.length;
      }
    }
  }
  return best ?? theme.colors['editor.foreground'];
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(theme, label) {
  const c = (key) => theme.colors[key];
  const brackets = [1, 2, 3].map((n) => c(`editorBracketHighlight.foreground${n}`));
  const W = 640;
  const H = 400;
  const TITLE = 26;
  const TABS = 34;
  const STATUS = 22;
  const ACT = 44;
  const LINE = 20;
  const X0 = ACT + 18;
  const Y0 = TITLE + TABS + 24;

  // Build lines of colored spans.
  const lines = [[]];
  let depth = 0;
  for (const [text, role] of CODE) {
    if (text === '\n') {
      lines.push([]);
      continue;
    }
    let fill = role ? tokenColor(theme, ROLE_SCOPE[role]) : c('editor.foreground');
    if ('([{'.includes(text)) fill = brackets[depth++ % brackets.length];
    else if (')]}'.includes(text)) fill = brackets[--depth % brackets.length];
    lines[lines.length - 1].push(`<tspan fill="${fill}">${esc(text)}</tspan>`);
  }
  const code = lines
    .map((spans, i) => `<text x="${X0}" y="${Y0 + i * LINE}" xml:space="preserve">${spans.join('')}</text>`)
    .join('\n    ');

  const inactive = c('activityBar.inactiveForeground');
  const active = c('activityBar.foreground');
  const accent = c('activityBar.activeBorder');
  const icon = (y, d, color) =>
    `<path d="${d}" transform="translate(12 ${y})" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const icons = [
    icon(TITLE + 14, 'M6 2h8l4 4v12H6z M14 2v4h4 M2 6v14h12', active),
    icon(TITLE + 58, 'M9 3a6 6 0 1 1 0 12a6 6 0 1 1 0-12 M13.5 13.5L19 19', inactive),
    icon(TITLE + 102, 'M5 3v14 M5 17a2.5 2.5 0 1 0 0.01 0 M15 3a2.5 2.5 0 1 0 0.01 0 M15 5.5c0 6-10 4-10 9', inactive),
    icon(TITLE + 146, 'M6 3l12 8l-12 8z', inactive),
    icon(TITLE + 190, 'M3 3h7v7H3z M12 12h7v7h-7z M3 12h7v7H3z M13 3l6 0l0 6', inactive),
  ].join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'JetBrains Mono', 'Cascadia Code', Consolas, monospace">
  <defs><clipPath id="w"><rect width="${W}" height="${H}" rx="10"/></clipPath></defs>
  <g clip-path="url(#w)">
    <rect width="${W}" height="${H}" fill="${c('editor.background')}"/>
    <rect width="${W}" height="${TITLE}" fill="${c('titleBar.activeBackground')}"/>
    <text x="${W / 2}" y="17" text-anchor="middle" font-family="'Segoe UI', system-ui, sans-serif" font-size="12" fill="${c('titleBar.activeForeground')}">${esc(label)}</text>
    <rect y="${TITLE}" width="${W}" height="${TABS}" fill="${c('editorGroupHeader.tabsBackground')}"/>
    <rect x="${ACT}" y="${TITLE}" width="132" height="${TABS}" fill="${c('tab.activeBackground')}"/>
    <rect x="${ACT}" y="${TITLE}" width="132" height="2" fill="${c('tab.activeBorderTop')}"/>
    <text x="${ACT + 66}" y="${TITLE + 22}" text-anchor="middle" font-family="'Segoe UI', system-ui, sans-serif" font-size="13" fill="${c('tab.activeForeground')}">main.py</text>
    <rect y="${TITLE}" width="${ACT}" height="${H - TITLE - STATUS}" fill="${c('activityBar.background')}"/>
    <rect y="${TITLE + 10}" width="2" height="28" fill="${accent}"/>
    ${icons}
    <circle cx="30" cy="${TITLE + 118}" r="6" fill="${c('activityBarBadge.background')}"/>
    <text x="30" y="${TITLE + 121.5}" text-anchor="middle" font-size="9" font-family="'Segoe UI', sans-serif" fill="${c('activityBarBadge.foreground')}">3</text>
    <g font-size="14" style="font-variant-ligatures: none">
    ${code}
    </g>
    <rect y="${H - STATUS}" width="${W}" height="${STATUS}" fill="${c('statusBar.background')}"/>
    <text x="12" y="${H - 7}" font-family="'Segoe UI', system-ui, sans-serif" font-size="11" fill="${c('statusBar.foreground')}">⊗ 0  ⚠ 0</text>
    <text x="${W - 12}" y="${H - 7}" text-anchor="end" font-family="'Segoe UI', system-ui, sans-serif" font-size="11" fill="${c('statusBar.foreground')}">Python</text>
  </g>
</svg>
`;
}

fs.mkdirSync(path.join(root, 'images'), { recursive: true });
for (const [themeFile, out] of THEMES) {
  const theme = JSON.parse(fs.readFileSync(path.join(root, themeFile), 'utf8'));
  fs.writeFileSync(path.join(root, out), render(theme, theme.name));
  console.log(`Rendered ${out}`);
}
