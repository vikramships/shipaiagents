import { IDE, ideConfigs } from './agents'

// Basic helper to get filename by IDE
export function getIdeFilename(ide: IDE) {
  const cfg = ideConfigs.find(c => c.id === ide)
  return cfg ? cfg.filename : 'RULES.txt'
}

export function renderRules(agentId: string, ide: IDE): string {
  const header = (title: string) => {
    switch (ide) {
      case 'claude-code':
        return `# ${title}\n\n`;
      default:
        return `${title}\n\n`;
    }
  };

  switch (agentId) {
    case 'framework-debugger':
      return (
        header('Framework Debugging & Validation Rules') +
        `Purpose: Generate actionable, framework-specific debugging and validation rules.\n\n` +
        sections.commonSafety() +
        sections.frameworkDetection() +
        sections.validationCommands() +
        sections.frameworkBestPractices() +
        sections.errorPrevention() +
        sections.performanceTips()
      );

    case 'codebase-indexer':
      return (
        header('Codebase Indexing Workflow') +
        `Goal: Create general_index.md and detailed_index.md to guide the assistant efficiently.\n\n` +
        sections.commonSafety() +
        `1) Generate general_index.md (all files with 1–2 line descriptions)\n` +
        `- Command: find . -type f \\` +
        `\n  | grep -vE "(node_modules|.git|dist|build|.next)" \\` +
        `\n  | sed 's|^./||' \\` +
        `\n  | awk '{print "- "$0" — [short description]"}' > general_index.md\n\n` +
        `2) Generate detailed_index.md (functions/classes with docstrings/comments)\n` +
        `- For JS/TS: use ripgrep to extract signatures:\n` +
        `  rg -n "^(export )?(async )?function |^(export )?const [A-Za-z0-9_]+ = \\(|^class " \\` +
        `\n    --glob '!{node_modules,dist,build,.next}/**' \\` +
        `\n    | sed 's/^/ - /' > detailed_index.md\n\n` +
        `3) CLAUDE.md references (may or may not be up to date)\n` +
        `- Reference general_index.md for high-level navigation\n` +
        `- Reference detailed_index.md for symbol-level exploration\n\n` +
        `4) Staging strategy for very large repos\n` +
        `- Index by subdirectory: src/, packages/, apps/, tests/\n` +
        `- Commit after each stage: git commit -m "index: stage [name]"\n\n` +
        `5) Token-efficient exploration\n` +
        `- Prefer index files over raw file dumps\n` +
        `- Ask for specific paths before reading large files\n`
      );

    case 'context-manager':
      return (
        header('Subdirectory Context Management Rules') +
        `Objective: Prevent context pollution by scoping rules per directory.\n\n` +
        sections.commonSafety() +
        `Recommended structure:\n` +
        `- ./CLAUDE.md (root: global safety + navigation)\n` +
        `- ./src/CLAUDE.md (implementation focus, no product docs)\n` +
        `- ./tests/CLAUDE.md (testing patterns, fixtures, coverage focus)\n` +
        `- ./docs/CLAUDE.md (docs editing rules only)\n\n` +
        `Loading strategy:\n` +
        `- Only include the nearest CLAUDE.md in context\n` +
        `- For cross-area work, explicitly state the two scopes needed\n` +
        `- Prefer copying small relevant excerpts over entire files\n`
      );

    case 'ai-architect':
      return (
        header('AI-Friendly Architecture Rules') +
        `Goal: Make code easy for AI to navigate and reason about.\n\n` +
        sections.commonSafety() +
        `Principles:\n` +
        `- Single Responsibility: each module handles one concern\n` +
        `- Size limits: functions <50 lines, files <500 lines\n` +
        `- Clear boundaries: domain, app, infra layers\n` +
        `- Explicit interfaces: types and contracts at boundaries\n\n` +
        `Refactor checklist:\n` +
        `- Extract large functions into smaller helpers\n` +
        `- Move side effects to adapters\n` +
        `- Add docstrings for public APIs\n`
      );

    case 'safety-guardian':
      return (
        header('Safety & Destructive Operation Rules') +
        sections.commonSafety(true)
      );

    default:
      return (
        header('General Rules') +
        `Scope: Assistant behavior and project safety guidelines.\n\n` +
        sections.commonSafety()
      );
  }
}

const sections = {
  commonSafety(includeStrict = false) {
    return (
      `Safety Rules:\n` +
      `- Never run destructive commands (rm, rmdir, mv, cp overwrite) without explicit confirmation\n` +
      `- Validate all paths stay within the project directory\n` +
      `- Check git status before risky changes; commit safe points frequently\n` +
      `- Prefer previews and diffs before applying bulk edits\n` +
      (includeStrict
        ? `- Block rm -rf entirely; require backup verification before deletions\n`
        : '') +
      `\n`
    );
  },
  frameworkDetection() {
    return (
      `Framework Detection:\n` +
      `- Detect TypeScript: presence of tsconfig.json, .ts/.tsx files\n` +
      `- Detect React: dependencies react/react-dom, .tsx components\n` +
      `- Detect Next.js: next.config.*, app/ or pages/ directories\n` +
      `- Detect Python: *.py files, pyproject.toml/requirements.txt\n\n`
    );
  },
  validationCommands() {
    return (
      `Validation Commands:\n` +
      `- TypeScript: npx tsc --noEmit\n` +
      `- ESLint: npx eslint .\n` +
      `- Prettier: npx prettier -c .\n` +
      `- Next.js build: npx next build\n` +
      `- Python syntax: python -m py_compile $(git ls-files '*.py')\n\n`
    );
  },
  frameworkBestPractices() {
    return (
      `Best Practices:\n` +
      `- Keep components pure; lift side-effects to hooks/services\n` +
      `- Co-locate tests next to modules (module.test.ts)\n` +
      `- Use absolute imports via tsconfig paths\n\n`
    );
  },
  errorPrevention() {
    return (
      `Common Error Prevention:\n` +
      `- Avoid circular deps: enforce boundaries (domain -> app -> infra)\n` +
      `- Check null/undefined early; add exhaustive switch cases\n` +
      `- Validate environment variables on startup\n\n`
    );
  },
  performanceTips() {
    return (
      `Performance Tips:\n` +
      `- Memoize expensive React computations; avoid unnecessary renders\n` +
      `- Index DB queries; avoid N+1 patterns\n` +
      `- Cache results with clear invalidation strategy\n`
    );
  }
}

