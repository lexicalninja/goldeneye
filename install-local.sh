#!/usr/bin/env bash
# Install goldeneye from the current directory (for development/local changes).
# Run: npm run build && ./install-local.sh

set -e

INSTALL_DIR="${GOLDENEYE_INSTALL_DIR:-$HOME/.goldeneye}"
BIN_DIR="${GOLDENEYE_BIN_DIR:-$HOME/.local/bin}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔫 Installing Goldeneye from local project..."

if [ ! -d "$SCRIPT_DIR/dist" ]; then
    echo "❌ Run 'npm run build' first."
    exit 1
fi

mkdir -p "$INSTALL_DIR"

# Copy built files and dependencies
echo "   Copying dist, node_modules, package.json..."
cp -r "$SCRIPT_DIR/dist" "$INSTALL_DIR/"
cp -r "$SCRIPT_DIR/node_modules" "$INSTALL_DIR/"
cp "$SCRIPT_DIR/package.json" "$INSTALL_DIR/"

# Create bin directory if needed
mkdir -p "$BIN_DIR"

# Create executable wrapper
cat > "$BIN_DIR/goldeneye" << WRAPPER
#!/usr/bin/env bash
INSTALL_DIR="${GOLDENEYE_INSTALL_DIR:-$HOME/.goldeneye}"
node "\$INSTALL_DIR/dist/index.js" "\$@"
WRAPPER
chmod +x "$BIN_DIR/goldeneye"

echo "✅ Goldeneye installed from local project!"
echo ""
echo "   Run 'goldeneye' to use the updated version."
