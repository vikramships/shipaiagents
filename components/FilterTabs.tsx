'use client';

import { categories } from '@/lib/agents';

interface FilterTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterTabs({ activeCategory, onCategoryChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
            activeCategory === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          {category.name} {category.count > 0 && <span className="ml-1">{category.count}</span>}
        </button>
      ))}
    </div>
  );
}