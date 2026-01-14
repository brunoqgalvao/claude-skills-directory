import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { Skill, SkillZ, slugify } from "@skills/shared";

// Handle both local dev (from packages/web) and Vercel production
function getDataDir(): string {
  // Try multiple paths for different environments
  const candidates = [
    path.join(process.cwd(), "data"),              // copied into packages/web during build (Vercel)
    path.join(process.cwd(), "..", "..", "data"),  // from packages/web (local dev)
    path.join(process.cwd(), "..", "data"),        // one level up
  ];

  for (const dir of candidates) {
    try {
      if (fsSync.existsSync(dir) && fsSync.existsSync(path.join(dir, "skills"))) {
        return dir;
      }
    } catch {
      // Continue to next candidate
    }
  }

  console.error(`[data.ts] No valid data directory found! CWD: ${process.cwd()}`);
  return candidates[0]; // Default fallback
}

const dataDir = getDataDir();
const skillsDir = path.join(dataDir, "skills");
const verticalsPath = path.join(dataDir, "verticals.json");

// Cache for skills index (lightweight metadata only)
let skillsIndexCache: SkillSummary[] | null = null;

export interface SkillSummary {
  id: string;
  name: string;
  summary: string;
  verticals: string[];
  tags?: string[];
  verified?: boolean;
  stats?: { stars?: number; installs?: number; installs_weekly?: number };
  last_updated: string;
}

async function loadSkillsIndex(): Promise<SkillSummary[]> {
  if (skillsIndexCache) return skillsIndexCache;

  const files = await fs.readdir(skillsDir);
  const items: SkillSummary[] = [];

  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(skillsDir, f), "utf8");
      const parsed = JSON.parse(raw);
      // Only extract summary fields for the index
      items.push({
        id: parsed.id,
        name: parsed.name,
        summary: parsed.summary,
        verticals: parsed.verticals || [],
        tags: parsed.tags,
        verified: parsed.verified,
        stats: parsed.stats,
        last_updated: parsed.last_updated
      });
    } catch {
      // Skip invalid files
    }
  }

  items.sort((a, b) => +new Date(b.last_updated) - +new Date(a.last_updated));
  skillsIndexCache = items;
  return items;
}

export async function getAllSkills(): Promise<Skill[]> {
  const files = await fs.readdir(skillsDir);
  const items: Skill[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(skillsDir, f), "utf8");
      const result = SkillZ.safeParse(JSON.parse(raw));
      if (result.success) {
        items.push(result.data);
      }
    } catch {
      // Skip files that can't be read/parsed
    }
  }
  items.sort((a, b) => +new Date(b.last_updated) - +new Date(a.last_updated));
  return items;
}

export async function getSkillsSummary(): Promise<SkillSummary[]> {
  return loadSkillsIndex();
}

export async function getPaginatedSkills(
  page: number = 1,
  limit: number = 50,
  search?: string,
  vertical?: string
): Promise<{ skills: SkillSummary[]; total: number; pages: number }> {
  let items = await loadSkillsIndex();

  // Filter by vertical
  if (vertical) {
    items = items.filter(s =>
      s.verticals.some(v => slugify(v) === vertical)
    );
  }

  // Basic search (for server-side, client uses Fuse.js)
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  const total = items.length;
  const pages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const skills = items.slice(offset, offset + limit);

  return { skills, total, pages };
}

export async function getAllVerticals(): Promise<{ name: string; emoji?: string }[]> {
  const raw = await fs.readFile(verticalsPath, "utf8");
  return JSON.parse(raw);
}

export async function getVerticalsWithCounts() {
  const [skills, verticals] = await Promise.all([getAllSkills(), getAllVerticals()]);
  const counts: Record<string, number> = {};
  for (const s of skills) {
    for (const v of s.verticals) {
      const key = slugify(v);
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return verticals.map((v) => ({
    ...v,
    count: counts[slugify(v.name)] || 0
  }));
}

export async function getSkillsForVerticalSlug(slug: string): Promise<Skill[]> {
  const all = await getAllSkills();
  return all.filter((s) => s.verticals.some((v) => slugify(v) === slug));
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const filePath = path.join(skillsDir, `${id}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const result = SkillZ.safeParse(parsed);
    if (!result.success) {
      console.error(`[getSkillById] Validation failed for ${id}:`, result.error.issues);
      return null;
    }
    return result.data;
  } catch (err) {
    console.error(`[getSkillById] Failed to load ${filePath}:`, err);
    return null;
  }
}
