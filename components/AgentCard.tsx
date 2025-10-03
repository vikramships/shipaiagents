'use client';

import Link from 'next/link';
import { Agent, categories } from '@/lib/agents';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const category = categories.find(cat => cat.id === agent.category);
  const IconComponent = agent.icon;

  return (
    <Link
      href={`/agents/${agent.id}`}
      className={`bg-card rounded-lg border p-6 cursor-pointer transition-all duration-150 ease-out group h-full flex flex-col relative block ${
        agent.featured
          ? 'border-primary shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
          : 'border-border hover:border-ring hover:shadow-sm'
      }`}
    >
      {agent.featured && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 cursor-pointer ${
          agent.featured 
            ? 'bg-primary/10 text-primary border border-primary/20' 
            : 'bg-orange-50 dark:bg-orange-900/20 text-primary'
        }`}>
          <IconComponent size={20} />
        </div>
        <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-muted-foreground bg-muted">
          {category?.name || agent.category}
        </div>
      </div>
      
      <h3 className={`font-semibold text-base leading-tight mb-3 line-clamp-2 ${
        agent.featured ? 'text-card-foreground font-bold' : 'text-card-foreground'
      }`}>
        {agent.name}
      </h3>
      
      <p className="text-muted-foreground text-xs leading-relaxed flex-1 line-clamp-3">
        {agent.description}
      </p>

      {/* Installation Command */}
      <div className="mt-3 pt-3 border-t border-border">
        <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
          shipai install {agent.id}
        </code>
      </div>
    </Link>
  );
}