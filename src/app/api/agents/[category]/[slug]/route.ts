import { NextResponse } from 'next/server';
import { getAgentBySlug, getAgentsByCategory } from '@/lib/mdx';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { category, slug } = await params;
  
  try {
    const agent = await getAgentBySlug(category, slug);
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    
    const relatedAgents = await getAgentsByCategory(category);
    const filteredRelatedAgents = relatedAgents.filter(a => a.slug !== slug).slice(0, 3);
    
    return NextResponse.json({ agent, relatedAgents: filteredRelatedAgents });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}