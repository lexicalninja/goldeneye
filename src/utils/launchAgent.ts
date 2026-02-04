import { spawn } from 'node:child_process';
import type { Agent } from '../types.js';

/**
 * Restore terminal to normal mode before spawning. Ink puts stdin in raw mode
 * for key capture; if not restored, child processes may not detect a TTY.
 */
function restoreTerminal(): void {
  if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false);
  }
}

/**
 * Copilot CLI requires an interactive TTY. When spawned from Node (after Ink
 * exits), it doesn't detect one. `script` allocates a pseudo-TTY so Copilot
 * runs in interactive mode. (Built-in on macOS and Linux.)
 */
function launchCopilot(agent: Agent): void {
  const child = spawn('script', ['-q', '/dev/null', agent.command], {
    stdio: 'inherit',
  });
  child.on('exit', (code) => process.exit(code ?? 0));
  child.on('error', (err) => {
    console.error(`Failed to launch ${agent.name}:`, err.message);
    process.exit(1);
  });
}

export function launchAgent(agent: Agent): void {
  restoreTerminal();

  if (agent.command === 'copilot') {
    launchCopilot(agent);
    return;
  }

  const child = spawn(agent.command, agent.args ?? [], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error(`Failed to launch ${agent.name}:`, err.message);
    process.exit(1);
  });
}
