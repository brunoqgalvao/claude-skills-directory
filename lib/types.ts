import { z } from "zod";

export const SkillZ = z.object({
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

  links: z.object({
    repo: z.string().url().optional(),
    skill_md: z.string().url().optional(),
    docs: z.string().url().optional(),
    demo: z.string().url().optional()
  }).refine((o) => Object.keys(o).length > 0, { message: "At least one link required" }),

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

  last_updated: z.string() // ISO date
});

export type Skill = z.infer<typeof SkillZ>;
