import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllAgents } from '@/lib/agents';

interface AgentPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { category, slug } = await params;
  const allAgents = getAllAgents();
  const agent = allAgents.find(a => a.category === category && a.slug === slug);

  if (!agent) {
    notFound();
  }

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

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatAgentName = (name: string) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const modelInfo = getModelInfo(agent.model);

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

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-slate-400">
          <Link href="/agents" className="hover:text-white transition-colors">
            Agents
          </Link>
          <span>/</span>
          <Link href={`/agents?category=${agent.category}`} className="hover:text-white transition-colors">
            {formatCategoryName(agent.category)}
          </Link>
          <span>/</span>
          <span className="text-white">{formatAgentName(agent.name)}</span>
        </nav>
      </div>

      {/* Agent Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${getColorClasses(agent.color)}`}></div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {formatAgentName(agent.name)}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-slate-400 bg-slate-700 px-3 py-1 rounded-lg text-sm">
                    {formatCategoryName(agent.category)}
                  </span>
                  <span className={modelInfo.classes}>
                    {modelInfo.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Model</div>
              <div className="text-lg font-semibold text-white">{agent.model.toUpperCase()}</div>
              <div className="text-xs text-slate-500 mt-1">{modelInfo.description}</div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed">
              {agent.description}
            </p>
          </div>
        </div>

        {/* Agent Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Capabilities */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Capabilities</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Technical Expertise</h3>
                    <p className="text-slate-300">Deep knowledge and experience in {formatCategoryName(agent.category).toLowerCase()} with proven methodologies and best practices.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Problem Solving</h3>
                    <p className="text-slate-300">Advanced analytical skills to identify and resolve complex technical challenges efficiently.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Best Practices</h3>
                    <p className="text-slate-300">Implementation of industry-standard approaches and modern development methodologies.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">When to Use This Agent</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Primary Use Cases</h3>
                  <p className="text-slate-300 mb-3">{agent.description.split('Examples:')[0].replace('Use this agent when ', '')}</p>
                  <div className="text-sm text-slate-400">
                    <strong>Examples:</strong> {agent.description.split('Examples:')[1]}
                  </div>
                </div>
              </div>
            </div>

            {/* Output Format */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">What You&apos;ll Get</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Technical Implementation</h3>
                  <p className="text-slate-300 text-sm">Production-ready code, configurations, and detailed technical solutions.</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Best Practices</h3>
                  <p className="text-slate-300 text-sm">Industry-standard approaches and methodologies for your specific use case.</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Performance Notes</h3>
                  <p className="text-slate-300 text-sm">Optimization strategies and their impact on your solution.</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Testing Strategy</h3>
                  <p className="text-slate-300 text-sm">Comprehensive testing approaches and validation methods.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Start Chat with Agent
                </button>
                <button className="w-full border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  View Examples
                </button>
                <button className="w-full border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Save to Favorites
                </button>
              </div>
            </div>

            {/* Agent Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Agent Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-white">{formatCategoryName(agent.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Model:</span>
                  <span className="text-white">{agent.model.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Complexity:</span>
                  <span className="text-white">
                    {agent.model === 'haiku' ? 'Simple' : agent.model === 'sonnet' ? 'Medium' : 'Complex'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Response Time:</span>
                  <span className="text-white">
                    {agent.model === 'haiku' ? 'Fast' : agent.model === 'sonnet' ? 'Balanced' : 'Thorough'}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Agents */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Related Agents</h3>
              <div className="space-y-3">
                {allAgents
                  .filter(a => a.category === agent.category && a.slug !== agent.slug)
                  .slice(0, 3)
                  .map(relatedAgent => (
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
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-slate-300 mb-6">
              Start a conversation with {formatAgentName(agent.name)} and get expert assistance for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors text-lg">
                Start Chat Now
              </button>
              <Link
                href="/agents"
                className="border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white font-medium py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Browse More Agents
              </Link>
            </div>
          </div>
        </div>
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
