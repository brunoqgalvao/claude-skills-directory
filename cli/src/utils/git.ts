import { simpleGit } from "simple-git";
import { existsSync } from "fs";
import { join } from "path";

export async function cloneSkill(repoUrl: string, destPath: string): Promise<void> {
  const git = simpleGit();
  await git.clone(repoUrl, destPath, ["--depth", "1"]);
}

export async function isGitUrl(source: string): Promise<boolean> {
  return (
    source.startsWith("https://github.com/") ||
    source.startsWith("git@github.com:") ||
    source.startsWith("https://gitlab.com/") ||
    source.includes(".git")
  );
}

export function extractRepoName(url: string): string {
  const match = url.match(/\/([^/]+?)(\.git)?$/);
  return match ? match[1].replace(".git", "") : "skill";
}

export async function hasSkillMd(path: string): Promise<boolean> {
  return existsSync(join(path, "SKILL.md"));
}
