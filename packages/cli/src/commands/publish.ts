import { existsSync, readFileSync } from "fs";
import { join, basename } from "path";
import chalk from "chalk";
import ora from "ora";
import { simpleGit } from "simple-git";

export async function publish(): Promise<void> {
  const cwd = process.cwd();
  const skillMdPath = join(cwd, "SKILL.md");

  if (!existsSync(skillMdPath)) {
    console.log(chalk.red("No SKILL.md found in current directory"));
    console.log(chalk.dim("Run `skill init` to create one"));
    process.exit(1);
  }

  const spinner = ora("Checking repository...").start();

  const git = simpleGit(cwd);

  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      spinner.fail("Current directory is not a git repository");
      console.log(chalk.dim("Initialize with: git init"));
      process.exit(1);
    }

    const remotes = await git.getRemotes(true);
    const origin = remotes.find((r) => r.name === "origin");

    if (!origin) {
      spinner.fail("No origin remote found");
      console.log(chalk.dim("Add one with: git remote add origin <url>"));
      process.exit(1);
    }

    const status = await git.status();
    if (status.files.length > 0) {
      spinner.warn("You have uncommitted changes");
      console.log(chalk.dim("Commit and push your changes first"));
    }

    spinner.succeed("Repository ready");
    console.log();
    console.log(chalk.green("To publish your skill:"));
    console.log();
    console.log("  1. Push to GitHub:");
    console.log(chalk.cyan(`     git push -u origin main`));
    console.log();
    console.log("  2. Submit to the directory:");
    console.log(
      chalk.cyan(
        `     https://github.com/brunogalvao/claude-skills-directory/issues/new?template=add-skill.yml`
      )
    );
    console.log();
    console.log(chalk.dim("Your skill will be reviewed and added to the registry."));
    console.log();

    const repoUrl = origin.refs.fetch || origin.refs.push;
    console.log(chalk.dim(`Repository: ${repoUrl}`));
  } catch (error) {
    spinner.fail(`Error: ${error}`);
    process.exit(1);
  }
}
