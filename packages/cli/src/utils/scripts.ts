import { execa } from "execa";
import { existsSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import ora from "ora";

const SETUP_SCRIPTS = ["setup.sh", "setup.py", "install.sh", "install.py"];

export async function findSetupScript(skillPath: string): Promise<string | null> {
  for (const script of SETUP_SCRIPTS) {
    const scriptPath = join(skillPath, script);
    if (existsSync(scriptPath)) {
      return scriptPath;
    }
  }
  return null;
}

export async function runSetupScript(skillPath: string): Promise<boolean> {
  const scriptPath = await findSetupScript(skillPath);

  if (!scriptPath) {
    return true;
  }

  const spinner = ora(`Running setup script: ${scriptPath}`).start();

  try {
    const ext = scriptPath.split(".").pop();
    let command: string;
    let args: string[];

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
      stdio: "inherit",
    });

    spinner.succeed("Setup completed");
    return true;
  } catch (error) {
    spinner.fail(`Setup failed: ${error}`);
    return false;
  }
}

export async function runSkillScript(skillPath: string, scriptName: string): Promise<void> {
  const scriptsDir = join(skillPath, "scripts");
  const possiblePaths = [
    join(scriptsDir, `${scriptName}.sh`),
    join(scriptsDir, `${scriptName}.py`),
    join(skillPath, `${scriptName}.sh`),
    join(skillPath, `${scriptName}.py`),
  ];

  let foundPath: string | null = null;
  for (const p of possiblePaths) {
    if (existsSync(p)) {
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
    stdio: "inherit",
  });
}
