export interface Agent {
  name: string;
  command: string;
  args?: string[];
  installed: boolean;
  displayName?: string;
}

export interface AgentDefinition {
  name: string;
  command: string;
  args?: string[];
  check: () => Promise<boolean>;
}

export type ShellType = 'zsh' | 'bash' | 'fish' | 'unknown';

export interface ShellConfig {
  type: ShellType;
  rcFile: string;
}
