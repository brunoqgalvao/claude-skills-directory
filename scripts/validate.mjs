import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillsDir = path.join(__dirname, "..", "data", "skills");

const Skill = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(3).max(80),
  summary: z.string().max(180),
  verticals: z.array(z.string()).min(1).max(3),
  tags: z.array(z.string()).optional(),
  author: z.object({
    name: z.string(),
    github: z.string().optional(),
    url: z.string().url().optional()
  }),
  visibility: z.enum(["public", "private"]).default("public"),
  links: z
    .object({
      repo: z.string().url().optional(),
      skill_md: z.string().url().optional(),
      docs: z.string().url().optional(),
      demo: z.string().url().optional()
    })
    .refine((o) => Object.keys(o).length > 0, { message: "At least one link required" }),
  installation: z.object({
    type: z.enum(["git", "inline", "npm", "cli"]),
    command: z.string().optional(),
    prerequisites: z.array(z.string()).optional()
  }).optional(),
  stats: z.object({
    stars: z.number().default(0),
    installs: z.number().default(0),
    downloads: z.number().default(0),
    thumbsUp: z.number().default(0)
  }).optional(),
  comments: z.array(z.object({
    id: z.string(),
    author: z.string(),
    authorGithub: z.string().optional(),
    content: z.string(),
    createdAt: z.string()
  })).optional(),
  last_updated: z.string()
});

let ok = true;
const ids = new Set();
const allSkills = [];

const files = fs.readdirSync(skillsDir).filter((f) => f.endsWith(".json"));
for (const f of files) {
  const p = path.join(skillsDir, f);
  try {
    const raw = fs.readFileSync(p, "utf8");
    const json = JSON.parse(raw);
    const parsed = Skill.parse(json);
    if (parsed.id + ".json" !== f) throw new Error(`filename must be ${parsed.id}.json`);
    if (ids.has(parsed.id)) throw new Error(`duplicate id: ${parsed.id}`);
    ids.add(parsed.id);
    for (const key of ["repo", "skill_md", "docs", "demo"]) {
      if (parsed.links[key] && !/^https?:\/\//.test(parsed.links[key])) {
        throw new Error(`links.${key} must be http(s) URL`);
      }
    }
    allSkills.push(parsed);
    console.log(`✓ ${f}`);
  } catch (e) {
    ok = false;
    console.error(`✗ ${f}: ${e.message}`);
  }
}

if (!ok) process.exit(1);

allSkills.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
const indexPath = path.join(__dirname, "..", "data", "skills-index.json");
fs.writeFileSync(indexPath, JSON.stringify(allSkills, null, 2));

console.log(`\n✅ ${files.length} skills validated`);
console.log(`📦 Generated skills-index.json`);
