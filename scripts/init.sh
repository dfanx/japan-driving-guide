#!/usr/bin/env sh
set -eu

PROJECT_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$PROJECT_ROOT"

export npm_config_cache="$PROJECT_ROOT/.npm-cache"
npm ci --no-audit --no-fund
npm run install:browsers

echo "Initialization complete. Run: npm run verify"

