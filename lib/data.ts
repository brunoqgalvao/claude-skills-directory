import fs from "node:fs/promises";
import path from "node:path";
import { Skill, SkillZ } from "./types";
import { slugify } from "./slug";

const skillsDir = path.join(process.cwd(), "data", "skills");
const verticalsPath = path.join(process.cwd(), "data", "verticals.json");

export async function getAllSkills(): Promise<Skill[]> {
  const files = await fs.readdir(skillsDir);
  const items: Skill[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(skillsDir, f), "utf8");
    const parsed = SkillZ.parse(JSON.parse(raw));
    // filename must match id
    if (parsed.id + ".json" !== f) {
      throw new Error(`Skill filename mismatch: expected ${parsed.id}.json but got ${f}`);
    }
    items.push(parsed);
  }
  // newest first
  items.sort((a, b) => +new Date(b.last_updated) - +new Date(a.last_updated));
  return items;
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
  try {
    const raw = await fs.readFile(path.join(skillsDir, `${id}.json`), "utf8");
    return SkillZ.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}
