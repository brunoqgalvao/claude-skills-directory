import fs from "node:fs/promises";
import path from "node:path";
import { Skill, SkillZ, slugify } from "@skills/shared";

const dataDir = path.join(process.cwd(), "..", "..", "data");
const skillsDir = path.join(dataDir, "skills");
const verticalsPath = path.join(dataDir, "verticals.json");

export async function getAllSkills(): Promise<Skill[]> {
  const files = await fs.readdir(skillsDir);
  const items: Skill[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(skillsDir, f), "utf8");
      const result = SkillZ.safeParse(JSON.parse(raw));
      if (result.success) {
        // Skip filename check - we have 18k skills with various naming
        items.push(result.data);
      }
      // Silently skip invalid skills
    } catch {
      // Skip files that can't be read/parsed
    }
  }
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
