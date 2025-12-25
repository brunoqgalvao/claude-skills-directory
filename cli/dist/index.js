#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/commands/install.ts
import { existsSync as existsSync3, mkdirSync, rmSync } from "fs";
import chalk2 from "chalk";
import ora2 from "ora";

// src/utils/paths.ts
import { homedir } from "os";
import { join } from "path";
var GLOBAL_SKILLS_DIR = join(homedir(), ".claude", "skills");
var LOCAL_SKILLS_DIR = join(process.cwd(), ".claude", "skills");
function getSkillsDir(global) {
  return global ? GLOBAL_SKILLS_DIR : LOCAL_SKILLS_DIR;
}
function getSkillPath(name, global) {
  return join(getSkillsDir(global), name);
}
var REGISTRY_URL = "https://raw.githubusercontent.com/brunogalvao/claude-skills-directory/main/data/skills";

// src/utils/git.ts
import { simpleGit } from "simple-git";
import { existsSync } from "fs";
import { join as join2 } from "path";
async function cloneSkill(repoUrl, destPath) {
  const git = simpleGit();
  await git.clone(repoUrl, destPath, ["--depth", "1"]);
}
async function isGitUrl(source) {
  return source.startsWith("https://github.com/") || source.startsWith("git@github.com:") || source.startsWith("https://gitlab.com/") || source.includes(".git");
}
function extractRepoName(url) {
  const match = url.match(/\/([^/]+?)(\.git)?$/);
  return match ? match[1].replace(".git", "") : "skill";
}
async function hasSkillMd(path) {
  return existsSync(join2(path, "SKILL.md"));
}

// src/utils/config.ts
import Conf from "conf";
var config = new Conf({
  projectName: "skill-cli",
  defaults: {
    installed: {
      global: {},
      local: {}
    }
  }
});
function trackInstall(name, global, source, version = "latest") {
  const scope = global ? "global" : "local";
  const installed = config.get("installed");
  installed[scope][name] = {
    version,
    installedAt: (/* @__PURE__ */ new Date()).toISOString(),
    source
  };
  config.set("installed", installed);
}
function trackUninstall(name, global) {
  const scope = global ? "global" : "local";
  const installed = config.get("installed");
  delete installed[scope][name];
  config.set("installed", installed);
}
function getInstalled(global) {
  const scope = global ? "global" : "local";
  return config.get("installed")[scope];
}

// src/utils/scripts.ts
import { execa } from "execa";
import { existsSync as existsSync2 } from "fs";
import { join as join3 } from "path";
import chalk from "chalk";
import ora from "ora";
var SETUP_SCRIPTS = ["setup.sh", "setup.py", "install.sh", "install.py"];
async function findSetupScript(skillPath) {
  for (const script of SETUP_SCRIPTS) {
    const scriptPath = join3(skillPath, script);
    if (existsSync2(scriptPath)) {
      return scriptPath;
    }
  }
  return null;
}
async function runSetupScript(skillPath) {
  const scriptPath = await findSetupScript(skillPath);
  if (!scriptPath) {
    return true;
  }
  const spinner = ora(`Running setup script: ${scriptPath}`).start();
  try {
    const ext = scriptPath.split(".").pop();
    let command;
    let args;
    if (ext === "sh") {
      command = "bash";
      args = [scriptPath];
    } else if (ext === "py") {
      command = "python3";
      args = [scriptPath];
    } else {
      spinner.warn("Unknown script type, skipping setup");
      return true;
    }
    await execa(command, args, {
      cwd: skillPath,
      stdio: "inherit"
    });
    spinner.succeed("Setup completed");
    return true;
  } catch (error) {
    spinner.fail(`Setup failed: ${error}`);
    return false;
  }
}
async function runSkillScript(skillPath, scriptName) {
  const scriptsDir = join3(skillPath, "scripts");
  const possiblePaths = [
    join3(scriptsDir, `${scriptName}.sh`),
    join3(scriptsDir, `${scriptName}.py`),
    join3(skillPath, `${scriptName}.sh`),
    join3(skillPath, `${scriptName}.py`)
  ];
  let foundPath = null;
  for (const p of possiblePaths) {
    if (existsSync2(p)) {
      foundPath = p;
      break;
    }
  }
  if (!foundPath) {
    console.error(chalk.red(`Script "${scriptName}" not found in skill`));
    process.exit(1);
  }
  const ext = foundPath.split(".").pop();
  const command = ext === "py" ? "python3" : "bash";
  await execa(command, [foundPath], {
    cwd: skillPath,
    stdio: "inherit"
  });
}

// src/utils/registry.ts
async function fetchSkillFromRegistry(id) {
  try {
    const response = await fetch(`${REGISTRY_URL}/${id}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
async function searchRegistry(query) {
  try {
    const indexUrl = "https://raw.githubusercontent.com/brunogalvao/claude-skills-directory/main/data/skills-index.json";
    const response = await fetch(indexUrl);
    if (!response.ok) return [];
    const skills = await response.json();
    const q = query.toLowerCase();
    return skills.filter(
      (s) => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.tags?.some((t) => t.toLowerCase().includes(q)) || s.verticals.some((v) => v.toLowerCase().includes(q))
    );
  } catch {
    return [];
  }
}

// src/commands/install.ts
async function install(source, options = {}) {
  const isGlobal = options.global ?? false;
  const skillsDir = getSkillsDir(isGlobal);
  if (!existsSync3(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
  }
  const spinner = ora2(`Installing skill from ${source}`).start();
  try {
    let repoUrl;
    let skillName;
    if (await isGitUrl(source)) {
      repoUrl = source;
      skillName = extractRepoName(source);
    } else {
      spinner.text = `Looking up "${source}" in registry...`;
      const registrySkill = await fetchSkillFromRegistry(source);
      if (!registrySkill) {
        spinner.fail(`Skill "${source}" not found in registry`);
        console.log(chalk2.dim("Try: skill search <query>"));
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
    if (existsSync3(destPath)) {
      if (options.force) {
        rmSync(destPath, { recursive: true, force: true });
      } else {
        spinner.fail(`Skill "${skillName}" already installed`);
        console.log(chalk2.dim("Use --force to reinstall"));
        process.exit(1);
      }
    }
    spinner.text = `Cloning ${repoUrl}...`;
    await cloneSkill(repoUrl, destPath);
    if (!await hasSkillMd(destPath)) {
      spinner.warn("No SKILL.md found - skill may not work correctly");
    }
    rmSync(`${destPath}/.git`, { recursive: true, force: true });
    trackInstall(skillName, isGlobal, repoUrl);
    spinner.succeed(
      `Installed ${chalk2.green(skillName)} ${isGlobal ? "(global)" : "(local)"}`
    );
    console.log(chalk2.dim(`  \u2192 ${destPath}`));
    if (!options.skipSetup) {
      await runSetupScript(destPath);
    }
  } catch (error) {
    spinner.fail(`Installation failed: ${error}`);
    process.exit(1);
  }
}

// src/commands/uninstall.ts
import { existsSync as existsSync4, rmSync as rmSync2 } from "fs";
import chalk3 from "chalk";
import ora3 from "ora";
async function uninstall(name, options = {}) {
  const isGlobal = options.global ?? false;
  const skillPath = getSkillPath(name, isGlobal);
  const spinner = ora3(`Uninstalling ${name}`).start();
  if (!existsSync4(skillPath)) {
    const installed = getInstalled(isGlobal);
    if (!installed[name]) {
      spinner.fail(`Skill "${name}" is not installed ${isGlobal ? "(global)" : "(local)"}`);
      process.exit(1);
    }
  }
  try {
    rmSync2(skillPath, { recursive: true, force: true });
    trackUninstall(name, isGlobal);
    spinner.succeed(`Uninstalled ${chalk3.red(name)} ${isGlobal ? "(global)" : "(local)"}`);
  } catch (error) {
    spinner.fail(`Failed to uninstall: ${error}`);
    process.exit(1);
  }
}

// src/commands/list.ts
import { existsSync as existsSync5, readdirSync } from "fs";
import chalk4 from "chalk";
async function list(options = {}) {
  if (options.all) {
    console.log(chalk4.bold("\nGlobal skills:"));
    await listScope(true);
    console.log(chalk4.bold("\nLocal skills:"));
    await listScope(false);
  } else {
    await listScope(options.global ?? false);
  }
}
async function listScope(isGlobal) {
  const skillsDir = getSkillsDir(isGlobal);
  const installed = getInstalled(isGlobal);
  const scope = isGlobal ? "global" : "local";
  if (!existsSync5(skillsDir)) {
    console.log(chalk4.dim(`  No ${scope} skills installed`));
    return;
  }
  const dirs = readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  if (dirs.length === 0) {
    console.log(chalk4.dim(`  No ${scope} skills installed`));
    return;
  }
  console.log(chalk4.dim(`  ${skillsDir}
`));
  for (const name of dirs) {
    const meta = installed[name];
    const date = meta?.installedAt ? new Date(meta.installedAt).toLocaleDateString() : "unknown";
    console.log(`  ${chalk4.green("\u25CF")} ${chalk4.bold(name)} ${chalk4.dim(`(${date})`)}`);
  }
  console.log();
}

// src/commands/search.ts
import chalk5 from "chalk";
import ora4 from "ora";
async function search(query) {
  const spinner = ora4(`Searching for "${query}"...`).start();
  const results = await searchRegistry(query);
  if (results.length === 0) {
    spinner.info("No skills found");
    return;
  }
  spinner.succeed(`Found ${results.length} skill(s)
`);
  for (const skill of results) {
    console.log(`${chalk5.green(skill.id)} ${chalk5.dim(`v${skill.last_updated}`)}`);
    console.log(`  ${skill.summary}`);
    console.log(
      `  ${chalk5.dim("by")} ${skill.author.name} ${chalk5.dim("\u2022")} ${skill.verticals.join(", ")}`
    );
    if (skill.stats) {
      console.log(
        `  ${chalk5.yellow("\u2605")} ${skill.stats.stars} ${chalk5.dim("\u2022")} ${skill.stats.installs} installs`
      );
    }
    console.log();
  }
}

// src/commands/info.ts
import { existsSync as existsSync6 } from "fs";
import chalk6 from "chalk";
import ora5 from "ora";
async function info(name, options = {}) {
  const isGlobal = options.global ?? false;
  const localPath = getSkillPath(name, false);
  const globalPath = getSkillPath(name, true);
  const installedLocal = existsSync6(localPath);
  const installedGlobal = existsSync6(globalPath);
  const installed = installedLocal || installedGlobal;
  const spinner = ora5(`Fetching info for "${name}"...`).start();
  const registrySkill = await fetchSkillFromRegistry(name);
  spinner.stop();
  console.log();
  console.log(chalk6.bold.green(registrySkill?.name ?? name));
  console.log();
  if (registrySkill) {
    console.log(registrySkill.summary);
    console.log();
    console.log(`${chalk6.dim("Author:")}    ${registrySkill.author.name}`);
    console.log(`${chalk6.dim("Verticals:")} ${registrySkill.verticals.join(", ")}`);
    if (registrySkill.tags?.length) {
      console.log(`${chalk6.dim("Tags:")}      ${registrySkill.tags.join(", ")}`);
    }
    console.log(`${chalk6.dim("Updated:")}   ${registrySkill.last_updated}`);
    if (registrySkill.stats) {
      console.log(
        `${chalk6.dim("Stats:")}     ${chalk6.yellow("\u2605")} ${registrySkill.stats.stars} stars, ${registrySkill.stats.installs} installs`
      );
    }
    console.log();
    console.log(chalk6.dim("Links:"));
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
  console.log(chalk6.dim("Installation:"));
  if (installedLocal) {
    console.log(`  ${chalk6.green("\u25CF")} Local:  ${localPath}`);
  } else {
    console.log(`  ${chalk6.dim("\u25CB")} Local:  not installed`);
  }
  if (installedGlobal) {
    console.log(`  ${chalk6.green("\u25CF")} Global: ${globalPath}`);
  } else {
    console.log(`  ${chalk6.dim("\u25CB")} Global: not installed`);
  }
  if (!installed && !registrySkill) {
    console.log(chalk6.yellow(`
Skill "${name}" not found locally or in registry`));
  }
  console.log();
}

// src/commands/init.ts
import { existsSync as existsSync7, writeFileSync } from "fs";
import { join as join4, basename } from "path";
import chalk7 from "chalk";
import inquirer from "inquirer";
var SKILL_MD_TEMPLATE = `---
name: {{name}}
description: {{description}}
---

# {{name}}

## Overview

{{description}}

## Usage

Describe how to use this skill.

## Examples

Add examples here.
`;
var SKILL_JSON_TEMPLATE = {
  name: "",
  version: "0.1.0",
  description: "",
  author: {
    name: "",
    github: ""
  },
  verticals: [],
  tags: [],
  scripts: {
    setup: "setup.sh"
  }
};
async function init() {
  const cwd = process.cwd();
  const defaultName = basename(cwd);
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Skill name:",
      default: defaultName
    },
    {
      type: "input",
      name: "description",
      message: "Description:"
    },
    {
      type: "input",
      name: "authorName",
      message: "Author name:"
    },
    {
      type: "input",
      name: "authorGithub",
      message: "Author GitHub username:"
    },
    {
      type: "input",
      name: "verticals",
      message: "Verticals (comma-separated):",
      default: "Development"
    },
    {
      type: "confirm",
      name: "createSetup",
      message: "Create setup.sh template?",
      default: true
    }
  ]);
  const skillMdPath = join4(cwd, "SKILL.md");
  const skillJsonPath = join4(cwd, "skill.json");
  if (existsSync7(skillMdPath)) {
    console.log(chalk7.yellow("SKILL.md already exists, skipping"));
  } else {
    const content = SKILL_MD_TEMPLATE.replace(/\{\{name\}\}/g, answers.name).replace(
      /\{\{description\}\}/g,
      answers.description
    );
    writeFileSync(skillMdPath, content);
    console.log(chalk7.green("\u2713"), "Created SKILL.md");
  }
  if (existsSync7(skillJsonPath)) {
    console.log(chalk7.yellow("skill.json already exists, skipping"));
  } else {
    const json = {
      ...SKILL_JSON_TEMPLATE,
      name: answers.name,
      description: answers.description,
      author: {
        name: answers.authorName,
        github: answers.authorGithub
      },
      verticals: answers.verticals.split(",").map((v) => v.trim())
    };
    writeFileSync(skillJsonPath, JSON.stringify(json, null, 2));
    console.log(chalk7.green("\u2713"), "Created skill.json");
  }
  if (answers.createSetup) {
    const setupPath = join4(cwd, "setup.sh");
    if (existsSync7(setupPath)) {
      console.log(chalk7.yellow("setup.sh already exists, skipping"));
    } else {
      writeFileSync(
        setupPath,
        `#!/bin/bash
# Setup script for ${answers.name}
# This runs automatically after \`skill install\`

echo "Setting up ${answers.name}..."

# Add your setup commands here
# Example: install dependencies, configure environment, etc.

echo "Setup complete!"
`,
        { mode: 493 }
      );
      console.log(chalk7.green("\u2713"), "Created setup.sh");
    }
  }
  console.log();
  console.log(chalk7.green("Skill initialized!"));
  console.log(chalk7.dim("Next steps:"));
  console.log(chalk7.dim("  1. Edit SKILL.md with your instructions"));
  console.log(chalk7.dim("  2. Add any scripts to scripts/ directory"));
  console.log(chalk7.dim("  3. Run: skill publish"));
}

// src/commands/publish.ts
import { existsSync as existsSync8 } from "fs";
import { join as join5 } from "path";
import chalk8 from "chalk";
import ora6 from "ora";
import { simpleGit as simpleGit2 } from "simple-git";
async function publish() {
  const cwd = process.cwd();
  const skillMdPath = join5(cwd, "SKILL.md");
  if (!existsSync8(skillMdPath)) {
    console.log(chalk8.red("No SKILL.md found in current directory"));
    console.log(chalk8.dim("Run `skill init` to create one"));
    process.exit(1);
  }
  const spinner = ora6("Checking repository...").start();
  const git = simpleGit2(cwd);
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      spinner.fail("Current directory is not a git repository");
      console.log(chalk8.dim("Initialize with: git init"));
      process.exit(1);
    }
    const remotes = await git.getRemotes(true);
    const origin = remotes.find((r) => r.name === "origin");
    if (!origin) {
      spinner.fail("No origin remote found");
      console.log(chalk8.dim("Add one with: git remote add origin <url>"));
      process.exit(1);
    }
    const status = await git.status();
    if (status.files.length > 0) {
      spinner.warn("You have uncommitted changes");
      console.log(chalk8.dim("Commit and push your changes first"));
    }
    spinner.succeed("Repository ready");
    console.log();
    console.log(chalk8.green("To publish your skill:"));
    console.log();
    console.log("  1. Push to GitHub:");
    console.log(chalk8.cyan(`     git push -u origin main`));
    console.log();
    console.log("  2. Submit to the directory:");
    console.log(
      chalk8.cyan(
        `     https://github.com/brunogalvao/claude-skills-directory/issues/new?template=add-skill.yml`
      )
    );
    console.log();
    console.log(chalk8.dim("Your skill will be reviewed and added to the registry."));
    console.log();
    const repoUrl = origin.refs.fetch || origin.refs.push;
    console.log(chalk8.dim(`Repository: ${repoUrl}`));
  } catch (error) {
    spinner.fail(`Error: ${error}`);
    process.exit(1);
  }
}

// src/commands/update.ts
import { existsSync as existsSync9, rmSync as rmSync3 } from "fs";
import chalk9 from "chalk";
import ora7 from "ora";
import { readdirSync as readdirSync2 } from "fs";
async function update(name, options = {}) {
  const isGlobal = options.global ?? false;
  const installed = getInstalled(isGlobal);
  if (name) {
    await updateOne(name, isGlobal, options.skipSetup);
  } else {
    const skillsDir = getSkillsDir(isGlobal);
    if (!existsSync9(skillsDir)) {
      console.log(chalk9.dim("No skills installed"));
      return;
    }
    const dirs = readdirSync2(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    if (dirs.length === 0) {
      console.log(chalk9.dim("No skills installed"));
      return;
    }
    console.log(chalk9.bold(`Updating ${dirs.length} skill(s)...
`));
    for (const skillName of dirs) {
      await updateOne(skillName, isGlobal, options.skipSetup);
    }
  }
}
async function updateOne(name, isGlobal, skipSetup) {
  const installed = getInstalled(isGlobal);
  const meta = installed[name];
  if (!meta?.source) {
    console.log(chalk9.yellow(`${name}: no source URL recorded, skipping`));
    return;
  }
  const spinner = ora7(`Updating ${name}...`).start();
  const destPath = getSkillPath(name, isGlobal);
  try {
    rmSync3(destPath, { recursive: true, force: true });
    await cloneSkill(meta.source, destPath);
    rmSync3(`${destPath}/.git`, { recursive: true, force: true });
    trackInstall(name, isGlobal, meta.source);
    spinner.succeed(`Updated ${chalk9.green(name)}`);
    if (!skipSetup) {
      await runSetupScript(destPath);
    }
  } catch (error) {
    spinner.fail(`Failed to update ${name}: ${error}`);
  }
}

// src/commands/run.ts
import { existsSync as existsSync10 } from "fs";
import chalk10 from "chalk";
async function run(skillName, scriptName, options = {}) {
  const isGlobal = options.global ?? false;
  const skillPath = getSkillPath(skillName, isGlobal);
  if (!existsSync10(skillPath)) {
    console.log(
      chalk10.red(
        `Skill "${skillName}" not found ${isGlobal ? "(global)" : "(local)"}`
      )
    );
    process.exit(1);
  }
  console.log(chalk10.dim(`Running ${scriptName} for ${skillName}...
`));
  await runSkillScript(skillPath, scriptName);
}

// src/index.ts
var program = new Command();
program.name("skill").description("NPM for AI agent skills - manage skills for Claude Code, Codex, and more").version("0.1.0");
program.command("install <source>").alias("i").description("Install a skill from registry or git URL").option("-g, --global", "Install globally (~/.claude/skills/)").option("-f, --force", "Force reinstall if already exists").option("--skip-setup", "Skip running setup scripts").action(async (source, options) => {
  await install(source, options);
});
program.command("uninstall <name>").alias("rm").alias("remove").description("Uninstall a skill").option("-g, --global", "Uninstall from global directory").action(async (name, options) => {
  await uninstall(name, options);
});
program.command("list").alias("ls").description("List installed skills").option("-g, --global", "List global skills only").option("-a, --all", "List both local and global skills").action(async (options) => {
  await list(options);
});
program.command("search <query>").alias("s").description("Search the skill registry").action(async (query) => {
  await search(query);
});
program.command("info <name>").description("Show details about a skill").option("-g, --global", "Check global installation").action(async (name, options) => {
  await info(name, options);
});
program.command("init").description("Initialize a new skill in current directory").action(async () => {
  await init();
});
program.command("publish").description("Publish current skill to registry").action(async () => {
  await publish();
});
program.command("update [name]").alias("up").description("Update installed skill(s)").option("-g, --global", "Update global skills").option("--skip-setup", "Skip running setup scripts").action(async (name, options) => {
  await update(name, options);
});
program.command("run <skill> <script>").description("Run a script from a skill").option("-g, --global", "Run from global skill").action(async (skill, script, options) => {
  await run(skill, script, options);
});
program.parse();
