import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { detectConfigFiles, readConfigFile, writeConfigFile, backupConfigFile, getInstalledAgents } from '../utils/fileUtils';
import { getAgentById, removeAgentFromContent } from '../utils/agentUtils';

interface UninstallOptions {
  all?: boolean;
  dryRun?: boolean;
}

export async function uninstallCommand(agentIds: string[], options: UninstallOptions): Promise<void> {
  try {
    // Find configuration files
    const configFiles = await detectConfigFiles();
    const claudeConfig = configFiles.find(f => f.type === 'claude-code');

    if (!claudeConfig || !claudeConfig.exists) {
      console.log(chalk.yellow('No CLAUDE.md configuration file found.'));
      return;
    }

    // Get installed agents
    const installedAgents = await getInstalledAgents(claudeConfig.path);

    if (installedAgents.length === 0) {
      console.log(chalk.blue('No agents are currently installed.'));
      return;
    }

    let agentsToRemove: string[] = agentIds;

    if (options.all) {
      agentsToRemove = installedAgents.map(agent => agent.id);
    }

    if (agentsToRemove.length === 0) {
      console.log(chalk.yellow('No agents specified for removal.'));
      console.log(chalk.white('Use --all to remove all installed agents or specify agent names.'));
      return;
    }

    // Validate agent IDs and find matching installed agents
    const validRemovals = agentsToRemove.map(id => {
      const installedAgent = installedAgents.find(agent => agent.id === id);
      if (!installedAgent) {
        console.log(chalk.yellow(`⚠️  Agent not installed: ${id}`));
        return null;
      }
      return installedAgent;
    }).filter(Boolean);

    if (validRemovals.length === 0) {
      console.log(chalk.red('No valid agents found for removal.'));
      return;
    }

    // Show what will be removed
    console.log(chalk.bold.red('\n🗑️  Ready to remove:'));
    validRemovals.forEach(agent => {
      console.log(`  ${chalk.bold(agent!.name)} (${agent!.id})`);
    });
    console.log(chalk.dim(`From file: ${claudeConfig.path}`));

    if (options.dryRun) {
      console.log(chalk.yellow('\n🔍 Dry run mode - no changes made.'));
      return;
    }

    // Confirm removal
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Are you sure you want to remove these agents?',
        default: false
      }
    ]);

    if (!confirmed) {
      console.log(chalk.yellow('Removal cancelled.'));
      return;
    }

    // Create backup
    const spinner = ora('Creating backup...').start();
    try {
      await backupConfigFile(claudeConfig.path);
      spinner.succeed('Backup created');
    } catch (error) {
      spinner.fail('Failed to create backup');
      throw error;
    }

    // Read current config and remove agents
    spinner.start('Reading configuration...');
    let configContent = await readConfigFile(claudeConfig.path);
    spinner.succeed('Configuration loaded');

    for (const agent of validRemovals) {
      spinner.start(`Removing ${agent!.name}...`);
      try {
        configContent = removeAgentFromContent(configContent, agent!.id);
        spinner.succeed(`Removed ${agent!.name}`);
      } catch (error) {
        spinner.fail(`Failed to remove ${agent!.name}`);
        throw error;
      }
    }

    // Write updated content
    spinner.start('Writing configuration file...');
    try {
      await writeConfigFile(claudeConfig.path, configContent);
      spinner.succeed('Configuration updated');
    } catch (error) {
      spinner.fail('Failed to write configuration');
      throw error;
    }

    console.log(chalk.green(`\n✅ Successfully removed ${validRemovals.length} agent(s)!`));

  } catch (error) {
    console.error(chalk.red('Removal failed:'), error);
    process.exit(1);
  }
}