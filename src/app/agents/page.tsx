'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Agent, getAgentsByFilter } from '@/lib/agents';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load agents on component mount
    const loadAgents = async () => {
      try {
        const allAgents = await getAgentsByFilter('all');
        setAgents(allAgents);
        setFilteredAgents(allAgents);
        setLoading(false);
      } catch (error) {
        console.error('Error loading agents:', error);
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const handleFilterChange = async (filter: string) => {
    setActiveFilter(filter);
    try {
      const filtered = await getAgentsByFilter(filter);
      setFilteredAgents(filtered);
    } catch (error) {
      console.error('Error filtering agents:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
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
        <div className="container mx-auto px-4 py-4">
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            AI Agents Collection
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover our comprehensive collection of specialized AI agents designed to help with every aspect of software development
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Agents
          </button>
          <button
            onClick={() => handleFilterChange('code-agents')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeFilter === 'code-agents'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Code Agents
          </button>
          <button
            onClick={() => handleFilterChange('writing-agents')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeFilter === 'writing-agents'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Writing Agents
          </button>
          <button
            onClick={() => handleFilterChange('analysis-agents')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeFilter === 'analysis-agents'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Analysis Agents
          </button>
          <div className="text-slate-400 text-sm">
            {filteredAgents.length} agents available
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAgents.map((agent) => (
            <div
              key={`${agent.category}-${agent.slug}`}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-slate-900/20 group"
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getColorClasses(agent.color)}`}></div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {agent.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                </div>
                {getModelBadge(agent.model)}
              </div>

              {/* Agent Description */}
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {agent.description}
              </p>

              {/* Agent Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                  {agent.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="text-xs text-slate-500">
                  {agent.model.toUpperCase()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                  Use Agent
                </button>
                <button className="px-4 py-2 border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white text-sm rounded-lg transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredAgents.length > 0 && (
          <div className="text-center">
            <button className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Load More Agents
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredAgents.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No agents found</h3>
            <p className="text-slate-400">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 AgentsCamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
