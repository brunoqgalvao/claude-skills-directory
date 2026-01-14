import * as fs from "fs";
import * as path from "path";
import { competitors } from "./competitors.js";
import { fetchAllGitHubStats } from "./github-stats.js";
import type { CompetitorSnapshot, TrackingData } from "./types.js";

const DATA_FILE = path.join(import.meta.dirname, "../data/tracking.json");

function loadData(): TrackingData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {}
  return { lastUpdated: "", competitors, snapshots: [] };
}

function saveData(data: TrackingData) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function generateReport() {
  console.log("=== Competitors Report ===\n");
  console.log(`Date: ${new Date().toISOString().split("T")[0]}\n`);

  const githubStats = await fetchAllGitHubStats();
  const data = loadData();
  const today = new Date().toISOString().split("T")[0];

  const skillsCompetitors = competitors.filter((c) => c.type === "skills" || c.type === "both");
  const mcpCompetitors = competitors.filter((c) => c.type === "mcp" || c.type === "both");

  console.log("## Skills Marketplaces\n");
  console.log("| Name | Stars | Forks | Last Commit | Description |");
  console.log("|------|-------|-------|-------------|-------------|");

  for (const c of skillsCompetitors) {
    const stats = githubStats[c.name];
    const stars = stats?.stars ?? "-";
    const forks = stats?.forks ?? "-";
    const lastCommit = stats?.lastCommit ? stats.lastCommit.split("T")[0] : "-";
    console.log(`| [${c.name}](${c.url}) | ${stars} | ${forks} | ${lastCommit} | ${c.description} |`);

    data.snapshots.push({
      name: c.name,
      date: today,
      github: stats || undefined,
    });
  }

  console.log("\n## MCP Directories\n");
  console.log("| Name | Stars | Forks | Last Commit | Description |");
  console.log("|------|-------|-------|-------------|-------------|");

  for (const c of mcpCompetitors) {
    const stats = githubStats[c.name];
    const stars = stats?.stars ?? "-";
    const forks = stats?.forks ?? "-";
    const lastCommit = stats?.lastCommit ? stats.lastCommit.split("T")[0] : "-";
    console.log(`| [${c.name}](${c.url}) | ${stars} | ${forks} | ${lastCommit} | ${c.description} |`);

    if (!data.snapshots.find((s) => s.name === c.name && s.date === today)) {
      data.snapshots.push({
        name: c.name,
        date: today,
        github: stats || undefined,
      });
    }
  }

  data.lastUpdated = new Date().toISOString();
  data.competitors = competitors;
  saveData(data);

  console.log(`\n\nData saved to: ${DATA_FILE}`);
}

export function showGrowth() {
  const data = loadData();
  console.log("=== Growth Over Time ===\n");

  const byCompetitor: Record<string, CompetitorSnapshot[]> = {};
  for (const snapshot of data.snapshots) {
    if (!byCompetitor[snapshot.name]) {
      byCompetitor[snapshot.name] = [];
    }
    byCompetitor[snapshot.name].push(snapshot);
  }

  for (const [name, snapshots] of Object.entries(byCompetitor)) {
    if (snapshots.length < 2) continue;
    
    const sorted = snapshots.sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    if (first.github && last.github) {
      const starGrowth = last.github.stars - first.github.stars;
      console.log(`${name}:`);
      console.log(`  Stars: ${first.github.stars} -> ${last.github.stars} (${starGrowth >= 0 ? "+" : ""}${starGrowth})`);
      console.log(`  Period: ${first.date} to ${last.date}`);
      console.log();
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2];
  if (arg === "growth") {
    showGrowth();
  } else {
    await generateReport();
  }
}
