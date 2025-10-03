import * as fs from 'fs-extra';
import * as path from 'path';
import { homedir } from 'os';

export interface ConfigFile {
  path: string;
  type: 'claude-code' | 'cursor' | 'windsurf' | 'codeium' | 'continue';
  exists: boolean;
}

export interface AgentInstallInfo {
  id: string;
  name: string;
  version: string;
  installedAt: string;
  configPath: string;
}

const CONFIG_FILES = [
  { type: 'claude-code' as const, paths: ['CLAUDE.md', '.claude/CLAUDE.md'] },
  { type: 'cursor' as const, paths: ['.cursorrules'] },
  { type: 'windsurf' as const, paths: ['.windsurfrules'] },
  { type: 'codeium' as const, paths: ['.codeiumrules'] },
  { type: 'continue' as const, paths: ['.continuerules'] },
];

export async function detectConfigFiles(projectPath: string = process.cwd()): Promise<ConfigFile[]> {
  const results: ConfigFile[] = [];

  for (const config of CONFIG_FILES) {
    for (const configPath of config.paths) {
      const fullPath = path.join(projectPath, configPath);
      const exists = await fs.pathExists(fullPath);

      results.push({
        path: fullPath,
        type: config.type,
        exists,
      });

      if (exists) break; // Use first found config for each type
    }
  }

  return results;
}

export async function findOrCreateConfigFile(type: string, projectPath: string = process.cwd()): Promise<ConfigFile> {
  const config = CONFIG_FILES.find(c => c.type === type);
  if (!config) {
    throw new Error(`Unknown config type: ${type}`);
  }

  for (const configPath of config.paths) {
    const fullPath = path.join(projectPath, configPath);
    const exists = await fs.pathExists(fullPath);

    if (exists || config.type === 'claude-code') {
      return {
        path: fullPath,
        type: config.type as any,
        exists,
      };
    }
  }

  // Create the file if it doesn't exist
  const defaultPath = path.join(projectPath, config.paths[0]);
  await fs.ensureDir(path.dirname(defaultPath));
  await fs.writeFile(defaultPath, getDefaultConfigContent(type));

  return {
    path: defaultPath,
    type: config.type as any,
    exists: true,
  };
}

function getDefaultConfigContent(type: string): string {
  switch (type) {
    case 'claude-code':
      return `# Claude Code Configuration

## Development Practices
- Use pnpm for installing etc. not npm

## Development Notes
- server is already running. you dont need to ask.

## SAFETY RULES - CRITICAL DATA PROTECTION

### File System Safety
- NEVER execute rm, rmdir, or destructive commands without explicit confirmation
- NEVER use rm -rf on any directory without triple confirmation and backup verification
- Always backup before file operations that modify multiple files
- Require explicit user confirmation for any operation that could cause data loss
- Block dangerous commands: rm -rf, truncate, dd, mv (when overwriting), cp (when overwriting)
- Use trash/recycle bin instead of permanent deletion when possible

### Git Safety Protocols
- NEVER force push to main/master branch without explicit confirmation
- Always verify branch context before destructive git operations
- Require confirmation for: git reset --hard, git clean -fd, git branch -D
- Create backup branches before major git operations
- Verify remote repository before pushing destructive changes

### Code Safety
- Always validate file paths before operations
- Check file existence before modification attempts
- Preserve original file permissions and ownership
- Never modify system files or directories outside project scope
- Require confirmation before bulk find/replace operations across multiple files

### Backup Requirements
- Create backup before operations affecting 3+ files
- Verify backup integrity before proceeding with destructive operations
- Maintain git commit history as primary backup mechanism
- Use git stash for temporary backups during experimental changes

### Confirmation Protocols
- Explicit user acknowledgment required for ALL destructive operations
- Must state specific risks and consequences before executing dangerous commands
- Provide safe alternatives whenever possible
- Allow user to abort any operation at any stage

### Scope Limitations
- Operations restricted to project directory: ${process.cwd()}
- NEVER operate on parent directories or system locations
- Validate all paths are within project boundaries
- Reject operations targeting home directory, system directories, or other projects
`;

    case 'cursor':
      return `# Cursor AI Assistant Rules

You are a helpful AI coding assistant. Follow these guidelines:

1. Always provide clear, well-commented code
2. Explain your reasoning before making changes
3. Ask for clarification when requirements are unclear
4. Follow best practices for the specific technology stack
5. Consider security implications of your suggestions
6. Test your suggestions when possible
`;

    case 'windsurf':
      return `# Windsurf AI Assistant Rules

You are Windsurf AI coding assistant. Please follow these guidelines:

1. Write clean, maintainable code
2. Follow modern development practices
3. Provide explanations for complex changes
4. Consider performance and security
5. Test your solutions when applicable
`;

    default:
      return `# AI Assistant Configuration

You are an AI coding assistant. Follow best practices and write clean, efficient code.
`;
  }
}

export async function readConfigFile(configPath: string): Promise<string> {
  try {
    return await fs.readFile(configPath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read config file: ${configPath}`);
  }
}

export async function writeConfigFile(configPath: string, content: string): Promise<void> {
  try {
    await fs.writeFile(configPath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write config file: ${configPath}`);
  }
}

export async function backupConfigFile(configPath: string): Promise<string> {
  const backupPath = `${configPath}.backup.${Date.now()}`;
  await fs.copy(configPath, backupPath);
  return backupPath;
}

export async function getInstalledAgents(configPath: string): Promise<AgentInstallInfo[]> {
  try {
    const content = await readConfigFile(configPath);
    const agents: AgentInstallInfo[] = [];

    // Look for agent markers in the file
    const agentBlocks = content.split(/<!-- Agent: ([\w-]+) -->/g);

    for (let i = 1; i < agentBlocks.length; i += 2) {
      const agentId = agentBlocks[i];
      const agentContent = agentBlocks[i + 1];

      if (agentId && agentContent) {
        // Extract metadata from agent content
        const nameMatch = agentContent.match(/# (.+)/);
        const versionMatch = agentContent.match(/Version: ([\d.]+)/);
        const installedMatch = agentContent.match(/Installed: (.+)/);

        agents.push({
          id: agentId,
          name: nameMatch?.[1] || agentId,
          version: versionMatch?.[1] || '1.0.0',
          installedAt: installedMatch?.[1] || new Date().toISOString(),
          configPath,
        });
      }
    }

    return agents;
  } catch (error) {
    return [];
  }
}