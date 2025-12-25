#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { install } from "./commands/install.js";
import { uninstall } from "./commands/uninstall.js";
import { list } from "./commands/list.js";
import { search } from "./commands/search.js";
import { info } from "./commands/info.js";
import { init } from "./commands/init.js";
import { publish } from "./commands/publish.js";
import { update } from "./commands/update.js";
import { run } from "./commands/run.js";

const program = new Command();

program
  .name("skill")
  .description("NPM for AI agent skills - manage skills for Claude Code, Codex, and more")
  .version("0.1.0");

program
  .command("install <source>")
  .alias("i")
  .description("Install a skill from registry or git URL")
  .option("-g, --global", "Install globally (~/.claude/skills/)")
  .option("-f, --force", "Force reinstall if already exists")
  .option("--skip-setup", "Skip running setup scripts")
  .action(async (source, options) => {
    await install(source, options);
  });

program
  .command("uninstall <name>")
  .alias("rm")
  .alias("remove")
  .description("Uninstall a skill")
  .option("-g, --global", "Uninstall from global directory")
  .action(async (name, options) => {
    await uninstall(name, options);
  });

program
  .command("list")
  .alias("ls")
  .description("List installed skills")
  .option("-g, --global", "List global skills only")
  .option("-a, --all", "List both local and global skills")
  .action(async (options) => {
    await list(options);
  });

program
  .command("search <query>")
  .alias("s")
  .description("Search the skill registry")
  .action(async (query) => {
    await search(query);
  });

program
  .command("info <name>")
  .description("Show details about a skill")
  .option("-g, --global", "Check global installation")
  .action(async (name, options) => {
    await info(name, options);
  });

program
  .command("init")
  .description("Initialize a new skill in current directory")
  .action(async () => {
    await init();
  });

program
  .command("publish")
  .description("Publish current skill to registry")
  .action(async () => {
    await publish();
  });

program
  .command("update [name]")
  .alias("up")
  .description("Update installed skill(s)")
  .option("-g, --global", "Update global skills")
  .option("--skip-setup", "Skip running setup scripts")
  .action(async (name, options) => {
    await update(name, options);
  });

program
  .command("run <skill> <script>")
  .description("Run a script from a skill")
  .option("-g, --global", "Run from global skill")
  .action(async (skill, script, options) => {
    await run(skill, script, options);
  });

program.parse();
