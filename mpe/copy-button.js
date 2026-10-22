// Velin: copy button for code blocks in the Markdown Preview Enhanced preview.
// Loaded by head.html; styled in style.less (.velin-code-wrap, .velin-copy-btn).
(() => {
  const ICONS = {
    copy: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11"/></svg>',
    done: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>',
    fail: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>',
  };
  const RESET_MS = 1600;
  const LOG = '[velin copy]';

  // The VS Code webview may block navigator.clipboard, so first fire a synchronous copy
  // command during the user gesture and fill the clipboard from the copy event.
  function copyViaCommand(text) {
    let handled = false;
    const onCopy = (event) => {
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
      handled = true;
    };
    document.addEventListener('copy', onCopy, true);
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn(LOG, 'execCommand failed', err);
    } finally {
      document.removeEventListener('copy', onCopy, true);
    }
    return handled;
  }

  function copyViaTextarea(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      console.warn(LOG, 'textarea copy failed', err);
    }
    area.remove();
    return ok;
  }

  // Resolves to null on success, or to a short reason when every method failed.
  async function copy(text) {
    const reasons = [];
    if (copyViaCommand(text)) return null;
    reasons.push("execCommand: no copy event");
    if (navigator.clipboard?.writeText) {
      // In a webview writeText can wait forever on a permission prompt that never shows.
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timed out")), 1200));
      try {
        await Promise.race([navigator.clipboard.writeText(text), timeout]);
        return null;
      } catch (err) {
        reasons.push(`clipboard API: ${err && err.message ? err.message : err}`);
      }
    } else {
      reasons.push("clipboard API: unavailable");
    }
    if (copyViaTextarea(text)) return null;
    reasons.push("textarea: execCommand returned false");
    console.warn(LOG, reasons.join("; "));
    return reasons.join("; ");
  }

  function setState(button, state, detail) {
    button.dataset.state = state;
    button.innerHTML = ICONS[state];
    const label = { copy: 'Copy', done: 'Copied', fail: 'Copy failed' }[state];
    button.title = detail ? `${label}: ${detail}` : label;
    button.setAttribute('aria-label', label);
  }

  // Wrap each <pre> so the button sits on a box that does not scroll with the code.
  function enhance() {
    document.querySelectorAll('.markdown-preview pre:not([data-velin-copy])').forEach((pre) => {
      pre.setAttribute('data-velin-copy', '');
      const wrap = document.createElement('div');
      wrap.className = 'velin-code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'velin-copy-btn';
      setState(button, 'copy');
      wrap.appendChild(button);
    });
  }

  // Handle the press on window in the capture phase, before anything in the preview can
  // swallow it or re-render; pointerdown already counts as a user gesture for copying.
  function onPress(event) {
    const button = event.target instanceof Element && event.target.closest('.velin-copy-btn');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.type !== 'pointerdown') return;
    const pre = button.parentNode.querySelector('pre');
    const code = pre && (pre.querySelector('code') || pre);
    const text = code ? code.textContent.replace(/\n$/, '') : '';
    copy(text).then((failure) => {
      setState(button, failure ? 'fail' : 'done', failure);
      clearTimeout(button._reset);
      // Keep a failure (and its reason in the tooltip) up longer so it can be read.
      button._reset = setTimeout(() => setState(button, 'copy'), failure ? 8000 : RESET_MS);
    });
  }

  function start() {
    for (const type of ['pointerdown', 'mousedown', 'mouseup', 'pointerup', 'click', 'dblclick']) {
      window.addEventListener(type, onPress, true);
    }
    enhance();
    // The preview re-renders on every edit, so watch for new code blocks.
    new MutationObserver(enhance).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
