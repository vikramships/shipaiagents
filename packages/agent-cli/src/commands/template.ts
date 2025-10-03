import chalk from 'chalk';
import inquirer from 'inquirer';
import { AGENT_TEMPLATES, getTemplateById, getAllTemplates } from '../templates/agentTemplates';
import { findOrCreateConfigFile, writeConfigFile } from '../utils/fileUtils';

interface TemplateOptions {
  list?: boolean;
  use?: string;
  create?: boolean;
}

export async function templateCommand(options: TemplateOptions): Promise<void> {
  try {
    if (options.list) {
      await listTemplates();
      return;
    }

    if (options.use) {
      await useTemplate(options.use);
      return;
    }

    if (options.create) {
      await createFromTemplate();
      return;
    }

    // Interactive mode
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do with templates?',
        choices: [
          { name: '📋 List available templates', value: 'list' },
          { name: '🛠️  Use a template', value: 'use' },
          { name: '✨ Create from template', value: 'create' }
        ]
      }
    ]);

    switch (action) {
      case 'list':
        await listTemplates();
        break;
      case 'use':
        const { templateId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'templateId',
            message: 'Select a template:',
            choices: getAllTemplates().map(template => ({
              name: `${template.name} - ${template.description}`,
              value: template.id
            }))
          }
        ]);
        await useTemplate(templateId);
        break;
      case 'create':
        await createFromTemplate();
        break;
    }

  } catch (error) {
    console.error(chalk.red('Template command failed:'), error);
    process.exit(1);
  }
}

async function listTemplates(): Promise<void> {
  console.log(chalk.bold.blue('\n📋 Available Agent Templates\n'));

  const templates = getAllTemplates();

  if (templates.length === 0) {
    console.log(chalk.yellow('No templates available.'));
    return;
  }

  templates.forEach(template => {
    console.log(chalk.bold.cyan(`\n${template.name}`));
    console.log(chalk.dim(`ID: ${template.id}`));
    console.log(chalk.white(`Category: ${template.category}`));
    console.log(chalk.dim(template.description));

    if (template.variables.length > 0) {
      console.log(chalk.yellow(`\n  Variables: ${template.variables.length}`));
      template.variables.slice(0, 3).forEach(v => {
        const required = v.required ? '*' : '';
        console.log(chalk.white(`    - ${v.name}${required} (${v.type})`));
      });
      if (template.variables.length > 3) {
        console.log(chalk.dim(`    ... and ${template.variables.length - 3} more`));
      }
    }

    if (template.examples && template.examples.length > 0) {
      console.log(chalk.yellow(`  Examples: ${template.examples.length}`));
    }
  });

  console.log(chalk.green('\n💡 Usage:'));
  console.log(chalk.white('  shipai template --use <template-id>    # Use specific template'));
  console.log(chalk.white('  shipai template --create              # Interactive creation'));
}

async function useTemplate(templateId: string): Promise<void> {
  const template = getTemplateById(templateId);

  if (!template) {
    console.log(chalk.red(`Template not found: ${templateId}`));
    console.log(chalk.white('Use "shipai template --list" to see available templates.'));
    return;
  }

  console.log(chalk.bold.blue(`\n🛠️  Using Template: ${template.name}\n`));
  console.log(chalk.dim(template.description));

  // Collect variable values
  const variables: Record<string, any> = {};

  for (const variable of template.variables) {
    let question: any = {
      name: variable.name,
      message: variable.description,
      default: variable.default
    };

    if (variable.type === 'boolean') {
      question.type = 'confirm';
    } else if (variable.type === 'number') {
      question.type = 'number';
    } else if (variable.type === 'array') {
      question.type = 'input';
      question.filter = (input: string) => input.split(',').map(s => s.trim());
    } else if (variable.type === 'select' && variable.options) {
      question.type = 'list';
      question.choices = variable.options;
    } else {
      question.type = 'input';
    }

    if (variable.required && !variable.default) {
      question.validate = (input: any) => {
        if (!input || (Array.isArray(input) && input.length === 0)) {
          return `${variable.description} is required.`;
        }
        return true;
      };
    }

    const answer = await inquirer.prompt([question]);
    variables[variable.name] = answer[variable.name];
  }

  // Generate agent content
  const content = generateAgentContent(template, variables);

  console.log(chalk.bold.green('\n✅ Agent Generated!\n'));
  console.log(chalk.cyan('Generated Content:'));
  console.log(chalk.white('─'.repeat(50)));
  console.log(content);
  console.log(chalk.white('─'.repeat(50)));

  // Ask what to do with the generated content
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do with this agent?',
      choices: [
        { name: '💾 Save to CLAUDE.md', value: 'save' },
        { name: '📋 Copy to clipboard', value: 'copy' },
        { name: '📝 Save to file', value: 'file' },
        { name: '❌ Cancel', value: 'cancel' }
      ]
    }
  ]);

  switch (action) {
    case 'save':
      await saveAgentToConfig(content);
      break;
    case 'copy':
      try {
        await require('child_process').spawnSync('pbcopy', { input: content });
        console.log(chalk.green('✅ Content copied to clipboard!'));
      } catch (error) {
        console.log(chalk.yellow('⚠️  Could not copy to clipboard. Please copy manually.'));
      }
      break;
    case 'file':
      const { filename } = await inquirer.prompt([
        {
          type: 'input',
          name: 'filename',
          message: 'Enter filename:',
          default: `${template.id}-agent.md`,
          validate: (input) => {
            if (!input.trim()) {
              return 'Please enter a filename.';
            }
            return true;
          }
        }
      ]);
      try {
        await require('fs-extra').writeFile(filename, content);
        console.log(chalk.green(`✅ Saved to ${filename}`));
      } catch (error) {
        console.error(chalk.red('Failed to save file:'), error);
      }
      break;
    case 'cancel':
      console.log(chalk.yellow('Operation cancelled.'));
      break;
  }
}

async function createFromTemplate(): Promise<void> {
  // This would open an advanced template creation interface
  console.log(chalk.yellow('Template creation wizard not implemented yet.'));
  console.log(chalk.white('Use "shipai template --use <template-id>" to use existing templates.'));
}

async function saveAgentToConfig(content: string): Promise<void> {
  const configFile = await findOrCreateConfigFile('claude-code');
  let existingContent = '';

  try {
    existingContent = await require('fs-extra').readFile(configFile.path, 'utf-8');
  } catch (error) {
    // File doesn't exist, will be created
  }

  const newContent = existingContent + '\n\n' + content;
  await writeConfigFile(configFile.path, newContent);

  console.log(chalk.green(`✅ Agent saved to ${configFile.path}`));
}

function generateAgentContent(template: any, variables: Record<string, any>): string {
  let content = template.template;

  // Simple template substitution (in real implementation, use a proper template engine)
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, String(value));
  });

  // Handle basic conditionals
  content = content.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match: string, varName: string, innerContent: string) => {
    return variables[varName] ? innerContent : '';
  });

  // Handle basic loops
  content = content.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match: string, varName: string, innerContent: string) => {
    const arrayValue = variables[varName];
    if (Array.isArray(arrayValue)) {
      return arrayValue.map(item => innerContent.replace(/{{this}}/g, String(item))).join('\n');
    }
    return '';
  });

  return content.trim();
}