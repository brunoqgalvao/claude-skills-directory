/**
 * Normalize and deduplicate skills from various sources
 */

import type { RawSkill, NormalizedSkill } from './types.js'
import { generateSkillId, slugify, detectVerticals, normalizeTags, getExistingSkillIds } from './utils.js'

/**
 * Normalize a raw skill into the standard schema
 */
export function normalizeSkill(raw: RawSkill): NormalizedSkill {
  const id = generateSkillId(raw.source, raw.repoUrl || raw.sourceUrl, raw.skillPath)
  const slug = raw.slug || slugify(raw.name)

  // Extract first paragraph as summary if not provided
  let summary = raw.summary || ''
  if (!summary && raw.description) {
    const firstPara = raw.description.split('\n\n')[0]
    summary = firstPara.replace(/^#.*\n/, '').trim().substring(0, 200)
  }
  if (!summary) {
    summary = `${raw.name} skill`
  }

  // Detect verticals from content
  const verticals = raw.verticals?.length
    ? raw.verticals
    : detectVerticals({ name: raw.name, summary, tags: raw.tags })

  // Normalize tags
  const tags = normalizeTags(raw.tags || [])

  return {
    id,
    name: raw.name,
    slug,
    summary,
    description: raw.description,
    repoUrl: raw.repoUrl,
    skillMdUrl: raw.skillMdUrl,
    author: {
      name: raw.author?.name || 'Unknown',
      github: raw.author?.github
    },
    verticals,
    tags,
    stats: {
      stars: raw.stars || 0,
      forks: raw.forks || 0,
      installs: raw.installs || 0
    },
    source: raw.source,
    sourceUrl: raw.sourceUrl,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    harvestedAt: new Date().toISOString()
  }
}

/**
 * Deduplicate skills by ID
 */
export function deduplicateSkills(skills: NormalizedSkill[]): NormalizedSkill[] {
  const seen = new Map<string, NormalizedSkill>()

  for (const skill of skills) {
    const existing = seen.get(skill.id)

    // Keep the one with more info or more recent update
    if (!existing) {
      seen.set(skill.id, skill)
    } else if (skill.stats.stars > existing.stats.stars) {
      seen.set(skill.id, skill)
    }
  }

  return Array.from(seen.values())
}

/**
 * Filter out skills that already exist in the index
 */
export async function filterNewSkills(
  skills: NormalizedSkill[],
  indexPath: string
): Promise<{ newSkills: NormalizedSkill[]; existingCount: number }> {
  const existingIds = await getExistingSkillIds(indexPath)
  const newSkills = skills.filter(s => !existingIds.has(s.id))

  return {
    newSkills,
    existingCount: skills.length - newSkills.length
  }
}

/**
 * Process raw skills through the full normalization pipeline
 */
export async function processSkills(
  rawSkills: RawSkill[],
  indexPath: string
): Promise<{
  normalized: NormalizedSkill[]
  new: NormalizedSkill[]
  duplicates: number
  existing: number
}> {
  console.log(`\n🔄 Processing ${rawSkills.length} raw skills...`)

  // Normalize
  const normalized = rawSkills.map(normalizeSkill)
  console.log(`  ✓ Normalized ${normalized.length} skills`)

  // Deduplicate
  const deduped = deduplicateSkills(normalized)
  const duplicates = normalized.length - deduped.length
  console.log(`  ✓ Removed ${duplicates} duplicates`)

  // Filter existing
  const { newSkills, existingCount } = await filterNewSkills(deduped, indexPath)
  console.log(`  ✓ Found ${newSkills.length} new skills (${existingCount} already exist)`)

  return {
    normalized: deduped,
    new: newSkills,
    duplicates,
    existing: existingCount
  }
}
