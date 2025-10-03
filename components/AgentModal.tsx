'use client';

import { Agent, categories } from '@/lib/agents';
import RuleGenerator from './RuleGenerator';
import { useState, useMemo, useEffect } from 'react';

interface AgentModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentModal({ agent, isOpen, onClose }: AgentModalProps) {
  // Always declare hooks first; never return before hooks (ESLint rule)
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'prompt' | 'rules'>('overview');

  const category = agent ? categories.find(cat => cat.id === agent.category) : undefined;
  useEffect(() => {
    if (isOpen) setActiveTab('overview');
  }, [isOpen, agent?.id]);

  const copyPrompt = async () => {
    if (!agent) return;
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
      const url = `${window.location.origin}#${agent?.id ?? ''}`;
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const hasRules = !!agent?.ruleGenerator;
  const tabs = useMemo(() => {
    return [
      { id: 'overview', label: 'Overview' },
      { id: 'prompt', label: 'Prompt' },
      ...(hasRules ? [{ id: 'rules', label: 'Rules' } as const] : []),
    ];
  }, [hasRules]);

  // Safe early return AFTER hooks are declared
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 bg-background/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-border overflow-hidden">
        {/* Top header strip */}
        <div className="bg-gradient-to-r from-primary/15 via-transparent to-transparent p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <agent.icon size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground leading-tight">{agent.name}</h2>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                  {category?.name || agent.category}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-xl font-light cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-2">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                  activeTab === t.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-transparent hover:bg-accent'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 pt-4 overflow-y-auto max-h-[70vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {agent.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">Key Features</h3>
                  <div className="space-y-2">
                    {agent.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">Use Cases</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-secondary text-secondary-foreground text-[11px] rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-card-foreground">Agent Prompt</h3>
                <div className="flex gap-2">
                  <button
                    onClick={shareAgent}
                    className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-accent text-secondary-foreground text-[11px] rounded-md transition-colors cursor-pointer"
                  >
                    {linkCopied ? 'Link Copied!' : 'Share Link'}
                  </button>
                  <button
                    onClick={copyPrompt}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] rounded-md transition-colors cursor-pointer"
                  >
                    {copied ? 'Copied!' : 'Copy Prompt'}
                  </button>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap max-h-72 overflow-auto">
                  {agent.prompt}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'rules' && hasRules && (
            <RuleGenerator agent={agent} />
          )}
        </div>
      </div>
    </div>
  );
}
