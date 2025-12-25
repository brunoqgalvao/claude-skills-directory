import { homedir } from "os";
import { join } from "path";

export const GLOBAL_SKILLS_DIR = join(homedir(), ".claude", "skills");
export const LOCAL_SKILLS_DIR = join(process.cwd(), ".claude", "skills");

export function getSkillsDir(global: boolean): string {
  return global ? GLOBAL_SKILLS_DIR : LOCAL_SKILLS_DIR;
}

export function getSkillPath(name: string, global: boolean): string {
  return join(getSkillsDir(global), name);
}

export const REGISTRY_URL = "https://raw.githubusercontent.com/brunogalvao/claude-skills-directory/main/data/skills";
export const REGISTRY_INDEX_URL = "https://raw.githubusercontent.com/brunogalvao/claude-skills-directory/main/data/index.json";
