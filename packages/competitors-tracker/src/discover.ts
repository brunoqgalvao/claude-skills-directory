import { competitors } from "./competitors.js";

const discoveryQueries = [
  "claude skills marketplace site:github.com",
  "claude code skills directory",
  "agent skills registry",
  "mcp server marketplace",
  "claude skills hub",
];

export async function discoverNewCompetitors() {
  console.log("=== Competitor Discovery ===\n");
  console.log("Current tracked competitors:");
  competitors.forEach((c) => console.log(`  - ${c.name}: ${c.url}`));
  
  console.log("\n--- Discovery Queries ---");
  console.log("Run these searches manually to find new competitors:\n");
  
  for (const query of discoveryQueries) {
    console.log(`Google: https://google.com/search?q=${encodeURIComponent(query)}`);
  }

  console.log("\n--- GitHub Search ---");
  console.log("https://github.com/search?q=claude+skills&type=repositories&s=stars");
  console.log("https://github.com/search?q=mcp+server+marketplace&type=repositories&s=stars");
  console.log("https://github.com/search?q=agent+skills&type=repositories&s=stars");

  console.log("\n--- Product Hunt ---");
  console.log("https://www.producthunt.com/search?q=claude%20skills");
  console.log("https://www.producthunt.com/search?q=mcp%20server");

  console.log("\n--- To add a new competitor ---");
  console.log("Edit: packages/competitors-tracker/src/competitors.ts");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await discoverNewCompetitors();
}
