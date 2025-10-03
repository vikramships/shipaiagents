#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { listCommand } from './commands/list';
import { installCommand } from './commands/install';
import { uninstallCommand } from './commands/uninstall';
import { updateCommand } from './commands/update';
import { statusCommand } from './commands/status';
import { searchCommand } from './commands/search';
import { configCommand } from './commands/config';
import { batchCommand } from './commands/batch';
import { templateCommand } from './commands/template';

const program = new Command();

program
  .name('shipai')
  .description('CLI tool to install and manage AI coding agents from shipaiagents.com')
  .version('1.0.0')
  .usage('<command> [options]');

program
  .command('list')
  .description('List all available agents')
  .option('-c, --category <category>', 'Filter by category')
  .option('-f, --featured', 'Show only featured agents')
  .option('-j, --json', 'Output as JSON')
  .action(listCommand);

program
  .command('install <agent...>')
  .description('Install one or more agents')
  .option('-i, --interactive', 'Interactive agent selection')
  .option('-c, --category <category>', 'Install all agents from category')
  .option('--force', 'Force overwrite existing agents')
  .option('--dry-run', 'Show what would be installed without making changes')
  .action(installCommand);

program
  .command('uninstall <agent...>')
  .description('Remove one or more installed agents')
  .option('-a, --all', 'Remove all installed agents')
  .option('--dry-run', 'Show what would be removed without making changes')
  .action(uninstallCommand);

program
  .command('update [agent...]')
  .description('Update installed agents to latest versions')
  .option('-a, --all', 'Update all installed agents')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(updateCommand);

program
  .command('status')
  .description('Show installed agents and their status')
  .option('-j, --json', 'Output as JSON')
  .action(statusCommand);

program
  .command('search <query>')
  .description('Search for agents by name, description, or keywords')
  .option('-c, --category <category>', 'Search within specific category')
  .option('-j, --json', 'Output as JSON')
  .action(searchCommand);

program
  .command('config')
  .description('Configure CLI settings and preferences')
  .option('-s, --show', 'Show current configuration')
  .option('-r, --reset', 'Reset configuration to defaults')
  .action(configCommand);

program
  .command('batch')
  .description('Perform batch operations on multiple agents')
  .option('-c, --category <category>', 'Target specific category')
  .option('-f, --featured', 'Target only featured agents')
  .option('--file <path>', 'Specify file for export/import operations')
  .option('--dry-run', 'Show what would be done without making changes')
  .action(batchCommand);

program
  .command('template')
  .description('Create and manage agent templates')
  .option('-l, --list', 'List available templates')
  .option('-u, --use <template-id>', 'Use a specific template')
  .option('-c, --create', 'Create agent from template')
  .action(templateCommand);

// Global error handler
program.configureOutput({
  writeErr: (str) => process.stderr.write(chalk.red(str)),
  writeOut: (str) => process.stdout.write(str),
});

// Handle unknown commands
program.on('command:*', ([cmd]) => {
  console.error(chalk.red(`Unknown command: ${cmd}`));
  console.log('See --help for a list of available commands.');
  process.exit(1);
});

// Parse and run
program.parse();