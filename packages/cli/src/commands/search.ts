import chalk from "chalk";
import ora from "ora";
import { searchRegistry } from "../utils/registry.js";

export async function search(query: string): Promise<void> {
  const spinner = ora(`Searching for "${query}"...`).start();

  const results = await searchRegistry(query);

  if (results.length === 0) {
    spinner.info("No skills found");
    return;
  }

  spinner.succeed(`Found ${results.length} skill(s)\n`);

  for (const skill of results) {
    console.log(`${chalk.green(skill.id)} ${chalk.dim(`v${skill.last_updated}`)}`);
    console.log(`  ${skill.summary}`);
    console.log(
      `  ${chalk.dim("by")} ${skill.author.name} ${chalk.dim("•")} ${skill.verticals.join(", ")}`
    );
    if (skill.stats) {
      console.log(
        `  ${chalk.yellow("★")} ${skill.stats.stars} ${chalk.dim("•")} ${skill.stats.installs} installs`
      );
    }
    console.log();
  }
}
