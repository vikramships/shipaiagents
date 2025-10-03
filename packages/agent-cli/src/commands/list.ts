import chalk from 'chalk';
import { table } from 'table';
import { getAllAgents, getAgentsByCategory, getFeaturedAgents, getCategoryName } from '../utils/agentUtils';

interface ListOptions {
  category?: string;
  featured?: boolean;
  json?: boolean;
}

export async function listCommand(options: ListOptions): Promise<void> {
  try {
    let agents = getAllAgents();

    if (options.category) {
      agents = getAgentsByCategory(options.category);
    }

    if (options.featured) {
      agents = agents.filter(agent => agent.featured);
    }

    if (options.json) {
      console.log(JSON.stringify(agents, null, 2));
      return;
    }

    if (agents.length === 0) {
      console.log(chalk.yellow('No agents found.'));
      return;
    }

    console.log(chalk.bold.blue('\n🤖 Available AI Agents\n'));

    // Group by category
    const agentsByCategory = agents.reduce((acc, agent) => {
      if (!acc[agent.category]) {
        acc[agent.category] = [];
      }
      acc[agent.category].push(agent);
      return acc;
    }, {} as Record<string, typeof agents>);

    for (const [categoryId, categoryAgents] of Object.entries(agentsByCategory)) {
      const categoryName = getCategoryName(categoryId);
      console.log(chalk.bold.cyan(`\n📁 ${categoryName} (${categoryAgents.length})\n`));

      const data = categoryAgents.map(agent => [
        agent.featured ? '⭐' : '  ',
        chalk.bold(agent.name),
        agent.keyFeatures.slice(0, 2).join(', '),
        agent.useCases.slice(0, 2).join(', ')
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
          { width: 3, alignment: 'center' as const },
          { width: 25, alignment: 'left' as const },
          { width: 40, alignment: 'left' as const },
          { width: 30, alignment: 'left' as const }
        ]
      };

      console.log(table(data, tableConfig));
    }

    console.log(chalk.green('\n💡 Usage:'));
    console.log(chalk.white('  shipai install <agent-name>     # Install specific agent'));
    console.log(chalk.white('  shipai install --interactive    # Interactive selection'));
    console.log(chalk.white('  shipai search <query>           # Search agents'));
    console.log(chalk.white('  shipai install -c <category>    # Install all from category'));

  } catch (error) {
    console.error(chalk.red('Error listing agents:'), error);
    process.exit(1);
  }
}