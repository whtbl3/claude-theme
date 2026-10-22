# Claude Theme

Theme VS Code tông màu kiểu Claude: nền than ấm, chữ kem, màu nhấn cam `#ea9a78`. Extension kèm theo style cùng tông cho [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced) (MPE).

| Claude Dark | Claude Dimmed |
| --- | --- |
| ![Claude Dark](images/claude-dark.svg) | ![Claude Dimmed](images/claude-dimmed.svg) |

## Tính năng

- **Hai theme tối** cho giao diện, terminal (16 màu ANSI) và màu cú pháp, kể cả semantic token (Python/Pylance). Hai theme dùng cùng màu chữ và màu cú pháp, chỉ khác độ tối của nền:
  - **Claude Dark**: nền tối, editor `#1a1a1a`.
  - **Claude Dimmed**: nền xám ấm như claude.ai, editor `#262624`.

  Comment không in nghiêng: dấu `|` in nghiêng của JetBrains Mono trông giống `/`.
- **Style cho MPE** (`mpe/style.less`):
  - Font Source Sans 3 / Source Serif 4 / JetBrains Mono, tải từ Google Fonts. Khi offline thì dùng font dự phòng có đủ dấu tiếng Việt.
  - Cột chữ căn giữa.
  - Code block cùng màu với editor, có nút **Copy** khi rê chuột (`mpe/copy-button.js`, nạp qua `mpe/head.html`).
- **Lệnh `Claude Theme: Install Markdown Preview Enhanced Style`**, làm 3 việc:
  - Ghi `style.less`, `head.html` và `copy-button.js` vào thư mục cấu hình global của MPE.
  - Đặt `markdown-preview-enhanced.previewTheme` và `codeBlockTheme` thành `vscode.css`, bật `enablePreviewScripts` để nút Copy chạy được. Setting này cho phép preview chạy file `.js` được nạp bằng `<script src>` từ thư mục cấu hình MPE và từ project đang mở (chỉ khi workspace được tin cậy).
  - Cho file `.md` mặc định mở bằng MPE.

  Nếu đã có sẵn một `style.less` không phải của extension này, file đó được giữ lại thành `style.less.bak-<thời điểm>`.
- **Khi khởi động:** nếu `style.less` do extension này cài trước đó thì tự cập nhật lên bản mới. Nếu chưa cài thì hỏi một lần cho mỗi phiên bản.

## Bảng màu

Giống Nord, cả hai theme dùng chung một bảng **18 màu** cố định, khai báo trong `palette.json`. Mọi màu trong theme (kể cả màu có độ trong) đều lấy từ bảng này; `node scripts/check-palette.js` báo lỗi nếu có màu lạc.

**Than** (nền, viền)

| Tên | Màu | Claude Dark | Claude Dimmed |
| --- | --- | --- | --- |
| c0 | `#161615` | thanh bên, panel, terminal, code block | bóng đổ |
| c1 | `#1a1a1a` | editor | thanh bên, panel, terminal |
| c2 | `#262624` | popup, menu, ô nhập | editor |
| c3 | `#30302e` | viền, đường gióng | popup, menu, ô nhập |
| c4 | `#4a4743` | số dòng, đường gióng đang chọn | viền, số dòng |

**Kem** (chữ)

| Tên | Màu | Dùng cho |
| --- | --- | --- |
| bright | `#f4f1ec` | chữ đậm, tiêu đề, tab đang mở |
| text | `#e8e6e3` | chữ chính, biến, tham số |
| muted | `#a8a29e` | chữ phụ, toán tử, dấu câu |
| dim | `#8a847d` | comment, chữ mờ, placeholder |

**Cam** (màu nhấn Claude, 2 màu)

| Tên | Màu | Dùng cho |
| --- | --- | --- |
| accent | `#ea9a78` | nút, con trỏ, viền focus, vùng chọn (có độ trong); từ khóa, decorator, `self`, link, key JSON |
| surface | `#443027` | nền tab đang mở |

**Đất** (cú pháp, trạng thái)

| Tên | Màu | Dùng cho |
| --- | --- | --- |
| yellow | `#ebcb8b` | tên hàm, số, `True`/`None`, cảnh báo, ngoặc cấp 1 |
| green | `#a7bd86` | string, git thêm |
| teal | `#94c7bb` | class |
| blue | `#6c9fc4` | thông tin |
| rose | `#d98a9a` | hằng số viết hoa, ngoặc cấp 2 |
| purple | `#c6a5c1` | kiểu có sẵn (`int`, `str`, `dict`), ngoặc cấp 3 |
| red | `#bf616a` | lỗi, git xóa |

Terminal (16 màu ANSI) cũng lấy từ bảng: black `c3`/`dim`, red `red`, green `green`, yellow `yellow`, blue `blue`, magenta `rose`, cyan `teal`, white `text`/`bright`.

## Cài đặt

1. Tải file `.vsix` từ trang Releases, hoặc tự build theo hướng dẫn bên dưới.
2. Trong VS Code: Command Palette, chạy **Extensions: Install from VSIX...**, chọn file `.vsix`.
3. Chọn theme: `Ctrl+K Ctrl+T`, chọn **Claude Dark** hoặc **Claude Dimmed**.
4. Nếu dùng MPE: bấm **Install** khi được hỏi, hoặc chạy lệnh **Claude Theme: Install Markdown Preview Enhanced Style**.

Extension chạy cùng phía với MPE (`extensionKind: workspace`). Trên WSL / Remote, hãy cài khi đang kết nối remote để style được ghi vào đúng thư mục mà MPE đọc.

## Build

Cần Node 22 trở lên. Không cần `npm install`.

```bash
node scripts/build-vsix.js       # tạo dist/claude-theme-<version>.vsix
node scripts/render-preview.js   # vẽ lại images/*.svg từ file theme
```

Script tự đóng gói `.vsix` (zip + manifest) mà không dùng `@vscode/vsce`. Nếu muốn đưa lên Marketplace thì dùng `vsce package` / `vsce publish` như bình thường.

## Ghi chú kỹ thuật

- **Màu tab đang mở với giao diện "modern":** ở kiểu tab "connected" (mặc định), VS Code bỏ qua màu tab trong theme, tab đang mở lấy màu nền editor. Muốn tab có nền cam, thêm vào `settings.json`:

  ```jsonc
  "workbench.colorCustomizations": {
    "[Claude Dark][Claude Dimmed]": {
      "modernEditorTab.activeBackground": "#443027",
      "modernEditorTab.activeHoverBackground": "#443027",
      "tab.activeBorderTop": "#ea9a78"
    }
  }
  ```

  Với tab cổ điển hoặc kiểu `"pill"` (`workbench.experimental.modernUIEditorTabStyle`), theme tự áp màu này, không cần settings.
- **Thư mục cấu hình MPE** được tìm giống cách MPE làm, theo thứ tự:
  1. Setting `markdown-preview-enhanced.configPath`.
  2. Windows: `~/.crossnote`.
  3. `$XDG_CONFIG_HOME/crossnote`.
  4. `~/.local/state/crossnote`.
- **Căn giữa:** MPE đặt `margin: 0` cho khung preview bằng một selector mạnh hơn selector của style này. Vì vậy cột chữ được căn giữa bằng padding: `max(24px, calc((100% - 800px) / 2))`. Biểu thức này được bọc trong `~"..."` để LESS không tự tính `max()` lúc biên dịch.
- **Font:** không dùng Georgia làm font dự phòng vì thiếu các chữ tiếng Việt như ặ, ữ, ộ.
- **Opacity:** theme preview `vscode.css` của MPE làm mờ blockquote, h6 và chữ gạch ngang bằng `opacity`. Style này đặt lại `opacity: 1`.

## Ghi công

Bảng màu và cách trình bày preview được chuyển từ extension [Claude Style Markdown Preview](https://github.com/ibank/claude-style-markdown-preview) (MIT).
