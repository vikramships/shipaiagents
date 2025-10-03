# ShipAI CLI

A powerful CLI tool to install and manage AI coding agents from shipaiagents.com.

## Installation

### Global Installation (Recommended)

```bash
npm install -g shipai-cli
```

### Local Installation

```bash
npm install shipai-cli
npx shipai --help
```

## Quick Start

```bash
# List available agents
shipai list

# Install featured agents
shipai install --featured

# Interactive installation
shipai install --interactive

# Check installed agents
shipai status
```

## Commands

### 📋 `list` - List Available Agents

List all available AI agents with their descriptions and features.

```bash
shipai list [options]
```

**Options:**
- `-c, --category <category>` - Filter by category
- `-f, --featured` - Show only featured agents
- `-j, --json` - Output as JSON

**Examples:**
```bash
shipai list                           # List all agents
shipai list -c development            # List development agents
shipai list --featured                # List featured agents
shipai list -j > agents.json         # Export as JSON
```

### 📦 `install` - Install Agents

Install one or more AI agents to your configuration file.

```bash
shipai install <agent...> [options]
```

**Options:**
- `-i, --interactive` - Interactive agent selection
- `-c, --category <category>` - Install all agents from category
- `--force` - Force overwrite existing agents
- `--dry-run` - Show what would be installed without making changes

**Examples:**
```bash
shipai install safety-guardian        # Install specific agent
shipai install api-builder cli-expert # Install multiple agents
shipai install -c development         # Install all development agents
shipai install --interactive          # Interactive selection
shipai install safety-guardian --dry-run  # Preview installation
```

### 🗑️ `uninstall` - Remove Agents

Remove installed agents from your configuration.

```bash
shipai uninstall <agent...> [options]
```

**Options:**
- `-a, --all` - Remove all installed agents
- `--dry-run` - Show what would be removed without making changes

**Examples:**
```bash
shipai uninstall safety-guardian      # Remove specific agent
shipai uninstall --all               # Remove all agents
```

### 🔄 `update` - Update Agents

Update installed agents to the latest versions.

```bash
shipai update [agent...] [options]
```

**Options:**
- `-a, --all` - Update all installed agents
- `--dry-run` - Show what would be updated without making changes

**Examples:**
```bash
shipai update safety-guardian        # Update specific agent
shipai update --all                  # Update all agents
```

### 📊 `status` - Show Installation Status

Display installed agents and their status.

```bash
shipai status [options]
```

**Options:**
- `-j, --json` - Output as JSON

**Examples:**
```bash
shipai status                        # Show installed agents
shipai status -j                     # Export status as JSON
```

### 🔍 `search` - Search Agents

Search for agents by name, description, or keywords.

```bash
shipai search <query> [options]
```

**Options:**
- `-c, --category <category>` - Search within specific category
- `-j, --json` - Output as JSON

**Examples:**
```bash
shipai search "safety"               # Search for safety agents
shipai search "database" -c development  # Search in development category
```

### ⚙️ `config` - Configure CLI

Manage CLI settings and preferences.

```bash
shipai config [options]
```

**Options:**
- `-s, --show` - Show current configuration
- `-r, --reset` - Reset configuration to defaults

**Examples:**
```bash
shipai config                        # Interactive configuration
shipai config --show                 # Show current settings
shipai config --reset                # Reset to defaults
```

### 🚀 `batch` - Batch Operations

Perform batch operations on multiple agents.

```bash
shipai batch [options]
```

**Options:**
- `-c, --category <category>` - Target specific category
- `-f, --featured` - Target only featured agents
- `--file <path>` - Specify file for export/import operations
- `--dry-run` - Show what would be done without making changes

**Examples:**
```bash
shipai batch                         # Interactive batch operations
shipai batch -c development --dry-run  # Preview batch install
```

### 📝 `template` - Agent Templates

Create and manage custom agent templates.

```bash
shipai template [options]
```

**Options:**
- `-l, --list` - List available templates
- `-u, --use <template-id>` - Use a specific template
- `-c, --create` - Create agent from template

**Examples:**
```bash
shipai template --list               # List available templates
shipai template --use custom-safety-agent  # Use template
shipai template                      # Interactive template management
```

## Agent Categories

- **📊 Product Strategy** - Product management and growth agents
- **💻 Development** - Coding and development assistance
- **🐛 Debugging** - Issue identification and resolution
- **🔒 Safety & Security** - Security rules and best practices
- **👁️ Preview & Validation** - Change preview and validation
- **✅ Quality & Testing** - Testing and quality assurance
- **🎨 Design & UX** - Design and user experience
- **⚙️ Operations** - DevOps and infrastructure
- **📈 Business & Analytics** - Business intelligence
- **🤖 AI & Innovation** - AI integration and automation

## Configuration

The CLI automatically detects and works with multiple AI assistant configuration files:

- **Claude Code**: `CLAUDE.md` or `.claude/CLAUDE.md`
- **Cursor**: `.cursorrules`
- **Windsurf**: `.windsurfrules`
- **Codeium**: `.codeiumrules`
- **Continue**: `.continuerules`

### Configuration File

CLI settings are stored in `~/.shipai/config.json`:

```json
{
  "defaultConfigType": "claude-code",
  "autoBackup": true,
  "backupRetention": 30,
  "analyticsEnabled": false
}
```

## Examples

### Basic Usage

```bash
# Browse available agents
shipai list

# Install a safety agent
shipai install safety-guardian

# Check what's installed
shipai status

# Update all agents
shipai update --all
```

### Interactive Usage

```bash
# Interactive agent selection
shipai install --interactive

# Interactive batch operations
shipai batch

# Interactive configuration
shipai config
```

### Team Workflow

```bash
# Export team configuration
shipai batch --export --file team-agents.json

# Share with team members
git add team-agents.json
git commit -m "Add shared agent configuration"

# Import on new project
shipai batch --import --file team-agents.json
```

### Custom Agents

```bash
# Create custom safety agent
shipai template --use custom-safety-agent

# List available templates
shipai template --list
```

## Configuration Files

### Claude Code (CLAUDE.md)

The CLI creates well-structured CLAUDE.md files with:

```markdown
<!-- Agent: safety-guardian -->
# Safety Guardian

**Category:** Safety & Security
**Version:** 1.0.0
**Installed:** 2024-01-15

## Description
Generates comprehensive safety rules...

## Key Features
- Destructive command prevention
- File operation safety
- ...

## Agent Prompt
```
You are a safety rule generator...
```

<!-- End Agent: safety-guardian -->
```

## Backup and Recovery

The CLI automatically creates backups before making changes:

```bash
# Backups are created automatically
# Location: CLAUDE.md.backup.1705123456789

# Manual backup creation via batch operations
shipai batch --export --file backup-$(date +%Y%m%d).json
```

## Troubleshooting

### Common Issues

**"No configuration file found"**
- The CLI will create a default CLAUDE.md file
- Use `shipai config` to set your preferred configuration type

**"Permission denied"**
- Check file permissions in your project directory
- Ensure write access to the configuration file

**"Agent already installed"**
- Use `--force` flag to reinstall
- Use `shipai update` to update existing agents

### Getting Help

```bash
shipai --help              # General help
shipai <command> --help    # Command-specific help
shipai config --show       # Check configuration
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://agentdirectory.dev/docs)
- 🐛 [Issues](https://github.com/agentdirectory/cli/issues)
- 💬 [Discussions](https://github.com/agentdirectory/cli/discussions)

---

Made with ❤️ by the Agent Directory team