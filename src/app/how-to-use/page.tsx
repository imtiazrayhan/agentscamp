'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HowToUsePage() {
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
              <Link href="/agents" className="text-slate-300 hover:text-white transition-colors">
                Agents
              </Link>
              <Link href="/how-to-use" className="text-white font-medium">
                How To Use
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              How to Use Claude Code Agents
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
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
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-slate-700/50 text-white border-l-2 border-blue-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-12">
            {/* Getting Started Section */}
            <section id="getting-started" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">🚀</span>
                <h2 className="text-2xl font-bold text-white">Getting Started</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">What are Claude Code Agents?</h3>
                  <p className="text-slate-300 mb-4">
                    Claude Code agents are specialized AI assistants built on Anthropic&apos;s Claude platform. Each agent is fine-tuned for specific development tasks, 
                    from frontend development to infrastructure management, providing expert-level assistance in their domain.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">How They Work</h3>
                  <p className="text-slate-300 mb-4">
                    Each agent combines Claude&apos;s advanced reasoning capabilities with specialized prompts and configurations tailored to specific development needs. 
                    Simply select an agent that matches your task, and interact with it using natural language.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Basic Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    <li>Access to Claude Code platform</li>
                    <li>Clear understanding of your development task</li>
                    <li>Basic knowledge of the technology domain you&apos;re working in</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How to Add an Agent Section */}
            <section id="add-agent" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">➕</span>
                <h2 className="text-2xl font-bold text-white">How to Add an Agent in Claude Code</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Adding Agents to Your Workflow</h3>
                  <p className="text-slate-300 mb-4">
                    Claude Code provides multiple ways to add and use specialized agents in your development workflow. Here&apos;s how to get started:
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Method 1: Using the /agents Command (Recommended)</h3>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-300 text-sm mb-3">
                      The easiest way to add and manage agents is through the built-in command:
                    </p>
                    <div className="bg-slate-800/50 rounded p-3 font-mono text-sm mb-3">
                      <span className="text-green-300">/agents</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      This command opens the agent management interface where you can browse, add, and configure agents.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Method 2: Using the Task Tool</h3>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-300 text-sm mb-3">
                      For programmatic agent invocation, use the Task tool in your prompts:
                    </p>
                    <div className="bg-slate-800/50 rounded p-3 font-mono text-xs mb-3">
                      <span className="text-slate-400">{`// Example: Invoking a code review agent`}</span><br />
                      <span className="text-green-300">&quot;Use the code-reviewer agent to analyze the changes in my pull request&quot;</span><br /><br />
                      <span className="text-slate-400">{`// Example: Invoking multiple agents`}</span><br />
                      <span className="text-green-300">&quot;First use the security-auditor agent to check for vulnerabilities, then use the performance-engineer agent to optimize&quot;</span>
                    </div>
                    <button
                      onClick={() => handleCopy("Use the code-reviewer agent to analyze my recent changes", "task-example")}
                      className="text-xs bg-slate-600 hover:bg-slate-500 text-slate-300 px-3 py-1 rounded transition-colors"
                    >
                      {copiedText === 'task-example' ? 'Copied!' : 'Copy Example'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Agent Configuration</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Configuration Fields</h4>
                      <ul className="space-y-2 text-slate-300 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <div>
                            <strong className="text-white">Name:</strong> Unique identifier for the agent
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <div>
                            <strong className="text-white">Description:</strong> What the agent does and when to use it
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <div>
                            <strong className="text-white">Model:</strong> Choose between haiku (fast), sonnet (balanced), or opus (powerful)
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <div>
                            <strong className="text-white">Tools:</strong> Available tools the agent can use (Read, Write, Bash, etc.)
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Invocation Methods</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-blue-300 font-medium text-sm mb-1">Automatic Delegation</p>
                          <p className="text-slate-400 text-xs">
                            Claude Code automatically selects and uses appropriate agents based on your task
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-300 font-medium text-sm mb-1">Explicit Invocation</p>
                          <p className="text-slate-400 text-xs">
                            Directly specify which agent to use for specific tasks
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Custom Agent Example</h3>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-300 text-sm mb-3">
                      Here's an example of a custom agent configuration:
                    </p>
                    <div className="bg-slate-800/50 rounded p-3 font-mono text-xs">
                      <span className="text-slate-400">// Custom API Documentation Agent</span><br />
                      <span className="text-yellow-300">{`{`}</span><br />
                      <span className="text-white">  "name":</span> <span className="text-green-300">"api-documenter"</span>,<br />
                      <span className="text-white">  "description":</span> <span className="text-green-300">"Generates comprehensive API documentation"</span>,<br />
                      <span className="text-white">  "model":</span> <span className="text-green-300">"sonnet"</span>,<br />
                      <span className="text-white">  "tools":</span> <span className="text-yellow-300">["Read", "Write", "Grep"]</span>,<br />
                      <span className="text-white">  "systemPrompt":</span> <span className="text-green-300">"You are an expert at creating clear API documentation..."</span><br />
                      <span className="text-yellow-300">{`}`}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Best Practices for Agent Management</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Start with pre-built agents before creating custom ones</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Test agents on small tasks before using them for critical work</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Chain agents together for complex workflows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Document custom agents for team collaboration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Choosing the Right Agent Section */}
            <section id="choosing-agents" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">🎯</span>
                <h2 className="text-2xl font-bold text-white">Choosing the Right Agent</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Understanding Agent Categories</h3>
                  <p className="text-slate-300 mb-4">
                    Agents are organized into specialized categories based on their expertise. Choose agents that match your specific development needs:
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Agent Categories Guide</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-400 mb-2">Core Development</h4>
                      <p className="text-slate-300 text-sm mb-2">
                        For fundamental programming tasks and application development
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Frontend Developer</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Backend Developer</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Fullstack Developer</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">API Architect</span>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-400 mb-2">Infrastructure & DevOps</h4>
                      <p className="text-slate-300 text-sm mb-2">
                        For deployment, scaling, and infrastructure management
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">DevOps Engineer</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Cloud Architect</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Kubernetes Specialist</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Terraform Engineer</span>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-400 mb-2">Quality & Security</h4>
                      <p className="text-slate-300 text-sm mb-2">
                        For code quality, testing, and security concerns
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Code Reviewer</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Test Engineer</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Security Auditor</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Performance Engineer</span>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-400 mb-2">Language Specialists</h4>
                      <p className="text-slate-300 text-sm mb-2">
                        For language-specific expertise and best practices
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Python Pro</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">JavaScript Pro</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">TypeScript Pro</span>
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Rust Engineer</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Matching Agents to Tasks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">🎨 Frontend Tasks</h4>
                      <p className="text-slate-400 text-sm">Frontend Developer for UI components, React/Vue specialists for framework-specific needs</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">⚙️ Backend Development</h4>
                      <p className="text-slate-400 text-sm">Backend Developer for APIs, Database Administrator for data layer</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">☁️ Infrastructure</h4>
                      <p className="text-slate-400 text-sm">DevOps Engineer for CI/CD, Cloud Architect for AWS/Azure/GCP</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">🔍 Code Quality</h4>
                      <p className="text-slate-400 text-sm">Code Reviewer for PRs, Test Engineer for test coverage</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">🔐 Security</h4>
                      <p className="text-slate-400 text-sm">Security Auditor for vulnerability scanning and compliance</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">📊 Data & AI</h4>
                      <p className="text-slate-400 text-sm">Data Engineer for pipelines, ML Engineer for model development</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Decision Tree for Agent Selection</h3>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <ol className="space-y-3 text-slate-300 text-sm">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2 font-semibold">1.</span>
                        <div>
                          <strong className="text-white">Identify your task category:</strong> Is it frontend, backend, infrastructure, or quality-related?
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2 font-semibold">2.</span>
                        <div>
                          <strong className="text-white">Consider specificity:</strong> Do you need language-specific expertise or general development help?
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2 font-semibold">3.</span>
                        <div>
                          <strong className="text-white">Evaluate complexity:</strong> Is this a simple task or does it require deep expertise?
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2 font-semibold">4.</span>
                        <div>
                          <strong className="text-white">Check for specialized needs:</strong> Security, performance, accessibility, etc.
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Model Performance Considerations</h3>
                  <p className="text-slate-300 mb-4">
                    While choosing agents, also consider the underlying model for optimal performance:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-green-400 mb-2">Haiku</h4>
                      <p className="text-slate-400 text-xs">Quick fixes, simple queries, rapid prototyping</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-blue-400 mb-2">Sonnet</h4>
                      <p className="text-slate-400 text-xs">Most development tasks, balanced speed and quality</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-purple-400 mb-2">Opus</h4>
                      <p className="text-slate-400 text-xs">Complex architecture, deep analysis, critical decisions</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices Section */}
            <section id="best-practices" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">💡</span>
                <h2 className="text-2xl font-bold text-white">Best Practices</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Effective Prompting</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Be Specific</h4>
                      <p className="text-slate-300 text-sm mb-3">Provide clear context and requirements for better results.</p>
                      <div className="bg-slate-800/50 rounded p-3 font-mono text-xs">
                        <span className="text-slate-400">// Good example</span><br />
                        <span className="text-green-300">"Create a React component for a user profile card with TypeScript, including props for name, email, and avatar"</span><br /><br />
                        <span className="text-slate-400">// Less effective</span><br />
                        <span className="text-red-300">"Make a profile component"</span>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Provide Context</h4>
                      <p className="text-slate-300 text-sm mb-3">Share relevant code snippets, error messages, or project structure.</p>
                      <button
                        onClick={() => handleCopy("I'm working on a Next.js 14 app with TypeScript and Tailwind CSS. I need to implement...", "context-example")}
                        className="text-xs bg-slate-600 hover:bg-slate-500 text-slate-300 px-3 py-1 rounded transition-colors"
                      >
                        {copiedText === 'context-example' ? 'Copied!' : 'Copy Example'}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Iterative Development</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-3 mt-1">1.</span>
                      <div>
                        <p className="text-white font-medium">Start with core functionality</p>
                        <p className="text-slate-400 text-sm">Get the basic implementation working first</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-3 mt-1">2.</span>
                      <div>
                        <p className="text-white font-medium">Refine and optimize</p>
                        <p className="text-slate-400 text-sm">Iterate on the solution with follow-up requests</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-3 mt-1">3.</span>
                      <div>
                        <p className="text-white font-medium">Add edge cases</p>
                        <p className="text-slate-400 text-sm">Handle error states and special scenarios</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Common Workflows Section */}
            <section id="common-workflows" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">🔄</span>
                <h2 className="text-2xl font-bold text-white">Common Workflows</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Building a New Feature</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-blue-400">1</div>
                      <p className="text-slate-300">Use <span className="text-white font-medium">System Architect</span> agent to design the feature structure</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-blue-400">2</div>
                      <p className="text-slate-300">Implement with <span className="text-white font-medium">Frontend/Backend Developer</span> agents</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-blue-400">3</div>
                      <p className="text-slate-300">Review with <span className="text-white font-medium">Code Reviewer</span> agent</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-blue-400">4</div>
                      <p className="text-slate-300">Add tests using <span className="text-white font-medium">Test Engineer</span> agent</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Debugging Issues</h3>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <ol className="space-y-2 text-slate-300 text-sm">
                      <li>1. Share the error message and relevant code with the <strong className="text-white">Debugger</strong> agent</li>
                      <li>2. Provide context about when the error occurs</li>
                      <li>3. Follow the agent's diagnostic steps</li>
                      <li>4. Implement suggested fixes iteratively</li>
                    </ol>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Code Optimization</h3>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-300 text-sm mb-3">
                      Use the <strong className="text-white">Performance Engineer</strong> agent to identify bottlenecks, 
                      then work with specialized agents to optimize specific areas.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Database Optimizer</span>
                      <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Refactoring Specialist</span>
                      <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Algorithm Specialist</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced Tips Section */}
            <section id="advanced-tips" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">⚡</span>
                <h2 className="text-2xl font-bold text-white">Advanced Tips</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Combining Multiple Agents</h3>
                  <p className="text-slate-300 mb-4">
                    For complex projects, leverage multiple agents in sequence. Each agent can build upon the work of others, 
                    creating a comprehensive solution.
                  </p>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Example: Full-Stack Application</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">→</span>
                        <span className="text-slate-300">Database Administrator for schema design</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">→</span>
                        <span className="text-slate-300">API Architect for endpoint planning</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">→</span>
                        <span className="text-slate-300">Backend Developer for implementation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">→</span>
                        <span className="text-slate-300">Frontend Developer for UI</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">→</span>
                        <span className="text-slate-300">DevOps Engineer for deployment</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Custom Workflows</h3>
                  <p className="text-slate-300 mb-4">
                    Create your own agent workflows based on your team's needs and project requirements.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Migration Workflow</h4>
                      <p className="text-slate-400 text-sm">Legacy Modernizer → Test Engineer → Deployment Specialist</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Security Audit</h4>
                      <p className="text-slate-400 text-sm">Security Auditor → Code Reviewer → Documentation Engineer</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Performance Optimization</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Use Haiku agents for rapid prototyping and quick iterations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Switch to Sonnet for production-ready code generation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Reserve Opus for architectural decisions and complex problem-solving</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Provide clear, concise prompts to reduce processing time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Troubleshooting Section */}
            <section id="troubleshooting" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">❓</span>
                <h2 className="text-2xl font-bold text-white">Troubleshooting & FAQs</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Common Issues</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Agent not understanding the request</h4>
                      <p className="text-slate-300 text-sm mb-2">Solution: Provide more context and be specific about your requirements.</p>
                      <p className="text-slate-400 text-xs">Try including: tech stack, project structure, specific error messages</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Code doesn't match project style</h4>
                      <p className="text-slate-300 text-sm mb-2">Solution: Share your coding standards or example code from your project.</p>
                      <p className="text-slate-400 text-xs">Include: ESLint config, prettier settings, or style guide</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Response too generic</h4>
                      <p className="text-slate-300 text-sm mb-2">Solution: Ask follow-up questions or request specific implementations.</p>
                      <p className="text-slate-400 text-xs">Be explicit about edge cases and requirements</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    <details className="bg-slate-700/30 rounded-lg p-4 cursor-pointer">
                      <summary className="font-medium text-white">Can I use multiple agents in one session?</summary>
                      <p className="text-slate-300 text-sm mt-2">
                        Yes! You can switch between agents as needed. Each agent maintains context within its session.
                      </p>
                    </details>
                    <details className="bg-slate-700/30 rounded-lg p-4 cursor-pointer">
                      <summary className="font-medium text-white">How do I know which model to choose?</summary>
                      <p className="text-slate-300 text-sm mt-2">
                        Start with Sonnet for most tasks. Use Haiku for simple queries and Opus only when you need deep analysis or complex solutions.
                      </p>
                    </details>
                    <details className="bg-slate-700/30 rounded-lg p-4 cursor-pointer">
                      <summary className="font-medium text-white">Can agents review each other's work?</summary>
                      <p className="text-slate-300 text-sm mt-2">
                        Absolutely! This is a recommended practice. Use the Code Reviewer agent to check work from other agents.
                      </p>
                    </details>
                    <details className="bg-slate-700/30 rounded-lg p-4 cursor-pointer">
                      <summary className="font-medium text-white">Do agents remember previous conversations?</summary>
                      <p className="text-slate-300 text-sm mt-2">
                        Agents maintain context within a session but don't have memory across different sessions. Always provide necessary context.
                      </p>
                    </details>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Getting Help</h3>
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-slate-300 mb-3">
                      Need additional assistance? Here are your options:
                    </p>
                    <div className="space-y-2">
                      <Link href="/agents" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                        <span>→</span>
                        <span>Browse all available agents</span>
                      </Link>
                      <Link href="https://docs.anthropic.com/claude" target="_blank" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                        <span>→</span>
                        <span>Claude documentation</span>
                      </Link>
                      <Link href="#" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                        <span>→</span>
                        <span>Community forum (Coming soon)</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
                <p className="text-lg text-slate-300 mb-6">
                  Explore our collection of specialized agents and supercharge your development process.
                </p>
                <Link
                  href="/agents"
                  className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <span>Browse Agents</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 AgentsCamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}