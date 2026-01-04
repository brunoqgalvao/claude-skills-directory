import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, basename } from "path";
import chalk from "chalk";
import inquirer from "inquirer";

const SKILL_MD_TEMPLATE = `---
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

const SKILL_JSON_TEMPLATE = {
  name: "",
  version: "0.1.0",
  description: "",
  author: {
    name: "",
    github: "",
  },
  verticals: [],
  tags: [],
  scripts: {
    setup: "setup.sh",
  },
};

export async function init(): Promise<void> {
  const cwd = process.cwd();
  const defaultName = basename(cwd);

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Skill name:",
      default: defaultName,
    },
    {
      type: "input",
      name: "description",
      message: "Description:",
    },
    {
      type: "input",
      name: "authorName",
      message: "Author name:",
    },
    {
      type: "input",
      name: "authorGithub",
      message: "Author GitHub username:",
    },
    {
      type: "input",
      name: "verticals",
      message: "Verticals (comma-separated):",
      default: "Development",
    },
    {
      type: "confirm",
      name: "createSetup",
      message: "Create setup.sh template?",
      default: true,
    },
  ]);

  const skillMdPath = join(cwd, "SKILL.md");
  const skillJsonPath = join(cwd, "skill.json");

  if (existsSync(skillMdPath)) {
    console.log(chalk.yellow("SKILL.md already exists, skipping"));
  } else {
    const content = SKILL_MD_TEMPLATE.replace(/\{\{name\}\}/g, answers.name).replace(
      /\{\{description\}\}/g,
      answers.description
    );
    writeFileSync(skillMdPath, content);
    console.log(chalk.green("✓"), "Created SKILL.md");
  }

  if (existsSync(skillJsonPath)) {
    console.log(chalk.yellow("skill.json already exists, skipping"));
  } else {
    const json = {
      ...SKILL_JSON_TEMPLATE,
      name: answers.name,
      description: answers.description,
      author: {
        name: answers.authorName,
        github: answers.authorGithub,
      },
      verticals: answers.verticals.split(",").map((v: string) => v.trim()),
    };
    writeFileSync(skillJsonPath, JSON.stringify(json, null, 2));
    console.log(chalk.green("✓"), "Created skill.json");
  }

  if (answers.createSetup) {
    const setupPath = join(cwd, "setup.sh");
    if (existsSync(setupPath)) {
      console.log(chalk.yellow("setup.sh already exists, skipping"));
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
        { mode: 0o755 }
      );
      console.log(chalk.green("✓"), "Created setup.sh");
    }
  }

  console.log();
  console.log(chalk.green("Skill initialized!"));
  console.log(chalk.dim("Next steps:"));
  console.log(chalk.dim("  1. Edit SKILL.md with your instructions"));
  console.log(chalk.dim("  2. Add any scripts to scripts/ directory"));
  console.log(chalk.dim("  3. Run: skill publish"));
}
