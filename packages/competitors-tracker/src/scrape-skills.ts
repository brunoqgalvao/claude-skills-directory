/**
 * Skill Scraper Pipeline
 *
 * Scrapes SKILL.md files from GitHub, enriches with API data,
 * and prepares for LLM classification.
 */

import * as fs from "fs";
import * as path from "path";

// Types
interface RawSkill {
  id: string;
  source: {
    type: "github-repo" | "github-folder" | "github-search";
    repo: string;
    path?: string;
    url: string;
  };
  frontmatter: {
    name?: string;
    description?: string;
    [key: string]: unknown;
  };
  content: string;
  github: {
    stars: number;
    forks: number;
    owner: string;
    ownerAvatar: string;
    license?: string;
    lastCommit: string;
    createdAt: string;
    topics: string[];
  };
  scrapedAt: string;
}

interface SkillSource {
  type: "repo" | "folder";
  repo: string;
  skillsPath?: string; // e.g., "skills" for repos with skills/ folder
  branch?: string;
}

// Known skill sources
const SKILL_SOURCES: SkillSource[] = [
  // Full repos that ARE skills
  { type: "repo", repo: "anthropics/skills", skillsPath: "skills" },
  { type: "repo", repo: "obra/superpowers", skillsPath: "skills" },
  { type: "repo", repo: "daymade/claude-code-skills", skillsPath: "skills" },
  { type: "repo", repo: "travisvn/awesome-claude-skills" },
  // Individual skill repos can be added here
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DATA_DIR = path.join(import.meta.dirname, "../data");
const SCRAPED_DIR = path.join(DATA_DIR, "scraped");

async function githubFetch(endpoint: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SkillsScraper/1.0",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `https://api.github.com${endpoint}`;

  const response = await fetch(url, { headers });

  if (response.status === 403) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      const reset = response.headers.get("x-ratelimit-reset");
      const resetDate = reset ? new Date(parseInt(reset) * 1000) : new Date();
      throw new Error(`GitHub rate limit exceeded. Resets at ${resetDate.toISOString()}`);
    }
  }

  return response;
}

async function getRepoInfo(repo: string): Promise<RawSkill["github"] | null> {
  try {
    const response = await githubFetch(`/repos/${repo}`);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      owner: data.owner?.login || "",
      ownerAvatar: data.owner?.avatar_url || "",
      license: data.license?.spdx_id,
      lastCommit: data.pushed_at || data.updated_at,
      createdAt: data.created_at,
      topics: data.topics || [],
    };
  } catch (error) {
    console.error(`Error fetching repo info for ${repo}:`, error);
    return null;
  }
}

async function getRawContent(repo: string, filePath: string, branch = "main"): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Try 'master' branch as fallback
      if (branch === "main") {
        return getRawContent(repo, filePath, "master");
      }
      return null;
    }
    return response.text();
  } catch {
    return null;
  }
}

function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, yamlStr, body] = match;
  const frontmatter: Record<string, unknown> = {};

  // Simple YAML parsing (key: value)
  for (const line of yamlStr.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function listDirectoryContents(repo: string, dirPath: string): Promise<Array<{ name: string; type: string; path: string }>> {
  try {
    const response = await githubFetch(`/repos/${repo}/contents/${dirPath}`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

async function scrapeRepoWithSkillsFolder(source: SkillSource): Promise<RawSkill[]> {
  const { repo, skillsPath = "skills" } = source;
  console.log(`\n📦 Scraping ${repo}/${skillsPath}...`);

  const skills: RawSkill[] = [];
  const repoInfo = await getRepoInfo(repo);

  if (!repoInfo) {
    console.log(`  ❌ Could not fetch repo info`);
    return skills;
  }

  // List skill directories
  const contents = await listDirectoryContents(repo, skillsPath);
  const skillDirs = contents.filter(item => item.type === "dir");

  console.log(`  Found ${skillDirs.length} skill directories`);

  for (const dir of skillDirs) {
    // Try to get SKILL.md
    const skillMdPath = `${dir.path}/SKILL.md`;
    const content = await getRawContent(repo, skillMdPath);

    if (!content) {
      console.log(`  ⚠️  No SKILL.md in ${dir.name}`);
      continue;
    }

    const { frontmatter, body } = parseFrontmatter(content);
    const id = slugify(frontmatter.name as string || dir.name);

    skills.push({
      id,
      source: {
        type: "github-folder",
        repo,
        path: dir.path,
        url: `https://github.com/${repo}/tree/main/${dir.path}`,
      },
      frontmatter,
      content: body,
      github: repoInfo,
      scrapedAt: new Date().toISOString(),
    });

    console.log(`  ✅ ${dir.name} → ${id}`);

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  return skills;
}

async function scrapeAwesomeList(repo: string): Promise<RawSkill[]> {
  console.log(`\n📋 Scraping awesome list: ${repo}...`);

  const skills: RawSkill[] = [];
  const content = await getRawContent(repo, "README.md");

  if (!content) {
    console.log(`  ❌ Could not fetch README`);
    return skills;
  }

  const repoInfo = await getRepoInfo(repo);

  // Parse markdown links: - [Name](url) - description
  const linkPattern = /^\s*[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)/gm;
  let match;

  while ((match = linkPattern.exec(content)) !== null) {
    const [, name, url, description] = match;

    // Skip non-GitHub links or section headers
    if (!url.includes("github.com") || name.length > 80) continue;

    // Extract repo from URL
    const repoMatch = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (!repoMatch) continue;

    const linkedRepo = repoMatch[1].replace(/\.git$/, "").replace(/#.*$/, "");
    const id = slugify(name);

    skills.push({
      id,
      source: {
        type: "github-repo",
        repo: linkedRepo,
        url,
      },
      frontmatter: {
        name,
        description: description.trim(),
      },
      content: "",
      github: repoInfo!, // Use the awesome list's repo info as fallback
      scrapedAt: new Date().toISOString(),
    });

    console.log(`  📎 ${name}`);
  }

  console.log(`  Found ${skills.length} linked skills`);
  return skills;
}

async function searchGitHubForSkills(): Promise<RawSkill[]> {
  console.log(`\n🔍 Searching GitHub for SKILL.md files...`);

  const skills: RawSkill[] = [];
  const queries = [
    'filename:SKILL.md "claude"',
    'path:.claude/skills filename:SKILL.md',
  ];

  for (const query of queries) {
    try {
      const response = await githubFetch(
        `/search/code?q=${encodeURIComponent(query)}&per_page=100`
      );

      if (!response.ok) {
        console.log(`  ⚠️  Search failed: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`  Query "${query}" found ${data.total_count} results`);

      for (const item of data.items?.slice(0, 50) || []) {
        const repo = item.repository.full_name;
        const filePath = item.path;

        // Skip if we already have this
        if (skills.some(s => s.source.repo === repo && s.source.path === filePath)) {
          continue;
        }

        const content = await getRawContent(repo, filePath);
        if (!content) continue;

        const { frontmatter, body } = parseFrontmatter(content);
        const repoInfo = await getRepoInfo(repo);

        if (!repoInfo) continue;

        // Derive skill name from path or frontmatter
        const dirName = path.dirname(filePath).split("/").pop() || "";
        const id = slugify(frontmatter.name as string || dirName || repo.split("/")[1]);

        skills.push({
          id,
          source: {
            type: "github-search",
            repo,
            path: filePath,
            url: `https://github.com/${repo}/blob/main/${filePath}`,
          },
          frontmatter,
          content: body,
          github: repoInfo,
          scrapedAt: new Date().toISOString(),
        });

        console.log(`  ✅ ${repo}/${filePath}`);

        // Rate limit protection
        await new Promise(r => setTimeout(r, 200));
      }
    } catch (error) {
      console.error(`  ❌ Search error:`, error);
    }

    // Delay between queries
    await new Promise(r => setTimeout(r, 1000));
  }

  return skills;
}

async function enrichWithRepoInfo(skills: RawSkill[]): Promise<RawSkill[]> {
  console.log(`\n🔄 Enriching ${skills.length} skills with repo info...`);

  const enriched: RawSkill[] = [];
  const seen = new Set<string>();

  for (const skill of skills) {
    // Skip duplicates
    if (seen.has(skill.id)) {
      console.log(`  ⏭️  Skipping duplicate: ${skill.id}`);
      continue;
    }
    seen.add(skill.id);

    // If it's from an awesome list, fetch the actual repo info
    if (skill.source.type === "github-repo" && skill.source.repo) {
      const repoInfo = await getRepoInfo(skill.source.repo);
      if (repoInfo) {
        skill.github = repoInfo;

        // Try to get SKILL.md from the linked repo
        const skillMd = await getRawContent(skill.source.repo, "SKILL.md");
        if (skillMd) {
          const { frontmatter, body } = parseFrontmatter(skillMd);
          skill.frontmatter = { ...skill.frontmatter, ...frontmatter };
          skill.content = body;
        }
      }
      await new Promise(r => setTimeout(r, 100));
    }

    enriched.push(skill);
  }

  return enriched;
}

function saveResults(skills: RawSkill[], filename: string) {
  if (!fs.existsSync(SCRAPED_DIR)) {
    fs.mkdirSync(SCRAPED_DIR, { recursive: true });
  }

  const filepath = path.join(SCRAPED_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(skills, null, 2));
  console.log(`\n💾 Saved ${skills.length} skills to ${filepath}`);
}

export async function scrapeAllSkills(): Promise<RawSkill[]> {
  console.log("=== Skill Scraper Pipeline ===\n");
  console.log(`GitHub Token: ${GITHUB_TOKEN ? "✅ Set" : "❌ Not set (will be rate limited)"}`);

  let allSkills: RawSkill[] = [];

  // 1. Scrape known repos with skills folders
  for (const source of SKILL_SOURCES) {
    if (source.skillsPath) {
      const skills = await scrapeRepoWithSkillsFolder(source);
      allSkills.push(...skills);
    } else if (source.repo.includes("awesome")) {
      const skills = await scrapeAwesomeList(source.repo);
      allSkills.push(...skills);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  // 2. Search GitHub for more SKILL.md files
  const searchResults = await searchGitHubForSkills();
  allSkills.push(...searchResults);

  // 3. Enrich and deduplicate
  allSkills = await enrichWithRepoInfo(allSkills);

  // 4. Save raw results
  saveResults(allSkills, "all-skills-raw.json");

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Total skills scraped: ${allSkills.length}`);
  console.log(`With SKILL.md content: ${allSkills.filter(s => s.content.length > 0).length}`);
  console.log(`With 10+ stars: ${allSkills.filter(s => s.github.stars >= 10).length}`);

  // Group by source type
  const byType = allSkills.reduce((acc, s) => {
    acc[s.source.type] = (acc[s.source.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log(`By source:`, byType);

  return allSkills;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  await scrapeAllSkills();
}
