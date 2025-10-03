const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('ShipAI CLI', () => {
  const cliPath = path.join(__dirname, '../bin/shipai');

  test('should show help', () => {
    const result = execSync(`node ${cliPath} --help`, { encoding: 'utf8' });
    expect(result).toContain('shipaiagents.com');
    expect(result).toContain('list');
    expect(result).toContain('install');
    expect(result).toContain('status');
  });

  test('should show version', () => {
    const result = execSync(`node ${cliPath} --version`, { encoding: 'utf8' });
    expect(result).toMatch(/\d+\.\d+\.\d+/);
  });

  test('should list agents', () => {
    const result = execSync(`node ${cliPath} list`, { encoding: 'utf8' });
    expect(result).toContain('Available AI Agents');
    expect(result).toContain('Safety Guardian');
    expect(result).toContain('Framework Debugger');
  });

  test('should search agents', () => {
    const result = execSync(`node ${cliPath} search "safety"`, { encoding: 'utf8' });
    expect(result).toContain('Search Results');
    expect(result).toContain('Safety Guardian');
  });

  test('should list templates', () => {
    const result = execSync(`node ${cliPath} template --list`, { encoding: 'utf8' });
    expect(result).toContain('Available Agent Templates');
    expect(result).toContain('Custom Safety Agent');
  });

  test('should handle dry run install', () => {
    const result = execSync(`node ${cliPath} install safety-guardian --dry-run`, { encoding: 'utf8' });
    expect(result).toContain('Dry run mode');
    expect(result).toContain('Safety Guardian');
  });

  test('should check status', () => {
    const result = execSync(`node ${cliPath} status`, { encoding: 'utf8' });
    expect(result).toContain('No CLAUDE.md configuration file found');
  });
});