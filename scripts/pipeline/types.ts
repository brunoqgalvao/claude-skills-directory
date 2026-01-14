// Pipeline types

export interface RawSkill {
  // Source info
  source: string // 'github', 'skillsmp', 'aitmpl', etc.
  sourceUrl: string // Original URL where we found it

  // Identity
  name: string
  slug?: string
  repoUrl?: string
  skillPath?: string // Path within repo (e.g., '.claude/skills/tdd')

  // Content
  summary?: string
  description?: string
  skillMdUrl?: string
  skillMdContent?: string

  // Metadata
  author?: {
    name?: string
    github?: string
    url?: string
  }
  tags?: string[]
  verticals?: string[]

  // Stats (from source)
  stars?: number
  forks?: number
  installs?: number

  // Timestamps
  createdAt?: string
  updatedAt?: string
}

export interface NormalizedSkill {
  // Unique ID (hash of source + repoUrl + skillPath)
  id: string

  // Core
  name: string
  slug: string
  summary: string
  description?: string

  // Links
  repoUrl?: string
  skillMdUrl?: string
  docsUrl?: string

  // Author
  author: {
    name: string
    github?: string
  }

  // Classification
  verticals: string[]
  tags: string[]

  // Stats
  stats: {
    stars: number
    forks: number
    installs: number
  }

  // Meta
  source: string
  sourceUrl: string
  createdAt: string
  updatedAt: string
  harvestedAt: string
}

export interface HarvesterResult {
  source: string
  skills: RawSkill[]
  errors: string[]
  timestamp: string
}

export interface PipelineConfig {
  sources: {
    github: {
      repos: string[] // e.g., ['anthropics/skills', 'obra/superpowers']
      searchQueries: string[]
    }
    web: {
      urls: string[]
    }
  }
  output: {
    skillsDir: string
    indexFile: string
  }
}
