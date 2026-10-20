#!/usr/bin/env bash
# Cài style.less cho Markdown Preview Enhanced (thư mục cấu hình global của crossnote).
# File cũ (nếu có) được đổi tên thành style.less.bak.<timestamp>.
set -euo pipefail

src="$(cd "$(dirname "$0")" && pwd)/mpe/style.less"
dest_dir="${XDG_STATE_HOME:-$HOME/.local/state}/crossnote"
dest="$dest_dir/style.less"

mkdir -p "$dest_dir"
if [[ -f "$dest" ]] && ! cmp -s "$src" "$dest"; then
  backup="$dest.bak.$(date +%Y%m%d%H%M%S)"
  cp "$dest" "$backup"
  echo "Đã sao lưu file cũ: $backup"
fi
cp "$src" "$dest"
echo "Đã cài: $dest"
echo "VS Code settings: gộp vscode/settings.json vào settings.json của bạn (xem README)."
