import { REGISTRY_URL } from "./paths.js";

export interface RegistrySkill {
  id: string;
  name: string;
  summary: string;
  verticals: string[];
  tags?: string[];
  author: {
    name: string;
    github?: string;
    url?: string;
  };
  links: {
    repo?: string;
    skill_md?: string;
    docs?: string;
    demo?: string;
  };
  installation?: {
    type: "git" | "inline" | "npm";
    command?: string;
    prerequisites?: string[];
  };
  stats?: {
    stars: number;
    installs: number;
  };
  last_updated: string;
}

export async function fetchSkillFromRegistry(id: string): Promise<RegistrySkill | null> {
  try {
    const response = await fetch(`${REGISTRY_URL}/${id}.json`);
    if (!response.ok) return null;
    return await response.json() as RegistrySkill;
  } catch {
    return null;
  }
}

export async function searchRegistry(query: string): Promise<RegistrySkill[]> {
  try {
    const indexUrl = "https://raw.githubusercontent.com/brunogalvao/claude-skills-directory/main/data/skills-index.json";
    const response = await fetch(indexUrl);
    if (!response.ok) return [];

    const skills = (await response.json()) as RegistrySkill[];
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
