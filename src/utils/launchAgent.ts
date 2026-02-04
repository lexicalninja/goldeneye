import { spawn } from 'node:child_process';
import type { Agent } from '../types.js';

export function launchAgent(agent: Agent): void {
  const args = agent.args ?? [];

  const child = spawn(agent.command, args, {
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
