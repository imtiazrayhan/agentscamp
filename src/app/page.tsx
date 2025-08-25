'use client';

import Link from "next/link";
import Script from "next/script";
import PromoHeader, { useScrollDirection } from '@/components/PromoHeader';

export default function Home() {
  const { showPromo } = useScrollDirection();
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
              <Link href="/" className="text-gray-900 font-medium border-b-2 border-[#FF6B35] pb-1">
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

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Geometric Pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#4ECDC4] rounded-full"></div>
          <div className="absolute top-40 right-40 w-48 h-48 bg-[#FF6B35] rounded-full"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFE66D] rounded-full mb-6">
              <div className="w-2 h-2 bg-[#FF6B35] rounded-full"></div>
              <span className="text-sm font-medium text-gray-800">60+ Specialized Agents</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="text-gray-900">Claude Code Agents</span>
              <br />
              <span className="text-[#FF6B35]">for Modern</span>
              <span className="text-[#4ECDC4]"> Development</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
              Supercharge your coding workflow with specialized AI agents. 
              From React to DevOps, find the perfect Claude Code agent for every development task.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/agents" className="group inline-flex items-center justify-center px-8 py-4 bg-[#FF6B35] hover:bg-[#E5582A] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                <span>Explore Agents</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link href="/how-to-use" className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 hover:border-[#4ECDC4] text-gray-700 hover:text-[#4ECDC4] font-semibold rounded-lg transition-all duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Claude Code Agents Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 dot-pattern opacity-[0.02]"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What Are Claude Code Agents?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                <strong className="text-gray-900">Claude Code agents</strong> are specialized AI assistants powered by Anthropic&apos;s Claude, 
                designed specifically for software development tasks. Each agent combines Claude&apos;s advanced reasoning capabilities 
                with domain-specific expertise.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Unlike generic AI tools, our agents are fine-tuned for specific roles - from frontend specialists 
                who understand React patterns to DevOps engineers who can optimize your CI/CD pipelines.
              </p>
              
              <Link href="/agents" className="inline-flex items-center text-[#FF6B35] hover:text-[#E5582A] font-medium transition-colors">
                <span>Browse all Claude Code agents</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: "🎯", title: "Specialized Expertise", desc: "Each agent masters specific technologies" },
                { icon: "🧠", title: "Context-Aware", desc: "Understands your codebase and maintains context" },
                { icon: "⚡", title: "Production-Ready", desc: "Generates clean, tested, maintainable code" },
                { icon: "🔄", title: "24/7 Availability", desc: "Get instant help whenever you need it" }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl border border-gray-200">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Claude Code Agents Excel */}
      <section className="py-24 bg-[#F5F5F4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Developers Choose Claude Code Agents
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powered by Anthropic&apos;s Claude AI, our agents deliver superior reasoning, 
              code expertise, and safety-first design for modern development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Intelligent Code Generation",
                desc: "Generate production-ready code with deep contextual understanding",
                color: "border-[#FF6B35]"
              },
              {
                number: "02",
                title: "Automated Code Reviews",
                desc: "Get instant feedback on quality, security, and best practices",
                color: "border-[#4ECDC4]"
              },
              {
                number: "03",
                title: "Complex Problem Solving",
                desc: "Excel at algorithmic challenges and system design",
                color: "border-[#95E1D3]"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border-l-4 border-b-4 border-gray-200 hover:border-gray-300 transition-colors">
                <div className={`text-3xl font-bold text-gray-300 mb-4 ${item.color} border-l-4 pl-4 -ml-6`}>
                  {item.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Claude Code Agents by Category */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Agents by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive collection organized by specialization
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "💻", title: "Core Development", desc: "Frontend, backend, and full-stack", color: "bg-[#FF6B35]" },
              { emoji: "🚀", title: "Infrastructure & DevOps", desc: "CI/CD, cloud, and deployment", color: "bg-[#4ECDC4]" },
              { emoji: "🔒", title: "Quality & Security", desc: "Testing, reviews, and auditing", color: "bg-[#95E1D3]" },
              { emoji: "📊", title: "Data & AI", desc: "Data engineering and ML", color: "bg-[#FFE66D]" },
              { emoji: "🎯", title: "Language Specialists", desc: "Language-specific experts", color: "bg-[#FF6B35]" },
              { emoji: "🛠️", title: "Developer Tools", desc: "Databases, APIs, architecture", color: "bg-[#4ECDC4]" }
            ].map((cat, index) => (
              <Link 
                key={index}
                href={`/agents?category=${cat.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="group bg-gray-50 rounded-lg p-6 border-2 border-transparent hover:border-gray-200 transition-all"
              >
                <div className={`w-12 h-12 ${cat.color} bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {cat.emoji}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#FF6B35] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-gray-600 mb-3">{cat.desc}</p>
                <span className="text-[#FF6B35] font-medium text-sm group-hover:underline">
                  View agents →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F5F5F4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Claude Code agents
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "What are Claude Code agents and how do they work?",
                a: "Claude Code agents are specialized AI assistants built on Anthropic's Claude platform, designed specifically for software development tasks. Each agent combines Claude's advanced language understanding with domain-specific expertise."
              },
              {
                q: "How do I add Claude Code agents to my workflow?",
                a: "Visit claude.ai/code to access Claude Code. Browse our collection of 60+ specialized agents and select one that matches your needs. Copy the agent's system prompt and add it to Claude Code using the 'Add Agent' feature."
              },
              {
                q: "What's the difference between agent models?",
                a: "Haiku (Fast) - Best for quick code completions and simple refactoring; Sonnet (Balanced) - Ideal for most development tasks; Opus (Powerful) - Excels at complex architectural decisions and deep code analysis."
              }
            ].map((item, index) => (
              <details key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900">{item.q}</h3>
                  <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#95E1D3] bg-opacity-30 rounded-full mb-6">
            <div className="w-2 h-2 bg-[#4ECDC4] rounded-full"></div>
            <span className="text-sm font-medium text-gray-800">Ready to accelerate your development?</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Start Using Claude Code Agents Today
          </h2>
          
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of developers already using Claude Code agents to build better software faster.
          </p>
          
          <Link href="/agents" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF6B35] hover:bg-[#E5582A] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
            <span>Explore All Agents</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white font-bold">
                AC
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                AgentsCamp
              </span>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Empowering developers with specialized Claude Code agents for modern software development.
            </p>
            
            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
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