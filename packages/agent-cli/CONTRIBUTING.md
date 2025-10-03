# Contributing to ShipAI CLI

Thank you for your interest in contributing to ShipAI CLI! This document provides guidelines for contributors.

## 🚀 Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/shipaiagents.git`
3. Install dependencies: `pnpm install`
4. Create your feature branch: `git checkout -b feature/amazing-feature`
5. Make your changes
6. Run tests: `pnpm test`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

## 📋 Development Setup

### Prerequisites
- Node.js 16 or higher
- pnpm package manager
- Git

### Installation
```bash
git clone https://github.com/vikramships/shipaiagents.git
cd shipaiagents
pnpm install
```

### Building
```bash
pnpm run build
```

### Testing
```bash
# Run all tests
pnpm test

# Run in watch mode
pnpm test --watch

# Test the CLI locally
npm link
shipai --help
```

## 🛠️ How to Contribute

### Adding New Agents

1. Edit `src/agents.ts` to add your agent
2. Include all required fields:
   ```typescript
   {
     id: 'unique-agent-id',
     name: 'Agent Name',
     category: 'category-id',
     description: 'Brief description',
     keyFeatures: ['feature1', 'feature2'],
     useCases: ['usecase1', 'usecase2'],
     prompt: 'Your agent prompt here...',
     icon: YourIcon,
     featured?: boolean,
     ruleGenerator?: boolean,
     supportedIDEs?: IDE[]
   }
   ```
3. Add tests for the new agent
4. Update documentation

### Adding New Commands

1. Create a new file in `src/commands/`
2. Export your command function
3. Add it to `src/index.ts`
4. Write tests in `test/`

### Categories

To add a new category:
1. Add to `categories` array in `src/agents.ts`
2. Include proper color and count
3. Update documentation

## 🧪 Testing

### Running Tests
```bash
pnpm test                    # Run all tests
pnpm test --coverage        # Run with coverage
pnpm test --watch          # Watch mode
```

### Test Structure
- Unit tests in `test/` directory
- Integration tests for CLI commands
- Mock file system operations

## 📝 Code Style

### TypeScript
- Use strict TypeScript mode
- Provide proper types for all functions
- Use interfaces for complex objects

### Naming Conventions
- Files: kebab-case (`my-command.ts`)
- Functions: camelCase (`myFunction`)
- Variables: camelCase (`myVariable`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY`)

### Documentation
- Add JSDoc comments for all public functions
- Update README.md for new features
- Include examples in command help text

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**: OS, Node.js version, CLI version
2. **Command**: The exact command that failed
3. **Expected**: What you expected to happen
4. **Actual**: What actually happened
5. **Error**: Full error message and stack trace

## 💡 Feature Requests

Before submitting a feature request:

1. Check existing issues for duplicates
2. Consider if it fits the project scope
3. Provide clear use cases and examples

## 📦 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Tag the release: `git tag v1.0.0`
4. Push to GitHub
5. Publish to npm

## 🤝 Code of Conduct

Be respectful, inclusive, and professional. We welcome contributions from everyone regardless of background or experience level.

## 📞 Getting Help

- Create an issue for bugs or feature requests
- Start a discussion for questions
- Check existing documentation first

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Community shoutouts

Thank you for contributing to ShipAI CLI!