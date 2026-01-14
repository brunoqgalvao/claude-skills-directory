export interface Competitor {
  name: string;
  url: string;
  github?: string;
  type: "skills" | "mcp" | "both";
  description: string;
}

export interface GitHubStats {
  stars: number;
  forks: number;
  issues: number;
  lastCommit: string;
  contributors?: number;
}

export interface CompetitorSnapshot {
  name: string;
  date: string;
  github?: GitHubStats;
  claimedSize?: string;
  keywordRankings?: Record<string, number | null>;
}

export interface TrackingData {
  lastUpdated: string;
  competitors: Competitor[];
  snapshots: CompetitorSnapshot[];
}
