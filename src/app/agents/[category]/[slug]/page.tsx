'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AgentData } from '@/lib/mdx';

interface AgentPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default function AgentPage({ params }: AgentPageProps) {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [relatedAgents, setRelatedAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedText, setCopiedText] = useState<string>('');

  useEffect(() => {
    async function loadAgent() {
      const { category, slug } = await params;
      
      try {
        const response = await fetch(`/api/agents/${category}/${slug}`);
        
        if (!response.ok) {
          notFound();
        }
        
        const data = await response.json();
        setAgent(data.agent);
        setRelatedAgents(data.relatedAgents);
      } catch (error) {
        console.error('Error loading agent:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    
    loadAgent();
  }, [params]);

  if (loading || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading agent...</p>
        </div>
      </div>
    );
  }

  const filteredRelatedAgents = relatedAgents;

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

  const getModelInfo = (model: string) => {
    const modelMap: Record<string, { label: string; description: string; classes: string }> = {
      haiku: { 
        label: 'Fast', 
        description: 'Fast and cost-effective for simple tasks',
        classes: 'bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full' 
      },
      sonnet: { 
        label: 'Balanced', 
        description: 'Balanced performance for most development work',
        classes: 'bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full' 
      },
      opus: { 
        label: 'Powerful', 
        description: 'Most capable for complex analysis and critical tasks',
        classes: 'bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full' 
      }
    };
    return modelMap[model] || { label: model, description: 'AI model', classes: 'bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full' };
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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Parse the system prompt to convert markdown headers and lists to HTML
  const formatSystemPrompt = (prompt: string) => {
    const lines = prompt.split('\n');
    const formattedLines: string[] = [];
    let inList = false;

    lines.forEach(line => {
      // Handle headers
      if (line.startsWith('## ')) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(`<h3 class="text-xl font-semibold text-white mt-6 mb-3">${line.substring(3)}</h3>`);
      } else if (line.startsWith('# ')) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(`<h2 class="text-2xl font-bold text-white mt-6 mb-4">${line.substring(2)}</h2>`);
      }
      // Handle bold text
      else if (line.includes('**')) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        formattedLines.push(`<p class="text-slate-300 mb-2">${formatted}</p>`);
      }
      // Handle list items with -
      else if (line.trim().startsWith('-')) {
        if (!inList) {
          formattedLines.push('<ul class="list-disc list-inside space-y-2 mb-4">');
          inList = true;
        }
        const formatted = line.trim().substring(1).trim()
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        formattedLines.push(`<li class="text-slate-300">${formatted}</li>`);
      }
      // Handle numbered lists
      else if (/^\d+\./.test(line.trim())) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        const formatted = line.trim().replace(/^\d+\.\s*/, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        formattedLines.push(`<div class="flex items-start space-x-3 mb-2"><span class="text-blue-400 font-semibold">${line.trim().match(/^\d+/)?.[0]}.</span><p class="text-slate-300">${formatted}</p></div>`);
      }
      // Handle regular paragraphs
      else if (line.trim()) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(`<p class="text-slate-300 mb-2">${line}</p>`);
      }
    });

    if (inList) {
      formattedLines.push('</ul>');
    }

    return formattedLines.join('\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
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

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <nav className="flex items-center space-x-2 text-sm text-slate-400">
          <Link href="/agents" className="hover:text-white transition-colors">
            Agents
          </Link>
          <span>/</span>
          <span className="text-white">{formatAgentName(agent.name)}</span>
        </nav>
      </div>

      {/* Agent Header */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-5xl font-bold text-white mb-6 uppercase tracking-wider">
          {agent.name.replace(/-/g, ' ')}
        </h1>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-300">Agent Metadata</h2>
            <button 
              onClick={() => handleCopy(agent.description, 'description')}
              className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-lg transition-colors"
            >
              {copiedText === 'description' ? 'Copied!' : 'Copy Description'}
            </button>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-6 font-mono text-sm">
            <div className="text-slate-400 mb-2">---</div>
            <div className="space-y-2">
              <div>
                <span className="text-blue-400">name:</span> <span className="text-green-300">{agent.name}</span>
              </div>
              <div>
                <span className="text-blue-400">description:</span> <span className="text-green-300">&quot;{agent.description}&quot;</span>
              </div>
              <div>
                <span className="text-blue-400">model:</span> <span className="text-green-300">{agent.model}</span>
              </div>
              <div>
                <span className="text-blue-400">color:</span> <span className="text-green-300">{agent.color}</span>
              </div>
            </div>
            <div className="text-slate-400 mt-2">---</div>
          </div>
        </div>

        {/* Agent Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - System Prompt */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">System Prompt</h2>
                <button 
                  onClick={() => handleCopy(agent.systemPrompt, 'prompt')}
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-lg transition-colors"
                >
                  {copiedText === 'prompt' ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatSystemPrompt(agent.systemPrompt) }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Agents */}
            {filteredRelatedAgents.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Related Agents</h3>
                <div className="space-y-3">
                  {filteredRelatedAgents.map(relatedAgent => (
                    <Link
                      key={relatedAgent.slug}
                      href={`/agents/${relatedAgent.category}/${relatedAgent.slug}`}
                      className="block p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getColorClasses(relatedAgent.color)}`}></div>
                        <div>
                          <div className="text-white font-medium text-sm">
                            {formatAgentName(relatedAgent.name)}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {relatedAgent.model.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 AgentsCamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}