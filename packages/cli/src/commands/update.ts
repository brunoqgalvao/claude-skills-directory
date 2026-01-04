import { existsSync, rmSync } from "fs";
import chalk from "chalk";
import ora from "ora";
import { getSkillPath, getSkillsDir } from "../utils/paths.js";
import { getInstalled, trackInstall } from "../utils/config.js";
import { cloneSkill } from "../utils/git.js";
import { runSetupScript } from "../utils/scripts.js";
import { readdirSync } from "fs";

export interface UpdateOptions {
  global?: boolean;
  skipSetup?: boolean;
}

export async function update(
  name?: string,
  options: UpdateOptions = {}
): Promise<void> {
  const isGlobal = options.global ?? false;
  const installed = getInstalled(isGlobal);

  if (name) {
    await updateOne(name, isGlobal, options.skipSetup);
  } else {
    const skillsDir = getSkillsDir(isGlobal);
    if (!existsSync(skillsDir)) {
      console.log(chalk.dim("No skills installed"));
      return;
    }

    const dirs = readdirSync(skillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    if (dirs.length === 0) {
      console.log(chalk.dim("No skills installed"));
      return;
    }

    console.log(chalk.bold(`Updating ${dirs.length} skill(s)...\n`));

    for (const skillName of dirs) {
      await updateOne(skillName, isGlobal, options.skipSetup);
    }
  }
}

async function updateOne(
  name: string,
  isGlobal: boolean,
  skipSetup?: boolean
): Promise<void> {
  const installed = getInstalled(isGlobal);
  const meta = installed[name];

  if (!meta?.source) {
    console.log(chalk.yellow(`${name}: no source URL recorded, skipping`));
    return;
  }

  const spinner = ora(`Updating ${name}...`).start();
  const destPath = getSkillPath(name, isGlobal);

  try {
    rmSync(destPath, { recursive: true, force: true });
    await cloneSkill(meta.source, destPath);
    rmSync(`${destPath}/.git`, { recursive: true, force: true });

    trackInstall(name, isGlobal, meta.source);

    spinner.succeed(`Updated ${chalk.green(name)}`);

    if (!skipSetup) {
      await runSetupScript(destPath);
    }
  } catch (error) {
    spinner.fail(`Failed to update ${name}: ${error}`);
  }
}
