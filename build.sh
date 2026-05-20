#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WASM_BUILD_DIR="$SCRIPT_DIR/wasm-build"
CDN_URL="https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.9.4-2026-05-19-a/dist/ruby+stdlib.wasm"

cd "$WASM_BUILD_DIR"

echo "==> bundle install"
bundle config set path 'vendor/bundle'
bundle install

echo "==> Downloading wasi-vfs toolchain"
bundle exec rbwasm build --ruby-version 3.4 --disable-gems -o /dev/null

echo "==> Downloading base.wasm"
curl -L "$CDN_URL" -o base.wasm

GEMS_PATH=$(ls -d vendor/bundle/ruby/*/gems | head -1)
echo "==> Packing wasm (gems: $GEMS_PATH)"
mkdir -p "$SCRIPT_DIR/src/wasm"
bundle exec rbwasm pack base.wasm --dir "$GEMS_PATH"::/bundle -o "$SCRIPT_DIR/src/wasm/rubocop-ruby.wasm"

echo "==> Cleaning up base.wasm"
rm base.wasm

echo "==> Done! Run ./serve.sh to start the server."
