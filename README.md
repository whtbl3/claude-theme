# claude-theme

Tông màu kiểu Claude cho VS Code và Markdown Preview Enhanced (MPE): nền than ấm, chữ kem, màu nhấn cam `#d97757`.

| Thư mục | Nội dung |
| --- | --- |
| `mpe/style.less` | Style cho preview của MPE. Font Source Sans 3 / Source Serif 4 / JetBrains Mono, tải từ Google Fonts. Khi offline thì dùng font dự phòng có đủ dấu tiếng Việt. |
| `vscode/settings.json` | Màu giao diện, màu cú pháp và semantic token, phủ lên theme **Dark Modern**. Có kèm 2 setting của MPE. |
| `install.sh` | Copy `mpe/style.less` vào thư mục cấu hình của MPE. File cũ được sao lưu trước khi ghi đè. |

Bảng màu được chuyển từ extension [Claude Style Markdown Preview](https://github.com/ibank/claude-style-markdown-preview).

## Cài đặt

### 1. Markdown Preview Enhanced

```bash
./install.sh
```

Script copy style vào `~/.local/state/crossnote/style.less` (hoặc `$XDG_STATE_HOME/crossnote/`). Trên WSL, chạy script bên trong WSL vì extension chạy ở phía WSL.

Cài thủ công: mở Command Palette, chạy **Markdown Preview Enhanced: Customize CSS (Global)**, dán nội dung `mpe/style.less` vào rồi lưu.

### 2. VS Code

1. Chọn theme **Dark Modern** (`Ctrl+K Ctrl+T`).
2. Mở Command Palette, chạy **Preferences: Open User Settings (JSON)**.
3. Copy các khóa trong `vscode/settings.json` vào file đó.

Mọi màu nằm trong khóa `[Dark Modern]`, nên chỉ có tác dụng khi dùng theme này. Muốn bỏ thì xóa các khóa vừa thêm.

### 3. Làm mới preview

MPE tự tải lại khi `style.less` thay đổi. Nếu preview chưa đổi, chuyển file `.md` sang **Text Editor** rồi mở lại bằng **Markdown Preview Enhanced** (menu **Reopen Editor With** ở góc trên bên phải).

## Ghi chú kỹ thuật

- **Căn giữa:** MPE đặt `margin: 0` cho khung preview bằng một selector mạnh hơn selector của style này. Vì vậy cột chữ được căn giữa bằng padding: `max(24px, calc((100% - 800px) / 2))`. Biểu thức này được bọc trong `~"..."` để LESS không tự tính `max()` lúc biên dịch.
- **Font:** không dùng Georgia làm font dự phòng vì thiếu các chữ tiếng Việt như ặ, ữ, ộ.
- **Opacity:** theme preview `vscode.css` làm mờ blockquote, h6 và chữ gạch ngang bằng `opacity`. Style này đặt lại `opacity: 1`.
