import { existsSync, readdirSync } from "fs";
import chalk from "chalk";
import { getSkillsDir, GLOBAL_SKILLS_DIR, LOCAL_SKILLS_DIR } from "../utils/paths.js";
import { getInstalled } from "../utils/config.js";

export interface ListOptions {
  global?: boolean;
  all?: boolean;
}

export async function list(options: ListOptions = {}): Promise<void> {
  if (options.all) {
    console.log(chalk.bold("\nGlobal skills:"));
    await listScope(true);
    console.log(chalk.bold("\nLocal skills:"));
    await listScope(false);
  } else {
    await listScope(options.global ?? false);
  }
}

async function listScope(isGlobal: boolean): Promise<void> {
  const skillsDir = getSkillsDir(isGlobal);
  const installed = getInstalled(isGlobal);
  const scope = isGlobal ? "global" : "local";

  if (!existsSync(skillsDir)) {
    console.log(chalk.dim(`  No ${scope} skills installed`));
    return;
  }

  const dirs = readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (dirs.length === 0) {
    console.log(chalk.dim(`  No ${scope} skills installed`));
    return;
  }

  console.log(chalk.dim(`  ${skillsDir}\n`));

  for (const name of dirs) {
    const meta = installed[name];
    const date = meta?.installedAt
      ? new Date(meta.installedAt).toLocaleDateString()
      : "unknown";
    console.log(`  ${chalk.green("●")} ${chalk.bold(name)} ${chalk.dim(`(${date})`)}`);
  }

  console.log();
}
