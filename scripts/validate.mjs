// Simple data validator for /data/skills/*.json using zod.
// Run: pnpm validate
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

  // Author information
  author: z.object({
    name: z.string(),
    github: z.string().optional(),
    url: z.string().url().optional()
  }),

  // Visibility control
  visibility: z.enum(["public", "private"]).default("public"),

  links: z
    .object({
      repo: z.string().url().optional(),
      skill_md: z.string().url().optional(),
      docs: z.string().url().optional(),
      demo: z.string().url().optional()
    })
    .refine((o) => Object.keys(o).length > 0, { message: "At least one link required" }),

  // Installation metadata
  installation: z.object({
    type: z.enum(["git", "inline", "npm"]),
    command: z.string().optional(), // For git/npm based installs
    prerequisites: z.array(z.string()).optional() // e.g., ["codex CLI installed"]
  }).optional(),

  // Community metrics
  stats: z.object({
    stars: z.number().default(0),
    installs: z.number().default(0)
  }).optional(),

  last_updated: z.string()
});

let ok = true;
const ids = new Set();

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
    // quick URL sanity check if provided
    for (const key of ["repo", "skill_md", "docs", "demo"]) {
      if (parsed.links[key] && !/^https?:\/\//.test(parsed.links[key])) {
        throw new Error(`links.${key} must be http(s) URL`);
      }
    }
    console.log(`✓ ${f}`);
  } catch (e) {
    ok = false;
    console.error(`✗ ${f}: ${e.message}`);
  }
}

if (!ok) process.exit(1);
console.log(`\n✅ ${files.length} skills validated`);
