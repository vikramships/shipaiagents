import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { detectConfigFiles, findOrCreateConfigFile, readConfigFile, writeConfigFile, backupConfigFile } from '../utils/fileUtils';
import { getAgentsByCategory, getAgentById, formatAgentForInstall, updateAgentInContent, getCategoryName } from '../utils/agentUtils';

interface BatchOptions {
  category?: string;
  featured?: boolean;
  file?: string;
  dryRun?: boolean;
}

export async function batchCommand(options: BatchOptions): Promise<void> {
  try {
    console.log(chalk.bold.blue('\n🚀 Batch Agent Operations\n'));

    // Select operation type
    const { operation } = await inquirer.prompt([
      {
        type: 'list',
        name: 'operation',
        message: 'Select batch operation:',
        choices: [
          { name: '📦 Install multiple agents', value: 'install' },
          { name: '🗑️  Uninstall multiple agents', value: 'uninstall' },
          { name: '🔄 Update multiple agents', value: 'update' },
          { name: '📋 Export agent configuration', value: 'export' },
          { name: '📥 Import agent configuration', value: 'import' }
        ]
      }
    ]);

    switch (operation) {
      case 'install':
        await batchInstall(options);
        break;
      case 'uninstall':
        await batchUninstall(options);
        break;
      case 'update':
        await batchUpdate(options);
        break;
      case 'export':
        await batchExport(options);
        break;
      case 'import':
        await batchImport(options);
        break;
    }

  } catch (error) {
    console.error(chalk.red('Batch operation failed:'), error);
    process.exit(1);
  }
}

async function batchInstall(options: BatchOptions): Promise<void> {
  let agentsToInstall = [];

  if (options.category) {
    agentsToInstall = getAgentsByCategory(options.category);
    console.log(chalk.blue(`Selected category: ${getCategoryName(options.category)} (${agentsToInstall.length} agents)`));
  } else if (options.featured) {
    agentsToInstall = getAgentsByCategory('all').filter(agent => agent.featured);
    console.log(chalk.blue(`Selected featured agents (${agentsToInstall.length} agents)`));
  } else {
    // Interactive selection
    const { selectedAgents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedAgents',
        message: 'Select agents to install:',
        choices: getAgentsByCategory('all').map(agent => ({
          name: `${agent.featured ? '⭐' : '  '} ${agent.name} - ${agent.description.substring(0, 60)}...`,
          value: agent.id
        })),
        validate: (input) => {
          if (input.length === 0) {
            return 'Please select at least one agent.';
          }
          return true;
        }
      }
    ]);

    agentsToInstall = selectedAgents.map((id: string) => getAgentById(id)).filter(Boolean);
  }

  if (agentsToInstall.length === 0) {
    console.log(chalk.yellow('No agents selected for installation.'));
    return;
  }

  // Confirm batch installation
  console.log(chalk.bold.blue('\n📦 Ready to install:'));
  agentsToInstall.forEach((agent: any) => {
    console.log(`  ${chalk.bold(agent!.name)} (${getCategoryName(agent!.category)})`);
  });

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `Install ${agentsToInstall.length} agents?`,
      default: true
    }
  ]);

  if (!confirmed) {
    console.log(chalk.yellow('Batch installation cancelled.'));
    return;
  }

  // Perform installation
  const configFile = await findOrCreateConfigFile('claude-code');
  let configContent = '';

  try {
    configContent = await readConfigFile(configFile.path);
  } catch (error) {
    console.log(chalk.blue('Creating new configuration file...'));
  }

  if (options.dryRun) {
    console.log(chalk.yellow('\n🔍 Dry run mode - no changes made.'));
    return;
  }

  const spinner = ora('Installing agents...').start();

  try {
    // Create backup
    if (configContent) {
      await backupConfigFile(configFile.path);
    }

    // Install all agents
    for (const agent of agentsToInstall) {
      configContent = updateAgentInContent(configContent, agent!);
    }

    // Write final content
    await writeConfigFile(configFile.path, configContent);
    spinner.succeed(`Installed ${agentsToInstall.length} agents`);

    console.log(chalk.green(`\n✅ Batch installation completed successfully!`));

  } catch (error) {
    spinner.fail('Installation failed');
    throw error;
  }
}

async function batchUninstall(options: BatchOptions): Promise<void> {
  // Implementation for batch uninstall
  console.log(chalk.yellow('Batch uninstall not implemented yet.'));
}

async function batchUpdate(options: BatchOptions): Promise<void> {
  // Implementation for batch update
  console.log(chalk.yellow('Batch update not implemented yet.'));
}

async function batchExport(options: BatchOptions): Promise<void> {
  const configFiles = await detectConfigFiles();
  const claudeConfig = configFiles.find(f => f.type === 'claude-code');

  if (!claudeConfig || !claudeConfig.exists) {
    console.log(chalk.yellow('No CLAUDE.md configuration file found to export.'));
    return;
  }

  const exportPath = options.file || 'agent-config-export.json';
  const spinner = ora('Exporting configuration...').start();

  try {
    const content = await readConfigFile(claudeConfig.path);
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      configType: 'claude-code',
      content: content,
      sourcePath: claudeConfig.path
    };

    await require('fs-extra').writeJson(exportPath, exportData, { spaces: 2 });
    spinner.succeed(`Configuration exported to ${exportPath}`);

    console.log(chalk.green(`\n✅ Export completed!`));
    console.log(chalk.white(`File: ${exportPath}`));

  } catch (error) {
    spinner.fail('Export failed');
    throw error;
  }
}

async function batchImport(options: BatchOptions): Promise<void> {
  const importPath = options.file || 'agent-config-export.json';

  if (!require('fs-extra').pathExistsSync(importPath)) {
    console.log(chalk.red(`Import file not found: ${importPath}`));
    console.log(chalk.white('Use --file <path> to specify the import file.'));
    return;
  }

  const spinner = ora('Importing configuration...').start();

  try {
    const importData = await require('fs-extra').readJson(importPath);

    if (!importData.content) {
      throw new Error('Invalid export file format');
    }

    const configFile = await findOrCreateConfigFile('claude-code');
    await writeConfigFile(configFile.path, importData.content);

    spinner.succeed(`Configuration imported from ${importPath}`);
    console.log(chalk.green(`\n✅ Import completed!`));
    console.log(chalk.white(`Target: ${configFile.path}`));

  } catch (error) {
    spinner.fail('Import failed');
    throw error;
  }
}