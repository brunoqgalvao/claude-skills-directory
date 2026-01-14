/**
 * MCP Server Harvester - extracts MCP servers from awesome lists and directories
 */

import { execSync } from 'child_process'
import type { RawSkill, HarvesterResult } from '../types.js'
import { parseGitHubUrl } from '../utils.js'

// Known MCP server registries and awesome lists
const MCP_SOURCES = [
  {
    name: 'awesome-mcp-servers',
    url: 'https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md',
    type: 'awesome-list'
  },
  {
    name: 'mcp-servers-smithery',
    url: 'https://raw.githubusercontent.com/smithery-ai/mcp-servers/main/registry.json',
    type: 'json-registry'
  },
  {
    name: 'awesome-mcp-servers-wong2',
    url: 'https://raw.githubusercontent.com/wong2/awesome-mcp-servers/main/README.md',
    type: 'awesome-list'
  }
]

/**
 * Fetch content from URL
 */
function fetchUrl(url: string): string | null {
  try {
    const result = execSync(`curl -sL "${url}"`, { encoding: 'utf-8', timeout: 60000 })
    return result
  } catch {
    return null
  }
}

/**
 * Parse GitHub repo info
 */
function getRepoInfo(owner: string, repo: string): any | null {
  try {
    const result = execSync(`gh api repos/${owner}/${repo}`, { encoding: 'utf-8', timeout: 30000 })
    return JSON.parse(result)
  } catch {
    return null
  }
}

/**
 * Parse awesome list markdown and extract servers
 */
function parseAwesomeList(content: string): RawSkill[] {
  const skills: RawSkill[] = []
  const lines = content.split('\n')

  // Match markdown links with descriptions: - [Name](url) - Description
  // or: - **[Name](url)** - Description
  const linkRegex = /^[-*]\s+\*?\*?\[([^\]]+)\]\(([^)]+)\)\*?\*?\s*[-–:]?\s*(.*)$/

  for (const line of lines) {
    const match = line.match(linkRegex)
    if (!match) continue

    const [, name, url, description] = match

    // Only process GitHub URLs
    if (!url.includes('github.com')) continue

    const parsed = parseGitHubUrl(url)
    if (!parsed) continue

    skills.push({
      source: 'mcp-awesome-list',
      sourceUrl: url,
      name: name.trim(),
      repoUrl: url,
      summary: description.trim() || `${name} MCP server`,
      author: {
        name: parsed.owner,
        github: parsed.owner
      },
      tags: ['mcp', 'server', 'integration']
    })
  }

  return skills
}

/**
 * Parse JSON registry (Smithery format)
 */
function parseJsonRegistry(content: string): RawSkill[] {
  const skills: RawSkill[] = []

  try {
    const data = JSON.parse(content)
    const servers = Array.isArray(data) ? data : data.servers || []

    for (const server of servers) {
      const repoUrl = server.repository || server.repo || server.url
      if (!repoUrl) continue

      const parsed = parseGitHubUrl(repoUrl)

      skills.push({
        source: 'mcp-registry',
        sourceUrl: repoUrl,
        name: server.name || server.title || (parsed?.repo || 'Unknown'),
        repoUrl,
        summary: server.description || server.summary || `${server.name} MCP server`,
        author: {
          name: server.author || (parsed?.owner || 'Unknown'),
          github: parsed?.owner
        },
        tags: ['mcp', 'server', ...(server.tags || []), ...(server.categories || [])]
      })
    }
  } catch {
    // Invalid JSON
  }

  return skills
}

/**
 * Enrich skills with GitHub data
 */
async function enrichWithGitHub(skills: RawSkill[], limit = 100): Promise<RawSkill[]> {
  const enriched: RawSkill[] = []
  let count = 0

  for (const skill of skills) {
    if (count >= limit) {
      // Just add without enrichment
      enriched.push(skill)
      continue
    }

    if (skill.repoUrl) {
      const parsed = parseGitHubUrl(skill.repoUrl)
      if (parsed) {
        const repoInfo = getRepoInfo(parsed.owner, parsed.repo)
        if (repoInfo) {
          skill.stars = repoInfo.stargazers_count
          skill.forks = repoInfo.forks_count
          skill.description = skill.description || repoInfo.description
          skill.createdAt = repoInfo.created_at
          skill.updatedAt = repoInfo.updated_at
          count++
        }
      }
    }

    enriched.push(skill)
  }

  return enriched
}

/**
 * Harvest MCP servers from all known sources
 */
export async function harvestMcpServers(options: { enrichLimit?: number } = {}): Promise<HarvesterResult> {
  const result: HarvesterResult = {
    source: 'mcp',
    skills: [],
    errors: [],
    timestamp: new Date().toISOString()
  }

  console.log('  🔌 Harvesting MCP servers...')

  for (const source of MCP_SOURCES) {
    console.log(`    Fetching ${source.name}...`)
    const content = fetchUrl(source.url)

    if (!content) {
      result.errors.push(`Failed to fetch ${source.url}`)
      continue
    }

    let skills: RawSkill[] = []

    if (source.type === 'awesome-list') {
      skills = parseAwesomeList(content)
    } else if (source.type === 'json-registry') {
      skills = parseJsonRegistry(content)
    }

    console.log(`      Found ${skills.length} servers`)
    result.skills.push(...skills)
  }

  // Dedupe by repoUrl
  const seen = new Set<string>()
  result.skills = result.skills.filter(s => {
    if (!s.repoUrl || seen.has(s.repoUrl)) return false
    seen.add(s.repoUrl)
    return true
  })

  console.log(`    Total unique MCP servers: ${result.skills.length}`)

  // Enrich top servers with GitHub data
  if (options.enrichLimit && options.enrichLimit > 0) {
    console.log(`    Enriching top ${options.enrichLimit} with GitHub data...`)
    result.skills = await enrichWithGitHub(result.skills, options.enrichLimit)
  }

  return result
}
