import { notFound } from 'next/navigation';
import { agents, categories } from '@/lib/agents';
import AgentPageClient from './AgentPageClient';

interface AgentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params;
  const agent = agents.find(a => a.id === id);

  if (!agent) {
    notFound();
  }

  // Convert icon to string for serialization
  const serializedAgent = {
    ...agent,
    icon: agent.icon.name,
    category: agent.category
  };

  return <AgentPageClient agent={serializedAgent} />;
}

// Generate static params for all agents
export async function generateStaticParams() {
  return agents.map((agent) => ({
    id: agent.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AgentPageProps) {
  const { id } = await params;
  const agent = agents.find(a => a.id === id);
  const category = agent ? categories.find(cat => cat.id === agent.category) : undefined;

  if (!agent) {
    return {
      title: 'Agent Not Found',
      description: 'The requested agent could not be found.',
    };
  }

  return {
    title: `${agent.name} - AI Agent Directory`,
    description: agent.description,
    keywords: [
      agent.name,
      category?.name,
      'AI agent',
      'prompt engineering',
      ...agent.useCases
    ].join(', '),
    openGraph: {
      title: agent.name,
      description: agent.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: agent.name,
      description: agent.description,
    },
  };
}