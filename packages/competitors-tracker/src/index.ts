import { generateReport, showGrowth } from "./report.js";
import { discoverNewCompetitors } from "./discover.js";
import { fetchAllGitHubStats } from "./github-stats.js";

const command = process.argv[2];

async function main() {
  switch (command) {
    case "report":
      await generateReport();
      break;
    case "growth":
      showGrowth();
      break;
    case "discover":
      await discoverNewCompetitors();
      break;
    case "github":
      const stats = await fetchAllGitHubStats();
      console.log(JSON.stringify(stats, null, 2));
      break;
    default:
      console.log(`
Competitors Tracker

Commands:
  pnpm track report    - Generate full report with GitHub stats
  pnpm track growth    - Show growth over time
  pnpm track discover  - Get links to discover new competitors
  pnpm track github    - Fetch GitHub stats only

Environment Variables:
  GITHUB_TOKEN   - GitHub API token (optional, increases rate limit)
  SERPAPI_KEY    - SerpAPI key for Google ranking checks

Data stored in: packages/competitors-tracker/data/tracking.json
`);
  }
}

main().catch(console.error);
