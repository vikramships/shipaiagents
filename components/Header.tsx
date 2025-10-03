import Link from 'next/link'
import DarkModeToggle from './DarkModeToggle'
import { Terminal } from 'lucide-react'

export default function Header() {
  return (
    <div className="mb-12">
      {/* Top right controls - hidden on mobile, visible on larger screens */}
      <div className="hidden sm:flex justify-end items-center gap-3 mb-6">
        <Link
          href="/install"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Terminal size={16} />
          Install CLI
        </Link>
        <DarkModeToggle />
      </div>

      {/* Main header content */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Ship AI Agents
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Optimize Claude Code for large codebases. Generate indexing workflows and context management rules.
          <br />
          Stop fighting with context windows and token limits.
        </p>
      </div>

      {/* Mobile controls - below title */}
      <div className="flex sm:hidden justify-center items-center gap-3 mt-6">
        <Link
          href="/install"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Terminal size={16} />
          Install CLI
        </Link>
        <DarkModeToggle />
      </div>
    </div>
  );
}