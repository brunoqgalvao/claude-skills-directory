import { existsSync, mkdirSync } from "fs";
import { exec } from "child_process";
import chalk from "chalk";
import { getSkillsDir, getSkillPath } from "../utils/paths.js";

export interface OpenOptions {
  global?: boolean;
  cloud?: boolean;
}

const CLOUD_URL = "https://skillsmp.com";

export async function open(name?: string, options: OpenOptions = {}): Promise<void> {
  if (options.cloud) {
    const url = name ? `${CLOUD_URL}/skills/${name}` : CLOUD_URL;
    const platform = process.platform;
    const command = platform === "darwin" ? `open "${url}"` : platform === "win32" ? `start "${url}"` : `xdg-open "${url}"`;
    exec(command);
    console.log(chalk.dim(`Opening ${url}`));
    return;
  }

  const isGlobal = options.global ?? true;
  
  let targetPath: string;
  
  if (name) {
    targetPath = getSkillPath(name, isGlobal);
    if (!existsSync(targetPath)) {
      console.log(chalk.red(`Skill "${name}" not found ${isGlobal ? "(global)" : "(local)"}`));
      process.exit(1);
    }
  } else {
    targetPath = getSkillsDir(isGlobal);
    if (!existsSync(targetPath)) {
      mkdirSync(targetPath, { recursive: true });
    }
  }

  const platform = process.platform;
  let command: string;

  if (platform === "darwin") {
    command = `open "${targetPath}"`;
  } else if (platform === "win32") {
    command = `explorer "${targetPath}"`;
  } else {
    command = `xdg-open "${targetPath}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.log(chalk.red(`Failed to open: ${error.message}`));
      process.exit(1);
    }
  });

  console.log(chalk.dim(`Opening ${targetPath}`));
}
