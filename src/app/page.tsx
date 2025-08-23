import Link from "next/link";
import Script from "next/script";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://agentscamp.com/#website",
        "url": "https://agentscamp.com/",
        "name": "AgentsCamp - Claude Code Agents",
        "description": "Discover 60+ specialized Claude Code agents for software development. Expert AI assistants for frontend, backend, DevOps, testing, and more.",
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://agentscamp.com/#organization",
        "name": "AgentsCamp",
        "url": "https://agentscamp.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://agentscamp.com/logo.png"
        },
        "description": "Platform for specialized Claude Code agents to enhance software development workflows"
      },
      {
        "@type": "WebPage",
        "@id": "https://agentscamp.com/#webpage",
        "url": "https://agentscamp.com/",
        "name": "Claude Code Agents - 60+ AI Development Assistants | AgentsCamp",
        "isPartOf": {
          "@id": "https://agentscamp.com/#website"
        },
        "about": {
          "@id": "https://agentscamp.com/#organization"
        },
        "description": "Leverage the power of 60+ specialized Claude Code agents to streamline your development workflow. From intelligent code generation to automated testing.",
        "inLanguage": "en-US"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are Claude Code agents and how do they work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Claude Code agents are specialized AI assistants built on Anthropic's Claude platform, designed specifically for software development tasks. Each agent combines Claude's advanced language understanding with domain-specific expertise in areas like React development, Python programming, DevOps automation, and more."
            }
          },
          {
            "@type": "Question",
            "name": "How do I add Claude Code agents to my workflow?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Adding Claude Code agents to your workflow is simple. First, visit claude.ai/code to access Claude Code. Then browse our collection of 60+ specialized agents and select one that matches your development needs. Copy the agent's system prompt and add it to Claude Code using the 'Add Agent' feature."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between Claude Code agent models (Haiku, Sonnet, Opus)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Claude Code agents are available in three model tiers: Haiku (Fast) - Best for quick code completions and simple refactoring; Sonnet (Balanced) - Ideal for most development tasks; Opus (Powerful) - Excels at complex architectural decisions and deep code analysis."
            }
          },
          {
            "@type": "Question",
            "name": "Can Claude Code agents work with my existing development tools?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Claude Code agents are designed to integrate seamlessly with your existing development environment. They can understand and work with any programming language, framework, or tool in your tech stack, including VS Code, IntelliJ, Git workflows, CI/CD pipelines, Docker, and cloud platforms."
            }
          },
          {
            "@type": "Question",
            "name": "Are Claude Code agents suitable for team collaboration?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Claude Code agents are excellent for team collaboration. They maintain consistent coding standards across your team, help with code reviews, and ensure best practices are followed. Teams can share custom agent configurations tailored to their specific tech stack and coding guidelines."
            }
          },
          {
            "@type": "Question",
            "name": "How do Claude Code agents handle security and privacy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Claude Code agents are built with Anthropic's strong commitment to AI safety and privacy. Your code and conversations are not used to train models, ensuring your proprietary code remains confidential. They follow secure coding practices and can help identify potential security issues in your codebase."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
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

            
            {/* Main Headline - SEO Optimized */}
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-tight">
              <span className="text-slate-100">Claude Code Agents for</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Software Development
              </span>
            </h1>
            
            {/* Subtitle - Enhanced with keywords */}
            <p className="mx-auto max-w-3xl text-xl text-slate-300 mb-12 leading-relaxed">
              Leverage the power of <strong className="text-white">60+ specialized Claude Code agents</strong> to streamline your development workflow. 
              From intelligent code generation to automated testing, our Claude Code agents handle every aspect of modern software development.
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

      {/* What Are Claude Code Agents Section - New for SEO */}
      <section className="relative z-10 py-20 bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              What Are Claude Code Agents?
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                <strong className="text-white">Claude Code agents</strong> are specialized AI assistants powered by Anthropic&apos;s Claude, 
                designed specifically for software development tasks. Each agent combines Claude&apos;s advanced reasoning capabilities 
                with domain-specific expertise to provide intelligent coding assistance.
              </p>
              
              <p className="text-lg text-slate-300 leading-relaxed">
                Unlike generic AI tools, our Claude Code agents are fine-tuned for specific development roles - from frontend specialists 
                who understand React patterns to DevOps engineers who can optimize your CI/CD pipelines. With over 60 specialized agents 
                across 10+ categories, there&apos;s a Claude Code agent for every aspect of your development workflow.
              </p>
              
              <div className="pt-4">
                <Link href="/agents" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  <span>Browse all Claude Code agents</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6">Key Benefits of Claude Code Agents</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300"><strong className="text-white">Specialized Expertise:</strong> Each Claude Code agent masters specific technologies and frameworks</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300"><strong className="text-white">Context-Aware:</strong> Understands your codebase and maintains context throughout conversations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300"><strong className="text-white">Production-Ready Code:</strong> Generates clean, tested, and maintainable code following best practices</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300"><strong className="text-white">24/7 Availability:</strong> Get instant help whenever you need it, no scheduling required</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Claude Code Agents Excel - Enhanced for SEO */}
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
              <span className="text-slate-100">Why Claude Code Agents Transform Software Development</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Discover why thousands of developers choose <strong className="text-white">Claude Code agents</strong> powered by Anthropic&apos;s Claude AI for their development needs. 
              Superior reasoning, code expertise, and safety-first design make Claude Code agents the premier choice for AI-assisted programming.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-slate-100 mb-8">How Claude Code Agents Enhance Your Workflow</h3>
              <div className="space-y-6">
                {[
                  { title: "Intelligent Code Generation", desc: "Claude Code agents generate production-ready code with deep contextual understanding", icon: "⚡" },
                  { title: "Automated Code Reviews", desc: "Get instant feedback on code quality, security, and best practices from specialized Claude Code agents", icon: "🚀" },
                  { title: "Complex Problem Solving", desc: "Claude Code agents excel at algorithmic challenges and system design", icon: "🧠" },
                  { title: "Learning & Documentation", desc: "Claude Code agents explain concepts clearly and generate comprehensive documentation", icon: "📚" }
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
                  <h3 className="text-xl font-semibold text-slate-100 mb-6 text-center">Why Developers Trust Claude Code Agents</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Advanced AI Reasoning", desc: "Claude&apos;s superior logic and problem-solving for complex code challenges", color: "indigo" },
                      { title: "Multi-Language Expertise", desc: "Claude Code agents master Python, JavaScript, Java, Go, and 50+ languages", color: "purple" },
                      { title: "Enterprise-Grade Security", desc: "Claude Code agents follow secure coding practices and protect sensitive data", color: "pink" }
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

      {/* Claude Code Agents by Category - New for SEO */}
      <section className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Claude Code Agents by Category
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Explore our comprehensive collection of Claude Code agents organized by specialization. 
              Each category contains expert agents tailored for specific development needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/agents?category=core-development" className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors block">
              <div className="text-2xl mb-3">💻</div>
              <h3 className="text-xl font-semibold text-white mb-2">Core Development</h3>
              <p className="text-slate-400 mb-3">Claude Code agents for frontend, backend, and full-stack development</p>
              <span className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View agents →
              </span>
            </Link>
            
            <Link href="/agents?category=infrastructure-devops" className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors block">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Infrastructure & DevOps</h3>
              <p className="text-slate-400 mb-3">Claude Code agents for CI/CD, cloud architecture, and deployment</p>
              <span className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View agents →
              </span>
            </Link>
            
            <Link href="/agents?category=quality-security" className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors block">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality & Security</h3>
              <p className="text-slate-400 mb-3">Claude Code agents for testing, code review, and security auditing</p>
              <span className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View agents →
              </span>
            </Link>
            
            <Link href="/agents?category=data-ai" className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors block">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">Data & AI</h3>
              <p className="text-slate-400 mb-3">Claude Code agents for data engineering and machine learning</p>
              <span className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View agents →
              </span>
            </Link>
            
            <Link href="/agents?category=language-specialists" className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors block">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">Language Specialists</h3>
              <p className="text-slate-400 mb-3">Claude Code agents specialized in specific programming languages</p>
              <span className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View agents →
              </span>
            </Link>
            
            <Link href="/agents?category=developer-tools" className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors block">
              <div className="text-2xl mb-3">🛠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Developer Tools</h3>
              <p className="text-slate-400 mb-3">Claude Code agents for databases, APIs, and system architecture</p>
              <span className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View agents →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section about Claude Code Agents - New for SEO */}
      <section className="relative z-10 py-20 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Frequently Asked Questions about Claude Code Agents
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Everything you need to know about using Claude Code agents in your development workflow
            </p>
          </div>
          
          <div className="space-y-4">
            <details className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white">What are Claude Code agents and how do they work?</h3>
                <svg className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-slate-300 leading-relaxed">
                  Claude Code agents are specialized AI assistants built on Anthropic&apos;s Claude platform, designed specifically for software development tasks. 
                  Each agent combines Claude&apos;s advanced language understanding with domain-specific expertise in areas like React development, Python programming, 
                  DevOps automation, and more. They work by understanding your code context, requirements, and best practices to provide intelligent assistance 
                  ranging from code generation to debugging and architecture recommendations.
                </p>
              </div>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white">How do I add Claude Code agents to my workflow?</h3>
                <svg className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-slate-300 leading-relaxed">
                  Adding Claude Code agents to your workflow is simple. First, visit claude.ai/code to access Claude Code. 
                  Then browse our collection of 60+ specialized agents and select one that matches your development needs. 
                  Copy the agent&apos;s system prompt and add it to Claude Code using the &quot;Add Agent&quot; feature. 
                  Once added, you can interact with the agent directly in your coding environment, asking questions, 
                  requesting code reviews, or getting help with specific development tasks.
                </p>
              </div>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white">What&apos;s the difference between Claude Code agent models (Haiku, Sonnet, Opus)?</h3>
                <svg className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-slate-300 leading-relaxed mb-3">
                  Claude Code agents are available in three model tiers, each optimized for different use cases:
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong className="text-white">Haiku (Fast):</strong> Best for quick code completions, simple refactoring, and rapid iterations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span><strong className="text-white">Sonnet (Balanced):</strong> Ideal for most development tasks, offering the perfect mix of speed and capability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span><strong className="text-white">Opus (Powerful):</strong> Excels at complex architectural decisions, deep code analysis, and challenging problem-solving</span>
                  </li>
                </ul>
              </div>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white">Can Claude Code agents work with my existing development tools?</h3>
                <svg className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-slate-300 leading-relaxed">
                  Yes! Claude Code agents are designed to integrate seamlessly with your existing development environment. 
                  They can understand and work with any programming language, framework, or tool in your tech stack. 
                  Whether you&apos;re using VS Code, IntelliJ, or any other IDE, Claude Code agents can assist with code generation, 
                  debugging, testing, and documentation. They understand Git workflows, CI/CD pipelines, Docker configurations, 
                  and can even help with cloud platform deployments on AWS, Azure, or Google Cloud.
                </p>
              </div>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white">Are Claude Code agents suitable for team collaboration?</h3>
                <svg className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-slate-300 leading-relaxed">
                  Absolutely! Claude Code agents are excellent for team collaboration. They maintain consistent coding standards across your team, 
                  help with code reviews, and ensure best practices are followed. Teams can share custom agent configurations tailored to their 
                  specific tech stack and coding guidelines. Claude Code agents also help onboard new developers faster by explaining codebase 
                  architecture, answering questions about existing code, and providing context-aware assistance that aligns with your team&apos;s practices.
                </p>
              </div>
            </details>
            
            <details className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white">How do Claude Code agents handle security and privacy?</h3>
                <svg className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-slate-300 leading-relaxed">
                  Claude Code agents are built with Anthropic&apos;s strong commitment to AI safety and privacy. Your code and conversations are not used 
                  to train models, ensuring your proprietary code remains confidential. Claude Code agents are designed to refuse generating malicious code 
                  and will actively warn about security vulnerabilities. They follow secure coding practices, never expose sensitive information like API keys 
                  or passwords, and can help identify potential security issues in your codebase through specialized security-focused agents.
                </p>
              </div>
            </details>
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
            <span className="text-slate-100">Start Using Claude Code Agents Today</span>
          </h2>
          
          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers already using <strong className="text-white">Claude Code agents</strong> to accelerate their development workflow. 
            Experience the power of AI-assisted programming with our 60+ specialized agents.
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
    </>
  );
}
