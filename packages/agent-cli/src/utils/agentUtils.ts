import { agents, categories, Agent, Category } from '../agents';

export function getAllAgents(): Agent[] {
  return agents.sort((a, b) => {
    // Sort featured agents first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });
}

export function getAgentsByCategory(categoryId: string): Agent[] {
  if (categoryId === 'all') return getAllAgents();
  return getAllAgents().filter(agent => agent.category === categoryId);
}

export function getFeaturedAgents(): Agent[] {
  return getAllAgents().filter(agent => agent.featured);
}

export function searchAgents(query: string, category?: string): Agent[] {
  const searchTerm = query.toLowerCase();
  let results = getAllAgents();

  if (category && category !== 'all') {
    results = results.filter(agent => agent.category === category);
  }

  return results.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm) ||
    agent.description.toLowerCase().includes(searchTerm) ||
    agent.keyFeatures.some(feature => feature.toLowerCase().includes(searchTerm)) ||
    agent.useCases.some(useCase => useCase.toLowerCase().includes(searchTerm))
  );
}

export function getAgentById(id: string): Agent | undefined {
  return agents.find(agent => agent.id === id);
}

export function getCategories(): Category[] {
  return categories;
}

export function formatAgentForInstall(agent: Agent, configType: string): string {
  const timestamp = new Date().toISOString().split('T')[0];

  let content = `<!-- Agent: ${agent.id} -->\n`;
  content += `# ${agent.name}\n\n`;
  content += `**Category:** ${getCategoryName(agent.category)}\n`;
  content += `**Version:** 1.0.0\n`;
  content += `**Installed:** ${timestamp}\n\n`;

  if (agent.featured) {
    content += `⭐ **Featured Agent**\n\n`;
  }

  content += `## Description\n${agent.description}\n\n`;

  content += `## Key Features\n`;
  agent.keyFeatures.forEach(feature => {
    content += `- ${feature}\n`;
  });
  content += `\n`;

  content += `## Use Cases\n`;
  agent.useCases.forEach(useCase => {
    content += `- ${useCase}\n`;
  });
  content += `\n`;

  content += `## Agent Prompt\n`;
  content += `\`\`\`\n${agent.prompt}\n\`\`\`\n\n`;

  if (agent.supportedIDEs && agent.supportedIDEs.length > 0) {
    content += `## Supported IDEs\n`;
    agent.supportedIDEs.forEach(ide => {
      content += `- ${ide.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
    });
    content += `\n`;
  }

  content += `<!-- End Agent: ${agent.id} -->\n\n`;

  return content;
}

export function getCategoryName(categoryId: string): string {
  const category = categories.find(cat => cat.id === categoryId);
  return category?.name || categoryId;
}

export function removeAgentFromContent(content: string, agentId: string): string {
  // Remove agent block using regex
  const agentRegex = new RegExp(`<!-- Agent: ${agentId} -->[\\s\\S]*?<!-- End Agent: ${agentId} -->\\n*`, 'g');
  return content.replace(agentRegex, '').replace(/\n{3,}/g, '\n\n').trim();
}

export function updateAgentInContent(content: string, agent: Agent): string {
  // Remove existing agent if present
  content = removeAgentFromContent(content, agent.id);

  // Find position to insert (after existing content or at the end)
  const insertPosition = findInsertPosition(content);

  // Insert new agent content
  const agentContent = formatAgentForInstall(agent, 'claude-code');
  return content.slice(0, insertPosition) + '\n\n' + agentContent + content.slice(insertPosition);
}

function findInsertPosition(content: string): number {
  // Try to insert before existing agents section, or at the end
  const agentsSectionMatch = content.match(/## (Agents|AI Agents|Installed Agents)/i);
  if (agentsSectionMatch) {
    const sectionStart = content.indexOf(agentsSectionMatch[0]);
    const nextSectionMatch = content.slice(sectionStart + agentsSectionMatch[0].length).match(/^##/m);
    if (nextSectionMatch) {
      return sectionStart + agentsSectionMatch[0].length + nextSectionMatch.index!;
    }
  }

  // Insert at the end
  return content.length;
}