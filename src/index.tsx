#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import chalk from 'chalk';
import { App } from './App.js';
import { install, uninstall } from './utils/shellSetup.js';
import { detectAgents, getInstalledAgents } from './utils/detectAgents.js';
import { assignCharacters } from './utils/characters.js';

const cli = meow(
  `
  ${chalk.yellow.bold('GOLDENEYE')} - Coding Agent Launcher

  ${chalk.bold('Usage')}
    $ goldeneye              Launch the picker UI
    $ goldeneye install      Add to shell startup
    $ goldeneye uninstall    Remove from shell startup
    $ goldeneye list         List detected agents

  ${chalk.bold('Options')}
    --help       Show this help message
    --version    Show version number

  ${chalk.bold('Keyboard Shortcuts')} (in UI)
    ↑/↓          Navigate
    Enter        Select agent
    q/Esc        Exit to terminal
`,
  {
    importMeta: import.meta,
    flags: {},
  }
);

const command = cli.input[0];

async function main() {
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
      const agents = await detectAgents();
      const installed = assignCharacters(getInstalledAgents(agents));

      console.log(chalk.yellow.bold('\nGOLDENEYE') + ' - Detected Agents\n');

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
      render(<App />);
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
