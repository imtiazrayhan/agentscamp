'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PromoHeader, { useScrollDirection } from '@/components/PromoHeader';

export default function HowToUsePage() {
  const { showPromo } = useScrollDirection();
  const [copiedText, setCopiedText] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          current = section.id;
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
    },
    {
      id: 'add-agent',
      title: 'How to Add an Agent in Claude Code',
      icon: '➕',
    },
    {
      id: 'choosing-agents',
      title: 'Choosing the Right Agent',
      icon: '🎯',
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: '💡',
    },
    {
      id: 'common-workflows',
      title: 'Common Workflows',
      icon: '🔄',
    },
    {
      id: 'advanced-tips',
      title: 'Advanced Tips',
      icon: '⚡',
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting & FAQs',
      icon: '❓',
    },
  ];

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
              <Link href="/how-to-use" className="text-gray-900 font-medium border-b-2 border-[#FF6B35] pb-1">
                How To Use
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="absolute inset-0 dot-pattern opacity-[0.02]"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFE66D] rounded-full mb-6">
              <div className="w-2 h-2 bg-[#FF6B35] rounded-full"></div>
              <span className="text-sm font-medium text-gray-800">Complete Guide</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              How to Use Claude Code Agents
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of working with specialized AI agents to accelerate your development workflow
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-[#FF6B35] text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Sections */}
          <div className="lg:col-span-3 space-y-16">
            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#FF6B35] bg-opacity-10 rounded-lg flex items-center justify-center text-2xl">
                  🚀
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Getting Started</h2>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <p className="text-gray-600">
                  Claude Code agents are specialized AI assistants that supercharge your development workflow. 
                  Here&apos;s how to get started:
                </p>
                
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#FFE66D] rounded-lg flex items-center justify-center font-bold text-gray-800">1</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Access Claude Code</h4>
                      <p className="text-gray-600">Visit <code className="px-2 py-1 bg-gray-100 rounded text-sm">claude.ai/code</code> and sign in to your account.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#FFE66D] rounded-lg flex items-center justify-center font-bold text-gray-800">2</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Browse Agent Collection</h4>
                      <p className="text-gray-600">Explore our 60+ specialized agents organized by category.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#FFE66D] rounded-lg flex items-center justify-center font-bold text-gray-800">3</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Add Agent to Claude Code</h4>
                      <p className="text-gray-600">Copy the agent&apos;s system prompt and add it to your Claude Code workspace.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* How to Add an Agent */}
            <section id="add-agent" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#4ECDC4] bg-opacity-10 rounded-lg flex items-center justify-center text-2xl">
                  ➕
                </div>
                <h2 className="text-3xl font-bold text-gray-900">How to Add an Agent in Claude Code</h2>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-6">
                  <div className="border-l-4 border-[#4ECDC4] pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step-by-Step Instructions</h3>
                    <ol className="space-y-3 text-gray-600">
                      <li>1. Navigate to the agent you want to add</li>
                      <li>2. Click the &quot;Copy System Prompt&quot; button</li>
                      <li>3. In Claude Code, click on &quot;Add Agent&quot; or &quot;Manage Agents&quot;</li>
                      <li>4. Paste the system prompt into the configuration</li>
                      <li>5. Give your agent a memorable name</li>
                      <li>6. Select the appropriate model (Haiku, Sonnet, or Opus)</li>
                      <li>7. Save and start using your new agent!</li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-900">Pro Tip:</strong> You can have multiple agents configured for different tasks. 
                      Switch between them based on your current development needs.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Choosing the Right Agent */}
            <section id="choosing-agents" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#95E1D3] bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
                  🎯
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Choosing the Right Agent</h2>
              </div>
              
              <div className="grid gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Agent Selection Guide</h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#FF6B35] pl-4">
                      <h4 className="font-medium text-gray-900">For Frontend Development</h4>
                      <p className="text-gray-600 text-sm mt-1">React Specialist, Vue Specialist, Frontend Developer</p>
                    </div>
                    
                    <div className="border-l-4 border-[#4ECDC4] pl-4">
                      <h4 className="font-medium text-gray-900">For Backend Development</h4>
                      <p className="text-gray-600 text-sm mt-1">Backend Developer, API Architect, Database Specialist</p>
                    </div>
                    
                    <div className="border-l-4 border-[#95E1D3] pl-4">
                      <h4 className="font-medium text-gray-900">For DevOps & Infrastructure</h4>
                      <p className="text-gray-600 text-sm mt-1">DevOps Engineer, Cloud Architect, Kubernetes Specialist</p>
                    </div>
                    
                    <div className="border-l-4 border-[#FFE66D] pl-4">
                      <h4 className="font-medium text-gray-900">For Quality Assurance</h4>
                      <p className="text-gray-600 text-sm mt-1">Test Engineer, Security Auditor, Code Reviewer</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Model Selection</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Haiku</span>
                      <div>
                        <p className="font-medium text-gray-900">Fast & Efficient</p>
                        <p className="text-sm text-gray-600">Best for quick code completions and simple tasks</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Sonnet</span>
                      <div>
                        <p className="font-medium text-gray-900">Balanced Performance</p>
                        <p className="text-sm text-gray-600">Ideal for most development tasks</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">Opus</span>
                      <div>
                        <p className="font-medium text-gray-900">Maximum Capability</p>
                        <p className="text-sm text-gray-600">For complex architecture and deep analysis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section id="best-practices" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#FFE66D] bg-opacity-30 rounded-lg flex items-center justify-center text-2xl">
                  💡
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-[#FF6B35] mt-1">✓</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Provide Clear Context</h4>
                      <p className="text-sm text-gray-600 mt-1">Share relevant code, requirements, and constraints for better assistance</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="text-[#FF6B35] mt-1">✓</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Use Specific Agents</h4>
                      <p className="text-sm text-gray-600 mt-1">Choose specialized agents over general ones for domain-specific tasks</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="text-[#FF6B35] mt-1">✓</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Iterate and Refine</h4>
                      <p className="text-sm text-gray-600 mt-1">Build incrementally and ask for improvements as needed</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="text-[#FF6B35] mt-1">✓</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Verify Generated Code</h4>
                      <p className="text-sm text-gray-600 mt-1">Always review and test code before deployment</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="text-[#FF6B35] mt-1">✓</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Maintain Context</h4>
                      <p className="text-sm text-gray-600 mt-1">Keep conversations focused on specific problems for best results</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Common Workflows */}
            <section id="common-workflows" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#FF6B35] bg-opacity-10 rounded-lg flex items-center justify-center text-2xl">
                  🔄
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Common Workflows</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Building a New Feature</h3>
                  <ol className="space-y-2 text-gray-600">
                    <li className="flex gap-2">
                      <span className="text-[#4ECDC4]">1.</span>
                      Use <strong>System Architect</strong> for initial design
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#4ECDC4]">2.</span>
                      Implement with <strong>Frontend/Backend Developer</strong>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#4ECDC4]">3.</span>
                      Add tests with <strong>Test Engineer</strong>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#4ECDC4]">4.</span>
                      Review with <strong>Code Reviewer</strong>
                    </li>
                  </ol>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Debugging Complex Issues</h3>
                  <ol className="space-y-2 text-gray-600">
                    <li className="flex gap-2">
                      <span className="text-[#95E1D3]">1.</span>
                      Start with <strong>Debugger</strong> for root cause analysis
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#95E1D3]">2.</span>
                      Use <strong>Performance Engineer</strong> if performance-related
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#95E1D3]">3.</span>
                      Apply fixes with appropriate specialist agent
                    </li>
                  </ol>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Setting Up CI/CD</h3>
                  <ol className="space-y-2 text-gray-600">
                    <li className="flex gap-2">
                      <span className="text-[#FFE66D]">1.</span>
                      Plan with <strong>DevOps Engineer</strong>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#FFE66D]">2.</span>
                      Configure with <strong>CI/CD Specialist</strong>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#FFE66D]">3.</span>
                      Deploy with <strong>Cloud Architect</strong>
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Advanced Tips */}
            <section id="advanced-tips" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#4ECDC4] bg-opacity-10 rounded-lg flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Advanced Tips</h2>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Agent Chaining</h3>
                  <p className="text-gray-600 mb-3">
                    Combine multiple agents for complex tasks. Start with architecture planning, 
                    move to implementation, then testing and optimization.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <code className="text-sm text-gray-700">
                      System Architect → Backend Developer → Test Engineer → Performance Engineer
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Custom Agent Configurations</h3>
                  <p className="text-gray-600">
                    Modify agent prompts to match your team&apos;s coding standards, tech stack, 
                    and best practices for consistent results.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Context Management</h3>
                  <p className="text-gray-600">
                    Keep a document with project context, architecture decisions, and coding 
                    standards to share with agents for better assistance.
                  </p>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#95E1D3] bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
                  ❓
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Troubleshooting & FAQs</h2>
              </div>
              
              <div className="space-y-4">
                <details className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Agent not understanding my codebase?</span>
                    <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">
                      Provide more context about your project structure, dependencies, and specific requirements. 
                      Share relevant code snippets and explain the architecture.
                    </p>
                  </div>
                </details>

                <details className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Which model should I use?</span>
                    <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">
                      Start with Sonnet for most tasks. Use Haiku for simple, repetitive tasks. 
                      Switch to Opus for complex architectural decisions or when you need the highest quality output.
                    </p>
                  </div>
                </details>

                <details className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Can I use multiple agents simultaneously?</span>
                    <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">
                      Yes! You can configure multiple agents and switch between them as needed. 
                      This is particularly useful when working on different aspects of a project.
                    </p>
                  </div>
                </details>

                <details className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">How do I report issues or suggest improvements?</span>
                    <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">
                      Contact us through the Claude Code interface or visit our community forums. 
                      We actively collect feedback to improve agent capabilities.
                    </p>
                  </div>
                </details>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-white py-16 mt-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Supercharge Your Development?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start using Claude Code agents today and experience the future of AI-assisted development.
          </p>
          <Link href="/agents" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF6B35] hover:bg-[#E5582A] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
            <span>Browse All Agents</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}