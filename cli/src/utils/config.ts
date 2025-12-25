import Conf from "conf";

interface SkillConfig {
  installed: {
    global: Record<string, { version: string; installedAt: string; source: string }>;
    local: Record<string, { version: string; installedAt: string; source: string }>;
  };
}

export const config = new Conf<SkillConfig>({
  projectName: "skill-cli",
  defaults: {
    installed: {
      global: {},
      local: {},
    },
  },
});

export function trackInstall(
  name: string,
  global: boolean,
  source: string,
  version = "latest"
): void {
  const scope = global ? "global" : "local";
  const installed = config.get("installed");
  installed[scope][name] = {
    version,
    installedAt: new Date().toISOString(),
    source,
  };
  config.set("installed", installed);
}

export function trackUninstall(name: string, global: boolean): void {
  const scope = global ? "global" : "local";
  const installed = config.get("installed");
  delete installed[scope][name];
  config.set("installed", installed);
}

export function getInstalled(global: boolean): Record<string, { version: string; installedAt: string; source: string }> {
  const scope = global ? "global" : "local";
  return config.get("installed")[scope];
}
