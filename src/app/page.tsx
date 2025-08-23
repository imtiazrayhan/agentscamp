import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,198,255,0.2),transparent_50%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AgentsCamp
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-white font-medium">
                Home
              </Link>
              <Link href="/agents" className="text-slate-300 hover:text-white transition-colors">
                Agents
              </Link>
              <Link href="/how-to-use" className="text-slate-300 hover:text-white transition-colors">
                How To Use
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        {/* Hero Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">

            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-tight">
              <span className="text-slate-100">Claude Code Agents</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                for Development Excellence
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="mx-auto max-w-3xl text-xl text-slate-300 mb-12 leading-relaxed">
              AgentsCamp provides a comprehensive collection of Claude Code agents designed to assist with every aspect of software development.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/agents" className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="flex items-center gap-3 text-lg font-semibold text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Explore Agents
                </span>
              </Link>
              
              <Link href="/how-to-use" className="px-8 py-4 border border-slate-600 text-slate-300 rounded-xl hover:border-indigo-500 hover:text-indigo-400 hover:bg-slate-800/50 transition-all duration-300">
                <span className="flex items-center gap-3 text-lg font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Learn More
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      

      {/* Claude Code Agents - Enhanced */}
      <section id="agents" className="relative z-10 py-20">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-800/30"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-slate-100">Claude Code Excellence</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Our specialized Claude Code agents are built on Anthropic&apos;s Claude platform, offering unparalleled development assistance.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-slate-100 mb-8">Why Claude Code Agents Excel</h3>
              <div className="space-y-6">
                {[
                  { title: "Code Generation & Review", desc: "Advanced code analysis and generation capabilities", icon: "⚡" },
                  { title: "Software Development", desc: "Comprehensive support for development workflows", icon: "🚀" },
                  { title: "Technical Problem Solving", desc: "Expert-level technical guidance and solutions", icon: "🧠" },
                  { title: "Programming Education", desc: "Learn coding concepts and best practices", icon: "📚" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-slate-700/50 border border-slate-600/50 rounded-xl flex items-center justify-center text-xl group-hover:bg-slate-700/70 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h4>
                      <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <h3 className="text-xl font-semibold text-slate-100 mb-6 text-center">Claude&apos;s Advantages</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Advanced Reasoning", desc: "Superior problem-solving capabilities", color: "indigo" },
                      { title: "Code Expertise", desc: "Deep understanding of programming languages", color: "purple" },
                      { title: "Safety Focused", desc: "Built with responsible AI principles", color: "pink" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full bg-${item.color}-500/20 border border-${item.color}-400/50 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <div className={`w-2 h-2 bg-${item.color}-400 rounded-full`}></div>
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">{item.title}</p>
                          <p className="text-slate-400 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Section - Enhanced */}
      <section className="relative z-10 py-20">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-900/30"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-1/3 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/3 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-6">
            <span className="text-slate-100">Ready to Explore Claude Code Agents?</span>
          </h2>
          
          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the growing community of developers who are enhancing their workflow with Claude Code agents.
          </p>
          
          <Link href="/agents" className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <span className="flex items-center gap-3 text-lg font-semibold text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Explore Agents
            </span>
          </Link>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm py-16">
        {/* Footer Background */}
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
              Empowering developers to enhance their workflow with specialized Claude Code agents.
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
