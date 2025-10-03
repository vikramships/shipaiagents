import chalk from 'chalk';
import { table } from 'table';
import { searchAgents, getCategoryName } from '../utils/agentUtils';

interface SearchOptions {
  category?: string;
  json?: boolean;
}

export async function searchCommand(query: string, options: SearchOptions): Promise<void> {
  try {
    if (!query) {
      console.log(chalk.yellow('Please provide a search query.'));
      console.log(chalk.white('Usage: shipai search "<query>"'));
      return;
    }

    const results = searchAgents(query, options.category);

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    if (results.length === 0) {
      console.log(chalk.yellow(`No agents found for: "${query}"`));
      if (options.category) {
        console.log(chalk.blue(`Searched in category: ${getCategoryName(options.category)}`));
      }
      console.log(chalk.white('Try different keywords or browse all agents with "shipai list"'));
      return;
    }

    console.log(chalk.bold.blue(`\n🔍 Search Results for: "${query}"`));
    if (options.category) {
      console.log(chalk.blue(`Category: ${getCategoryName(options.category)}`));
    }
    console.log(chalk.green(`Found ${results.length} agent(s)\n`));

    const data = results.map(agent => [
      agent.featured ? '⭐' : '  ',
      chalk.bold(agent.name),
      getCategoryName(agent.category),
      agent.description.substring(0, 80) + (agent.description.length > 80 ? '...' : '')
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
        { width: 20, alignment: 'left' as const },
        { width: 20, alignment: 'left' as const },
        { width: 60, alignment: 'left' as const }
      ]
    };

    console.log(table(data, tableConfig));

    console.log(chalk.green('\n💡 Installation:'));
    results.forEach(agent => {
      console.log(chalk.white(`  shipai install ${agent.id}`));
    });

  } catch (error) {
    console.error(chalk.red('Search failed:'), error);
    process.exit(1);
  }
}