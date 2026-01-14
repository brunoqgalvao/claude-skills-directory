"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { Skill, SortOption, sortSkills, SORT_OPTIONS } from "@/lib/types";
import Search from "@/components/Search";
import SkillCard from "@/components/SkillCard";

export default function DirectoryClient({
  allSkills,
  initialQuery = "",
  defaultSort = "popular"
}: {
  allSkills: Skill[];
  initialQuery?: string;
  defaultSort?: SortOption;
}) {
  const [q, setQ] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);

  const fuse = useMemo(
    () =>
      new Fuse(allSkills, {
        threshold: 0.38,
        keys: [
          { name: "name", weight: 0.6 },
          { name: "summary", weight: 0.3 },
          { name: "tags", weight: 0.2 },
          { name: "verticals", weight: 0.2 }
        ]
      }),
    [allSkills]
  );

  const results = useMemo(() => {
    let items: Skill[];
    if (!q.trim()) {
      items = allSkills;
    } else {
      items = fuse.search(q).map((r) => r.item);
    }
    // Apply sorting
    return sortSkills(items, sortBy);
  }, [q, fuse, allSkills, sortBy]);

  return (
    <>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Search value={q} onChange={setQ} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-gray-500 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.emoji} {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <span>{results.length} skill{results.length !== 1 ? "s" : ""}</span>
        {sortBy === "popular" && <span className="text-gray-400">• Sorted by quality score</span>}
        {sortBy === "trending" && <span className="text-gray-400">• Skills with high weekly growth</span>}
        {sortBy === "verified" && <span className="text-gray-400">• Verified skills shown first</span>}
        {sortBy === "rising" && <span className="text-gray-400">• New skills gaining traction</span>}
        {sortBy === "recent" && <span className="text-gray-400">• Most recently updated</span>}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-10 rounded-xl border border-border bg-muted p-8 text-center text-gray-500">
          No results. Try a different keyword or a vertical page.
        </div>
      )}
    </>
  );
}
