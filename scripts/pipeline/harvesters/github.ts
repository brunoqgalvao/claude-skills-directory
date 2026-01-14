/**
 * GitHub Harvester - extracts skills from GitHub repositories
 */

import { execSync } from 'child_process'
import type { RawSkill, HarvesterResult } from '../types.js'
import { parseGitHubUrl } from '../utils.js'

interface GitHubFile {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url?: string
}

interface GitHubRepo {
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  owner: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
}

/**
 * Fetch repo info using GitHub CLI
 */
function getRepoInfo(owner: string, repo: string): GitHubRepo | null {
  try {
    const result = execSync(
      `gh api repos/${owner}/${repo}`,
      { encoding: 'utf-8', timeout: 30000 }
    )
    return JSON.parse(result)
  } catch (error) {
    console.error(`Failed to get repo info for ${owner}/${repo}`)
    return null
  }
}

/**
 * List files in a directory using GitHub CLI
 */
function listFiles(owner: string, repo: string, path: string): GitHubFile[] {
  try {
    const result = execSync(
      `gh api repos/${owner}/${repo}/contents/${path}`,
      { encoding: 'utf-8', timeout: 30000 }
    )
    const data = JSON.parse(result)
    return Array.isArray(data) ? data : [data]
  } catch {
    return []
  }
}

/**
 * Fetch file content
 */
function fetchFile(url: string): string | null {
  try {
    const result = execSync(
      `curl -sL "${url}"`,
      { encoding: 'utf-8', timeout: 30000 }
    )
    return result
  } catch {
    return null
  }
}

/**
 * Parse SKILL.md frontmatter and content
 */
function parseSkillMd(content: string): { name?: string; description?: string; tags?: string[]; content: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  if (!frontmatterMatch) {
    return { content }
  }

  const [, frontmatter, body] = frontmatterMatch
  const result: { name?: string; description?: string; tags?: string[]; content: string } = { content: body.trim() }

  // Parse YAML-like frontmatter
  const lines = frontmatter.split('\n')
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    const value = valueParts.join(':').trim()

    if (key === 'name') result.name = value
    if (key === 'description') result.description = value
    if (key === 'tags') {
      // Handle array syntax: tags: [a, b, c]
      const tagMatch = value.match(/\[(.*)\]/)
      if (tagMatch) {
        result.tags = tagMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''))
      }
    }
  }

  return result
}

/**
 * Find skills in a repository
 */
async function findSkillsInRepo(owner: string, repo: string): Promise<RawSkill[]> {
  const skills: RawSkill[] = []
  const repoUrl = `https://github.com/${owner}/${repo}`

  // Get repo info
  const repoInfo = getRepoInfo(owner, repo)
  if (!repoInfo) return skills

  // Check common skill locations
  const skillPaths = [
    '.claude/skills',
    'skills',
    'claude-skills',
    ''  // Root level SKILL.md files
  ]

  for (const basePath of skillPaths) {
    const files = listFiles(owner, repo, basePath)

    for (const file of files) {
      // Look for SKILL.md files
      if (file.name === 'SKILL.md' && file.download_url) {
        const content = fetchFile(file.download_url)
        if (content) {
          const parsed = parseSkillMd(content)
          const skillPath = basePath || 'root'

          skills.push({
            source: 'github',
            sourceUrl: `${repoUrl}/blob/main/${file.path}`,
            name: parsed.name || repo,
            slug: basePath.split('/').pop() || repo,
            repoUrl,
            skillPath,
            summary: parsed.description,
            description: parsed.content,
            skillMdUrl: file.download_url,
            skillMdContent: content,
            author: {
              name: repoInfo.owner.login,
              github: repoInfo.owner.login
            },
            tags: parsed.tags,
            stars: repoInfo.stargazers_count,
            forks: repoInfo.forks_count,
            createdAt: repoInfo.created_at,
            updatedAt: repoInfo.updated_at
          })
        }
      }

      // Check subdirectories for skills
      if (file.type === 'dir') {
        const subFiles = listFiles(owner, repo, file.path)
        const skillMd = subFiles.find(f => f.name === 'SKILL.md')

        if (skillMd?.download_url) {
          const content = fetchFile(skillMd.download_url)
          if (content) {
            const parsed = parseSkillMd(content)

            skills.push({
              source: 'github',
              sourceUrl: `${repoUrl}/blob/main/${skillMd.path}`,
              name: parsed.name || file.name,
              slug: file.name,
              repoUrl,
              skillPath: file.path,
              summary: parsed.description,
              description: parsed.content,
              skillMdUrl: skillMd.download_url,
              skillMdContent: content,
              author: {
                name: repoInfo.owner.login,
                github: repoInfo.owner.login
              },
              tags: parsed.tags,
              stars: repoInfo.stargazers_count,
              forks: repoInfo.forks_count,
              createdAt: repoInfo.created_at,
              updatedAt: repoInfo.updated_at
            })
          }
        }
      }
    }
  }

  return skills
}

/**
 * Harvest skills from a GitHub repository URL
 */
export async function harvestGitHubRepo(repoUrl: string): Promise<HarvesterResult> {
  const result: HarvesterResult = {
    source: 'github',
    skills: [],
    errors: [],
    timestamp: new Date().toISOString()
  }

  const parsed = parseGitHubUrl(repoUrl)
  if (!parsed) {
    result.errors.push(`Invalid GitHub URL: ${repoUrl}`)
    return result
  }

  console.log(`  📦 Harvesting ${parsed.owner}/${parsed.repo}...`)

  try {
    const skills = await findSkillsInRepo(parsed.owner, parsed.repo)
    result.skills = skills
    console.log(`    Found ${skills.length} skill(s)`)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    result.errors.push(`Failed to harvest ${repoUrl}: ${msg}`)
  }

  return result
}

/**
 * Harvest skills from multiple GitHub repositories
 */
export async function harvestGitHubRepos(repoUrls: string[]): Promise<HarvesterResult> {
  const combined: HarvesterResult = {
    source: 'github',
    skills: [],
    errors: [],
    timestamp: new Date().toISOString()
  }

  for (const url of repoUrls) {
    const result = await harvestGitHubRepo(url)
    combined.skills.push(...result.skills)
    combined.errors.push(...result.errors)
  }

  return combined
}
