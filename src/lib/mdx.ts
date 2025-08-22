import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface AgentData {
  name: string;
  description: string;
  model: 'haiku' | 'sonnet' | 'opus';
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan';
  category: string;
  slug: string;
  systemPrompt: string;
}

const AGENTS_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'agents');

export async function getAgentBySlug(category: string, slug: string): Promise<AgentData | null> {
  try {
    const filePath = path.join(AGENTS_DIRECTORY, category, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    const { data, content } = matter(fileContents);
    
    return {
      name: data.name,
      description: data.description,
      model: data.model,
      color: data.color,
      category,
      slug,
      systemPrompt: content.trim()
    };
  } catch (error) {
    console.error(`Error reading agent file for ${category}/${slug}:`, error);
    return null;
  }
}

export async function getAllAgentsFromMarkdown(): Promise<AgentData[]> {
  const agents: AgentData[] = [];
  
  try {
    const categories = fs.readdirSync(AGENTS_DIRECTORY);
    
    for (const category of categories) {
      const categoryPath = path.join(AGENTS_DIRECTORY, category);
      const stat = fs.statSync(categoryPath);
      
      if (stat.isDirectory()) {
        const files = fs.readdirSync(categoryPath);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const slug = file.replace('.md', '');
            const agent = await getAgentBySlug(category, slug);
            if (agent) {
              agents.push(agent);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading agents from markdown:', error);
  }
  
  return agents;
}

export async function getAgentsByCategory(category: string): Promise<AgentData[]> {
  const agents: AgentData[] = [];
  
  try {
    const categoryPath = path.join(AGENTS_DIRECTORY, category);
    const files = fs.readdirSync(categoryPath);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace('.md', '');
        const agent = await getAgentBySlug(category, slug);
        if (agent) {
          agents.push(agent);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading agents from category ${category}:`, error);
  }
  
  return agents;
}