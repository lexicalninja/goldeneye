import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { ShellConfig, ShellType } from '../types.js';

const MARKER_START = '# goldeneye - coding agent launcher (start)';
const MARKER_END = '# goldeneye - coding agent launcher (end)';

const SHELL_BLOCK = `${MARKER_START}
if [ -t 1 ]; then
  goldeneye
fi
${MARKER_END}`;

const FISH_BLOCK = `${MARKER_START}
if isatty 1
  goldeneye
end
${MARKER_END}`;

export function detectShell(): ShellConfig {
  const shell = process.env.SHELL ?? '';
  const home = homedir();
  const isMac = process.platform === 'darwin';

  if (shell.includes('zsh')) {
    return { type: 'zsh', rcFile: join(home, '.zshrc') };
  }

  if (shell.includes('bash')) {
    const rcFile = isMac
      ? join(home, '.bash_profile')
      : join(home, '.bashrc');
    return { type: 'bash', rcFile };
  }

  if (shell.includes('fish')) {
    return { type: 'fish', rcFile: join(home, '.config/fish/config.fish') };
  }

  return { type: 'unknown', rcFile: '' };
}

export function isInstalled(config: ShellConfig): boolean {
  if (!config.rcFile || !existsSync(config.rcFile)) {
    return false;
  }

  const content = readFileSync(config.rcFile, 'utf-8');
  return content.includes(MARKER_START);
}

export function install(): { success: boolean; message: string } {
  const config = detectShell();

  if (config.type === 'unknown') {
    return {
      success: false,
      message: 'Could not detect shell. Please add goldeneye to your shell rc file manually.',
    };
  }

  if (isInstalled(config)) {
    return {
      success: true,
      message: `Goldeneye is already installed in ${config.rcFile}`,
    };
  }

  const block = config.type === 'fish' ? FISH_BLOCK : SHELL_BLOCK;

  let content = '';
  if (existsSync(config.rcFile)) {
    content = readFileSync(config.rcFile, 'utf-8');
  }

  content = content.trimEnd() + '\n\n' + block + '\n';
  writeFileSync(config.rcFile, content);

  return {
    success: true,
    message: `Goldeneye installed to ${config.rcFile}. Restart your terminal or run: source ${config.rcFile}`,
  };
}

export function uninstall(): { success: boolean; message: string } {
  const config = detectShell();

  if (config.type === 'unknown') {
    return {
      success: false,
      message: 'Could not detect shell. Please remove goldeneye from your shell rc file manually.',
    };
  }

  if (!isInstalled(config)) {
    return {
      success: true,
      message: 'Goldeneye is not installed in your shell rc file.',
    };
  }

  let content = readFileSync(config.rcFile, 'utf-8');

  // Remove the block including markers and surrounding newlines
  const regex = new RegExp(
    `\\n*${escapeRegex(MARKER_START)}[\\s\\S]*?${escapeRegex(MARKER_END)}\\n*`,
    'g'
  );
  content = content.replace(regex, '\n');
  content = content.trimEnd() + '\n';

  writeFileSync(config.rcFile, content);

  return {
    success: true,
    message: `Goldeneye removed from ${config.rcFile}`,
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
