# GOLDENEYE

A sleek terminal UI for launching your coding agents. Auto-detects installed AI coding assistants and lets you pick one with style.

Each agent is randomly assigned a GoldenEye 64 character name because why not.

![Goldeneye Demo](https://raw.githubusercontent.com/lexicalninja/goldeneye/main/assets/demo.gif)

## Features

- **Auto-detection** - Scans for installed coding agents (Claude, Gemini, Copilot, Aider, etc.)
- **Interactive TUI** - Arrow key navigation with visual selection
- **Shell auto-start** - Optional launch on every new terminal
- **GoldenEye 64 flair** - Random character names (Oddjob, Jaws, Boris...)

## Supported Agents

| Agent | Command |
|-------|---------|
| Claude Code | `claude` |
| Gemini CLI | `gemini` |
| GitHub Copilot | `copilot` |
| Aider | `aider` |
| Cursor | `cursor` |
| Continue | `continue` |
| Cody CLI | `cody` |
| Codex | `codex` |

## Installation

### Quick Install (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/lexicalninja/goldeneye/main/install.sh | bash
```

This installs to `~/.goldeneye` and creates an executable at `~/.local/bin/goldeneye`.

### Manual Install

```bash
git clone https://github.com/lexicalninja/goldeneye.git
cd goldeneye
npm install
npm run build
npm link
```

### Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/lexicalninja/goldeneye/main/uninstall.sh | bash
```

## Usage

### Launch the picker

```bash
goldeneye
```

```
╭──────────────────────────────────╮
│           GOLDENEYE              │
│      Coding Agent Launcher       │
╰──────────────────────────────────╯

  ❯ Oddjob (Claude Code)
    Jaws (GitHub Copilot)
    Boris (Gemini CLI)
    ─────────────
    Skip → Terminal

┌──────────────────────────────────┐
│  ↑↓ Navigate  ⏎ Select  q Quit  │
└──────────────────────────────────┘
```

### List detected agents

```bash
goldeneye list
```

```
GOLDENEYE - Detected Agents

✓ Baron Samedi (Claude Code)
✓ Xenia (GitHub Copilot)
✓ Natalya (Gemini CLI)

Not installed:
  ○ Aider
  ○ Cursor
  ○ Continue
  ○ Cody CLI
  ○ Codex
```

### Auto-start on terminal open

```bash
goldeneye install    # Add to shell startup
goldeneye uninstall  # Remove from shell startup
```

Supports zsh, bash, and fish shells.

### Update

```bash
goldeneye update
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate list |
| `Enter` | Launch selected agent |
| `q` / `Esc` | Exit to terminal |

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GOLDENEYE_INSTALL_DIR` | `~/.goldeneye` | Installation directory |
| `GOLDENEYE_BIN_DIR` | `~/.local/bin` | Executable location |

## Requirements

- Node.js 18+
- At least one supported coding agent installed

## License

MIT
