#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env"

# .env 체크
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env 파일이 없습니다: $ENV_FILE"
  exit 1
fi

source "$ENV_FILE"

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "❌ VERCEL_TOKEN이 설정되어 있지 않습니다."
  exit 1
fi

cd "$PROJECT_DIR"
echo "🚀 MyResume 배포 시작..."
vercel --prod --token="$VERCEL_TOKEN"
