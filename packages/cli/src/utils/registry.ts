import { Skill } from "../types.js";
import { REGISTRY_URL, REGISTRY_INDEX_URL } from "./paths.js";

export async function fetchSkillFromRegistry(id: string): Promise<Skill | null> {
  try {
    const response = await fetch(`${REGISTRY_URL}/${id}.json`);
    if (!response.ok) return null;
    return await response.json() as Skill;
  } catch {
    return null;
  }
}

export async function searchRegistry(query: string): Promise<Skill[]> {
  try {
    const response = await fetch(REGISTRY_INDEX_URL);
    if (!response.ok) return [];

    const skills = (await response.json()) as Skill[];
    const q = query.toLowerCase();

    return skills.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q)) ||
        s.verticals.some((v) => v.toLowerCase().includes(q))
    );
  } catch {
    return [];
  }
}
