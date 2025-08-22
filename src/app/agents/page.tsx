'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Agent {
  name: string;
  description: string;
  model: 'haiku' | 'sonnet' | 'opus';
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan';
  category: string;
  slug: string;
}

interface CategoryData {
  name: string;
  slug: string;
  agents: Agent[];
  count: number;
}

interface ApiResponse {
  categories: CategoryData[];
  agents: Agent[];
  total: number;
}

export default function AgentsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      try {
        const response = await fetch('/api/agents');
        const result: ApiResponse = await response.json();
        setData(result);
        setFilteredAgents(result.agents);
        setLoading(false);
      } catch (error) {
        console.error('Error loading agents:', error);
        setLoading(false);
      }
    }

    loadAgents();
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredAgents(data?.agents || []);
    } else {
      const categoryAgents = data?.categories.find(c => c.slug === category)?.agents || [];
      setFilteredAgents(categoryAgents);
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-500 text-white',
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-black',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      pink: 'bg-pink-500 text-white',
      cyan: 'bg-cyan-500 text-white'
    };
    return colorMap[color] || 'bg-gray-500 text-white';
  };

  const getModelBadge = (model: string) => {
    const modelMap: Record<string, { label: string; classes: string }> = {
      haiku: { label: 'Fast', classes: 'bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full' },
      sonnet: { label: 'Balanced', classes: 'bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full' },
      opus: { label: 'Powerful', classes: 'bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full' }
    };
    const modelInfo = modelMap[model] || { label: model, classes: 'bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full' };
    return <span className={modelInfo.classes}>{modelInfo.label}</span>;
  };

  const formatAgentName = (name: string) => {
    return name.split('-').map(word => {
      // Keep API and AI in all caps
      if (word.toUpperCase() === 'API' || word.toUpperCase() === 'AI') {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  const formatCategoryName = (name: string) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AgentsCamp
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/agents" className="text-blue-400 font-medium">
                Agents
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Claude Code Agents Collection
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Explore our specialized Claude Code agents organized by category
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All ({data?.total || 0})
            </button>
            {data?.categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.slug
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filteredAgents.map((agent) => (
            <Link
              key={`${agent.category}-${agent.slug}`}
              href={`/agents/${agent.category}/${agent.slug}`}
              className="block bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-slate-900/20 group"
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${getColorClasses(agent.color)}`}></div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {formatAgentName(agent.name)}
                  </h3>
                </div>
                {getModelBadge(agent.model)}
              </div>

              {/* Agent Description */}
              <p className="text-slate-300 text-sm mb-3 leading-relaxed line-clamp-2">
                {agent.description}
              </p>

              {/* Agent Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                  {formatCategoryName(agent.category)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No agents found</h3>
            <p className="text-slate-400">Try selecting a different category.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 AgentsCamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}