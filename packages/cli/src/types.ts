import { z } from "zod";

export const AuthorZ = z.object({
  name: z.string(),
  github: z.string().optional(),
  url: z.string().url().optional(),
  avatar: z.string().url().optional()
});

export const SkillZ = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(3).max(80),
  version: z.string().default("1.0.0"),
  summary: z.string().max(180),
  description: z.string().optional(),
  verticals: z.array(z.string()).min(1).max(3),
  tags: z.array(z.string()).optional(),
  author: AuthorZ,
  status: z.enum(["ready", "beta", "deprecated"]).default("ready"),
  verified: z.boolean().default(false),
  links: z.object({
    repo: z.string().url().optional(),
    skill_md: z.string().url().optional(),
    docs: z.string().url().optional(),
    demo: z.string().url().optional(),
    homepage: z.string().url().optional()
  }),
  installation: z.object({
    type: z.enum(["git", "inline", "npm", "cli"]),
    command: z.string().optional(),
    prerequisites: z.array(z.string()).optional()
  }).optional(),
  stats: z.object({
    stars: z.number().default(0),
    forks: z.number().default(0),
    installs: z.number().default(0),
  }).optional(),
  last_updated: z.string(),
});

export type Skill = z.infer<typeof SkillZ>;
export type Author = z.infer<typeof AuthorZ>;
