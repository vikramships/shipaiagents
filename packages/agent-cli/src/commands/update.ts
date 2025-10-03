import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { detectConfigFiles, readConfigFile, writeConfigFile, backupConfigFile, getInstalledAgents } from '../utils/fileUtils';
import { getAgentById, updateAgentInContent } from '../utils/agentUtils';

interface UpdateOptions {
  all?: boolean;
  dryRun?: boolean;
}

export async function updateCommand(agentIds: string[], options: UpdateOptions): Promise<void> {
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

    let agentsToUpdate: string[] = agentIds;

    if (options.all) {
      agentsToUpdate = installedAgents.map(agent => agent.id);
    }

    if (agentsToUpdate.length === 0) {
      console.log(chalk.yellow('No agents specified for update.'));
      console.log(chalk.white('Use --all to update all installed agents or specify agent names.'));
      return;
    }

    // Find agents that need updating
    const updatesAvailable = agentsToUpdate.map(id => {
      const installedAgent = installedAgents.find(agent => agent.id === id);
      const latestAgent = getAgentById(id);

      if (!installedAgent || !latestAgent) {
        console.log(chalk.yellow(`⚠️  Agent not found: ${id}`));
        return null;
      }

      // Simple version comparison (in real implementation, would be more sophisticated)
      const needsUpdate = true; // For now, always update

      return {
        installed: installedAgent,
        latest: latestAgent,
        needsUpdate
      };
    }).filter(Boolean);

    if (updatesAvailable.length === 0) {
      console.log(chalk.blue('No agents need updating.'));
      return;
    }

    // Filter to only agents that need updates
    const agentsNeedingUpdate = updatesAvailable.filter(update => update!.needsUpdate);

    if (agentsNeedingUpdate.length === 0) {
      console.log(chalk.green('All specified agents are up to date.'));
      return;
    }

    // Show what will be updated
    console.log(chalk.bold.blue('\n🔄 Updates available:'));
    agentsNeedingUpdate.forEach(update => {
      console.log(`  ${chalk.bold(update!.latest.name)} (${update!.installed.version} → latest)`);
    });
    console.log(chalk.dim(`Target file: ${claudeConfig.path}`));

    if (options.dryRun) {
      console.log(chalk.yellow('\n🔍 Dry run mode - no changes made.'));
      return;
    }

    // Confirm update
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Proceed with updates?',
        default: true
      }
    ]);

    if (!confirmed) {
      console.log(chalk.yellow('Update cancelled.'));
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

    // Read current config and update agents
    spinner.start('Reading configuration...');
    let configContent = await readConfigFile(claudeConfig.path);
    spinner.succeed('Configuration loaded');

    for (const update of agentsNeedingUpdate) {
      spinner.start(`Updating ${update!.latest.name}...`);
      try {
        configContent = updateAgentInContent(configContent, update!.latest);
        spinner.succeed(`Updated ${update!.latest.name}`);
      } catch (error) {
        spinner.fail(`Failed to update ${update!.latest.name}`);
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

    console.log(chalk.green(`\n✅ Successfully updated ${agentsNeedingUpdate.length} agent(s)!`));

  } catch (error) {
    console.error(chalk.red('Update failed:'), error);
    process.exit(1);
  }
}