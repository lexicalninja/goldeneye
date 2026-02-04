import { execSync } from 'node:child_process';
import type { Agent, AgentDefinition } from '../types.js';

function commandExists(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function ghExtensionInstalled(extension: string): boolean {
  try {
    const output = execSync('gh extension list', { encoding: 'utf-8' });
    return output.includes(extension);
  } catch {
    return false;
  }
}

const agentDefinitions: AgentDefinition[] = [
  {
    name: 'Claude Code',
    command: 'claude',
    check: async () => commandExists('claude'),
  },
  {
    name: 'Aider',
    command: 'aider',
    check: async () => commandExists('aider'),
  },
  {
    name: 'GitHub Copilot',
    command: 'gh',
    args: ['copilot'],
    check: async () => commandExists('gh') && ghExtensionInstalled('copilot'),
  },
  {
    name: 'Cursor',
    command: 'cursor',
    check: async () => commandExists('cursor'),
  },
  {
    name: 'Continue',
    command: 'continue',
    check: async () => commandExists('continue'),
  },
  {
    name: 'Cody CLI',
    command: 'cody',
    check: async () => commandExists('cody'),
  },
  {
    name: 'Gemini CLI',
    command: 'gemini',
    check: async () => commandExists('gemini'),
  },
  {
    name: 'Codex',
    command: 'codex',
    check: async () => commandExists('codex'),
  },
];

export async function detectAgents(): Promise<Agent[]> {
  const agents: Agent[] = [];

  for (const def of agentDefinitions) {
    const installed = await def.check();
    agents.push({
      name: def.name,
      command: def.command,
      args: def.args,
      installed,
    });
  }

  return agents;
}

export function getInstalledAgents(agents: Agent[]): Agent[] {
  return agents.filter((agent) => agent.installed);
}
