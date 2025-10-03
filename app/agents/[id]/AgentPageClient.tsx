'use client';

import { agents, categories } from '@/lib/agents';
import RuleGenerator from '@/components/RuleGenerator';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Share2 } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AgentPageClientProps {
  agent: Omit<typeof agents[0], 'icon'> & { icon: string };
}

export default function AgentPageClient({ agent }: AgentPageClientProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'prompt' | 'rules'>('overview');

  // Find the original agent with icon component for RuleGenerator
  const originalAgent = agents.find(a => a.id === agent.id);
  const category = categories.find(cat => cat.id === agent.category);
  const hasRules = !!agent.ruleGenerator;

  // Get the icon component dynamically with fallback
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[agent.icon] || Icons.HelpCircle;

  useEffect(() => {
    setActiveTab('overview');
  }, [agent.id]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(agent.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareAgent = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(`shipai install ${agent.id}`);
      setCommandCopied(true);
      setTimeout(() => setCommandCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command: ', err);
    }
  };

  const tabs = useMemo(() => {
    return [
      { id: 'overview', label: 'Overview' },
      { id: 'prompt', label: 'Prompt' },
      ...(hasRules ? [{ id: 'rules', label: 'Rules' } as const] : []),
    ];
  }, [hasRules]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to agents
        </Link>

        {/* Agent Header */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <IconComponent size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-card-foreground mb-2">{agent.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                  {category?.name || agent.category}
                </div>
                {agent.featured && (
                  <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                    Featured
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-base leading-relaxed">
                {agent.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={shareAgent}
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg transition-colors"
              >
                <Share2 size={16} />
                {linkCopied ? 'Link Copied!' : 'Share Agent'}
              </button>
              <a
                href="#prompt"
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                <Copy size={16} />
                View Prompt
              </a>
            </div>

            {/* Installation Command */}
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Install Agent</span>
                <button
                  onClick={copyInstallCommand}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors"
                >
                  {commandCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-background border border-border rounded px-3 py-2 text-foreground flex-1">
                  shipai install {agent.id}
                </code>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Requires ShipAI CLI: <code className="bg-background border border-border rounded px-1">npm install -g @shipai/cli</code>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-xl border border-border p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agent.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-card-foreground mb-4">Use Cases</h2>
                <div className="flex flex-wrap gap-3">
                  {agent.useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {agent.supportedIDEs && (
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground mb-4">Supported IDEs</h2>
                  <div className="flex flex-wrap gap-3">
                    {agent.supportedIDEs.map((ide, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-muted text-muted-foreground text-sm rounded-md capitalize"
                      >
                        {ide.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prompt' && (
            <div id="prompt">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">Agent Prompt</h2>
                <div className="flex gap-3">
                  <button
                    onClick={shareAgent}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg transition-colors"
                  >
                    <Share2 size={16} />
                    {linkCopied ? 'Link Copied!' : 'Share Link'}
                  </button>
                  <button
                    onClick={copyPrompt}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    <Copy size={16} />
                    {copied ? 'Copied!' : 'Copy Prompt'}
                  </button>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-6">
                <pre className="text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-auto">
                  {agent.prompt}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'rules' && hasRules && originalAgent && (
            <div>
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Generate IDE Rules</h2>
              <RuleGenerator agent={originalAgent} />
            </div>
          )}
        </div>

        {/* Related Agents */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-card-foreground mb-6">More {category?.name} Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents
              .filter(a => a.category === agent.category && a.id !== agent.id)
              .slice(0, 4)
              .map(relatedAgent => {
                const RelatedIconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[relatedAgent.icon.name] || Icons.HelpCircle;
                return (
                  <Link
                    key={relatedAgent.id}
                    href={`/agents/${relatedAgent.id}`}
                    className="bg-card rounded-lg border border-border p-6 hover:border-ring hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <RelatedIconComponent size={16} />
                      </div>
                      <h3 className="font-semibold text-card-foreground">{relatedAgent.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {relatedAgent.description}
                    </p>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}