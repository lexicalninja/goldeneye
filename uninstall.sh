#!/usr/bin/env bash
set -e

# Goldeneye Uninstaller
# Usage: curl -fsSL https://raw.githubusercontent.com/lexicalninja/goldeneye/main/uninstall.sh | bash

INSTALL_DIR="${GOLDENEYE_INSTALL_DIR:-$HOME/.goldeneye}"
BIN_DIR="${GOLDENEYE_BIN_DIR:-$HOME/.local/bin}"

echo "🔫 Uninstalling Goldeneye..."

# Remove from shell rc if installed
if [ -d "$INSTALL_DIR" ]; then
    cd "$INSTALL_DIR"
    if command -v node &> /dev/null; then
        node dist/index.js uninstall 2>/dev/null || true
    fi
fi

# Remove installation directory
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    echo "   Removed $INSTALL_DIR"
fi

# Remove executable
if [ -f "$BIN_DIR/goldeneye" ]; then
    rm "$BIN_DIR/goldeneye"
    echo "   Removed $BIN_DIR/goldeneye"
fi

echo "✅ Goldeneye uninstalled successfully!"
