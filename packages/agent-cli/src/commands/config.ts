import chalk from 'chalk';
import inquirer from 'inquirer';
import { loadConfig, saveConfig, getConfigPath } from '../config';

interface ConfigOptions {
  show?: boolean;
  reset?: boolean;
}

export async function configCommand(options: ConfigOptions): Promise<void> {
  try {
    if (options.show) {
      const config = await loadConfig();
      const configPath = await getConfigPath();

      console.log(chalk.bold.blue('\n⚙️  Agent Directory Configuration\n'));
      console.log(chalk.white(`Config file: ${configPath}\n`));

      console.log(chalk.cyan('Current settings:'));
      console.log(`  Default config type: ${chalk.bold(config.defaultConfigType)}`);
      console.log(`  Auto backup: ${chalk.bold(config.autoBackup ? 'enabled' : 'disabled')}`);
      console.log(`  Backup retention: ${chalk.bold(config.backupRetention)} days`);
      console.log(`  Analytics: ${chalk.bold(config.analyticsEnabled ? 'enabled' : 'disabled')}`);

      if (config.defaultCategory) {
        console.log(`  Default category: ${chalk.bold(config.defaultCategory)}`);
      }

      if (config.customAgentRegistry) {
        console.log(`  Custom registry: ${chalk.bold(config.customAgentRegistry)}`);
      }

      return;
    }

    if (options.reset) {
      const { confirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: 'This will reset all configuration to defaults. Are you sure?',
          default: false
        }
      ]);

      if (!confirmed) {
        console.log(chalk.yellow('Configuration reset cancelled.'));
        return;
      }

      await saveConfig({
        defaultConfigType: 'claude-code',
        autoBackup: true,
        backupRetention: 30,
        analyticsEnabled: false
      });

      console.log(chalk.green('✅ Configuration reset to defaults.'));
      return;
    }

    // Interactive configuration
    const config = await loadConfig();

    console.log(chalk.bold.blue('\n⚙️  Configure Agent Directory\n'));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'defaultConfigType',
        message: 'Default AI assistant configuration:',
        choices: [
          { name: 'Claude Code (CLAUDE.md)', value: 'claude-code' },
          { name: 'Cursor (.cursorrules)', value: 'cursor' },
          { name: 'Windsurf (.windsurfrules)', value: 'windsurf' },
          { name: 'Codeium (.codeiumrules)', value: 'codeium' },
          { name: 'Continue (.continuerules)', value: 'continue' }
        ],
        default: config.defaultConfigType
      },
      {
        type: 'confirm',
        name: 'autoBackup',
        message: 'Enable automatic backups before changes?',
        default: config.autoBackup
      },
      {
        type: 'number',
        name: 'backupRetention',
        message: 'How many days to keep backup files?',
        default: config.backupRetention,
        when: (answers) => answers.autoBackup,
        validate: (input) => {
          if (input < 1) {
            return 'Please enter at least 1 day.';
          }
          return true;
        }
      },
      {
        type: 'confirm',
        name: 'analyticsEnabled',
        message: 'Enable usage analytics? (helps improve the CLI)',
        default: config.analyticsEnabled
      },
      {
        type: 'input',
        name: 'customAgentRegistry',
        message: 'Custom agent registry URL (optional):',
        default: config.customAgentRegistry || '',
        when: () => false // Hide for now, can be enabled later
      }
    ]);

    const updatedConfig = {
      ...config,
      ...answers
    };

    await saveConfig(updatedConfig);

    console.log(chalk.green('\n✅ Configuration updated successfully!'));
    console.log(chalk.white(`Config saved to: ${await getConfigPath()}`));

  } catch (error) {
    console.error(chalk.red('Configuration error:'), error);
    process.exit(1);
  }
}