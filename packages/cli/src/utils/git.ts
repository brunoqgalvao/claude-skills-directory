import { simpleGit } from "simple-git";
import { existsSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import fse from "fs-extra";

export interface MonorepoInfo {
  isMonorepo: boolean;
  baseRepoUrl: string;
  subPath: string | null;
  branch: string;
}

/**
 * Parse a GitHub URL to detect if it points to a subdirectory in a monorepo
 * e.g., https://github.com/anthropics/skills/tree/main/skills/canvas-design
 */
export function parseGitHubUrl(url: string): MonorepoInfo {
  // Match: https://github.com/owner/repo/tree/branch/path/to/subdir
  const monorepoMatch = url.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+)$/
  );

  if (monorepoMatch) {
    const [, owner, repo, branch, subPath] = monorepoMatch;
    return {
      isMonorepo: true,
      baseRepoUrl: `https://github.com/${owner}/${repo}.git`,
      subPath: subPath,
      branch: branch,
    };
  }

  // Standard repo URL
  return {
    isMonorepo: false,
    baseRepoUrl: url.endsWith(".git") ? url : `${url}.git`,
    subPath: null,
    branch: "main",
  };
}

export async function cloneSkill(repoUrl: string, destPath: string): Promise<void> {
  const git = simpleGit();
  const parsed = parseGitHubUrl(repoUrl);

  if (parsed.isMonorepo && parsed.subPath) {
    // Use sparse checkout for monorepo subdirectories
    const tempDir = `${destPath}_temp_${Date.now()}`;

    try {
      mkdirSync(tempDir, { recursive: true });

      // Initialize sparse checkout
      await git.clone(parsed.baseRepoUrl, tempDir, [
        "--depth", "1",
        "--filter=blob:none",
        "--sparse",
        "--branch", parsed.branch,
      ]);

      const tempGit = simpleGit(tempDir);
      await tempGit.raw(["sparse-checkout", "set", parsed.subPath]);

      // Move the subdirectory to the destination
      const subDirPath = join(tempDir, parsed.subPath);

      if (!existsSync(subDirPath)) {
        throw new Error(`Subdirectory "${parsed.subPath}" not found in repository`);
      }

      mkdirSync(destPath, { recursive: true });
      await fse.copy(subDirPath, destPath);

    } finally {
      // Clean up temp directory
      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }
    }
  } else {
    // Standard clone for regular repos
    await git.clone(parsed.baseRepoUrl, destPath, ["--depth", "1"]);
  }
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
  const parsed = parseGitHubUrl(url);

  if (parsed.isMonorepo && parsed.subPath) {
    // Get the last segment of the subpath
    const segments = parsed.subPath.split("/").filter(Boolean);
    return segments[segments.length - 1] || "skill";
  }

  const match = url.match(/\/([^/]+?)(\.git)?$/);
  return match ? match[1].replace(".git", "") : "skill";
}

export async function hasSkillMd(path: string): Promise<boolean> {
  return existsSync(join(path, "SKILL.md"));
}
