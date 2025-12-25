import { existsSync, rmSync } from "fs";
import chalk from "chalk";
import ora from "ora";
import { getSkillPath } from "../utils/paths.js";
import { trackUninstall, getInstalled } from "../utils/config.js";

export interface UninstallOptions {
  global?: boolean;
}

export async function uninstall(
  name: string,
  options: UninstallOptions = {}
): Promise<void> {
  const isGlobal = options.global ?? false;
  const skillPath = getSkillPath(name, isGlobal);

  const spinner = ora(`Uninstalling ${name}`).start();

  if (!existsSync(skillPath)) {
    const installed = getInstalled(isGlobal);
    if (!installed[name]) {
      spinner.fail(`Skill "${name}" is not installed ${isGlobal ? "(global)" : "(local)"}`);
      process.exit(1);
    }
  }

  try {
    rmSync(skillPath, { recursive: true, force: true });
    trackUninstall(name, isGlobal);
    spinner.succeed(`Uninstalled ${chalk.red(name)} ${isGlobal ? "(global)" : "(local)"}`);
  } catch (error) {
    spinner.fail(`Failed to uninstall: ${error}`);
    process.exit(1);
  }
}
