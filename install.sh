#!/usr/bin/env bash
set -e

# Goldeneye Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/lexicalninja/goldeneye/main/install.sh | bash

REPO="https://github.com/lexicalninja/goldeneye.git"
INSTALL_DIR="${GOLDENEYE_INSTALL_DIR:-$HOME/.goldeneye}"
BIN_DIR="${GOLDENEYE_BIN_DIR:-$HOME/.local/bin}"

echo "🔫 Installing Goldeneye..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "   Install it from https://nodejs.org or via your package manager."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. You have $(node -v)."
    exit 1
fi

# Check for git
if ! command -v git &> /dev/null; then
    echo "❌ git is required but not installed."
    exit 1
fi

# Remove existing installation
if [ -d "$INSTALL_DIR" ]; then
    echo "   Removing existing installation..."
    rm -rf "$INSTALL_DIR"
fi

# Clone repo
echo "   Cloning repository..."
git clone --depth 1 "$REPO" "$INSTALL_DIR" 2>/dev/null

# Install dependencies and build
echo "   Installing dependencies..."
cd "$INSTALL_DIR"
npm install --silent 2>/dev/null
npm run build --silent 2>/dev/null

# Create bin directory if needed
mkdir -p "$BIN_DIR"

# Create executable wrapper
cat > "$BIN_DIR/goldeneye" << 'WRAPPER'
#!/usr/bin/env bash
INSTALL_DIR="${GOLDENEYE_INSTALL_DIR:-$HOME/.goldeneye}"
node "$INSTALL_DIR/dist/index.js" "$@"
WRAPPER
chmod +x "$BIN_DIR/goldeneye"

echo "✅ Goldeneye installed successfully!"
echo ""

# Check if bin is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo "⚠️  Add $BIN_DIR to your PATH:"
    echo ""
    echo "   # Add to your shell rc file:"
    echo "   export PATH=\"\$HOME/.local/bin:\$PATH\""
    echo ""
fi

echo "   Run 'goldeneye' to get started!"
echo "   Run 'goldeneye install' to auto-launch on terminal open."
