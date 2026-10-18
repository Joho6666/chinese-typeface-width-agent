#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="$(pwd)"
OUTPUT="${1:-$BASE/output}"
CLASS="${2:-班级名称}"
printf '%s\n%s\n' "$OUTPUT" "$CLASS" > .run-config.txt
SCRIPT="$BASE/illustrator/generate_typography.jsx"
if ! pgrep -fl 'Adobe Illustrator' >/dev/null 2>&1; then
  echo "请先安装并启动 Adobe Illustrator。"
fi
osascript - "$SCRIPT" <<'APPLESCRIPT'
on run argv
  set jsxFile to POSIX file (item 1 of argv)
  tell application "Adobe Illustrator"
    activate
    do javascript jsxFile
  end tell
end run
APPLESCRIPT
echo "Done. Check $OUTPUT/$CLASS"
