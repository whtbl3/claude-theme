# Changelog

## 0.7.0

- Renamed to **Velin**: themes are now **Velin Dark** and **Velin Dimmed**, the command is **Velin: Install Markdown Preview Enhanced Style**, and the extension has its own icon. Files installed by the old "Claude Theme" extension are recognized and updated in place.
- README and changelog rewritten in English. The README now states what is installed: terminal colors come with the theme; Markdown Preview Enhanced is a separate extension and is not installed for you.
- Preview images show a JavaScript sample.

## 0.6.4

- Defined every color group that still fell back to VS Code defaults, all from the palette: peek view (was navy `#001f33`), diff and merge editors, overview ruler and minimap, input validation, problem and notification icons, debug, testing, light bulb, inlay hints, ghost text, code lens, drag and drop, keybinding labels, charts, SCM graph and notebooks.

## 0.6.3

- MPE Copy button no longer scrolls sideways with long code: code blocks are wrapped in a non-scrolling box that holds the button.
- The button copies on `pointerdown`, handled on `window` in the capture phase. `navigator.clipboard.writeText` is capped at 1.2 s because it can wait forever in a webview. On failure the button shows a cross and its tooltip lists why each method failed.

## 0.6.2

- Copy button uses icons: a check mark on success, a cross on failure.
- Tries `execCommand("copy")` with a `copy` event first, then the Clipboard API, then a temporary textarea.

## 0.6.1

- **Copy** button on code blocks in the MPE preview. MPE drops inline scripts in `head.html` and only loads `<script src>` files when `markdown-preview-enhanced.enablePreviewScripts` is on, so the script lives in `mpe/copy-button.js` and the install command turns that setting on.

## 0.5.8

- Built-in Python types (`int`, `str`, `dict`) use purple `#c6a5c1`; the palette purple moved from `#b48ead` to the lighter `#c6a5c1`.

## 0.5.5

- The palette's single orange is `#ea9a78` (7.8:1 on Velin Dark, 6.8:1 on Velin Dimmed), used for keywords and UI accents alike.

## 0.5.2

- Added purple to the palette. Brackets cycle yellow, rose, purple.

## 0.5.1

- Palette yellow is now `#ebcb8b`, clearly apart from the orange keywords.

## 0.5.0

- Fixed 18-color palette in `palette.json`, shared by both themes, plus `scripts/check-palette.js` to keep stray colors out.
- Variables and parameters use the main text color, so they stand apart from yellow function names.
- Dimmed uses the same palette with backgrounds one step lighter.

## 0.4.8

- `UPPER_CASE` constants use rose `#d98a9a`.

## 0.4.0

- Merged near-duplicate colors (three reds, two greens, two teals, three light oranges) and documented the palette in the README.

## 0.3.5

- Terminal red is `#bf616a`, so errors no longer look like keywords.

## 0.3.3

- Active editor tab background `#443027` for classic and modern tabs; the README explains the settings needed for the modern "connected" tab style.
- Light orange hover in lists.

## 0.3.0

- Added the Dimmed theme and README preview images (`scripts/render-preview.js`).

## 0.2.0

- Experimented with Nord syntax colors; later replaced by the palette above.

## 0.1.0

- First release: a warm charcoal dark theme with clay-orange accents, and a command that installs a matching style for Markdown Preview Enhanced.
