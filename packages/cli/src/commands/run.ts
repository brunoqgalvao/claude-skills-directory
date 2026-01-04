import { existsSync } from "fs";
import chalk from "chalk";
import { getSkillPath } from "../utils/paths.js";
import { runSkillScript } from "../utils/scripts.js";

export interface RunOptions {
  global?: boolean;
}

export async function run(
  skillName: string,
  scriptName: string,
  options: RunOptions = {}
): Promise<void> {
  const isGlobal = options.global ?? false;
  const skillPath = getSkillPath(skillName, isGlobal);

  if (!existsSync(skillPath)) {
    console.log(
      chalk.red(
        `Skill "${skillName}" not found ${isGlobal ? "(global)" : "(local)"}`
      )
    );
    process.exit(1);
  }

  console.log(chalk.dim(`Running ${scriptName} for ${skillName}...\n`));
  await runSkillScript(skillPath, scriptName);
}
