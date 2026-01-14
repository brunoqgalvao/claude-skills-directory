/**
 * Skill Generation Pipeline
 *
 * Takes classified skills and generates final skill JSONs.
 * Supports manual overrides for curation.
 *
 * Directory structure:
 *   data/
 *     scraped/           - Raw scraped data (auto-generated)
 *     overrides/         - Manual override JSONs (human curated)
 *     classified-skills.json - LLM-classified skills
 *   ../../data/skills/   - Final skill JSONs for the directory
 */

import * as fs from "fs";
import * as path from "path";

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
  _raw?: unknown;
}

interface SkillOverride {
  // Any field can be overridden
  name?: string;
  summary?: string;
  verticals?: string[];
  tags?: string[];
  qualityTier?: "A" | "B" | "C";
  status?: "ready" | "beta" | "deprecated";
  verified?: boolean;
  // Special fields
  _exclude?: boolean; // Set to true to exclude from directory
  _note?: string; // Internal note about the override
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
    repo?: string;
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
const CLASSIFIED_FILE = path.join(DATA_DIR, "classified-skills.json");
const OVERRIDES_DIR = path.join(DATA_DIR, "overrides");
const OUTPUT_DIR = path.join(import.meta.dirname, "../../../data/skills");

function loadClassifiedSkills(): ClassifiedSkill[] {
  if (!fs.existsSync(CLASSIFIED_FILE)) {
    console.error(`❌ No classified data found at ${CLASSIFIED_FILE}`);
    console.error("Run: pnpm classify-skills first");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CLASSIFIED_FILE, "utf-8"));
}

function loadOverride(id: string): SkillOverride | null {
  const overridePath = path.join(OVERRIDES_DIR, `${id}.override.json`);
  if (fs.existsSync(overridePath)) {
    return JSON.parse(fs.readFileSync(overridePath, "utf-8"));
  }
  return null;
}

function applyOverride(skill: ClassifiedSkill, override: SkillOverride): ClassifiedSkill {
  return {
    ...skill,
    name: override.name ?? skill.name,
    summary: override.summary ?? skill.summary,
    verticals: override.verticals ?? skill.verticals,
    tags: override.tags ?? skill.tags,
    qualityTier: override.qualityTier ?? skill.qualityTier,
    status: override.status ?? skill.status,
    verified: override.verified ?? skill.verified,
  };
}

function toFinalSkill(skill: ClassifiedSkill): FinalSkill {
  // Remove _raw and other internal fields
  return {
    id: skill.id,
    name: skill.name,
    version: "1.0.0",
    summary: skill.summary.slice(0, 180), // Enforce max length
    verticals: skill.verticals.slice(0, 3),
    tags: skill.tags.slice(0, 10),
    author: skill.author,
    status: skill.status,
    verified: skill.verified,
    visibility: "public",
    license: skill.license,
    links: skill.links,
    installation: {
      type: "git",
      command: `npx skills-cli install ${skill.id}`,
    },
    stats: skill.stats,
    last_updated: skill.last_updated,
    created_at: skill.created_at,
  };
}

function saveSkill(skill: FinalSkill): void {
  const filepath = path.join(OUTPUT_DIR, `${skill.id}.json`);
  fs.writeFileSync(filepath, JSON.stringify(skill, null, 2));
}

export async function generateSkills(options: {
  minTier?: "A" | "B" | "C";
  includeDeprecated?: boolean;
  dryRun?: boolean;
} = {}): Promise<FinalSkill[]> {
  const { minTier = "C", includeDeprecated = false, dryRun = false } = options;

  console.log("=== Skill Generation Pipeline ===\n");
  console.log(`Options: minTier=${minTier}, includeDeprecated=${includeDeprecated}, dryRun=${dryRun}\n`);

  const classified = loadClassifiedSkills();
  console.log(`Loaded ${classified.length} classified skills`);

  // Ensure output directory exists
  if (!dryRun && !fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Ensure overrides directory exists
  if (!fs.existsSync(OVERRIDES_DIR)) {
    fs.mkdirSync(OVERRIDES_DIR, { recursive: true });
  }

  const tierOrder = { A: 1, B: 2, C: 3 };
  const minTierValue = tierOrder[minTier];

  const generated: FinalSkill[] = [];
  const excluded: string[] = [];
  const overridden: string[] = [];

  for (const skill of classified) {
    // Check override first
    const override = loadOverride(skill.id);

    if (override?._exclude) {
      excluded.push(skill.id);
      console.log(`⏭️  Excluded: ${skill.id} (${override._note || "manual exclusion"})`);
      continue;
    }

    // Apply override if exists
    let processedSkill = skill;
    if (override) {
      processedSkill = applyOverride(skill, override);
      overridden.push(skill.id);
    }

    // Filter by tier
    const skillTierValue = tierOrder[processedSkill.qualityTier];
    if (skillTierValue > minTierValue) {
      console.log(`⏭️  Skipped: ${skill.id} (Tier ${processedSkill.qualityTier} < min ${minTier})`);
      continue;
    }

    // Filter deprecated
    if (!includeDeprecated && processedSkill.status === "deprecated") {
      console.log(`⏭️  Skipped: ${skill.id} (deprecated)`);
      continue;
    }

    const final = toFinalSkill(processedSkill);
    generated.push(final);

    if (!dryRun) {
      saveSkill(final);
    }

    const overrideMarker = override ? " [overridden]" : "";
    console.log(`✅ ${final.id} → ${final.name}${overrideMarker}`);
  }

  console.log("\n=== Summary ===");
  console.log(`Generated: ${generated.length}`);
  console.log(`Excluded: ${excluded.length}`);
  console.log(`Overridden: ${overridden.length}`);

  if (!dryRun) {
    console.log(`\nSkills saved to: ${OUTPUT_DIR}`);
  } else {
    console.log("\n(Dry run - no files written)");
  }

  return generated;
}

// Helper to create an override template
export function createOverrideTemplate(id: string): void {
  const overridePath = path.join(OVERRIDES_DIR, `${id}.override.json`);

  if (fs.existsSync(overridePath)) {
    console.log(`Override already exists: ${overridePath}`);
    return;
  }

  const template: SkillOverride = {
    _note: "Override template - uncomment fields to override",
    // name: "Better Name",
    // summary: "Better summary under 180 chars",
    // verticals: ["Engineering"],
    // tags: ["tag1", "tag2"],
    // qualityTier: "A",
    // status: "ready",
    // verified: true,
    // _exclude: false,
  };

  if (!fs.existsSync(OVERRIDES_DIR)) {
    fs.mkdirSync(OVERRIDES_DIR, { recursive: true });
  }

  fs.writeFileSync(overridePath, JSON.stringify(template, null, 2));
  console.log(`Created override template: ${overridePath}`);
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args[0] === "override") {
    const id = args[1];
    if (!id) {
      console.error("Usage: generate-skills override <skill-id>");
      process.exit(1);
    }
    createOverrideTemplate(id);
  } else {
    const minTier = args.includes("--min-tier")
      ? (args[args.indexOf("--min-tier") + 1] as "A" | "B" | "C")
      : "B";
    const includeDeprecated = args.includes("--include-deprecated");
    const dryRun = args.includes("--dry-run");

    await generateSkills({ minTier, includeDeprecated, dryRun });
  }
}
