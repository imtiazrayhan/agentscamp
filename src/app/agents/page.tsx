'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PromoHeader, { useScrollDirection } from '@/components/PromoHeader';

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

function AgentsContent() {
  const searchParams = useSearchParams();
  const { showPromo } = useScrollDirection();
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
        
        // Check if there's a category query parameter
        const categoryParam = searchParams.get('category');
        if (categoryParam && result.categories.some(c => c.slug === categoryParam)) {
          setActiveCategory(categoryParam);
          const categoryAgents = result.categories.find(c => c.slug === categoryParam)?.agents || [];
          setFilteredAgents(categoryAgents);
        } else {
          setFilteredAgents(result.agents);
        }
      } catch (error) {
        console.error('Error loading agents:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, [searchParams]);

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
      red: 'bg-red-500',
      blue: 'bg-[#4ECDC4]',
      green: 'bg-green-500',
      yellow: 'bg-[#FFE66D]',
      purple: 'bg-purple-500',
      orange: 'bg-[#FF6B35]',
      pink: 'bg-pink-500',
      cyan: 'bg-[#95E1D3]'
    };
    return colorMap[color] || 'bg-gray-500';
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
      <div className="min-h-screen bg-[#FAFAF9]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Promotional Header */}
      <PromoHeader isVisible={showPromo} />
      
      {/* Subtle Grid Pattern Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 grid-pattern"></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 transition-opacity duration-300 ${showPromo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white text-sm font-bold">A</span>
              AgentsCamp
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/agents" className="text-gray-900 font-medium border-b-2 border-[#FF6B35] pb-1">
                Agents
              </Link>
              <Link href="/how-to-use" className="text-gray-600 hover:text-gray-900 transition-colors">
                How To Use
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="absolute inset-0 dot-pattern opacity-[0.02]"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Claude Code Agents Collection
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our specialized Claude Code agents organized by category
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search agents by name or description..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35]'
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
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35]'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Found <span className="font-semibold text-gray-900">{filteredAgents.length}</span> agents
              {searchQuery && <span> matching "{searchQuery}"</span>}
            </p>
          </div>
        )}

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAgents.map((agent) => (
            <Link
              key={`${agent.category}-${agent.slug}`}
              href={`/agents/${agent.category}/${agent.slug}`}
              className="group block bg-white rounded-lg border-2 border-gray-200 hover:border-[#4ECDC4] p-5 transition-all hover:shadow-lg"
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                  {formatAgentName(agent.name)}
                </h3>
                <div className={`w-3 h-3 rounded-full ${getColorClasses(agent.color)} flex-shrink-0 mt-1.5`}></div>
              </div>

              {/* Agent Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                {agent.description}
              </p>

              {/* Agent Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {formatCategoryName(agent.category)}
                </span>
                <span className="text-[#FF6B35] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF9]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading agents...</p>
          </div>
        </div>
      </div>
    }>
      <AgentsContent />
    </Suspense>
  );
}