import chalk from 'chalk';
import { table } from 'table';
import { detectConfigFiles } from '../utils/fileUtils';
import { getAgentById, getCategoryName } from '../utils/agentUtils';
import fs from 'fs-extra';
import path from 'path';

interface StatusOptions {
  json?: boolean;
}

export async function statusCommand(options: StatusOptions): Promise<void> {
  try {
    // Check agents directory
    const agentsDir = path.join(process.cwd(), '.claude', 'agents');

    if (!fs.existsSync(agentsDir)) {
      console.log(chalk.yellow('No agents directory found.'));
      console.log(chalk.blue('Use "shipai install <agent>" to install your first agent.'));
      return;
    }

    // Get installed agents by reading agent files
    const agentFiles = await fs.readdir(agentsDir);
    const installedAgentIds = agentFiles
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));

    const installedAgents = installedAgentIds.map(id => {
      const agent = getAgentById(id);
      return agent ? { ...agent, installed: true } : null;
    }).filter(Boolean);

    console.log(chalk.bold.blue('\n📊 Agent Status\n'));
    console.log(chalk.white(`Agents directory: ${agentsDir}`));
    console.log(chalk.white(`Configuration file: CLAUDE.md`));

    if (installedAgents.length === 0) {
      console.log(chalk.yellow('\nNo agents are currently installed.'));
      console.log(chalk.blue('\n💡 Get started:'));
      console.log(chalk.white('  shipai list                    # Browse available agents'));
      console.log(chalk.white('  shipai install --interactive   # Select and install agents'));
      return;
    }

    if (options.json) {
      console.log(JSON.stringify(installedAgents, null, 2));
      return;
    }

    console.log(chalk.green(`\n✅ ${installedAgents.length} agent(s) installed\n`));

    // Group agents by category
    const agentsByCategory = installedAgents.reduce((acc, agent) => {
      if (!agent) return acc;
      // Try to find category by looking up agent in the main agents list
      const category = inferCategory(agent.name, agent.id);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(agent);
      return acc;
    }, {} as Record<string, typeof installedAgents>);

    for (const [category, categoryAgents] of Object.entries(agentsByCategory)) {
      console.log(chalk.bold.cyan(`\n📁 ${category} (${categoryAgents.length})`));

      const data = categoryAgents.filter(agent => agent).map(agent => [
        agent!.name,
        getCategoryName(agent!.category),
        path.join('.claude/agents', `${agent!.id}.md`)
      ]);

      const tableConfig = {
        border: {
          topBody: '─',
          topJoin: '┬',
          topLeft: '┌',
          topRight: '┐',
          bottomBody: '─',
          bottomJoin: '┴',
          bottomLeft: '└',
          bottomRight: '┘',
          bodyLeft: '│',
          bodyRight: '│',
          bodyJoin: '│',
          joinBody: '─',
          joinLeft: '├',
          joinRight: '┤',
          joinJoin: '┼'
        },
        columns: [
          { width: 25, alignment: 'left' as const },
          { width: 10, alignment: 'center' as const },
          { width: 12, alignment: 'center' as const },
          { width: 40, alignment: 'left' as const }
        ]
      };

      console.log(table(data, tableConfig));
    }

    console.log(chalk.green('\n💡 Management commands:'));
    console.log(chalk.white('  shipai update <agent>   # Update specific agent'));
    console.log(chalk.white('  shipai update --all     # Update all agents'));
    console.log(chalk.white('  shipai uninstall <agent> # Remove agent'));
    console.log(chalk.white('  shipai list            # Browse more agents'));

  } catch (error) {
    console.error(chalk.red('Error checking status:'), error);
    process.exit(1);
  }
}

function inferCategory(agentName: string, agentId: string): string {
  // Simple category inference based on agent name and ID
  const name = agentName.toLowerCase();
  const id = agentId.toLowerCase();

  if (name.includes('security') || name.includes('safety') || id.includes('safety') || id.includes('security')) {
    return 'Safety & Security';
  }
  if (name.includes('debug') || name.includes('test') || id.includes('debug') || id.includes('test')) {
    return 'Debugging';
  }
  if (name.includes('api') || name.includes('database') || name.includes('performance') || id.includes('api') || id.includes('database')) {
    return 'Development';
  }
  if (name.includes('product') || name.includes('growth') || name.includes('revenue') || id.includes('product') || id.includes('growth')) {
    return 'Product Strategy';
  }
  if (name.includes('design') || name.includes('ux') || id.includes('design') || id.includes('ux')) {
    return 'Design & UX';
  }
  if (name.includes('ai') || name.includes('automation') || id.includes('ai') || id.includes('automation')) {
    return 'AI & Innovation';
  }

  return 'Other';
}