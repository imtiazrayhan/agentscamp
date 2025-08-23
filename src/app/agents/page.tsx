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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filterAgentsBySearch = (agents: Agent[], query: string) => {
    if (!query.trim()) return agents;
    
    const lowerQuery = query.toLowerCase();
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(lowerQuery) ||
      agent.description.toLowerCase().includes(lowerQuery) ||
      agent.category.toLowerCase().includes(lowerQuery) ||
      formatAgentName(agent.name).toLowerCase().includes(lowerQuery)
    );
  };

  const applyFilters = (category: string, search: string) => {
    let agents = data?.agents || [];
    
    // Apply category filter
    if (category !== 'all') {
      agents = data?.categories.find(c => c.slug === category)?.agents || [];
    }
    
    // Apply search filter
    agents = filterAgentsBySearch(agents, search);
    
    setFilteredAgents(agents);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    applyFilters(category, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters(activeCategory, query);
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
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AgentsCamp
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/agents" className="text-white font-medium">
                Agents
              </Link>
              <Link href="/how-to-use" className="text-slate-300 hover:text-white transition-colors">
                How To Use
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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search agents by name or description..."
              className="block w-full pl-10 pr-10 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {searchQuery ? 'No agents match your search' : 'No agents found'}
            </h3>
            {searchQuery && (
              <div>
                <p className="text-slate-400 mb-4">
                  Try adjusting your search terms or browse all agents
                </p>
                <button
                  onClick={() => handleSearchChange('')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
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