'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AgentData } from '@/lib/mdx';
import PromoHeader, { useScrollDirection } from '@/components/PromoHeader';

interface AgentPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default function AgentPage({ params }: AgentPageProps) {
  const { showPromo } = useScrollDirection();
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
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading agent...</p>
        </div>
      </div>
    );
  }

  const filteredRelatedAgents = relatedAgents;

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
        formattedLines.push(`<h3 class="text-lg font-semibold text-gray-900 mt-5 mb-2">${line.substring(3)}</h3>`);
      } else if (line.startsWith('# ')) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(`<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">${line.substring(2)}</h2>`);
      }
      // Handle bold text
      else if (line.includes('**')) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>');
        formattedLines.push(`<p class="text-gray-700 mb-2 leading-relaxed">${formatted}</p>`);
      }
      // Handle list items with -
      else if (line.trim().startsWith('-')) {
        if (!inList) {
          formattedLines.push('<ul class="list-disc list-inside space-y-1.5 mb-3 ml-2">');
          inList = true;
        }
        const formatted = line.trim().substring(1).trim()
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>');
        formattedLines.push(`<li class="text-gray-700">${formatted}</li>`);
      }
      // Handle numbered lists
      else if (/^\d+\./.test(line.trim())) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        const formatted = line.trim().replace(/^\d+\.\s*/, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>');
        formattedLines.push(`<div class="flex items-start space-x-3 mb-2"><span class="text-[#FF6B35] font-semibold flex-shrink-0">${line.trim().match(/^\d+/)?.[0]}.</span><p class="text-gray-700">${formatted}</p></div>`);
      }
      // Handle regular paragraphs
      else if (line.trim()) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(`<p class="text-gray-700 mb-2 leading-relaxed">${line}</p>`);
      }
    });

    if (inList) {
      formattedLines.push('</ul>');
    }

    return formattedLines.join('\n');
  };

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
              <Link href="/agents" className="text-gray-600 hover:text-gray-900 transition-colors">
                Agents
              </Link>
              <Link href="/how-to-use" className="text-gray-600 hover:text-gray-900 transition-colors">
                How To Use
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/agents" className="hover:text-gray-900 transition-colors">
            Agents
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{formatAgentName(agent.name)}</span>
        </nav>
      </div>

      {/* Agent Header */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {formatAgentName(agent.name)}
        </h1>
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Agent Metadata</h2>
            <button 
              onClick={() => handleCopy(agent.description, 'description')}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              {copiedText === 'description' ? '✓ Copied!' : 'Copy Description'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm border border-gray-100">
            <div className="text-gray-500 mb-2">---</div>
            <div className="space-y-2">
              <div>
                <span className="text-[#FF6B35] font-medium">name:</span> <span className="text-gray-700">{agent.name}</span>
              </div>
              <div>
                <span className="text-[#FF6B35] font-medium">description:</span> <span className="text-gray-700">&quot;{agent.description}&quot;</span>
              </div>
              <div>
                <span className="text-[#FF6B35] font-medium">model:</span> <span className="text-gray-700">{agent.model}</span>
              </div>
              <div>
                <span className="text-[#FF6B35] font-medium">color:</span> <span className="text-gray-700">{agent.color}</span>
              </div>
            </div>
            <div className="text-gray-500 mt-2">---</div>
          </div>
        </div>

        {/* Agent Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - System Prompt */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-gray-900">System Prompt</h2>
                <button 
                  onClick={() => handleCopy(agent.systemPrompt, 'prompt')}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  {copiedText === 'prompt' ? '✓ Copied!' : 'Copy Prompt'}
                </button>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatSystemPrompt(agent.systemPrompt) }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Agents */}
            {filteredRelatedAgents.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Agents</h3>
                <div className="space-y-2">
                  {filteredRelatedAgents.map(relatedAgent => (
                    <Link
                      key={relatedAgent.slug}
                      href={`/agents/${relatedAgent.category}/${relatedAgent.slug}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${getColorClasses(relatedAgent.color)} flex-shrink-0`}></div>
                        <div className="min-w-0">
                          <div className="text-gray-900 font-medium text-sm truncate">
                            {formatAgentName(relatedAgent.name)}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {relatedAgent.model.charAt(0).toUpperCase() + relatedAgent.model.slice(1)}
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
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 AgentsCamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}