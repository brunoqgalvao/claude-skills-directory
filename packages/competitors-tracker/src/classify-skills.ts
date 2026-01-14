/**
 * LLM Skill Classifier
 *
 * Takes raw scraped skills and classifies them using Claude API:
 * - Assigns verticals (1-3)
 * - Generates tags
 * - Creates better summary
 * - Assigns quality tier (A/B/C)
 */

import Anthropic from "@anthropic-ai/sdk";
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

interface ClassifiedSkill {
  id: string;
  name: string;
  summary: string;
  verticals: string[];
  tags: string[];
  qualityTier: "A" | "B" | "C";
  qualityReason: string;
  author: {
    name: string;
    github: string;
    avatar?: string;
  };
  links: {
    repo?: string;
    skill_md?: string;
  };
  installation: {
    type: "git";
    command: string;
  };
  stats: {
    stars: number;
    forks: number;
    installs: number;
  };
  status: "ready" | "beta" | "deprecated";
  verified: boolean;
  license: string;
  last_updated: string;
  created_at?: string;
  _raw: RawSkill;
}

const VERTICALS = [
  "Engineering",
  "Design",
  "Data",
  "Marketing",
  "Sales",
  "Support",
  "Legal",
  "Finance",
  "HR",
  "Operations",
];

const DATA_DIR = path.join(import.meta.dirname, "../data");
const SCRAPED_FILE = path.join(DATA_DIR, "scraped/all-skills-raw.json");
const CLASSIFIED_FILE = path.join(DATA_DIR, "classified-skills.json");

function loadRawSkills(): RawSkill[] {
  if (!fs.existsSync(SCRAPED_FILE)) {
    console.error(`❌ No scraped data found at ${SCRAPED_FILE}`);
    console.error("Run: pnpm scrape-skills first");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(SCRAPED_FILE, "utf-8"));
}

async function classifyWithLLM(
  client: Anthropic,
  skill: RawSkill
): Promise<Omit<ClassifiedSkill, "_raw" | "author" | "links" | "installation" | "stats" | "last_updated" | "created_at" | "license" | "verified">> {
  const prompt = `You are classifying AI agent skills for a directory. Analyze this skill and provide classification.

SKILL DATA:
- Name: ${skill.frontmatter.name || skill.id}
- Description: ${skill.frontmatter.description || "No description"}
- Repository: ${skill.source.repo}
- Stars: ${skill.github.stars}
- Topics: ${skill.github.topics.join(", ") || "None"}
- Last updated: ${skill.github.lastCommit}
- Content preview: ${skill.content.slice(0, 1500)}...

AVAILABLE VERTICALS (pick 1-3):
${VERTICALS.join(", ")}

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "name": "Human readable name (Title Case, max 60 chars)",
  "summary": "Clear 1-sentence description of what this skill does (max 160 chars)",
  "verticals": ["Primary Vertical", "Secondary if applicable"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "qualityTier": "A|B|C",
  "qualityReason": "Brief reason for tier",
  "status": "ready|beta|deprecated"
}

QUALITY TIERS:
- A: Has detailed SKILL.md, well-documented, actively maintained (updated in last 6 months), 10+ stars
- B: Has SKILL.md, functional, some documentation
- C: Minimal docs, abandoned (>1 year old), or incomplete`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      id: skill.id,
      name: parsed.name || skill.frontmatter.name || skill.id,
      summary: parsed.summary || skill.frontmatter.description || "",
      verticals: parsed.verticals || ["Engineering"],
      tags: parsed.tags || [],
      qualityTier: parsed.qualityTier || "C",
      qualityReason: parsed.qualityReason || "",
      status: parsed.status || "beta",
    };
  } catch (error) {
    console.error(`  ❌ Classification failed for ${skill.id}:`, error);

    // Return defaults
    return {
      id: skill.id,
      name: skill.frontmatter.name as string || skill.id,
      summary: skill.frontmatter.description as string || "",
      verticals: ["Engineering"],
      tags: skill.github.topics.slice(0, 5),
      qualityTier: "C",
      qualityReason: "Classification failed",
      status: "beta",
    };
  }
}

function buildClassifiedSkill(raw: RawSkill, classification: Awaited<ReturnType<typeof classifyWithLLM>>): ClassifiedSkill {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const isActive = new Date(raw.github.lastCommit) > sixMonthsAgo;

  return {
    ...classification,
    author: {
      name: raw.github.owner,
      github: raw.github.owner,
      avatar: raw.github.ownerAvatar,
    },
    links: {
      repo: `https://github.com/${raw.source.repo}`,
      skill_md: raw.source.path
        ? `https://raw.githubusercontent.com/${raw.source.repo}/main/${raw.source.path}/SKILL.md`
        : `https://raw.githubusercontent.com/${raw.source.repo}/main/SKILL.md`,
    },
    installation: {
      type: "git",
      command: `git clone https://github.com/${raw.source.repo}.git`,
    },
    stats: {
      stars: raw.github.stars,
      forks: raw.github.forks,
      installs: 0,
    },
    verified: false,
    license: raw.github.license || "MIT",
    last_updated: raw.github.lastCommit.split("T")[0],
    created_at: raw.github.createdAt?.split("T")[0],
    status: !isActive ? "deprecated" : classification.status,
    _raw: raw,
  };
}

export async function classifyAllSkills(options: { limit?: number; minStars?: number } = {}): Promise<ClassifiedSkill[]> {
  const { limit = Infinity, minStars = 0 } = options;

  console.log("=== Skill Classification Pipeline ===\n");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("❌ ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const rawSkills = loadRawSkills();

  console.log(`Loaded ${rawSkills.length} raw skills`);

  // Filter by stars
  const filtered = rawSkills
    .filter(s => s.github.stars >= minStars)
    .slice(0, limit);

  console.log(`Processing ${filtered.length} skills (minStars: ${minStars}, limit: ${limit})\n`);

  const classified: ClassifiedSkill[] = [];

  for (let i = 0; i < filtered.length; i++) {
    const skill = filtered[i];
    console.log(`[${i + 1}/${filtered.length}] Classifying: ${skill.id}`);

    const classification = await classifyWithLLM(client, skill);
    const full = buildClassifiedSkill(skill, classification);

    classified.push(full);
    console.log(`  → ${full.name} | ${full.verticals.join(", ")} | Tier ${full.qualityTier}`);

    // Rate limit - ~1 request per second
    await new Promise(r => setTimeout(r, 1000));
  }

  // Save results
  fs.writeFileSync(CLASSIFIED_FILE, JSON.stringify(classified, null, 2));
  console.log(`\n💾 Saved ${classified.length} classified skills to ${CLASSIFIED_FILE}`);

  // Summary by tier
  const byTier = classified.reduce((acc, s) => {
    acc[s.qualityTier] = (acc[s.qualityTier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("\n=== Quality Distribution ===");
  console.log(`Tier A: ${byTier.A || 0}`);
  console.log(`Tier B: ${byTier.B || 0}`);
  console.log(`Tier C: ${byTier.C || 0}`);

  return classified;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const limit = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1]) : undefined;
  const minStars = args.includes("--min-stars") ? parseInt(args[args.indexOf("--min-stars") + 1]) : 0;

  await classifyAllSkills({ limit, minStars });
}
