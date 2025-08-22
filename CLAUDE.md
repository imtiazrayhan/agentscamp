# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgentsCamp is a Next.js 15 application showcasing AI agents for various development tasks. The site serves as a platform to display and organize Claude Code agents.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3001)
npm run dev

# Build for production
npm run build

# Start production server (port 3001)
npm run start

# Run linter
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: Markdown files with gray-matter for metadata

### Project Structure

- **`/src/app`**: Next.js App Router pages and layouts
  - `agents/[category]/[slug]/page.tsx`: Dynamic routes for individual agent pages
  - `agents/page.tsx`: Main agents listing page with filtering
  
- **`/src/content/agents`**: Markdown files organized by category containing agent definitions
  - Each category folder contains agent markdown files with metadata
  
- **`/src/lib/agents.ts`**: Core data layer with static agent data and utility functions
  - `getAllAgents()`: Returns all agents
  - `getAgentsByFilter()`: Filter agents by type
  - `getAgentCategories()`: Get agent categories with counts

### Key Implementation Details

1. **Agent Data Model**: Agents have properties: name, description, model (haiku/sonnet/opus), color, category, and slug

2. **Dynamic Routing**: Uses Next.js dynamic routes for `/agents/[category]/[slug]` pattern

3. **Client-Side Filtering**: The agents page uses React state for filtering agents by category

4. **Color System**: Limited palette of 8 colors (red, blue, green, yellow, purple, orange, pink, cyan)

5. **Port Configuration**: Application runs on port 3001 (configured in package.json and next.config.ts)

## Important Patterns

- Agent data is centralized in `/src/lib/agents.ts` as a static array
- Client components use `'use client'` directive for interactivity
- Consistent use of Tailwind CSS for styling with slate color scheme
- Model badges indicate agent performance characteristics (Fast/Balanced/Powerful)