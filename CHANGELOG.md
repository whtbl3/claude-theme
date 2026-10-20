# Changelog

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
