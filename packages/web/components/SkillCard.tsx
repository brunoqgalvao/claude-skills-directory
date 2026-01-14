"use client";

import Link from "next/link";
import { Skill, getTrustTier, isTrending, isRising, TRUST_TIER_CONFIG } from "@/lib/types";
import clsx from "clsx";
import { useState, useMemo } from "react";

export default function SkillCard({ skill }: { skill: Skill }) {
  const [hover, setHover] = useState(false);
  const status = skill.status || "ready";

  // Calculate quality metrics
  const tier = useMemo(() => getTrustTier(skill), [skill]);
  const trending = useMemo(() => isTrending(skill), [skill]);
  const rising = useMemo(() => isRising(skill), [skill]);
  const tierConfig = TRUST_TIER_CONFIG[tier];

  return (
    <Link
      href={`/skill/${skill.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all duration-300",
        "hover:border-accent hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        tier === "gold" && "border-amber-200 bg-gradient-to-br from-amber-50/30 to-white"
      )}
    >
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent transition-opacity duration-300",
          hover ? "opacity-100" : "opacity-0"
        )}
        aria-hidden
      />

      {/* Trust tier badge - top right corner */}
      {tier !== "new" && (
        <div className="absolute top-3 right-3">
          <span
            className={clsx(
              "text-[10px] px-1.5 py-0.5 rounded-full border font-medium",
              tierConfig.color
            )}
            title={`${tierConfig.label} tier skill`}
          >
            {tierConfig.emoji}
          </span>
        </div>
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold leading-tight text-foreground group-hover:text-accent transition-colors truncate">
              {skill.name}
            </h3>
            {skill.verified && (
              <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {trending && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium shrink-0" title="Trending this week">
                🔥
              </span>
            )}
            {rising && !trending && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium shrink-0" title="Rising skill">
                📈
              </span>
            )}
            {status === "beta" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium shrink-0">
                Beta
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-500 truncate">
            by {skill.author.github ? `@${skill.author.github}` : skill.author.name}
          </p>
        </div>
      </div>

      <p className="relative mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed flex-grow">
        {skill.summary}
      </p>

      <div className="relative mt-4 flex items-center gap-4 text-xs text-gray-500">
        {skill.stats && (
          <>
            {skill.stats.stars > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {skill.stats.stars}
              </span>
            )}
            {skill.stats.installs > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {skill.stats.installs.toLocaleString()}
              </span>
            )}
            {skill.stats.forks > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {skill.stats.forks}
              </span>
            )}
          </>
        )}
      </div>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {skill.verticals.slice(0, 2).map((v) => (
          <span
            key={v}
            className="text-xs rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-accent font-medium"
          >
            {v}
          </span>
        ))}
        {(skill.tags || []).slice(0, 2).map((t) => (
          <span key={t} className="text-xs text-gray-400 px-1">
            #{t}
          </span>
        ))}
      </div>
    </Link>
  );
}
