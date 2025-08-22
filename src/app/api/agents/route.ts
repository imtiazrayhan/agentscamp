import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Agent {
  name: string;
  description: string;
  model: 'haiku' | 'sonnet' | 'opus';
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan';
  category: string;
  slug: string;
}

interface CategoryData {
  name: string;
  slug: string;
  agents: Agent[];
  count: number;
}

const AGENTS_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'agents');

export async function GET() {
  try {
    const categories: Record<string, Agent[]> = {};
    
    // Read all category directories
    const categoryDirs = fs.readdirSync(AGENTS_DIRECTORY);
    
    for (const categoryDir of categoryDirs) {
      const categoryPath = path.join(AGENTS_DIRECTORY, categoryDir);
      const stat = fs.statSync(categoryPath);
      
      if (stat.isDirectory()) {
        const agents: Agent[] = [];
        const files = fs.readdirSync(categoryPath);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(categoryPath, file);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            
            try {
              const { data } = matter(fileContents);
              const slug = file.replace('.md', '');
              
              agents.push({
                name: data.name || slug,
                description: data.description || '',
                model: data.model || 'sonnet',
                color: data.color || 'blue',
                category: categoryDir,
                slug: slug
              });
            } catch (error) {
              console.error(`Error parsing ${file}:`, error);
            }
          }
        }
        
        if (agents.length > 0) {
          categories[categoryDir] = agents;
        }
      }
    }
    
    // Convert to array format with category data
    const categoriesArray: CategoryData[] = Object.entries(categories)
      .map(([slug, agents]) => ({
        name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        slug,
        agents,
        count: agents.length
      }))
      .sort((a, b) => {
        // Sort categories in a logical order
        const order = [
          'core-development',
          'language-specialists',
          'infrastructure-devops',
          'data-ai',
          'quality-security',
          'developer-tools',
          'specialized-domains',
          'meta-orchestration'
        ];
        const aIndex = order.indexOf(a.slug);
        const bIndex = order.indexOf(b.slug);
        
        if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    
    // Get all agents in a flat array
    const allAgents = Object.values(categories).flat();
    
    return NextResponse.json({
      categories: categoriesArray,
      agents: allAgents,
      total: allAgents.length
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}