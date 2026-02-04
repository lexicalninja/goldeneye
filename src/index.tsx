#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import chalk from 'chalk';
import { App } from './App.js';
import { install, uninstall } from './utils/shellSetup.js';
import { detectAgents, getInstalledAgents } from './utils/detectAgents.js';
import { assignCharacters } from './utils/characters.js';
import { launchAgent } from './utils/launchAgent.js';
import { getVersion } from './utils/version.js';
import { checkForUpdates } from './utils/updateChecker.js';
import type { Agent } from './types.js';

const version = getVersion();

const cli = meow(
  `
  ${chalk.yellow.bold('GOLDENEYE')} ${chalk.gray(`v${version}`)} - Coding Agent Launcher

  ${chalk.bold('Usage')}
    $ goldeneye              Launch the picker UI
    $ goldeneye install      Add to shell startup
    $ goldeneye uninstall    Remove from shell startup
    $ goldeneye list         List detected agents

  ${chalk.bold('Options')}
    --help       Show this help message
    --version    Show version number
    --update     Update to the latest version

  ${chalk.bold('Keyboard Shortcuts')} (in UI)
    ↑/↓          Navigate
    Enter        Select agent
    q/Esc        Exit to terminal
`,
  {
    importMeta: import.meta,
    flags: {
      update: {
        type: 'boolean',
        shortFlag: 'u',
      },
    },
    version,
  }
);

const command = cli.input[0];

async function runUpdate(): Promise<void> {
  const { spawn } = await import('node:child_process');

  console.log(chalk.yellow.bold('\nGOLDENEYE') + ' - Updating...\n');

  // Check for updates first
  const updateInfo = await checkForUpdates();
  if (updateInfo && !updateInfo.updateAvailable) {
    console.log(chalk.green('✓'), `Already on latest version (${updateInfo.currentVersion})`);
    return;
  }

  if (updateInfo) {
    console.log(chalk.gray(`Updating ${updateInfo.currentVersion} → ${updateInfo.latestVersion}\n`));
  }

  const child = spawn('bash', ['-c', 'curl -fsSL https://raw.githubusercontent.com/lexicalninja/goldeneye/main/install.sh | bash'], {
    stdio: 'inherit',
    shell: true,
  });

  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Update failed with exit code ${code}`));
      }
    });
    child.on('error', reject);
  });
}

async function main() {
  // Handle --update flag
  if (cli.flags.update) {
    await runUpdate();
    return;
  }

  switch (command) {
    case 'install': {
      const result = install();
      if (result.success) {
        console.log(chalk.green('✓'), result.message);
      } else {
        console.log(chalk.red('✗'), result.message);
        process.exit(1);
      }
      break;
    }

    case 'uninstall': {
      const result = uninstall();
      if (result.success) {
        console.log(chalk.green('✓'), result.message);
      } else {
        console.log(chalk.red('✗'), result.message);
        process.exit(1);
      }
      break;
    }

    case 'list': {
      const [agents, updateInfo] = await Promise.all([
        detectAgents(),
        checkForUpdates(),
      ]);
      const installed = assignCharacters(getInstalledAgents(agents));

      console.log(chalk.yellow.bold('\nGOLDENEYE') + chalk.gray(` v${version}`) + ' - Detected Agents\n');

      if (updateInfo?.updateAvailable) {
        console.log(
          chalk.yellow('⚡ Update available:'),
          chalk.gray(`${updateInfo.currentVersion} → ${updateInfo.latestVersion}`),
        );
        console.log(
          chalk.gray('   Run: curl -fsSL https://raw.githubusercontent.com/lexicalninja/goldeneye/main/install.sh | bash\n'),
        );
      }

      if (installed.length === 0) {
        console.log(chalk.gray('No coding agents detected.\n'));
      } else {
        for (const agent of installed) {
          console.log(chalk.green('✓'), agent.displayName);
        }
        console.log();
      }

      console.log(chalk.gray('Not installed:'));
      for (const agent of agents.filter((a) => !a.installed)) {
        console.log(chalk.gray('  ○'), chalk.gray(agent.name));
      }
      console.log();
      break;
    }

    case undefined: {
      // Launch interactive UI
      let selectedAgent: Agent | null = null;

      const { waitUntilExit } = render(
        <App onSelectAgent={(agent) => { selectedAgent = agent; }} />
      );

      await waitUntilExit();

      if (selectedAgent) {
        launchAgent(selectedAgent);
      }
      break;
    }

    default: {
      console.log(chalk.red('Unknown command:'), command);
      console.log('Run', chalk.cyan('goldeneye --help'), 'for usage information.');
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(chalk.red('Error:'), err.message);
  process.exit(1);
});
