import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { detectConfigFiles, findOrCreateConfigFile, readConfigFile, writeConfigFile, backupConfigFile } from '../utils/fileUtils';
import { getAgentById, getAgentsByCategory, getAllAgents, formatAgentForInstall, updateAgentInContent, getCategoryName } from '../utils/agentUtils';

interface InstallOptions {
  interactive?: boolean;
  category?: string;
  force?: boolean;
  dryRun?: boolean;
}

export async function installCommand(agentIds: string[], options: InstallOptions): Promise<void> {
  try {
    // Detect available config files
    const configFiles = await detectConfigFiles();

    if (configFiles.length === 0) {
      console.log(chalk.yellow('No AI assistant configuration files found.'));
      console.log(chalk.blue('Creating CLAUDE.md configuration file...'));
    }

    // Find or create CLAUDE.md file (default for Claude Code)
    const configFile = await findOrCreateConfigFile('claude-code');

    if (!configFile.exists) {
      console.log(chalk.green(`✓ Created ${configFile.path}`));
    }

    // Determine which agents to install
    let agentsToInstall: string[] = agentIds;

    if (options.interactive && !options.category) {
      agentsToInstall = await selectAgentsInteractively();
    } else if (options.category) {
      const categoryAgents = getAgentsByCategory(options.category);
      agentsToInstall = categoryAgents.map(agent => agent.id);

      if (agentsToInstall.length === 0) {
        console.log(chalk.yellow(`No agents found in category: ${options.category}`));
        return;
      }

      console.log(chalk.blue(`Found ${agentsToInstall.length} agents in category: ${getCategoryName(options.category)}`));
    }

    if (agentsToInstall.length === 0) {
      console.log(chalk.yellow('No agents specified for installation.'));
      console.log(chalk.white('Use --interactive to select agents or specify agent names.'));
      return;
    }

    // Validate agent IDs
    const validAgents = agentsToInstall.map(id => {
      const agent = getAgentById(id);
      if (!agent) {
        console.log(chalk.yellow(`⚠️  Agent not found: ${id}`));
        return null;
      }
      return agent;
    }).filter(Boolean);

    if (validAgents.length === 0) {
      console.log(chalk.red('No valid agents found for installation.'));
      return;
    }

    // Read current config content
    let configContent = '';
    try {
      configContent = await readConfigFile(configFile.path);
    } catch (error) {
      console.log(chalk.blue('Creating new configuration file...'));
    }

    // Check for existing installations
    const existingAgents = new Set();
    const agentBlocks = configContent.split(/<!-- Agent: ([\w-]+) -->/g);
    for (let i = 1; i < agentBlocks.length; i += 2) {
      existingAgents.add(agentBlocks[i]);
    }

    // Filter out already installed agents (unless force is used)
    const agentsToActuallyInstall = validAgents.filter(agent => {
      if (existingAgents.has(agent!.id) && !options.force) {
        console.log(chalk.yellow(`⚠️  Agent already installed: ${agent!.name} (use --force to reinstall)`));
        return false;
      }
      return true;
    });

    if (agentsToActuallyInstall.length === 0) {
      console.log(chalk.blue('All specified agents are already installed.'));
      console.log(chalk.white('Use --force to reinstall or --interactive to select different agents.'));
      return;
    }

    // Show what will be installed
    console.log(chalk.bold.blue('\n📦 Ready to install:'));
    agentsToActuallyInstall.forEach(agent => {
      const status = existingAgents.has(agent!.id) ? chalk.yellow('(reinstall)') : chalk.green('(new)');
      console.log(`  ${chalk.bold(agent!.name)} ${status}`);
    });
    console.log(chalk.dim(`Target file: ${configFile.path}`));

    if (options.dryRun) {
      console.log(chalk.yellow('\n🔍 Dry run mode - no changes made.'));
      return;
    }

    // Confirm installation
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Proceed with installation?',
        default: true
      }
    ]);

    if (!confirmed) {
      console.log(chalk.yellow('Installation cancelled.'));
      return;
    }

    // Create backup
    const spinner = ora('Creating backup...').start();
    try {
      if (configContent) {
        await backupConfigFile(configFile.path);
        spinner.succeed('Backup created');
      } else {
        spinner.stop();
      }
    } catch (error) {
      spinner.fail('Failed to create backup');
      throw error;
    }

    // Install agents
    let updatedContent = configContent;

    for (const agent of agentsToActuallyInstall) {
      spinner.start(`Installing ${agent!.name}...`);

      try {
        updatedContent = updateAgentInContent(updatedContent, agent!);
        spinner.succeed(`Installed ${agent!.name}`);
      } catch (error) {
        spinner.fail(`Failed to install ${agent!.name}`);
        throw error;
      }
    }

    // Write updated content
    spinner.start('Writing configuration file...');
    try {
      await writeConfigFile(configFile.path, updatedContent);
      spinner.succeed('Configuration updated');
    } catch (error) {
      spinner.fail('Failed to write configuration');
      throw error;
    }

    console.log(chalk.green(`\n✅ Successfully installed ${agentsToActuallyInstall.length} agent(s)!`));
    console.log(chalk.white(`Configuration file: ${configFile.path}`));

  } catch (error) {
    console.error(chalk.red('Installation failed:'), error);
    process.exit(1);
  }
}

async function selectAgentsInteractively(): Promise<string[]> {
  const agents = getAllAgents();

  // Category selection
  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: 'Select a category:',
      choices: [
        { name: '🔍 All Agents', value: 'all' },
        ...agents.reduce((acc, agent) => {
          if (!acc.find(choice => choice.value === agent.category)) {
            acc.push({
              name: `${getCategoryIcon(agent.category)} ${getCategoryName(agent.category)}`,
              value: agent.category
            });
          }
          return acc;
        }, [] as { name: string; value: string }[])
      ]
    }
  ]);

  let availableAgents = category === 'all' ? agents : getAgentsByCategory(category);

  // Agent selection
  const { selectedAgents } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedAgents',
      message: 'Select agents to install:',
      choices: availableAgents.map(agent => ({
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

  return selectedAgents;
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'product-strategy': '📊',
    'development': '💻',
    'debugging': '🐛',
    'safety-security': '🔒',
    'preview-validation': '👁️',
    'quality-testing': '✅',
    'design-ux': '🎨',
    'operations': '⚙️',
    'business-analytics': '📈',
    'ai-innovation': '🤖'
  };
  return icons[category] || '📁';
}