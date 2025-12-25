import { existsSync, mkdirSync, rmSync } from "fs";
import fse from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { getSkillPath, getSkillsDir } from "../utils/paths.js";
import { cloneSkill, isGitUrl, extractRepoName, hasSkillMd } from "../utils/git.js";
import { trackInstall } from "../utils/config.js";
import { runSetupScript } from "../utils/scripts.js";
import { fetchSkillFromRegistry } from "../utils/registry.js";

export interface InstallOptions {
  global?: boolean;
  skipSetup?: boolean;
  force?: boolean;
}

export async function install(
  source: string,
  options: InstallOptions = {}
): Promise<void> {
  const isGlobal = options.global ?? false;
  const skillsDir = getSkillsDir(isGlobal);

  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
  }

  const spinner = ora(`Installing skill from ${source}`).start();

  try {
    let repoUrl: string;
    let skillName: string;

    if (await isGitUrl(source)) {
      repoUrl = source;
      skillName = extractRepoName(source);
    } else {
      spinner.text = `Looking up "${source}" in registry...`;
      const registrySkill = await fetchSkillFromRegistry(source);

      if (!registrySkill) {
        spinner.fail(`Skill "${source}" not found in registry`);
        console.log(chalk.dim("Try: skill search <query>"));
        process.exit(1);
      }

      if (!registrySkill.links.repo) {
        spinner.fail(`Skill "${source}" has no repository URL`);
        process.exit(1);
      }

      repoUrl = registrySkill.links.repo;
      skillName = registrySkill.id;
      spinner.text = `Found ${registrySkill.name} by ${registrySkill.author.name}`;
    }

    const destPath = getSkillPath(skillName, isGlobal);

    if (existsSync(destPath)) {
      if (options.force) {
        rmSync(destPath, { recursive: true, force: true });
      } else {
        spinner.fail(`Skill "${skillName}" already installed`);
        console.log(chalk.dim("Use --force to reinstall"));
        process.exit(1);
      }
    }

    spinner.text = `Cloning ${repoUrl}...`;
    await cloneSkill(repoUrl, destPath);

    if (!(await hasSkillMd(destPath))) {
      spinner.warn("No SKILL.md found - skill may not work correctly");
    }

    rmSync(`${destPath}/.git`, { recursive: true, force: true });

    trackInstall(skillName, isGlobal, repoUrl);

    spinner.succeed(
      `Installed ${chalk.green(skillName)} ${isGlobal ? "(global)" : "(local)"}`
    );
    console.log(chalk.dim(`  → ${destPath}`));

    if (!options.skipSetup) {
      await runSetupScript(destPath);
    }
  } catch (error) {
    spinner.fail(`Installation failed: ${error}`);
    process.exit(1);
  }
}
