#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# 변경 상태 확인
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ 커밋할 변경사항이 없습니다."
  exit 0
fi

# staged + unstaged 모두 add
git add -A

echo "📦 다음 변경사항을 커밋합니다:"
git diff --cached --stat

read -rp "커밋 메시지를 입력하세요: " MESSAGE
git commit -m "$MESSAGE"
git push origin main

echo "✅ GitHub push 완료."
