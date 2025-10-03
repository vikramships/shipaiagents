'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import FilterTabs from '@/components/FilterTabs';
import AgentCard from '@/components/AgentCard';
import { agents, categories } from '@/lib/agents';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAgents = useMemo(() => {
    const filtered = activeCategory === 'all'
      ? agents
      : agents.filter(agent => agent.category === activeCategory);

    // Sort featured agents first
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Header />

        {/* CLI Installation Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground mb-2">
                Install agents with ShipAI CLI
              </h2>
              <p className="text-muted-foreground text-sm">
                Get the command-line tool to manage AI agents directly in your projects
              </p>
            </div>
            <div className="text-right">
              <code className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground">
                npm install -g shipai-cli
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Open source • MIT License
              </p>
            </div>
          </div>
        </div>
        
        <FilterTabs 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        
        <div className="text-center text-muted-foreground text-sm mb-8">
          Showing {filteredAgents.length} agents {activeCategory !== 'all' && `in ${categories.find(c => c.id === activeCategory)?.name}`}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
