import * as fs from 'fs-extra';
import * as path from 'path';
import { homedir } from 'os';

export interface CLIConfig {
  defaultConfigType: 'claude-code' | 'cursor' | 'windsurf' | 'codeium' | 'continue';
  autoBackup: boolean;
  backupRetention: number; // days
  defaultCategory?: string;
  installedAgentsPath?: string;
  customAgentRegistry?: string;
  analyticsEnabled: boolean;
}

const DEFAULT_CONFIG: CLIConfig = {
  defaultConfigType: 'claude-code',
  autoBackup: true,
  backupRetention: 30,
  analyticsEnabled: false
};

const CONFIG_PATH = path.join(homedir(), '.shipai', 'config.json');

export async function loadConfig(): Promise<CLIConfig> {
  try {
    const configExists = await fs.pathExists(CONFIG_PATH);
    if (!configExists) {
      await saveConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }

    const configData = await fs.readJson(CONFIG_PATH);
    return { ...DEFAULT_CONFIG, ...configData };
  } catch (error) {
    console.warn('Failed to load config, using defaults:', error);
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(config: CLIConfig): Promise<void> {
  try {
    await fs.ensureDir(path.dirname(CONFIG_PATH));
    await fs.writeJson(CONFIG_PATH, config, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to save config: ${error}`);
  }
}

export async function getConfigPath(): Promise<string> {
  return CONFIG_PATH;
}