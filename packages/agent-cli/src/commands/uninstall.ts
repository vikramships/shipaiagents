import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { detectConfigFiles, readConfigFile, writeConfigFile, backupConfigFile } from '../utils/fileUtils';
import { getAgentById, getCategoryName } from '../utils/agentUtils';
import fs from 'fs-extra';
import path from 'path';

interface UninstallOptions {
  all?: boolean;
  dryRun?: boolean;
}

export async function uninstallCommand(agentIds: string[], options: UninstallOptions): Promise<void> {
  try {
    // Check agents directory
    const agentsDir = path.join(process.cwd(), '.claude', 'agents');

    if (!fs.existsSync(agentsDir)) {
      console.log(chalk.yellow('No agents directory found.'));
      return;
    }

    // Get installed agents by reading agent files
    const agentFiles = await fs.readdir(agentsDir);
    const installedAgents = agentFiles
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));

    if (installedAgents.length === 0) {
      console.log(chalk.blue('No agents are currently installed.'));
      return;
    }

    let agentsToRemove: string[] = agentIds;

    if (options.all) {
      agentsToRemove = installedAgents;
    }

    if (agentsToRemove.length === 0) {
      console.log(chalk.yellow('No agents specified for removal.'));
      console.log(chalk.white('Use --all to remove all installed agents or specify agent names.'));
      return;
    }

    // Validate agent IDs and find matching installed agents
    const validRemovals = agentsToRemove.map(id => {
      const agent = getAgentById(id);
      const isInstalled = installedAgents.includes(id);
      if (!agent) {
        console.log(chalk.yellow(`⚠️  Agent not found: ${id}`));
        return null;
      }
      if (!isInstalled) {
        console.log(chalk.yellow(`⚠️  Agent not installed: ${agent.name}`));
        return null;
      }
      return agent;
    }).filter(Boolean);

    if (validRemovals.length === 0) {
      console.log(chalk.red('No valid agents found for removal.'));
      return;
    }

    // Show what will be removed
    console.log(chalk.bold.red('\n🗑️  Ready to remove:'));
    validRemovals.forEach(agent => {
      const agentFilePath = path.join(agentsDir, `${agent!.id}.md`);
      console.log(`  ${chalk.bold(agent!.name)} (${agent!.id})`);
      console.log(chalk.dim(`    → ${agentFilePath}`));
    });

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

    // Create backup of CLAUDE.md if it exists
    const spinner = ora('Creating backup...').start();
    try {
      const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
      if (fs.existsSync(claudeMdPath)) {
        await backupConfigFile(claudeMdPath);
        spinner.succeed('Backup created');
      } else {
        spinner.stop();
      }
    } catch (error) {
      spinner.fail('Failed to create backup');
      throw error;
    }

    // Remove agent files
    for (const agent of validRemovals) {
      spinner.start(`Removing ${agent!.name}...`);
      try {
        const agentFilePath = path.join(agentsDir, `${agent!.id}.md`);
        await fs.remove(agentFilePath);
        spinner.succeed(`Removed ${agent!.name}`);
      } catch (error) {
        spinner.fail(`Failed to remove ${agent!.name}`);
        throw error;
      }
    }

    // Update main CLAUDE.md to remove agent references
    spinner.start('Updating main configuration...');
    try {
      const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
      let claudeContent = '';

      try {
        claudeContent = await fs.readFile(claudeMdPath, 'utf8');
      } catch (error) {
        // CLAUDE.md doesn't exist, nothing to update
        spinner.stop();
        return;
      }

      // Remove agent links from the agents section
      const remainingAgents = installedAgents.filter(id => !validRemovals.some(agent => agent!.id === id));

      const agentsSection = '\n## Installed Agents\n\n';
      const agentList = remainingAgents.map(agentId => {
        const agent = getAgentById(agentId);
        return agent ? `- [${agent.name}](${path.join('.claude/agents', `${agentId}.md`)}) - ${agent.description}` : '';
      }).filter(Boolean).join('\n');

      const agentsSectionStart = claudeContent.indexOf('## Installed Agents');
      if (agentsSectionStart !== -1) {
        const nextSectionMatch = claudeContent.slice(agentsSectionStart).match(/^##/m);
        if (nextSectionMatch && nextSectionMatch.index! > 0) {
          const endPosition = agentsSectionStart + nextSectionMatch.index!;
          claudeContent = claudeContent.slice(0, agentsSectionStart) +
                         (remainingAgents.length > 0 ? agentsSection + agentList + '\n' : '') +
                         claudeContent.slice(endPosition);
        } else {
          claudeContent = claudeContent.slice(0, agentsSectionStart) +
                         (remainingAgents.length > 0 ? agentsSection + agentList : '');
        }
      }

      await fs.writeFile(claudeMdPath, claudeContent, 'utf8');
      spinner.succeed('Configuration updated');
    } catch (error) {
      spinner.fail('Failed to update configuration');
      throw error;
    }

    console.log(chalk.green(`\n✅ Successfully removed ${validRemovals.length} agent(s)!`));

  } catch (error) {
    console.error(chalk.red('Removal failed:'), error);
    process.exit(1);
  }
}