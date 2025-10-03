# NPM CLI Package Development

## 📋 Task List

### Phase 1: Package Setup
- [x] Create CLI package directory structure
- [ ] Set up package.json with CLI configuration
- [ ] Configure TypeScript and build tools
- [ ] Add dependencies (commander.js, inquirer, chalk, etc.)

### Phase 2: Core CLI Structure
- [ ] Create main CLI entry point
- [ ] Set up command structure with commander.js
- [ ] Add global CLI configuration
- [ ] Implement help system and version info

### Phase 3: Agent Management
- [ ] Implement agent listing functionality
- [ ] Add agent browsing by category
- [ ] Create agent search functionality
- [ ] Add agent preview capabilities

### Phase 4: Installation System
- [ ] Detect IDE and configuration files
- [ ] Build CLAUDE.md installation logic
- [ ] Handle existing content gracefully
- [ ] Add support for different IDE formats

### Phase 5: CLI Commands
- [ ] `install` command - Install agents
- [ ] `list` command - List available agents
- [ ] `search` command - Search agents
- [ ] `update` command - Update installed agents
- [ ] `uninstall` command - Remove agents
- [ ] `status` command - Show installed agents

### Phase 6: Interactive Features
- [ ] Add interactive agent selection
- [ ] Create agent customization options
- [ ] Add batch installation
- [ ] Implement progress indicators

### Phase 7: Testing & Polish
- [ ] Write unit tests
- [ ] Test CLI with various scenarios
- [ ] Add error handling and validation
- [ ] Create documentation and examples

### Phase 8: Distribution
- [ ] Prepare package for npm publish
- [ ] Create installation guide
- [ ] Add README with usage examples
- [ ] Publish to npm

## 🚀 CLI Commands Preview

```bash
# Install CLI globally
npm install -g @agentdirectory/cli

# List available agents
agent-dir list

# Install specific agents
agent-dir install safety-guardian
agent-dir install api-builder --category development

# Interactive installation
agent-dir install --interactive

# Check installed agents
agent-dir status

# Update agents
agent-dir update safety-guardian
agent-dir update --all

# Remove agents
agent-dir uninstall safety-guardian

# Search agents
agent-dir search "database"
```

## 📁 Package Structure

```
packages/agent-cli/
├── src/
│   ├── commands/
│   │   ├── install.ts
│   │   ├── list.ts
│   │   ├── search.ts
│   │   ├── update.ts
│   │   └── uninstall.ts
│   ├── utils/
│   │   ├── fileUtils.ts
│   │   ├── agentUtils.ts
│   │   └── ideDetection.ts
│   ├── templates/
│   │   └── claudeMd.ts
│   └── index.ts
├── bin/
│   └── agent-dir
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Key Features

1. **Smart IDE Detection**: Automatically detect Claude Code, Cursor, Windsurf
2. **Safe Installation**: Merge agents with existing CLAUDE.md content
3. **Category Management**: Organize agents by categories
4. **Interactive Selection**: Browse and select agents interactively
5. **Version Management**: Update and rollback agent versions
6. **Project Specific**: Install agents per project or globally

## 💡 Next Steps

1. Set up basic package structure
2. Create CLI entry point
3. Implement agent listing
4. Build installation logic
5. Add interactive features
6. Test and publish