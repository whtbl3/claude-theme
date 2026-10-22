const vscode = require('vscode');
const fs = require('fs');
const os = require('os');
const path = require('path');

const MPE = 'markdown-preview-enhanced';
const MPE_EXTENSION_ID = 'shd101wyy.markdown-preview-enhanced';
// First lines of the mpe/ files; mark files we wrote, so updates skip the backup. The second
// entry of each list is the marker the extension used before it was renamed from "Claude Theme".
const STYLE_MARKERS = ['Velin theme for Markdown Preview Enhanced', 'Claude-style theme for Markdown Preview Enhanced'];
const HEAD_MARKERS = ['Velin: copy button for code blocks', 'Claude Theme: copy button for code blocks'];
// Comment at the top of the head.html MPE creates by default; that file holds nothing worth backing up.
const MPE_DEFAULT_HEAD = 'The content below will be included at the end of the <head> element.';
const PROMPTED_KEY = 'velin.promptedVersion';

const hasAny = (text, markers) => markers.some((m) => text.includes(m));

const MPE_SETTINGS = [
  [`${MPE}.previewTheme`, 'vscode.css'],
  [`${MPE}.codeBlockTheme`, 'vscode.css'],
  // Lets head.html load copy-button.js; MPE strips every <script> while this is off.
  [`${MPE}.enablePreviewScripts`, true],
];

// Same lookup MPE (crossnote) uses for its global config directory.
function mpeConfigDir() {
  const custom = vscode.workspace.getConfiguration(MPE).get('configPath');
  if (typeof custom === 'string' && custom !== '') {
    return custom.replace(/^~(.*)$/, (_, rest) => (rest ? path.join(os.homedir(), rest) : os.homedir()));
  }
  if (process.platform === 'win32') return path.join(os.homedir(), '.crossnote');
  if (process.env.XDG_CONFIG_HOME) return path.resolve(process.env.XDG_CONFIG_HOME, 'crossnote');
  return path.resolve(os.homedir(), '.local/state/crossnote');
}

function readOrNull(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

async function applySettings() {
  const config = vscode.workspace.getConfiguration();
  const global = vscode.ConfigurationTarget.Global;
  for (const [key, value] of MPE_SETTINGS) {
    await config.update(key, value, global);
  }
  const associations = config.inspect('workbench.editorAssociations')?.globalValue ?? {};
  await config.update('workbench.editorAssociations', { ...associations, '*.md': MPE }, global);
}

// Writes one bundled mpe/<name> into MPE's config dir. A file we did not write is kept
// as <name>.bak-<timestamp>. Returns false when already current.
function writeMpeFile(context, name, isOurs) {
  const bundled = fs.readFileSync(path.join(context.extensionPath, 'mpe', name), 'utf8');
  const dir = mpeConfigDir();
  const dest = path.join(dir, name);
  const current = readOrNull(dest);
  if (current === bundled) return false;

  fs.mkdirSync(dir, { recursive: true });
  if (current !== null && current.trim() !== '' && !isOurs(current)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(`${dest}.bak-${stamp}`, current);
  }
  fs.writeFileSync(dest, bundled);
  return true;
}

// Writes style.less, head.html and copy-button.js. Returns false when all were already current.
function writeStyle(context) {
  const style = writeMpeFile(context, 'style.less', (s) => hasAny(s, STYLE_MARKERS));
  const head = writeMpeFile(context, 'head.html', (s) => hasAny(s, HEAD_MARKERS) || s.includes(MPE_DEFAULT_HEAD));
  const script = writeMpeFile(context, 'copy-button.js', (s) => hasAny(s, HEAD_MARKERS));
  return style || head || script;
}

async function installMpeStyle(context) {
  try {
    const changed = writeStyle(context);
    await applySettings();
    vscode.window.showInformationMessage(
      changed
        ? 'Velin: installed the Markdown Preview Enhanced style. Reopen open previews to see it.'
        : 'Velin: the Markdown Preview Enhanced style is already up to date.'
    );
  } catch (err) {
    vscode.window.showErrorMessage(`Velin: could not install the MPE style: ${err.message}`);
  }
}

// On startup: silently refresh a style.less we installed before; otherwise offer
// the install once per extension version.
async function checkMpeStyle(context) {
  if (!vscode.extensions.getExtension(MPE_EXTENSION_ID)) return;

  const current = readOrNull(path.join(mpeConfigDir(), 'style.less'));
  if (current !== null && hasAny(current, STYLE_MARKERS)) {
    try {
      writeStyle(context);
    } catch (err) {
      console.error('Velin: failed to update MPE style', err);
    }
    return;
  }

  const version = context.extension.packageJSON.version;
  if (context.globalState.get(PROMPTED_KEY) === version) return;
  await context.globalState.update(PROMPTED_KEY, version);

  const choice = await vscode.window.showInformationMessage(
    'Velin: apply the matching style to Markdown Preview Enhanced?',
    'Install',
    'Not now'
  );
  if (choice === 'Install') await installMpeStyle(context);
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('velin.installMpeStyle', () => installMpeStyle(context))
  );
  checkMpeStyle(context);
}

function deactivate() {}

module.exports = { activate, deactivate };
