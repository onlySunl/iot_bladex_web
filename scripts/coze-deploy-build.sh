#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

echo "Installing dependencies..."
pnpm install --no-frozen-lockfile

echo "Building frontend with vue-cli-service..."
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm run build
