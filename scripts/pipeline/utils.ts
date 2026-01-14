import { createHash } from 'crypto'

/**
 * Generate a unique, deterministic ID for a skill based on its source
 */
export function generateSkillId(source: string, repoUrl: string, skillPath?: string): string {
  const input = `${source}:${repoUrl}:${skillPath || ''}`
  const hash = createHash('sha256').update(input).digest('hex')
  return `sk_${hash.substring(0, 12)}`
}

/**
 * Convert a name to a URL-friendly slug
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Extract owner/repo from a GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) return null
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

/**
 * Detect verticals based on skill content
 */
export function detectVerticals(skill: { name: string; summary?: string; tags?: string[] }): string[] {
  const text = `${skill.name} ${skill.summary || ''} ${(skill.tags || []).join(' ')}`.toLowerCase()

  const verticalKeywords: Record<string, string[]> = {
    engineering: ['code', 'dev', 'programming', 'debug', 'test', 'build', 'deploy', 'api', 'typescript', 'python', 'rust', 'javascript'],
    legal: ['legal', 'law', 'contract', 'compliance', 'litigation', 'brief', 'case'],
    finance: ['finance', 'invoice', 'accounting', 'payment', 'budget', 'tax', 'revenue'],
    sales: ['sales', 'crm', 'lead', 'prospect', 'pipeline', 'deal'],
    marketing: ['marketing', 'seo', 'content', 'campaign', 'analytics', 'social'],
    support: ['support', 'ticket', 'helpdesk', 'customer', 'service'],
    hr: ['hr', 'hiring', 'recruitment', 'onboarding', 'employee'],
    operations: ['ops', 'operations', 'workflow', 'automation', 'process'],
    data: ['data', 'analytics', 'metrics', 'report', 'dashboard', 'visualization'],
    design: ['design', 'ui', 'ux', 'figma', 'prototype', 'wireframe']
  }

  const detected: string[] = []
  for (const [vertical, keywords] of Object.entries(verticalKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      detected.push(vertical)
    }
  }

  return detected.length > 0 ? detected : ['engineering'] // Default to engineering
}

/**
 * Clean and normalize tags
 */
export function normalizeTags(tags: string[]): string[] {
  return [...new Set(
    tags
      .map(t => t.toLowerCase().trim())
      .filter(t => t.length > 0 && t.length < 30)
  )]
}

/**
 * Read existing skills index and return a Set of IDs
 */
export async function getExistingSkillIds(indexPath: string): Promise<Set<string>> {
  try {
    const fs = await import('fs/promises')
    const content = await fs.readFile(indexPath, 'utf-8')
    const skills = JSON.parse(content)
    return new Set(skills.map((s: { id: string }) => s.id))
  } catch {
    return new Set()
  }
}
