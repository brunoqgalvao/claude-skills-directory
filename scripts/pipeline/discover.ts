/**
 * Discovery module - finds skill sources from various places
 */

import { execSync } from 'child_process'

interface DiscoveredSource {
  type: 'github_repo' | 'github_search' | 'web_directory'
  url: string
  name: string
  description?: string
  stars?: number
}

// Known skill repositories
const KNOWN_REPOS = [
  'anthropics/skills',
  'obra/superpowers',
  'travisvn/awesome-claude-skills',
  'daymade/claude-code-skills',
  'numman-ali/openskills',
  'tachyon-beep/skillpacks',
  'BandarLabs/open-skills',
  'Nice-Wolf-Studio/claude-code-supabase-skills',
]

// GitHub search queries to discover new repos
const SEARCH_QUERIES = [
  'claude skills SKILL.md',
  'claude code skills',
  'anthropic agent skills',
  '.claude/skills',
]

/**
 * Get known repositories as sources
 */
export function getKnownRepos(): DiscoveredSource[] {
  return KNOWN_REPOS.map(repo => ({
    type: 'github_repo',
    url: `https://github.com/${repo}`,
    name: repo.split('/')[1],
    description: `Known skills repository: ${repo}`
  }))
}

/**
 * Search GitHub for skill repositories
 */
export async function searchGitHub(query: string, limit = 10): Promise<DiscoveredSource[]> {
  try {
    const result = execSync(
      `gh search repos "${query}" --limit ${limit} --json fullName,url,description,stargazersCount`,
      { encoding: 'utf-8', timeout: 30000 }
    )

    const repos = JSON.parse(result)
    return repos.map((repo: any) => ({
      type: 'github_search',
      url: repo.url,
      name: repo.fullName,
      description: repo.description,
      stars: repo.stargazersCount
    }))
  } catch (error) {
    console.error(`Search failed for "${query}":`, error)
    return []
  }
}

/**
 * Run all discovery methods and return unique sources
 */
export async function discoverSources(): Promise<DiscoveredSource[]> {
  console.log('🔍 Discovering skill sources...\n')

  const sources: DiscoveredSource[] = []
  const seenUrls = new Set<string>()

  // Add known repos
  console.log('📚 Adding known repositories...')
  for (const source of getKnownRepos()) {
    if (!seenUrls.has(source.url)) {
      sources.push(source)
      seenUrls.add(source.url)
      console.log(`  ✓ ${source.name}`)
    }
  }

  // Search GitHub
  console.log('\n🔎 Searching GitHub...')
  for (const query of SEARCH_QUERIES) {
    console.log(`  Searching: "${query}"`)
    const results = await searchGitHub(query, 5)
    for (const source of results) {
      if (!seenUrls.has(source.url)) {
        sources.push(source)
        seenUrls.add(source.url)
        console.log(`    ✓ ${source.name} (⭐ ${source.stars || 0})`)
      }
    }
  }

  console.log(`\n📊 Discovered ${sources.length} unique sources`)
  return sources
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverSources().then(sources => {
    console.log('\n--- All Sources ---')
    console.log(JSON.stringify(sources, null, 2))
  })
}
