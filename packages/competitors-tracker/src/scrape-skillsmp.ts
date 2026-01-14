/**
 * SkillsMP Scraper
 *
 * Scrapes skills from skillsmp.com via their public API.
 * They have 44k+ skills - we paginate through all of them.
 */

import * as fs from "fs";
import * as path from "path";

interface SkillsMPSkill {
  id: string;
  name: string;
  author: string;
  authorAvatar: string;
  description: string;
  githubUrl: string;
  stars: number;
  forks: number;
  updatedAt: number; // Unix timestamp
  hasMarketplace: boolean;
  path: string;
  branch: string;
}

interface SkillsMPResponse {
  skills: SkillsMPSkill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface NormalizedSkill {
  id: string;
  name: string;
  summary: string;
  author: {
    name: string;
    github: string;
    avatar: string;
  };
  links: {
    repo: string;
    skill_md?: string;
  };
  stats: {
    stars: number;
    forks: number;
  };
  source: {
    type: "skillsmp";
    url: string;
    scrapedAt: string;
  };
  lastUpdated: string;
}

const DATA_DIR = path.join(import.meta.dirname, "../data");
const OUTPUT_FILE = path.join(DATA_DIR, "scraped/skillsmp-raw.json");

const API_BASE = "https://skillsmp.com/api/skills";
const DELAY_MS = 500; // Be nice to their servers

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function fetchPage(page: number, limit = 100): Promise<SkillsMPResponse> {
  const url = `${API_BASE}?page=${page}&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "SkillsDirectory/1.0 (https://skills.directory)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`SkillsMP API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function normalizeSkill(skill: SkillsMPSkill): NormalizedSkill {
  // Create a unique ID from repo + path
  const repoMatch = skill.githubUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
  const repo = repoMatch ? repoMatch[1] : skill.author;

  // Build skill_md URL if we can
  const skillMdUrl = skill.path
    ? `https://raw.githubusercontent.com/${repo}/${skill.branch || "main"}/${skill.path}`
    : undefined;

  return {
    id: slugify(skill.name || skill.id),
    name: skill.name,
    summary: skill.description?.slice(0, 180) || "",
    author: {
      name: skill.author,
      github: skill.author,
      avatar: skill.authorAvatar,
    },
    links: {
      repo: skill.githubUrl,
      skill_md: skillMdUrl,
    },
    stats: {
      stars: skill.stars || 0,
      forks: skill.forks || 0,
    },
    source: {
      type: "skillsmp",
      url: `https://skillsmp.com/skill/${skill.id}`,
      scrapedAt: new Date().toISOString(),
    },
    lastUpdated: skill.updatedAt
      ? new Date(skill.updatedAt * 1000).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  };
}

export async function scrapeSkillsMP(options: {
  maxPages?: number;
  minStars?: number;
} = {}): Promise<NormalizedSkill[]> {
  const { maxPages = Infinity, minStars = 0 } = options;

  console.log("=== SkillsMP Scraper ===\n");

  // Ensure output directory
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const allSkills: NormalizedSkill[] = [];
  let page = 1;
  let hasMore = true;

  try {
    // First request to get total
    const first = await fetchPage(1);
    console.log(`Total skills available: ${first.pagination.total}`);
    console.log(`Total pages: ${first.pagination.totalPages}`);
    console.log(`Options: maxPages=${maxPages}, minStars=${minStars}\n`);

    const totalPages = Math.min(first.pagination.totalPages, maxPages);

    while (hasMore && page <= totalPages) {
      console.log(`Fetching page ${page}/${totalPages}...`);

      const data = page === 1 ? first : await fetchPage(page);

      for (const skill of data.skills) {
        // Filter by stars
        if (skill.stars >= minStars) {
          const normalized = normalizeSkill(skill);
          allSkills.push(normalized);
        }
      }

      console.log(`  → ${data.skills.length} skills (${allSkills.length} total kept)`);

      hasMore = data.pagination.hasNext;
      page++;

      // Rate limiting
      if (hasMore && page <= totalPages) {
        await new Promise((r) => setTimeout(r, DELAY_MS));
      }
    }
  } catch (error) {
    console.error("Error scraping SkillsMP:", error);
  }

  // Deduplicate by ID
  const seen = new Set<string>();
  const unique = allSkills.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });

  console.log(`\nTotal unique skills: ${unique.length}`);

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(unique, null, 2));
  console.log(`Saved to: ${OUTPUT_FILE}`);

  // Stats
  const withStars = unique.filter((s) => s.stats.stars > 0);
  const highStars = unique.filter((s) => s.stats.stars >= 10);
  console.log(`\n=== Stats ===`);
  console.log(`With any stars: ${withStars.length}`);
  console.log(`With 10+ stars: ${highStars.length}`);

  return unique;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const maxPages = args.includes("--max-pages")
    ? parseInt(args[args.indexOf("--max-pages") + 1])
    : 10; // Default to 10 pages (1000 skills) for testing
  const minStars = args.includes("--min-stars")
    ? parseInt(args[args.indexOf("--min-stars") + 1])
    : 0;

  await scrapeSkillsMP({ maxPages, minStars });
}
