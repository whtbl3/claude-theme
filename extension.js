const vscode = require('vscode');
const fs = require('fs');
const os = require('os');
const path = require('path');

const MPE = 'markdown-preview-enhanced';
const MPE_EXTENSION_ID = 'shd101wyy.markdown-preview-enhanced';
// First line of mpe/style.less; marks a style.less we wrote, so updates skip the backup.
const STYLE_MARKER = 'Claude-style theme for Markdown Preview Enhanced';
const PROMPTED_KEY = 'claudeTheme.promptedVersion';

const MPE_SETTINGS = [
  [`${MPE}.previewTheme`, 'vscode.css'],
  [`${MPE}.codeBlockTheme`, 'vscode.css'],
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

// Writes the bundled style.less into MPE's config dir. A style.less that we did not
// write is kept as style.less.bak-<timestamp>. Returns false when already current.
function writeStyle(context) {
  const bundled = fs.readFileSync(path.join(context.extensionPath, 'mpe', 'style.less'), 'utf8');
  const dir = mpeConfigDir();
  const dest = path.join(dir, 'style.less');
  const current = readOrNull(dest);
  if (current === bundled) return false;

  fs.mkdirSync(dir, { recursive: true });
  if (current !== null && current.trim() !== '' && !current.includes(STYLE_MARKER)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(`${dest}.bak-${stamp}`, current);
  }
  fs.writeFileSync(dest, bundled);
  return true;
}

async function installMpeStyle(context) {
  try {
    const changed = writeStyle(context);
    await applySettings();
    vscode.window.showInformationMessage(
      changed
        ? 'Claude Theme: installed the Markdown Preview Enhanced style. Reopen open previews to see it.'
        : 'Claude Theme: the Markdown Preview Enhanced style is already up to date.'
    );
  } catch (err) {
    vscode.window.showErrorMessage(`Claude Theme: could not install the MPE style: ${err.message}`);
  }
}

// On startup: silently refresh a style.less we installed before; otherwise offer
// the install once per extension version.
async function checkMpeStyle(context) {
  if (!vscode.extensions.getExtension(MPE_EXTENSION_ID)) return;

  const current = readOrNull(path.join(mpeConfigDir(), 'style.less'));
  if (current !== null && current.includes(STYLE_MARKER)) {
    try {
      writeStyle(context);
    } catch (err) {
      console.error('Claude Theme: failed to update MPE style', err);
    }
    return;
  }

  const version = context.extension.packageJSON.version;
  if (context.globalState.get(PROMPTED_KEY) === version) return;
  await context.globalState.update(PROMPTED_KEY, version);

  const choice = await vscode.window.showInformationMessage(
    'Claude Theme: apply the matching style to Markdown Preview Enhanced?',
    'Install',
    'Not now'
  );
  if (choice === 'Install') await installMpeStyle(context);
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('claudeTheme.installMpeStyle', () => installMpeStyle(context))
  );
  checkMpeStyle(context);
}

function deactivate() {}

module.exports = { activate, deactivate };
