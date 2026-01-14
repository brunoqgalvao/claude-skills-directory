import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

interface SkillInfo {
  name: string;
  description?: string;
  repo?: string;
  users?: number;
}

interface FetchResult {
  source: string;
  url: string;
  fetchedAt: string;
  skills: SkillInfo[];
}

const DATA_FILE = path.join(import.meta.dirname, "../data/skills-snapshot.json");

async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SkillsTracker/1.0)",
    },
  });
  return response.text();
}

async function fetchSkillsDirectory(): Promise<SkillInfo[]> {
  console.log("Fetching from skillsdirectory.org...");
  try {
    const html = await fetchHTML("https://www.skillsdirectory.org/");
    const $ = cheerio.load(html);
    const skills: SkillInfo[] = [];

    $("a[href^='/skills/']").each((_, el) => {
      const $el = $(el);
      const name = $el.find("h3, .font-semibold").first().text().trim();
      const description = $el.find("p").first().text().trim();
      if (name && !skills.find((s) => s.name === name)) {
        skills.push({ name, description });
      }
    });

    return skills.slice(0, 20);
  } catch (error) {
    console.error("Error fetching skillsdirectory.org:", error);
    return [];
  }
}

async function fetchSkillsMP(): Promise<SkillInfo[]> {
  console.log("Fetching from skillsmp.com...");
  try {
    const html = await fetchHTML("https://skillsmp.com/");
    const $ = cheerio.load(html);
    const skills: SkillInfo[] = [];

    $("a[href*='/skill/'], .skill-card, [class*='skill']").each((_, el) => {
      const $el = $(el);
      const name = $el.find("h3, h4, .title, .name").first().text().trim() || $el.text().trim().split("\n")[0];
      if (name && name.length < 100 && !skills.find((s) => s.name === name)) {
        skills.push({ name });
      }
    });

    return skills.slice(0, 20);
  } catch (error) {
    console.error("Error fetching skillsmp.com:", error);
    return [];
  }
}

async function fetchAwesomeClaudeSkills(): Promise<SkillInfo[]> {
  console.log("Fetching from awesome-claude-skills...");
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/travisvn/awesome-claude-skills/main/README.md"
    );
    const markdown = await response.text();
    const skills: SkillInfo[] = [];

    const lines = markdown.split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—]?\s*(.*)/);
      if (match) {
        skills.push({
          name: match[1],
          repo: match[2],
          description: match[3].trim(),
        });
      }
    }

    return skills.slice(0, 30);
  } catch (error) {
    console.error("Error fetching awesome-claude-skills:", error);
    return [];
  }
}

async function fetchSuperpowers(): Promise<SkillInfo[]> {
  console.log("Fetching from superpowers...");
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/obra/superpowers/main/README.md"
    );
    const markdown = await response.text();
    const skills: SkillInfo[] = [];

    const lines = markdown.split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*[-*]\s*\*?\*?`?([^`*\[]+)`?\*?\*?\s*[-–—:]?\s*(.*)/);
      if (match && match[1].length < 50) {
        skills.push({
          name: match[1].trim(),
          description: match[2].trim(),
        });
      }
    }

    return skills.filter((s) => s.name && s.name.length > 2).slice(0, 30);
  } catch (error) {
    console.error("Error fetching superpowers:", error);
    return [];
  }
}

async function fetchAnthropicSkills(): Promise<SkillInfo[]> {
  console.log("Fetching from anthropics/skills...");
  try {
    const response = await fetch(
      "https://api.github.com/repos/anthropics/skills/contents",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );
    const contents = await response.json();
    const skills: SkillInfo[] = [];

    if (Array.isArray(contents)) {
      for (const item of contents) {
        if (item.type === "dir" && !item.name.startsWith(".")) {
          skills.push({
            name: item.name,
            repo: `anthropics/skills/${item.name}`,
          });
        }
      }
    }

    return skills;
  } catch (error) {
    console.error("Error fetching anthropics/skills:", error);
    return [];
  }
}

async function fetchMCPServersSkills(): Promise<SkillInfo[]> {
  console.log("Fetching from mcpservers.org/claude-skills...");
  try {
    const html = await fetchHTML("https://mcpservers.org/claude-skills");
    const $ = cheerio.load(html);
    const skills: SkillInfo[] = [];

    $("a[href*='github.com']").each((_, el) => {
      const $el = $(el);
      const name = $el.text().trim();
      const href = $el.attr("href") || "";
      if (name && href.includes("github.com") && !skills.find((s) => s.name === name)) {
        skills.push({ name, repo: href });
      }
    });

    return skills.slice(0, 20);
  } catch (error) {
    console.error("Error fetching mcpservers.org:", error);
    return [];
  }
}

export async function fetchAllSkills(): Promise<FetchResult[]> {
  const results: FetchResult[] = [];
  const now = new Date().toISOString();

  const skillsDir = await fetchSkillsDirectory();
  results.push({
    source: "Skills Directory",
    url: "https://skillsdirectory.org",
    fetchedAt: now,
    skills: skillsDir,
  });

  await new Promise((r) => setTimeout(r, 1000));

  const skillsMP = await fetchSkillsMP();
  results.push({
    source: "SkillsMP",
    url: "https://skillsmp.com",
    fetchedAt: now,
    skills: skillsMP,
  });

  await new Promise((r) => setTimeout(r, 1000));

  const awesome = await fetchAwesomeClaudeSkills();
  results.push({
    source: "awesome-claude-skills",
    url: "https://github.com/travisvn/awesome-claude-skills",
    fetchedAt: now,
    skills: awesome,
  });

  await new Promise((r) => setTimeout(r, 1000));

  const superpowers = await fetchSuperpowers();
  results.push({
    source: "superpowers",
    url: "https://github.com/obra/superpowers",
    fetchedAt: now,
    skills: superpowers,
  });

  await new Promise((r) => setTimeout(r, 1000));

  const anthropic = await fetchAnthropicSkills();
  results.push({
    source: "anthropics/skills",
    url: "https://github.com/anthropics/skills",
    fetchedAt: now,
    skills: anthropic,
  });

  await new Promise((r) => setTimeout(r, 1000));

  const mcpservers = await fetchMCPServersSkills();
  results.push({
    source: "mcpservers.org",
    url: "https://mcpservers.org/claude-skills",
    fetchedAt: now,
    skills: mcpservers,
  });

  return results;
}

function saveResults(results: FetchResult[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2));
  console.log(`\nSaved to: ${DATA_FILE}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== Fetching Skills from Competitors ===\n");

  const results = await fetchAllSkills();
  saveResults(results);

  console.log("\n=== Summary ===\n");
  for (const result of results) {
    console.log(`${result.source}: ${result.skills.length} skills fetched`);
    if (result.skills.length > 0) {
      console.log(`  Top 5:`);
      result.skills.slice(0, 5).forEach((s) => {
        console.log(`    - ${s.name}`);
      });
    }
    console.log();
  }
}
