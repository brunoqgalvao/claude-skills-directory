#!/usr/bin/env npx tsx
/**
 * Main pipeline runner - orchestrates discovery, harvesting, and normalization
 */

import { writeFile, readFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { discoverSources } from './discover.js'
import { harvestGitHubRepo } from './harvesters/github.js'
import { harvestSkillsDirectory } from './harvesters/skillsdirectory.js'
import { processSkills } from './normalize.js'
import type { RawSkill, NormalizedSkill } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '../..')
const DATA_DIR = join(ROOT_DIR, 'data')
const SKILLS_DIR = join(DATA_DIR, 'skills')
const INDEX_FILE = join(DATA_DIR, 'skills-index.json')

/**
 * Ensure ID is valid slug format: lowercase letters, numbers, and hyphens only
 */
function sanitizeId(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-')
}

/**
 * Truncate summary to 180 chars max (schema requirement)
 */
function truncateSummary(summary: string): string {
  if (summary.length <= 180) return summary
  return summary.substring(0, 177) + '...'
}

/**
 * Convert NormalizedSkill to the format used in data/skills/*.json
 */
function toSkillJson(skill: NormalizedSkill) {
  const id = sanitizeId(skill.slug)
  const summary = truncateSummary(skill.summary)

  return {
    id,
    name: skill.name,
    version: '1.0.0',
    summary,
    description: skill.description,
    verticals: skill.verticals.length > 0 ? skill.verticals.slice(0, 3) : ['operations'],
    tags: skill.tags,
    author: skill.author,
    status: 'ready' as const,
    verified: false,
    visibility: 'public' as const,
    license: 'MIT',
    links: {
      repo: skill.repoUrl,
      skill_md: skill.skillMdUrl
    },
    stats: {
      stars: skill.stats.stars,
      forks: skill.stats.forks,
      installs: skill.stats.installs
    },
    last_updated: skill.updatedAt || new Date().toISOString(),
    created_at: skill.createdAt,
    meta: {
      source: skill.source,
      sourceUrl: skill.sourceUrl,
      harvestedAt: skill.harvestedAt,
      uniqueId: skill.id // Keep the hash-based ID for deduplication
    }
  }
}

/**
 * Write a skill to data/skills/<slug>.json
 */
async function writeSkillFile(skill: NormalizedSkill): Promise<void> {
  const skillJson = toSkillJson(skill)
  const filePath = join(SKILLS_DIR, `${skillJson.id}.json`)
  const content = JSON.stringify(skillJson, null, 2)
  await writeFile(filePath, content, 'utf-8')
}

/**
 * Update the skills index
 */
async function updateIndex(newSkills: NormalizedSkill[]): Promise<void> {
  let existingSkills: any[] = []

  try {
    const content = await readFile(INDEX_FILE, 'utf-8')
    existingSkills = JSON.parse(content)
  } catch {
    // Index doesn't exist yet
  }

  // Add new skills to index
  const newEntries = newSkills.map(s => {
    const skillJson = toSkillJson(s)
    return {
      id: skillJson.id,
      name: s.name,
      summary: skillJson.summary,
      verticals: skillJson.verticals,
      tags: s.tags,
      author: s.author.name,
      stats: s.stats,
      uniqueId: s.id
    }
  })

  // Merge, keeping existing skills and adding new ones
  const existingIds = new Set(existingSkills.map(s => s.uniqueId || s.id))
  const merged = [
    ...existingSkills,
    ...newEntries.filter(s => !existingIds.has(s.uniqueId))
  ]

  await writeFile(INDEX_FILE, JSON.stringify(merged, null, 2), 'utf-8')
}

/**
 * Main pipeline execution
 */
async function runPipeline(options: { dryRun?: boolean } = {}): Promise<void> {
  console.log('═══════════════════════════════════════════════════')
  console.log('       SKILLS DIRECTORY INGESTION PIPELINE')
  console.log('═══════════════════════════════════════════════════\n')

  const startTime = Date.now()

  // Step 1: Discover sources
  console.log('STEP 1: DISCOVERY')
  console.log('─────────────────────────────────────────────────────')
  const sources = await discoverSources()

  // Step 2: Harvest from each source
  console.log('\nSTEP 2: HARVESTING')
  console.log('─────────────────────────────────────────────────────')
  const allRawSkills: RawSkill[] = []

  // 2a. Harvest from skillsdirectory.org (24k+ skills)
  console.log('\n  [2a] skillsdirectory.org')
  const skillsDirResult = await harvestSkillsDirectory({ maxSkills: 25000 })
  allRawSkills.push(...skillsDirResult.skills)
  if (skillsDirResult.errors.length > 0) {
    console.log(`  ⚠️ Errors:`, skillsDirResult.errors.slice(0, 5))
  }

  // 2b. Harvest from GitHub repos
  console.log('\n  [2b] GitHub repositories')
  for (const source of sources) {
    if (source.type === 'github_repo' || source.type === 'github_search') {
      const result = await harvestGitHubRepo(source.url)
      allRawSkills.push(...result.skills)

      if (result.errors.length > 0) {
        console.log(`  ⚠️ Errors:`, result.errors)
      }
    }
  }

  console.log(`\n  📊 Total raw skills harvested: ${allRawSkills.length}`)

  // Step 3: Normalize and deduplicate
  console.log('\nSTEP 3: NORMALIZATION')
  console.log('─────────────────────────────────────────────────────')
  const { normalized, new: newSkills, duplicates, existing } = await processSkills(
    allRawSkills,
    INDEX_FILE
  )

  // Step 4: Write output
  console.log('\nSTEP 4: OUTPUT')
  console.log('─────────────────────────────────────────────────────')

  if (options.dryRun) {
    console.log('  🔍 DRY RUN - No files written')
    console.log(`  Would write ${newSkills.length} new skill files`)
  } else if (newSkills.length === 0) {
    console.log('  ℹ️ No new skills to write')
  } else {
    // Ensure directories exist
    await mkdir(SKILLS_DIR, { recursive: true })

    // Write individual skill files
    for (const skill of newSkills) {
      const skillJson = toSkillJson(skill)
      await writeSkillFile(skill)
      console.log(`  ✓ Wrote ${skillJson.id}.json`)
    }

    // Update index
    await updateIndex(newSkills)
    console.log(`  ✓ Updated skills-index.json`)
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log('\n═══════════════════════════════════════════════════')
  console.log('                    SUMMARY')
  console.log('═══════════════════════════════════════════════════')
  console.log(`  Sources discovered:  ${sources.length}`)
  console.log(`  Skills harvested:    ${allRawSkills.length}`)
  console.log(`  Duplicates removed:  ${duplicates}`)
  console.log(`  Already existed:     ${existing}`)
  console.log(`  New skills added:    ${newSkills.length}`)
  console.log(`  Duration:            ${duration}s`)
  console.log('═══════════════════════════════════════════════════\n')

  if (newSkills.length > 0 && !options.dryRun) {
    console.log('New skills added:')
    for (const skill of newSkills) {
      console.log(`  - ${skill.name} (${skill.source})`)
    }
  }
}

// Parse CLI args
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || args.includes('-n')

// Run
runPipeline({ dryRun }).catch(error => {
  console.error('Pipeline failed:', error)
  process.exit(1)
})
