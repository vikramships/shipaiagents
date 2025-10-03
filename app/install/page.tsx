import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download, Terminal, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Install ShipAI CLI - ShipAI Agents',
  description: 'Install the ShipAI CLI to manage AI coding agents directly in your projects',
};

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to agents
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Terminal className="text-primary" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-card-foreground">Install ShipAI CLI</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the command-line tool to install and manage AI coding agents directly in your projects
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-full border border-green-200 dark:border-green-800">
              Open Source
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm rounded-full border border-blue-200 dark:border-blue-800">
              MIT License
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-sm rounded-full border border-purple-200 dark:border-purple-800">
              Node.js 16+
            </span>
          </div>
        </div>

        {/* Quick Install */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
            <Download size={24} />
            Quick Install
          </h2>

          <div className="bg-muted rounded-lg p-6 mb-6">
            <code className="text-sm text-foreground font-mono">
              npm install -g @shipai/cli
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-card-foreground mb-3">After Installation</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm text-foreground">Verify installation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm text-foreground">Browse available agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm text-foreground">Install your first agent</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-card-foreground mb-3">Test Commands</h3>
              <div className="space-y-2">
                <code className="block text-xs bg-background border border-border rounded px-2 py-1">
                  shipai --version
                </code>
                <code className="block text-xs bg-background border border-border rounded px-2 py-1">
                  shipai list
                </code>
                <code className="block text-xs bg-background border border-border rounded px-2 py-1">
                  shipai install safety-guardian
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-card-foreground mb-3">Global Install</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Install for all users on your system
            </p>
            <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
              npm install -g @shipai/cli
            </code>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-card-foreground mb-3">Local Install</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Install for a specific project
            </p>
            <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
              npm install @shipai/cli
            </code>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-card-foreground mb-3">Using pnpm</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Alternative package manager
            </p>
            <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
              pnpm add -g @shipai/cli
            </code>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">Prerequisites</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-card-foreground mb-3">Required</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Node.js 16.0 or higher</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">npm 6.0+ or pnpm 7.0+</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Git (for some features)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-card-foreground mb-3">Supported Platforms</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">macOS (Intel & Apple Silicon)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Linux (Ubuntu, Debian, CentOS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Windows 10/11 (WSL recommended)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* First Steps */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">First Steps</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground mb-2">Browse Available Agents</h3>
                <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
                  shipai list
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  See all available AI agents with descriptions and categories
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground mb-2">Install Your First Agent</h3>
                <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
                  shipai install safety-guardian
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  Install a safety agent to protect your project from destructive commands
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground mb-2">Check Installation Status</h3>
                <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
                  shipai status
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  See which agents are installed and their configuration
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-card rounded-xl border border-border p-8">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">Troubleshooting</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-card-foreground mb-2">Permission Denied</h3>
              <p className="text-sm text-muted-foreground mb-2">
                If you get a permission error, try using sudo or fix npm permissions:
              </p>
              <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
                sudo npm install -g @shipai/cli
              </code>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium text-card-foreground mb-2">Node.js Version</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Check your Node.js version. ShipAI CLI requires Node.js 16 or higher:
              </p>
              <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
                node --version
              </code>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-card-foreground mb-2">Command Not Found</h3>
              <p className="text-sm text-muted-foreground mb-2">
                If the command isn&apos;t found, check your npm global path:
              </p>
              <code className="block text-xs bg-muted rounded px-2 py-2 font-mono">
                npm config get prefix
              </code>
            </div>
          </div>
        </div>

        {/* Open Source */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">Open Source Project</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              ShipAI CLI is open source and available on GitHub. Contributions, issues, and feedback are welcome!
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/shipai/shipai-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                View on GitHub
              </a>
              <a
                href="https://github.com/shipai/shipai-cli/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
              >
                Contributing Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}