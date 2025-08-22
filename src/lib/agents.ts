export interface Agent {
  name: string;
  description: string;
  model: 'haiku' | 'sonnet' | 'opus';
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan';
  category: string;
  slug: string;
}

export interface AgentCategory {
  name: string;
  slug: string;
  agents: Agent[];
  count: number;
}

// Static agent data for client-side rendering
export const agentsData: Agent[] = [
  // Core Development
  {
    name: 'frontend-developer',
    description: 'Use this agent when building modern web applications, optimizing user interfaces, or implementing responsive designs. Examples: Creating a React component library, optimizing a Vue.js SPA for performance, implementing accessibility features in a Next.js app',
    model: 'sonnet',
    color: 'blue',
    category: 'core-development',
    slug: 'frontend-developer'
  },
  {
    name: 'backend-developer',
    description: 'Use this agent when building server-side applications, designing APIs, or implementing business logic. Examples: Creating a RESTful API with authentication, designing a microservices architecture, implementing database optimization strategies',
    model: 'sonnet',
    color: 'green',
    category: 'core-development',
    slug: 'backend-developer'
  },
  {
    name: 'fullstack-developer',
    description: 'Use this agent when building complete applications that span frontend and backend, or when you need holistic system design. Examples: Building a complete web application from database to UI, designing a full-stack architecture, implementing end-to-end features across the stack',
    model: 'sonnet',
    color: 'purple',
    category: 'core-development',
    slug: 'fullstack-developer'
  },
  {
    name: 'mobile-developer',
    description: 'Use this agent when building mobile applications, optimizing mobile performance, or implementing mobile-specific features. Examples: Creating a React Native app with offline capabilities, optimizing a Flutter app for performance, implementing push notifications in a native iOS app',
    model: 'sonnet',
    color: 'blue',
    category: 'core-development',
    slug: 'mobile-developer'
  },
  {
    name: 'API-architect',
    description: 'Use this agent when designing APIs, implementing GraphQL schemas, or creating API documentation. Examples: Designing a RESTful API with OpenAPI specs, implementing GraphQL resolvers, creating comprehensive API documentation',
    model: 'sonnet',
    color: 'cyan',
    category: 'core-development',
    slug: 'API-architect'
  },
  {
    name: 'microservices-architect',
    description: 'Use this agent when designing microservices architectures, implementing service communication, or managing distributed systems. Examples: Breaking down a monolith into microservices, implementing service mesh patterns, designing event-driven architectures',
    model: 'sonnet',
    color: 'cyan',
    category: 'core-development',
    slug: 'microservices-architect'
  },
  {
    name: 'system-architect',
    description: 'Use this agent when designing large-scale systems, planning system architecture, or implementing enterprise solutions. Examples: Designing a high-traffic web application, planning a multi-tenant SaaS architecture, implementing enterprise integration patterns',
    model: 'sonnet',
    color: 'purple',
    category: 'core-development',
    slug: 'system-architect'
  },
  {
    name: 'algorithm-specialist',
    description: 'Use this agent when implementing complex algorithms, optimizing performance, or solving algorithmic challenges. Examples: Implementing sorting algorithms, optimizing database queries, solving algorithmic problems',
    model: 'sonnet',
    color: 'green',
    category: 'core-development',
    slug: 'algorithm-specialist'
  },

  // Language Specialists
  {
    name: 'typescript-pro',
    description: 'Use this agent when building TypeScript applications, implementing advanced type systems, or migrating JavaScript codebases. Examples: Creating a type-safe API client, implementing complex generic types, migrating a JavaScript project to TypeScript with strict mode',
    model: 'sonnet',
    color: 'blue',
    category: 'language-specialists',
    slug: 'typescript-pro'
  },
  {
    name: 'python-pro',
    description: 'Use this agent when building Python applications, implementing data science solutions, or optimizing Python performance. Examples: Creating a FastAPI web service, implementing machine learning pipelines, optimizing Python code for performance',
    model: 'sonnet',
    color: 'yellow',
    category: 'language-specialists',
    slug: 'python-pro'
  },
  {
    name: 'javascript-pro',
    description: 'Use this agent when building JavaScript applications, implementing modern ES6+ features, or optimizing JavaScript performance. Examples: Creating a Node.js API, implementing modern frontend features, optimizing JavaScript bundles',
    model: 'sonnet',
    color: 'yellow',
    category: 'language-specialists',
    slug: 'javascript-pro'
  },
  {
    name: 'golang-pro',
    description: 'Use this agent when building Go applications, implementing concurrent systems, or optimizing Go performance. Examples: Creating a microservice in Go, implementing concurrent data processing, optimizing Go memory usage',
    model: 'sonnet',
    color: 'blue',
    category: 'language-specialists',
    slug: 'golang-pro'
  },
  {
    name: 'rust-engineer',
    description: 'Use this agent when building Rust applications, implementing systems programming, or optimizing Rust performance. Examples: Creating a CLI tool in Rust, implementing memory-safe data structures, optimizing Rust compilation',
    model: 'sonnet',
    color: 'orange',
    category: 'language-specialists',
    slug: 'rust-engineer'
  },
  {
    name: 'java-architect',
    description: 'Use this agent when building Java applications, implementing enterprise patterns, or optimizing JVM performance. Examples: Creating a Spring Boot application, implementing design patterns, optimizing JVM memory usage',
    model: 'sonnet',
    color: 'red',
    category: 'language-specialists',
    slug: 'java-architect'
  },
  {
    name: 'csharp-developer',
    description: 'Use this agent when building C# applications, implementing .NET solutions, or optimizing C# performance. Examples: Creating an ASP.NET Core API, implementing design patterns, optimizing .NET performance',
    model: 'sonnet',
    color: 'purple',
    category: 'language-specialists',
    slug: 'csharp-developer'
  },
  {
    name: 'cpp-developer',
    description: 'Use this agent when building C++ applications, implementing systems programming, or optimizing C++ performance. Examples: Creating a high-performance library, implementing data structures, optimizing C++ memory usage',
    model: 'sonnet',
    color: 'blue',
    category: 'language-specialists',
    slug: 'cpp-developer'
  },
  {
    name: 'swift-ios-developer',
    description: 'Use this agent when building iOS applications, implementing Swift features, or optimizing iOS performance. Examples: Creating an iOS app with SwiftUI, implementing Core Data, optimizing iOS app performance',
    model: 'sonnet',
    color: 'orange',
    category: 'language-specialists',
    slug: 'swift-ios-developer'
  },
  {
    name: 'kotlin-android-developer',
    description: 'Use this agent when building Android applications, implementing Kotlin features, or optimizing Android performance. Examples: Creating an Android app with Kotlin, implementing Room database, optimizing Android app performance',
    model: 'sonnet',
    color: 'green',
    category: 'language-specialists',
    slug: 'kotlin-android-developer'
  },
  {
    name: 'ruby-rails-developer',
    description: 'Use this agent when building Ruby on Rails applications, implementing web services, or optimizing Ruby performance. Examples: Creating a Rails API, implementing ActiveRecord patterns, optimizing Ruby performance',
    model: 'sonnet',
    color: 'red',
    category: 'language-specialists',
    slug: 'ruby-rails-developer'
  },
  {
    name: 'php-laravel-developer',
    description: 'Use this agent when building PHP Laravel applications, implementing web services, or optimizing PHP performance. Examples: Creating a Laravel API, implementing Eloquent patterns, optimizing PHP performance',
    model: 'sonnet',
    color: 'purple',
    category: 'language-specialists',
    slug: 'php-laravel-developer'
  },
  {
    name: 'sql-database-expert',
    description: 'Use this agent when designing databases, optimizing SQL queries, or implementing database solutions. Examples: Designing a normalized database schema, optimizing complex SQL queries, implementing database migrations',
    model: 'sonnet',
    color: 'cyan',
    category: 'language-specialists',
    slug: 'sql-database-expert'
  },

  // Infrastructure & DevOps
  {
    name: 'devops-engineer',
    description: 'Use this agent when setting up CI/CD pipelines, managing infrastructure, or implementing DevOps practices. Examples: Creating a GitHub Actions workflow, setting up Kubernetes clusters, implementing infrastructure as code with Terraform',
    model: 'sonnet',
    color: 'orange',
    category: 'infrastructure-devops',
    slug: 'devops-engineer'
  },
  {
    name: 'cloud-architect',
    description: 'Use this agent when designing cloud infrastructure, implementing cloud solutions, or optimizing cloud costs. Examples: Designing AWS architecture, implementing multi-cloud strategies, optimizing cloud resource usage',
    model: 'sonnet',
    color: 'blue',
    category: 'infrastructure-devops',
    slug: 'cloud-architect'
  },
  {
    name: 'kubernetes-specialist',
    description: 'Use this agent when managing Kubernetes clusters, implementing container orchestration, or optimizing Kubernetes performance. Examples: Setting up Kubernetes clusters, implementing Helm charts, optimizing pod resource usage',
    model: 'sonnet',
    color: 'blue',
    category: 'infrastructure-devops',
    slug: 'kubernetes-specialist'
  },
  {
    name: 'terraform-iac-engineer',
    description: 'Use this agent when implementing infrastructure as code, managing cloud resources, or automating infrastructure deployment. Examples: Creating Terraform modules, implementing infrastructure automation, managing multi-environment deployments',
    model: 'sonnet',
    color: 'orange',
    category: 'infrastructure-devops',
    slug: 'terraform-iac-engineer'
  },
  {
    name: 'database-administrator',
    description: 'Use this agent when managing databases, optimizing database performance, or implementing database security. Examples: Setting up database clusters, implementing backup strategies, optimizing database queries',
    model: 'sonnet',
    color: 'cyan',
    category: 'infrastructure-devops',
    slug: 'database-administrator'
  },
  {
    name: 'network-engineer',
    description: 'Use this agent when designing networks, implementing network security, or troubleshooting network issues. Examples: Designing network architecture, implementing VPN solutions, troubleshooting connectivity issues',
    model: 'sonnet',
    color: 'blue',
    category: 'infrastructure-devops',
    slug: 'network-engineer'
  },
  {
    name: 'sre-engineer',
    description: 'Use this agent when implementing SRE practices, managing system reliability, or implementing monitoring solutions. Examples: Setting up monitoring systems, implementing SLOs and SLIs, managing incident response',
    model: 'sonnet',
    color: 'red',
    category: 'infrastructure-devops',
    slug: 'sre-engineer'
  },
  {
    name: 'deployment-specialist',
    description: 'Use this agent when implementing deployment strategies, managing release processes, or optimizing deployment pipelines. Examples: Implementing blue-green deployments, managing release automation, optimizing deployment times',
    model: 'sonnet',
    color: 'green',
    category: 'infrastructure-devops',
    slug: 'deployment-specialist'
  },

  // Quality & Security
  {
    name: 'code-reviewer',
    description: 'Use this agent when reviewing code, implementing code quality standards, or establishing development practices. Examples: Conducting thorough code reviews, implementing code quality gates, establishing coding standards',
    model: 'sonnet',
    color: 'blue',
    category: 'quality-security',
    slug: 'code-reviewer'
  },
  {
    name: 'security-auditor',
    description: 'Use this agent when implementing security measures, conducting security audits, or implementing secure coding practices. Examples: Conducting security code reviews, implementing authentication systems, identifying security vulnerabilities',
    model: 'sonnet',
    color: 'red',
    category: 'quality-security',
    slug: 'security-auditor'
  },
  {
    name: 'test-engineer',
    description: 'Use this agent when implementing testing strategies, creating automated tests, or establishing QA processes. Examples: Creating comprehensive test suites, implementing CI/CD testing, establishing testing frameworks',
    model: 'sonnet',
    color: 'green',
    category: 'quality-security',
    slug: 'test-engineer'
  },
  {
    name: 'performance-engineer',
    description: 'Use this agent when optimizing application performance, implementing performance testing, or resolving performance bottlenecks. Examples: Conducting performance audits, implementing load testing, optimizing application speed',
    model: 'sonnet',
    color: 'yellow',
    category: 'quality-security',
    slug: 'performance-engineer'
  },
  {
    name: 'debugger',
    description: 'Use this agent when troubleshooting issues, debugging complex problems, or implementing debugging strategies. Examples: Debugging production issues, implementing logging strategies, troubleshooting system problems',
    model: 'sonnet',
    color: 'orange',
    category: 'quality-security',
    slug: 'debugger'
  },
  {
    name: 'accessibility-specialist',
    description: 'Use this agent when implementing accessibility features, ensuring WCAG compliance, or creating inclusive user experiences. Examples: Implementing ARIA labels, ensuring keyboard navigation, testing with screen readers',
    model: 'sonnet',
    color: 'purple',
    category: 'quality-security',
    slug: 'accessibility-specialist'
  },

  // Data & AI
  {
    name: 'data-engineer',
    description: 'Use this agent when building data pipelines, implementing ETL processes, or managing data infrastructure. Examples: Creating data pipelines with Apache Airflow, implementing data warehouses, optimizing data processing',
    model: 'sonnet',
    color: 'blue',
    category: 'data-ai',
    slug: 'data-engineer'
  },
  {
    name: 'data-scientist',
    description: 'Use this agent when implementing data analysis, building machine learning models, or conducting statistical analysis. Examples: Implementing predictive models, conducting exploratory data analysis, building recommendation systems',
    model: 'sonnet',
    color: 'green',
    category: 'data-ai',
    slug: 'data-scientist'
  },
  {
    name: 'ml-engineer',
    description: 'Use this agent when implementing machine learning systems, managing ML infrastructure, or deploying ML models. Examples: Building ML pipelines, implementing MLOps practices, deploying models to production',
    model: 'sonnet',
    color: 'purple',
    category: 'data-ai',
    slug: 'ml-engineer'
  },
  {
    name: 'AI-application-developer',
    description: 'Use this agent when building AI applications, implementing LLM solutions, or creating RAG systems. Examples: Building chatbots with LLMs, implementing RAG for document search, creating AI-powered applications',
    model: 'sonnet',
    color: 'blue',
    category: 'data-ai',
    slug: 'AI-application-developer'
  },
  {
    name: 'database-optimizer',
    description: 'Use this agent when optimizing database performance, implementing query optimization, or managing database scaling. Examples: Optimizing database queries, implementing indexing strategies, managing database performance',
    model: 'sonnet',
    color: 'cyan',
    category: 'data-ai',
    slug: 'database-optimizer'
  },
  {
    name: 'analytics-engineer',
    description: 'Use this agent when building analytics systems, implementing data visualization, or creating business intelligence solutions. Examples: Building analytics dashboards, implementing data visualization, creating BI reports',
    model: 'sonnet',
    color: 'cyan',
    category: 'data-ai',
    slug: 'analytics-engineer'
  },

  // Developer Tools
  {
    name: 'dx-optimizer',
    description: 'Use this agent when optimizing developer experience, implementing development tools, or improving development workflows. Examples: Setting up development environments, implementing code generators, optimizing build processes',
    model: 'sonnet',
    color: 'blue',
    category: 'developer-tools',
    slug: 'dx-optimizer'
  },
  {
    name: 'build-engineer',
    description: 'Use this agent when optimizing build processes, implementing build automation, or managing build infrastructure. Examples: Optimizing build times, implementing build caching, managing build dependencies',
    model: 'sonnet',
    color: 'orange',
    category: 'developer-tools',
    slug: 'build-engineer'
  },
  {
    name: 'legacy-modernizer',
    description: 'Use this agent when modernizing legacy systems, migrating technologies, or updating outdated codebases. Examples: Migrating from older frameworks, updating deprecated APIs, modernizing legacy applications',
    model: 'sonnet',
    color: 'blue',
    category: 'developer-tools',
    slug: 'legacy-modernizer'
  },
  {
    name: 'refactoring-specialist',
    description: 'Use this agent when refactoring code, improving code quality, or restructuring codebases. Examples: Refactoring complex functions, improving code organization, restructuring large codebases',
    model: 'sonnet',
    color: 'green',
    category: 'developer-tools',
    slug: 'refactoring-specialist'
  },
  {
    name: 'documentation-engineer',
    description: 'Use this agent when creating technical documentation, implementing documentation systems, or improving code documentation. Examples: Creating API documentation, implementing documentation generators, improving code comments',
    model: 'sonnet',
    color: 'purple',
    category: 'developer-tools',
    slug: 'documentation-engineer'
  },

  // Specialized Domains
  {
    name: 'blockchain-developer',
    description: 'Use this agent when building blockchain applications, implementing smart contracts, or working with Web3 technologies. Examples: Creating smart contracts, building DApps, implementing blockchain integrations',
    model: 'sonnet',
    color: 'yellow',
    category: 'specialized-domains',
    slug: 'blockchain-developer'
  },
  {
    name: 'game-developer',
    description: 'Use this agent when building games, implementing game mechanics, or optimizing game performance. Examples: Creating game engines, implementing game physics, optimizing game rendering',
    model: 'sonnet',
    color: 'pink',
    category: 'specialized-domains',
    slug: 'game-developer'
  },
  {
    name: 'embedded-systems-engineer',
    description: 'Use this agent when building embedded systems, implementing IoT solutions, or working with hardware interfaces. Examples: Programming microcontrollers, implementing sensor systems, creating IoT applications',
    model: 'sonnet',
    color: 'blue',
    category: 'specialized-domains',
    slug: 'embedded-systems-engineer'
  },
  {
    name: 'fintech-developer',
    description: 'Use this agent when building financial applications, implementing payment systems, or working with financial data. Examples: Creating payment processing systems, implementing financial APIs, building trading platforms',
    model: 'sonnet',
    color: 'green',
    category: 'specialized-domains',
    slug: 'fintech-developer'
  },
  {
    name: 'iot-engineer',
    description: 'Use this agent when building IoT applications, implementing sensor networks, or working with connected devices. Examples: Creating IoT platforms, implementing sensor data processing, building device management systems',
    model: 'sonnet',
    color: 'blue',
    category: 'specialized-domains',
    slug: 'iot-engineer'
  },

  // Meta/Orchestration
  {
    name: 'workflow-orchestrator',
    description: 'Use this agent when designing complex workflows, implementing business process automation, or managing multi-step processes. Examples: Creating workflow engines, implementing business process automation, managing complex system interactions',
    model: 'sonnet',
    color: 'purple',
    category: 'meta-orchestration',
    slug: 'workflow-orchestrator'
  },
  {
    name: 'context-manager',
    description: 'Use this agent when managing complex system contexts, implementing state management, or coordinating multi-system interactions. Examples: Implementing context-aware systems, managing application state, coordinating microservices',
    model: 'sonnet',
    color: 'blue',
    category: 'meta-orchestration',
    slug: 'context-manager'
  },
  {
    name: 'research-analyst',
    description: 'Use this agent when conducting technical research, analyzing technology trends, or evaluating technical solutions. Examples: Researching new technologies, analyzing architectural patterns, evaluating solution alternatives',
    model: 'sonnet',
    color: 'blue',
    category: 'meta-orchestration',
    slug: 'research-analyst'
  }
];

// Get all agents
export function getAllAgents(): Agent[] {
  return agentsData;
}

// Get agents by filter
export function getAgentsByFilter(filter: string): Agent[] {
  if (filter === 'all') {
    return agentsData;
  }
  
  return agentsData.filter(agent => {
    if (filter === 'code-agents') {
      return ['core-development', 'language-specialists'].includes(agent.category);
    }
    if (filter === 'writing-agents') {
      return ['developer-tools'].includes(agent.category);
    }
    if (filter === 'analysis-agents') {
      return ['data-ai', 'quality-security', 'meta-orchestration'].includes(agent.category);
    }
    return false;
  });
}

// Get agent categories
export function getAgentCategories(): AgentCategory[] {
  const categories: Record<string, Agent[]> = {};
  
  agentsData.forEach(agent => {
    if (!categories[agent.category]) {
      categories[agent.category] = [];
    }
    categories[agent.category].push(agent);
  });
  
  return Object.entries(categories).map(([slug, agents]) => ({
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    slug,
    agents,
    count: agents.length
  })).sort((a, b) => b.count - a.count);
}
