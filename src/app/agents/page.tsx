import Link from 'next/link';

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,198,255,0.2),transparent_50%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-xl font-semibold text-slate-100">
                AgentsCamp
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-indigo-400 transition-colors duration-200">Home</Link>
              <Link href="/agents" className="text-indigo-400 font-medium">Agents</Link>
              <a href="#about" className="text-slate-300 hover:text-indigo-400 transition-colors duration-200">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section className="relative z-10 pt-24 pb-16">
        {/* Header Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Agents Collection
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover our curated collection of intelligent AI agents designed to solve specific problems and unlock new capabilities.
          </p>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="relative z-10 py-16">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-900/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="text-slate-300 font-medium">Filter by:</span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                    All Agents
                  </button>
                  <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700/70 transition-colors">
                    Code Agents
                  </button>
                  <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700/70 transition-colors">
                    Writing Agents
                  </button>
                  <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700/70 transition-colors">
                    Analysis Agents
                  </button>
                </div>
              </div>
              <div className="text-slate-400 text-sm">
                <span className="font-medium">12</span> agents available
              </div>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Agent Card 1 */}
            <div className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/30">
                    Code
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Code Review Agent</h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Advanced code analysis and review with detailed feedback on best practices, security, and performance.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                    Try Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Card 2 */}
            <div className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30">
                    Code
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Debug Assistant</h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Intelligent debugging support with step-by-step problem analysis and solution recommendations.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                    Try Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Card 3 */}
            <div className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs font-medium rounded-full border border-pink-500/30">
                    Writing
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Documentation Writer</h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Generate comprehensive technical documentation with clear explanations and examples.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Coming Soon</span>
                  </div>
                  <button className="px-4 py-2 bg-slate-600 text-slate-300 text-sm rounded-lg cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Card 4 */}
            <div className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">
                    Analysis
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Performance Analyzer</h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Analyze code performance and identify optimization opportunities with detailed metrics.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                    Try Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Card 5 */}
            <div className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">
                    Code
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Code Explainer</h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Get detailed explanations of complex code with step-by-step breakdowns and examples.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <button className="px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition-colors">
                    Try Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Card 6 */}
            <div className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-medium rounded-full border border-orange-500/30">
                    Analysis
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Security Scanner</h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Identify security vulnerabilities and provide remediation recommendations for your code.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Coming Soon</span>
                  </div>
                  <button className="px-4 py-2 bg-slate-600 text-slate-300 text-sm rounded-lg cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 border border-slate-600 text-slate-300 rounded-xl hover:border-indigo-500 hover:text-indigo-400 hover:bg-slate-800/50 transition-all duration-300">
              <span className="flex items-center gap-3 text-lg font-semibold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Load More Agents
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm py-16">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-slate-800/30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AC</span>
              </div>
              <span className="text-2xl font-semibold text-slate-100">
                AgentsCamp
              </span>
            </div>
            
            <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
              Empowering developers and creators to discover and utilize intelligent AI agents.
            </p>
            
            <div className="pt-8 border-t border-slate-700/50">
              <p className="text-slate-500 text-sm">
                © 2025 AgentsCamp. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
