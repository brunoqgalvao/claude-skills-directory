/**
 * SkillsDirectory.org Harvester
 * Scrapes skills from skillsdirectory.org API (24k+ skills)
 */

import type { RawSkill, HarvesterResult } from '../types.js'

const API_BASE = 'https://www.skillsdirectory.org/api/skills'
const BATCH_SIZE = 100 // Max items per request
const MAX_SKILLS = 25000 // Safety limit

interface SkillsDirectorySkill {
  repoFullName: string
  skillPath: string
  name: string
  description: string
  license: string | null
  collectedAt: string
  gitUpdatedAt: string
  duplicateCount: number
  contentHash: string
}

interface SkillsDirectoryResponse {
  skills: SkillsDirectorySkill[]
  total: number
}

/**
 * Fetch a page of skills from the API
 */
async function fetchPage(offset: number, limit: number): Promise<SkillsDirectoryResponse> {
  const url = `${API_BASE}?limit=${limit}&offset=${offset}`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SkillsDir Pipeline/1.0',
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Convert API skill to RawSkill format
 */
function toRawSkill(skill: SkillsDirectorySkill): RawSkill {
  const [owner, repo] = skill.repoFullName.split('/')
  const repoUrl = `https://github.com/${skill.repoFullName}`

  return {
    source: 'skillsdirectory.org',
    sourceUrl: `https://www.skillsdirectory.org/skill/${encodeURIComponent(skill.repoFullName)}/${encodeURIComponent(skill.skillPath)}`,
    name: skill.name,
    slug: skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    repoUrl,
    skillPath: skill.skillPath,
    summary: skill.description,
    skillMdUrl: `https://raw.githubusercontent.com/${skill.repoFullName}/main/${skill.skillPath}`,
    author: {
      name: owner,
      github: owner
    },
    createdAt: skill.collectedAt,
    updatedAt: skill.gitUpdatedAt
  }
}

/**
 * Harvest all skills from skillsdirectory.org
 */
export async function harvestSkillsDirectory(options: {
  maxSkills?: number
  onProgress?: (fetched: number, total: number) => void
} = {}): Promise<HarvesterResult> {
  const { maxSkills = MAX_SKILLS, onProgress } = options

  const result: HarvesterResult = {
    source: 'skillsdirectory.org',
    skills: [],
    errors: [],
    timestamp: new Date().toISOString()
  }

  console.log('  📦 Harvesting skillsdirectory.org...')

  try {
    // Get first page to get total count
    const firstPage = await fetchPage(0, BATCH_SIZE)
    const total = Math.min(firstPage.total, maxSkills)

    console.log(`    Total available: ${firstPage.total}, fetching up to ${total}`)

    // Convert first page
    result.skills.push(...firstPage.skills.map(toRawSkill))

    if (onProgress) onProgress(result.skills.length, total)

    // Fetch remaining pages
    let offset = BATCH_SIZE
    while (offset < total) {
      try {
        const page = await fetchPage(offset, BATCH_SIZE)
        result.skills.push(...page.skills.map(toRawSkill))

        if (onProgress) onProgress(result.skills.length, total)
        console.log(`    Progress: ${result.skills.length}/${total}`)

        offset += BATCH_SIZE

        // Small delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        result.errors.push(`Failed at offset ${offset}: ${msg}`)
        // Continue with next batch
        offset += BATCH_SIZE
      }
    }

    console.log(`    Found ${result.skills.length} skills`)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    result.errors.push(`Harvester failed: ${msg}`)
    console.error(`    Error: ${msg}`)
  }

  return result
}

// Test if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  harvestSkillsDirectory({ maxSkills: 10 }).then(result => {
    console.log('\n--- Sample Results ---')
    console.log(`Skills: ${result.skills.length}`)
    console.log(`Errors: ${result.errors.length}`)
    if (result.skills.length > 0) {
      console.log('\nFirst skill:', JSON.stringify(result.skills[0], null, 2))
    }
  })
}
