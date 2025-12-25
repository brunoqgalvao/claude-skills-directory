"use client";

import Link from "next/link";
import { Skill } from "@/lib/types";
import clsx from "clsx";
import { useState } from "react";

export default function SkillCard({ skill }: { skill: Skill }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={`/skill/${skill.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={clsx(
        "group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-card transition",
        "hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
      )}
    >
      {/* glow border */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 rounded-2xl",
          hover ? "ring-1 ring-brand-400/30" : "ring-0"
        )}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold leading-tight">
            {skill.name}
          </h3>
          {skill.stats && skill.stats.stars > 0 && (
            <p className="mt-1 text-xs text-brand-300">
              ⭐ {skill.stats.stars} {skill.stats.stars === 1 ? 'star' : 'stars'}
            </p>
          )}
        </div>
        <span className="text-xs text-white/60 whitespace-nowrap">
          Updated {new Date(skill.last_updated).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/75 line-clamp-2">{skill.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {skill.verticals.map((v) => (
          <span
            key={v}
            className="text-xs rounded-lg bg-white/10 px-2.5 py-1 text-white/80"
          >
            {v}
          </span>
        ))}
        {(skill.tags || []).slice(0, 3).map((t) => (
          <span key={t} className="text-xs rounded-lg bg-white/5 px-2.5 py-1 text-white/60">
            #{t}
          </span>
        ))}
      </div>
    </Link>
  );
}
