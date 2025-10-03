'use client'

import { useMemo, useState } from 'react'
import { Agent, IDE, ideConfigs } from '@/lib/agents'
import { getIdeFilename, renderRules } from '@/lib/ruleTemplates'

interface RuleGeneratorProps {
  agent: Agent
}

export default function RuleGenerator({ agent }: RuleGeneratorProps) {
  const supported = useMemo(() => {
    const ids = agent.supportedIDEs
    return ids && ids.length > 0
      ? ideConfigs.filter(i => ids.includes(i.id))
      : ideConfigs
  }, [agent])

  const [ide, setIde] = useState<IDE>(supported[0]?.id ?? 'claude-code')
  const content = useMemo(() => renderRules(agent.id, ide), [agent.id, ide])

  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }


  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold text-card-foreground">Rules Preview</h4>
          <select
            value={ide}
            onChange={(e) => setIde(e.target.value as IDE)}
            className="px-2 py-1 bg-secondary text-secondary-foreground text-[11px] rounded-md border border-border"
          >
            {supported.map(cfg => (
              <option key={cfg.id} value={cfg.id}>{cfg.name}</option>
            ))}
          </select>
          <span className="text-[11px] text-muted-foreground">{getIdeFilename(ide)}</span>
        </div>
        <button
          onClick={onCopy}
          className="px-2 py-1 bg-secondary hover:bg-accent text-secondary-foreground text-[11px] rounded-md transition-colors cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy Rules'}
        </button>
      </div>
      <div className="bg-muted rounded-lg p-4">
        <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-72 overflow-auto">{content}</pre>
      </div>
    </div>
  )
}
