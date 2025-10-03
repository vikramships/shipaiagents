# ShipAI Agents Directory & CLI

A comprehensive platform for discovering and installing AI coding agents. Browse agents on the web and install them directly in your projects with the ShipAI CLI.

## 🌐 Web Directory

Browse and discover AI coding agents at [shipaiagents.com](https://shipaiagents.com)

### Features
- **35+ AI Agents**: Pre-built agents for development, debugging, safety, and more
- **Categories**: Product Strategy, Development, Debugging, Safety & Security, etc.
- **Interactive Detail Pages**: Deep dive into each agent with copy-to-clipboard commands
- **Smart Search**: Find agents by keywords, categories, or use cases
- **Installation Guides**: Step-by-step instructions for CLI setup

## 🛠️ ShipAI CLI

Open-source command-line tool to install and manage AI coding agents directly in your projects.

### Installation
```bash
npm install -g @shipai/cli
```

### Quick Start
```bash
shipai list                           # Browse available agents
shipai install safety-guardian        # Install safety agent
shipai status                        # Check installed agents
shipai search "database"              # Search for database agents
```

### Key Features
- **Multi-IDE Support**: Claude Code, Cursor, Windsurf, Codeium, Continue
- **Interactive Installation**: User-friendly agent selection
- **Template System**: Create custom agents from templates
- **Batch Operations**: Install/export/import agent configurations
- **Backup System**: Automatic backups before changes
- **Open Source**: MIT License with community contributions

## 📁 Project Structure

```
shipai-agents/
├── 🌐 app/                          # Next.js directory website
│   ├── agents/[id]/                # Agent detail pages
│   ├── install/                   # CLI installation guide
│   └── page.tsx                   # Homepage
├── 🧩 components/
│   ├── AgentCard.tsx              # Agent cards with install commands
│   ├── Header.tsx                  # Navigation with CLI button
│   └── ...
├── 📦 packages/agent-cli/           # ShipAI CLI tool
│   ├── src/
│   │   ├── commands/              # All CLI commands
│   │   ├── utils/                 # File utilities
│   │   └── templates/             # Agent templates
│   ├── bin/shipai                  # CLI binary
│   ├── LICENSE                   # MIT License
│   ├── CONTRIBUTING.md           # Contribution guide
│   └── README.md                 # CLI documentation
├── 📚 lib/
│   ├── agents.ts                 # Agent data
│   ├── ruleTemplates.ts          # Rule generation
│   └── ...
├── 📄 OPEN_SOURCE_SUMMARY.md    # Project summary
├── 📄 todo.md                    # Development tasks
└── 📄 package.json               # Root dependencies
```

## 🚀 Getting Started

### 1. Install the CLI
```bash
npm install -g @shipai/cli
```

### 2. Browse Available Agents
```bash
shipai list
```

### 3. Install Your First Agent
```bash
shipai install safety-guardian
```

### 4. Check Installation Status
```bash
shipai status
```

## 🛠️ Development

### Web Application
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### CLI Tool
```bash
cd packages/agent-cli

# Install dependencies
pnpm install

# Build CLI
pnpm run build

# Run tests
pnpm test

# Link for local testing
npm link
```

## 🤝 Contributing

We welcome contributions of all kinds! Whether you're fixing a bug, adding a new agent, improving documentation, or suggesting features, we'd love to hear from you.

### Ways to Contribute

1. **Add New Agents**: Create AI agents for specific use cases
2. **Improve CLI**: Add new commands or enhance existing ones
3. **Enhance Website**: Improve UI/UX or add new features
4. **Documentation**: Help improve guides and examples
5. **Bug Reports**: Report issues and help squash bugs

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

See [CONTRIBUTING.md](./packages/agent-cli/CONTRIBUTING.md) for detailed guidelines.

## 📋 CLI Commands

### Core Commands
```bash
shipai list              # List all available agents
shipai install <agent>   # Install specific agent
shipai uninstall <agent> # Remove agent
shipai update <agent>    # Update agent
shipai status           # Show installation status
shipai search <query>   # Search agents
```

### Advanced Commands
```bash
shipai config           # Configure CLI settings
shipai batch            # Batch operations
shipai template         # Create agent templates
shipai --help           # Show all commands
```

### Options
- `-c, --category <cat>`: Filter by category
- `-f, --featured`: Show featured agents only
- `-i, --interactive`: Interactive installation
- `--dry-run`: Preview without making changes

## 🏗️ Architecture

### Web Application
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with dark mode
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Deployment**: Static site generation

### CLI Tool
- **Language**: TypeScript
- **Framework**: Commander.js for CLI parsing
- **Package Manager**: pnpm with workspace support
- **Testing**: Jest for unit tests
- **Build**: TypeScript compilation

## 📦 Packages

### @shipai/cli
The main CLI package for installing and managing AI agents.

**Installation:**
```bash
npm install -g @shipai/cli
```

**Dependencies:**
- commander.js: CLI framework
- inquirer: Interactive prompts
- chalk: Terminal styling
- ora: Loading spinners
- fs-extra: File system utilities

## 🐛 Supported IDEs

The CLI automatically detects and configures files for:

- **Claude Code**: `CLAUDE.md`
- **Cursor**: `.cursorrules`
- **Windsurf**: `.windsurfrules`
- **Codeium**: `.codeiumrules`
- **Continue**: `.continuerules`

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](./packages/agent-cli/LICENSE) file for details.

## 📊 Stats

- **AI Agents**: 35+ pre-built agents
- **Categories**: 11 different categories
- **CLI Commands**: 9 commands with 20+ options
- **Supported IDEs**: 5 major AI coding environments
- **Platform Support**: macOS, Linux, Windows (WSL)

## 🤝 Community

- **Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Pull Requests**: Contribute code and documentation
- **Twitter**: Follow for updates and tips

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/shipai/shipai-agents/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shipai/shipai-agents/discussions)
- **Email**: [Contact ShipAI](mailto:hello@shipaiagents.com)

---

Made with ❤️ by the ShipAI community. Open source and available for everyone.