"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { Skill } from "@/lib/types";
import Search from "@/components/Search";
import SkillCard from "@/components/SkillCard";

export default function DirectoryClient({
  allSkills,
  initialQuery = ""
}: {
  allSkills: Skill[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);

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
    if (!q.trim()) return allSkills;
    return fuse.search(q).map((r) => r.item);
  }, [q, fuse, allSkills]);

  return (
    <>
      <div className="mt-6">
        <Search value={q} onChange={setQ} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
          No results. Try a different keyword or a vertical page.
        </div>
      )}
    </>
  );
}
