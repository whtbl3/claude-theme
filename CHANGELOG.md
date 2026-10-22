# Changelog

## 0.6.4

- Khai báo các nhóm màu trước đây còn dùng mặc định của VS Code, tất cả lấy từ bảng màu: peek view (References, Peek Definition — trước là nền xanh navy `#001f33`), diff và merge, thước bên phải và minimap, ô nhập báo lỗi/cảnh báo, icon lỗi/cảnh báo/thông tin, debug, testing, bóng đèn gợi ý, inlay hint, ghost text, code lens, kéo thả, keybinding, biểu đồ, đồ thị git, notebook.

## 0.6.3

- Nút Copy không còn trôi khi cuộn ngang code: code block được bọc trong khung không cuộn, nút gắn vào khung.
- Copy khi nhấn chuột xuống (`pointerdown`), bắt ở `window` pha capture trước mọi xử lý khác của preview.
- `navigator.clipboard.writeText` có giới hạn 1,2 giây (trong webview nó có thể chờ mãi một hộp thoại cấp quyền); khi copy thất bại, nút hiện ✕ và tooltip ghi lý do từng cách.

## 0.6.2

- Nút Copy dùng icon như nút copy của VS Code; bấm xong hiện dấu tick ✓ xanh lá, lỗi thì hiện ✕ đỏ.
- Copy chắc chắn hơn trong webview: thử `execCommand("copy")` kèm sự kiện `copy`, rồi `navigator.clipboard`, rồi ô `textarea` tạm; chặn sự kiện chuột để MPE không bắt mất cú bấm.

## 0.6.1

- Nút **Copy** cho code block trong preview MPE: rê chuột lên code block để hiện, bấm xong hiện **Copied**. Script nằm trong `mpe/copy-button.js`, nạp qua `<script src>` trong `mpe/head.html`, vì MPE xóa mọi script viết thẳng trong `head.html` và chỉ chạy `<script src>` khi bật `markdown-preview-enhanced.enablePreviewScripts`. Lệnh cài đặt ghi cả ba file và bật setting này (file có sẵn không phải của extension và không phải mặc định của MPE sẽ được sao lưu).

## 0.5.8

- Kiểu có sẵn của Python (`int`, `str`, `dict`…) dùng tím `#c6a5c1` (trước là xanh lam `#6c9fc4`). Màu tím của bảng màu sáng hơn một bậc (`#b48ead` → `#c6a5c1`); ngoặc cấp 3 đổi theo.

## 0.5.5

- Màu cam duy nhất của bảng màu là cam hồng `#ea9a78` (màu từ khóa của 0.1.0): từ khóa 7.8:1 (Dimmed 6.8:1), dùng cho cả từ khóa, nút, con trỏ, viền focus, vùng chọn.

## 0.5.3

- Gộp cam từ khóa `#ea9a78` vào cam Claude `#d97757` (bảng màu còn 18 màu): từ khóa, decorator, `self`, link, key JSON dùng chung màu nhấn.

## 0.5.2

- Thêm tím `#b48ead` vào bảng màu (19 màu). Ngoặc theo thứ tự vàng `#ebcb8b` → hồng đất `#d98a9a` → tím `#b48ead`.

## 0.5.1

- Màu vàng của bảng màu đổi từ `#e0b07a` sang `#ebcb8b` (vàng Nord) để tách rõ khỏi cam từ khóa `#ea9a78`: tên hàm, số, `True`/`None`, cảnh báo, ngoặc cấp 1, vàng của terminal.

## 0.5.0

- Bảng màu cố định 18 màu kiểu Nord (`palette.json`), dùng chung cho cả hai theme: Than (5) cho nền, Kem (4) cho chữ, Cam (3) cho màu nhấn, Đất (6) cho cú pháp. Thêm `scripts/check-palette.js` để kiểm tra không có màu lạc.
- Biến và tham số dùng màu chữ chính `#e8e6e3` (trước là kem `#d6bfa0`), tách rõ khỏi tên hàm vàng.
- Comment sáng hơn `#8a847d`; thông tin dùng xanh lam `#6c9fc4`; vàng kem `#f0cd96` gộp vào vàng `#e0b07a`.
- Claude Dimmed dùng nền sáng hơn một bậc trong cùng bảng (editor `#262624`, thanh bên `#1a1a1a`).
- Bỏ `#000000`/`#ffffff`: bóng đổ và lớp phủ mờ cũng lấy từ bảng.

## 0.4.8

- Tên hàm (khai báo và lời gọi) dùng vàng đất `#e0b07a`, đậm hơn vàng kem `#f0cd96` trước đây; cùng màu với số.
- Hằng số viết hoa (`KEYFRAME_DIR`, `SLIDE_QUARANTINE_THRESHOLD`) dùng hồng đất `#d98a9a`, không còn trùng màu vàng với số và tên hàm.

## 0.4.0

- Thống nhất bảng màu: mỗi theme còn 30 màu (trước là 45), mỗi vai trò một màu. Gộp các màu gần giống nhau:
  - Đỏ (lỗi, git xóa, terminal) → `#bf616a`.
  - Xanh lá (string, git thêm) → `#a7bd86`.
  - Xanh ngọc (class, ngoặc cấp 3, terminal cyan) → `#94c7bb`.
  - Cam nhạt (từ khóa, link, key JSON) → `#ea9a78`.
  - Bỏ bớt bậc xám và viền gần trùng; tab đang mở khi mất focus dùng chung `#443027`.
  - Terminal: magenta → hồng đất `#d98a9a`, blue → `#6c9fc4`, cyan → `#94c7bb`; các màu bright dùng lại màu có sẵn.
- Bảng màu đầy đủ ghi trong README.
- Style MPE (bản tối) dùng cùng bảng màu.

## 0.3.6

- Ngoặc cấp 2 đổi sang hồng đất đậm hơn `#d98a9a` (trước là `#d4a5a5`) để khác rõ ngoặc cấp 1 màu vàng.

## 0.3.5

- Màu đỏ của terminal (`ansiRed` và `ansiBrightRed`) dùng đỏ Nord `#bf616a` để lỗi dễ nhận ra. Trước đây là cam hồng, trùng màu từ khóa.

## 0.3.3

- Tab đang mở dùng nền cam nâu `#443027` (cam `#d97757` pha 20%), rê chuột lên thì `#4f352b`; khai báo cho cả tab cổ điển (`tab.*`) và giao diện tab "modern" (`modernEditorTab.*`).
- Rê chuột lên danh sách (Explorer, tìm kiếm…) có nền cam rất nhạt `#d977571a`, nhạt hơn dòng đang chọn (`#d9775733`).
- Lưu ý: với kiểu tab "connected" mặc định của giao diện modern, VS Code chỉ đọc màu tab từ `workbench.colorCustomizations` trong settings, không đọc từ theme — xem README.

## 0.3.2

- Tab đang mở có nền cam nhạt (màu đặc, pha 16% `#d97757` lên nền thanh tab), viền cam phía trên và chữ kem sáng; khi focus ở chỗ khác thì nền nhạt hơn (8%). Áp dụng cho cả Claude Dark và Claude Dimmed.

## 0.3.0

- Màu cú pháp quay về bộ màu Claude của 0.1.0 (bỏ Nord), với vài chỉnh sửa:
  - Tên class sáng hơn: `#94c7bb`.
  - Kiểu có sẵn của Python (`str`, `int`, `list`…) dùng xanh lam đậm `#6c9fc4`.
  - Ngoặc theo thứ tự vàng `#e0b07a` → hồng đất `#d4a5a5` → xanh ngọc `#87b8ad`.
- Thêm theme **Claude Dimmed**: cùng màu với Claude Dark, nền xám ấm như claude.ai (editor `#262624`, thanh bên `#1f1e1d`, popup `#30302e`), comment sáng hơn (`#8a8174`).
- Ảnh preview cho README (`images/`), vẽ bằng `scripts/render-preview.js`.
- Style MPE quay về bản 0.1.0.

## 0.2.1

- Kết hợp màu lạnh cho phần khung code: từ khai báo (`def`, `class`, `lambda`), hằng ngôn ngữ (`True`/`False`/`None`, `true`/`null`) và `self`/`this` dùng xanh `#81a1c1`; tham số và keyword argument (`cwd=`) dùng xanh nhạt `#88c0d0`. Điều khiển, hàm, string và số giữ tông ấm. Chỉ áp dụng trong editor.
- Bỏ bảng Nord Frost, chỉ giữ Aurora. Kiểu dữ liệu `#87b8ad`, key JSON / attribute `#e8a87c`, toán tử `#a8a29e`, info và màu xanh của terminal trở về màu Claude gốc.
- Số trở lại màu cam `#e0b07a` của bộ màu Claude, tách khỏi các hằng số khác. Áp dụng cho theme và code block trong preview MPE (tông tối).

## 0.2.0

- Màu cú pháp (tông tối) và màu trạng thái chuyển sang bảng Nord. Áp dụng cho theme, terminal và code block trong preview MPE.
  - Aurora: keyword `#d08770`, hàm `#ebcb8b`, string `#a3be8c`, số `#b48ead`, lỗi / dòng xóa `#bf616a`.
  - Frost: kiểu dữ liệu / class `#8fbcbb`, key JSON / attribute / info `#88c0d0`, toán tử `#81a1c1`, chỉ thị tiền xử lý `#5e81ac`.

## 0.1.0

- Theme **Claude Dark**: nền than ấm, chữ kem, màu nhấn cam `#d97757`, màu cú pháp tông ấm.
- Lệnh **Claude Theme: Install Markdown Preview Enhanced Style**: cài `style.less` cho MPE và đặt các setting liên quan.
- Khi khởi động: tự cập nhật `style.less` đã cài trước đó, hoặc hỏi một lần để cài.
