import { existsSync, readFileSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import ora from "ora";
import { parse as parseYaml } from "yaml";
import { getSkillPath } from "../utils/paths.js";
import { fetchSkillFromRegistry } from "../utils/registry.js";
import { getInstalled } from "../utils/config.js";

export interface InfoOptions {
  global?: boolean;
}

export async function info(name: string, options: InfoOptions = {}): Promise<void> {
  const isGlobal = options.global ?? false;
  const localPath = getSkillPath(name, false);
  const globalPath = getSkillPath(name, true);

  const installedLocal = existsSync(localPath);
  const installedGlobal = existsSync(globalPath);
  const installed = installedLocal || installedGlobal;

  const spinner = ora(`Fetching info for "${name}"...`).start();
  const registrySkill = await fetchSkillFromRegistry(name);
  spinner.stop();

  console.log();
  console.log(chalk.bold.green(registrySkill?.name ?? name));
  console.log();

  if (registrySkill) {
    console.log(registrySkill.summary);
    console.log();
    console.log(`${chalk.dim("Author:")}    ${registrySkill.author.name}`);
    console.log(`${chalk.dim("Verticals:")} ${registrySkill.verticals.join(", ")}`);
    if (registrySkill.tags?.length) {
      console.log(`${chalk.dim("Tags:")}      ${registrySkill.tags.join(", ")}`);
    }
    console.log(`${chalk.dim("Updated:")}   ${registrySkill.last_updated}`);

    if (registrySkill.stats) {
      console.log(
        `${chalk.dim("Stats:")}     ${chalk.yellow("★")} ${registrySkill.stats.stars} stars, ${registrySkill.stats.installs} installs`
      );
    }

    console.log();
    console.log(chalk.dim("Links:"));
    if (registrySkill.links.repo) {
      console.log(`  repo:     ${registrySkill.links.repo}`);
    }
    if (registrySkill.links.docs) {
      console.log(`  docs:     ${registrySkill.links.docs}`);
    }
    if (registrySkill.links.skill_md) {
      console.log(`  skill_md: ${registrySkill.links.skill_md}`);
    }
  }

  console.log();
  console.log(chalk.dim("Installation:"));
  if (installedLocal) {
    console.log(`  ${chalk.green("●")} Local:  ${localPath}`);
  } else {
    console.log(`  ${chalk.dim("○")} Local:  not installed`);
  }
  if (installedGlobal) {
    console.log(`  ${chalk.green("●")} Global: ${globalPath}`);
  } else {
    console.log(`  ${chalk.dim("○")} Global: not installed`);
  }

  if (!installed && !registrySkill) {
    console.log(chalk.yellow(`\nSkill "${name}" not found locally or in registry`));
  }

  console.log();
}
