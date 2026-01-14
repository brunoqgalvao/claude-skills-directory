import { competitors, keywords } from "./competitors.js";

export async function checkGoogleRanking(keyword: string, targetUrl: string): Promise<number | null> {
  console.log(`  Note: Google ranking requires SerpAPI or similar service`);
  console.log(`  Set SERPAPI_KEY env var to enable`);
  
  if (!process.env.SERPAPI_KEY) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: keyword,
      api_key: process.env.SERPAPI_KEY,
      engine: "google",
      num: "100",
    });

    const response = await fetch(`https://serpapi.com/search?${params}`);
    const data = await response.json();

    const results = data.organic_results || [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].link?.includes(targetUrl)) {
        return i + 1;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error checking ranking for "${keyword}":`, error);
    return null;
  }
}

export async function checkAllRankings() {
  const results: Record<string, Record<string, number | null>> = {};

  for (const competitor of competitors) {
    console.log(`\nChecking rankings for ${competitor.name}...`);
    results[competitor.name] = {};

    for (const keyword of keywords) {
      console.log(`  Keyword: "${keyword}"`);
      const domain = new URL(competitor.url).hostname;
      results[competitor.name][keyword] = await checkGoogleRanking(keyword, domain);
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== Keyword Ranking Check ===\n");
  console.log("Keywords tracked:", keywords);
  console.log("\nNote: Full ranking requires SERPAPI_KEY environment variable");
  console.log("Get a key at https://serpapi.com\n");
  
  if (process.env.SERPAPI_KEY) {
    const rankings = await checkAllRankings();
    console.log("\n=== Results ===\n");
    console.log(JSON.stringify(rankings, null, 2));
  }
}
