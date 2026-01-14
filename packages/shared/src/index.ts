import { z } from "zod";

export const AuthorZ = z.object({
  name: z.string(),
  github: z.string().optional(),
  url: z.string().url().optional(),
  avatar: z.string().url().optional()
});

export const AttributionZ = z.object({
  source: z.string(),
  url: z.string().url().optional()
});

export const CollaboratorZ = z.object({
  name: z.string(),
  github: z.string().optional(),
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
  attribution: AttributionZ.optional(),
  collaborators: z.array(CollaboratorZ).optional(),

  status: z.enum(["ready", "beta", "deprecated"]).default("ready"),
  verified: z.boolean().default(false),
  visibility: z.enum(["public", "private"]).default("public"),
  setup_time: z.string().optional(),
  license: z.string().default("MIT"),

  links: z.object({
    repo: z.string().url().optional(),
    skill_md: z.string().url().optional(),
    docs: z.string().url().optional(),
    demo: z.string().url().optional(),
    homepage: z.string().url().optional()
  }).refine((o) => Object.keys(o).length > 0, { message: "At least one link required" }),

  installation: z.object({
    type: z.enum(["git", "inline", "npm", "cli"]),
    command: z.string().optional(),
    prerequisites: z.array(z.string()).optional()
  }).optional(),

  stats: z.object({
    stars: z.number().default(0),
    forks: z.number().default(0),
    installs: z.number().default(0),
    installs_weekly: z.array(z.number()).optional()
  }).optional(),

  last_updated: z.string(),
  created_at: z.string().optional()
});

export type Skill = z.infer<typeof SkillZ>;
export type Author = z.infer<typeof AuthorZ>;
export type Attribution = z.infer<typeof AttributionZ>;
export type Collaborator = z.infer<typeof CollaboratorZ>;

export const VerticalZ = z.object({
  name: z.string(),
  emoji: z.string().optional()
});

export type Vertical = z.infer<typeof VerticalZ>;

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const SKILLS_DIR_NAME = "skills";
export const VERTICALS_FILE = "verticals.json";

// ============================================
// Quality Score & Trust Tier System
// ============================================

export type TrustTier = "gold" | "silver" | "bronze" | "new";

export type SortOption =
  | "trending"      // Weekly install growth rate
  | "popular"       // Stars + installs
  | "verified"      // Verified first
  | "recent"        // Recently updated (default)
  | "rising";       // New skills with good traction

export interface QualityMetrics {
  score: number;
  tier: TrustTier;
  isTrending: boolean;
  isRising: boolean;
}

/**
 * Calculate quality score for a skill
 * Inspired by npm's quality metric
 */
export function calculateQualityScore(skill: Skill): number {
  const stats = skill.stats || { stars: 0, forks: 0, installs: 0 };
  const verified = skill.verified ? 50 : 0;

  // Recency bonus: skills updated in last 30 days get a boost
  const lastUpdate = new Date(skill.last_updated);
  const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  const recencyBonus = daysSinceUpdate <= 30 ? 10 : daysSinceUpdate <= 90 ? 5 : 0;

  return (
    stats.stars * 1.0 +
    stats.installs * 0.5 +
    stats.forks * 0.8 +
    verified +
    recencyBonus
  );
}

/**
 * Determine trust tier based on stats
 */
export function getTrustTier(skill: Skill): TrustTier {
  const stats = skill.stats || { stars: 0, forks: 0, installs: 0 };

  // 🥇 Gold: verified + 100+ stars + 500+ installs
  if (skill.verified && stats.stars >= 100 && stats.installs >= 500) {
    return "gold";
  }

  // 🥈 Silver: 50+ stars OR 200+ installs
  if (stats.stars >= 50 || stats.installs >= 200) {
    return "silver";
  }

  // 🥉 Bronze: 10+ stars OR 50+ installs
  if (stats.stars >= 10 || stats.installs >= 50) {
    return "bronze";
  }

  // ⚪ New: Everything else
  return "new";
}

/**
 * Check if skill is trending (weekly install growth)
 */
export function isTrending(skill: Skill): boolean {
  const weekly = skill.stats?.installs_weekly;
  if (!weekly || weekly.length < 2) return false;

  // Compare last week to average of previous weeks
  const lastWeek = weekly[weekly.length - 1];
  const previousWeeks = weekly.slice(0, -1);
  const avgPrevious = previousWeeks.reduce((a, b) => a + b, 0) / previousWeeks.length;

  // Trending if 50% growth and at least 10 installs last week
  return lastWeek >= 10 && lastWeek > avgPrevious * 1.5;
}

/**
 * Check if skill is rising (new but gaining traction)
 */
export function isRising(skill: Skill): boolean {
  const stats = skill.stats || { stars: 0, forks: 0, installs: 0 };
  const created = skill.created_at ? new Date(skill.created_at) : new Date(skill.last_updated);
  const daysSinceCreation = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);

  // Rising: created in last 60 days + some traction
  return daysSinceCreation <= 60 && (stats.stars >= 5 || stats.installs >= 20);
}

/**
 * Get all quality metrics for a skill
 */
export function getQualityMetrics(skill: Skill): QualityMetrics {
  return {
    score: calculateQualityScore(skill),
    tier: getTrustTier(skill),
    isTrending: isTrending(skill),
    isRising: isRising(skill)
  };
}

/**
 * Sort skills by various criteria
 */
export function sortSkills(skills: Skill[], sortBy: SortOption): Skill[] {
  const sorted = [...skills];

  switch (sortBy) {
    case "trending":
      // Sort by weekly install growth rate
      return sorted.sort((a, b) => {
        const aWeekly = a.stats?.installs_weekly;
        const bWeekly = b.stats?.installs_weekly;
        const aGrowth = aWeekly?.length ? aWeekly[aWeekly.length - 1] : 0;
        const bGrowth = bWeekly?.length ? bWeekly[bWeekly.length - 1] : 0;
        return bGrowth - aGrowth;
      });

    case "popular":
      // Sort by quality score (stars + installs)
      return sorted.sort((a, b) => calculateQualityScore(b) - calculateQualityScore(a));

    case "verified":
      // Verified first, then by quality score
      return sorted.sort((a, b) => {
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return calculateQualityScore(b) - calculateQualityScore(a);
      });

    case "rising":
      // New skills with good early traction
      return sorted.sort((a, b) => {
        const aRising = isRising(a) ? 1 : 0;
        const bRising = isRising(b) ? 1 : 0;
        if (aRising !== bRising) return bRising - aRising;
        return calculateQualityScore(b) - calculateQualityScore(a);
      });

    case "recent":
    default:
      // Sort by last_updated
      return sorted.sort((a, b) =>
        new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
      );
  }
}

export const SORT_OPTIONS: { value: SortOption; label: string; emoji: string }[] = [
  { value: "popular", label: "Most Popular", emoji: "⭐" },
  { value: "trending", label: "Trending", emoji: "🔥" },
  { value: "verified", label: "Verified First", emoji: "✅" },
  { value: "rising", label: "Rising", emoji: "📈" },
  { value: "recent", label: "Recently Updated", emoji: "🆕" }
];

export const TRUST_TIER_CONFIG: Record<TrustTier, { label: string; emoji: string; color: string }> = {
  gold: { label: "Gold", emoji: "🥇", color: "text-amber-600 bg-amber-50 border-amber-200" },
  silver: { label: "Silver", emoji: "🥈", color: "text-gray-600 bg-gray-100 border-gray-200" },
  bronze: { label: "Bronze", emoji: "🥉", color: "text-orange-700 bg-orange-50 border-orange-200" },
  new: { label: "New", emoji: "⚪", color: "text-gray-500 bg-gray-50 border-gray-200" }
};
