/**
 * Quick Skill Generator (No LLM Required)
 *
 * Converts scraped skills directly to final format using heuristics.
 * Good for bootstrapping - can be refined later with LLM classification.
 */

import * as fs from "fs";
import * as path from "path";

interface RawSkill {
  id: string;
  source: {
    type: string;
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

interface FinalSkill {
  id: string;
  name: string;
  version: string;
  summary: string;
  verticals: string[];
  tags: string[];
  author: {
    name: string;
    github: string;
    avatar?: string;
  };
  status: "ready" | "beta" | "deprecated";
  verified: boolean;
  visibility: "public";
  license: string;
  links: {
    repo: string;
    skill_md?: string;
  };
  installation: {
    type: "git" | "cli";
    command: string;
  };
  stats: {
    stars: number;
    forks: number;
    installs: number;
  };
  last_updated: string;
  created_at?: string;
}

const DATA_DIR = path.join(import.meta.dirname, "../data");
const SCRAPED_FILE = path.join(DATA_DIR, "scraped/all-skills-raw.json");
const OUTPUT_DIR = path.join(import.meta.dirname, "../../../data/skills");

// Keyword-based vertical detection
const VERTICAL_KEYWORDS: Record<string, string[]> = {
  Engineering: ["code", "develop", "debug", "test", "git", "api", "build", "deploy", "typescript", "python", "javascript", "mcp", "agent"],
  Design: ["design", "ui", "ux", "figma", "css", "style", "theme", "canvas", "art", "visual", "frontend"],
  Data: ["data", "analytics", "sql", "database", "chart", "xlsx", "excel", "csv", "report"],
  Marketing: ["marketing", "seo", "content", "social", "campaign", "brand", "copy"],
  Sales: ["sales", "crm", "lead", "prospect", "pipeline", "deal"],
  Support: ["support", "ticket", "help", "customer", "slack", "chat"],
  Legal: ["legal", "contract", "compliance", "policy", "terms"],
  Finance: ["finance", "invoice", "accounting", "budget", "expense"],
  HR: ["hr", "hiring", "recruit", "onboard", "employee", "internal-comms"],
  Operations: ["ops", "workflow", "automate", "process", "plan", "project"],
};

function detectVerticals(skill: RawSkill): string[] {
  const text = `${skill.id} ${skill.frontmatter.name || ""} ${skill.frontmatter.description || ""} ${skill.content.slice(0, 500)}`.toLowerCase();

  const matches: Array<{ vertical: string; count: number }> = [];

  for (const [vertical, keywords] of Object.entries(VERTICAL_KEYWORDS)) {
    const count = keywords.filter(kw => text.includes(kw)).length;
    if (count > 0) {
      matches.push({ vertical, count });
    }
  }

  // Sort by match count and take top 2
  matches.sort((a, b) => b.count - a.count);
  const verticals = matches.slice(0, 2).map(m => m.vertical);

  // Default to Engineering if nothing matched
  return verticals.length > 0 ? verticals : ["Engineering"];
}

function detectTags(skill: RawSkill): string[] {
  const tags = new Set<string>();

  // Add GitHub topics
  skill.github.topics.forEach(t => tags.add(t));

  // Extract from id
  skill.id.split("-").forEach(part => {
    if (part.length > 2 && part.length < 15) {
      tags.add(part);
    }
  });

  // Common keyword detection
  const text = `${skill.frontmatter.description || ""} ${skill.content.slice(0, 500)}`.toLowerCase();
  const commonTags = ["automation", "ai", "llm", "claude", "testing", "git", "api", "workflow", "documentation"];
  commonTags.forEach(tag => {
    if (text.includes(tag)) tags.add(tag);
  });

  return Array.from(tags).slice(0, 8);
}

function determineStatus(skill: RawSkill): "ready" | "beta" | "deprecated" {
  const lastUpdate = new Date(skill.github.lastCommit);
  const now = new Date();
  const monthsAgo = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsAgo > 12) return "deprecated";
  if (monthsAgo > 6 || skill.github.stars < 5) return "beta";
  return "ready";
}

function titleCase(str: string): string {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createSummary(skill: RawSkill): string {
  // Use frontmatter description if available
  if (skill.frontmatter.description) {
    const desc = skill.frontmatter.description as string;
    // Clean up and truncate
    return desc.replace(/^Use when\s+/i, "").slice(0, 180);
  }

  // Extract first sentence from content
  const firstParagraph = skill.content.split("\n\n")[0] || "";
  const firstSentence = firstParagraph.split(/[.!?]/)[0] || "";

  if (firstSentence.length > 20) {
    return firstSentence.slice(0, 180);
  }

  // Fallback
  return `${titleCase(skill.id)} skill for Claude Code`;
}

function toFinalSkill(raw: RawSkill): FinalSkill {
  const repoBase = `https://github.com/${raw.source.repo}`;
  const skillMdUrl = raw.source.path
    ? `https://raw.githubusercontent.com/${raw.source.repo}/main/${raw.source.path}/SKILL.md`
    : `https://raw.githubusercontent.com/${raw.source.repo}/main/SKILL.md`;

  return {
    id: raw.id,
    name: raw.frontmatter.name as string || titleCase(raw.id),
    version: "1.0.0",
    summary: createSummary(raw),
    verticals: detectVerticals(raw),
    tags: detectTags(raw),
    author: {
      name: raw.github.owner,
      github: raw.github.owner,
      avatar: raw.github.ownerAvatar,
    },
    status: determineStatus(raw),
    verified: raw.source.repo.startsWith("anthropics/"),
    visibility: "public",
    license: raw.github.license || "MIT",
    links: {
      repo: raw.source.path ? `${repoBase}/tree/main/${raw.source.path}` : repoBase,
      skill_md: raw.content ? skillMdUrl : undefined,
    },
    installation: {
      type: "cli",
      command: `npx skills-cli install ${raw.id}`,
    },
    stats: {
      stars: raw.github.stars,
      forks: raw.github.forks,
      installs: 0,
    },
    last_updated: raw.github.lastCommit.split("T")[0],
    created_at: raw.github.createdAt?.split("T")[0],
  };
}

export async function quickGenerate(options: { minStars?: number } = {}): Promise<FinalSkill[]> {
  const { minStars = 0 } = options;

  console.log("=== Quick Skill Generator ===\n");

  if (!fs.existsSync(SCRAPED_FILE)) {
    console.error(`❌ No scraped data found at ${SCRAPED_FILE}`);
    console.error("Run: pnpm scrape-skills first");
    process.exit(1);
  }

  const rawSkills: RawSkill[] = JSON.parse(fs.readFileSync(SCRAPED_FILE, "utf-8"));
  console.log(`Loaded ${rawSkills.length} raw skills`);

  // Filter
  const filtered = rawSkills.filter(s => {
    // Must have content
    if (!s.content && !s.frontmatter.description) return false;
    // Min stars
    if (s.github.stars < minStars) return false;
    return true;
  });

  console.log(`Filtered to ${filtered.length} skills (minStars: ${minStars})\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const generated: FinalSkill[] = [];

  for (const raw of filtered) {
    const skill = toFinalSkill(raw);
    generated.push(skill);

    // Save individual file
    const filepath = path.join(OUTPUT_DIR, `${skill.id}.json`);
    fs.writeFileSync(filepath, JSON.stringify(skill, null, 2));

    console.log(`✅ ${skill.id} → ${skill.name} [${skill.verticals.join(", ")}] (${skill.status})`);
  }

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Generated: ${generated.length} skills`);

  const byStatus = generated.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log(`By status: ready=${byStatus.ready || 0}, beta=${byStatus.beta || 0}, deprecated=${byStatus.deprecated || 0}`);

  const byVertical = generated.reduce((acc, s) => {
    s.verticals.forEach(v => acc[v] = (acc[v] || 0) + 1);
    return acc;
  }, {} as Record<string, number>);
  console.log(`By vertical:`, byVertical);

  console.log(`\nSkills saved to: ${OUTPUT_DIR}`);

  return generated;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const minStars = args.includes("--min-stars") ? parseInt(args[args.indexOf("--min-stars") + 1]) : 0;

  await quickGenerate({ minStars });
}
