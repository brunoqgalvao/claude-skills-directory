"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SortOption, SORT_OPTIONS } from "@/lib/types";
import Search from "@/components/Search";
import SkillCard from "@/components/SkillCard";
import type { SkillSummary } from "@/lib/data";

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const showPages = 5;

  if (totalPages <= showPages + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-border bg-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-colors"
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              p === currentPage
                ? "border-accent bg-accent text-white"
                : "border-border bg-white hover:border-accent"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-border bg-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

export default function DirectoryClient({
  initialSkills,
  initialQuery = "",
  currentPage,
  totalPages,
  totalSkills,
  defaultSort = "popular"
}: {
  initialSkills: SkillSummary[];
  initialQuery?: string;
  currentPage: number;
  totalPages: number;
  totalSkills: number;
  defaultSort?: SortOption;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);

  const handleSearch = (value: string) => {
    setQ(value);
    // Debounced navigation to search
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.delete("page"); // Reset to page 1 on search
      router.push(`/?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timeout);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sort the current page's skills client-side
  const sortedSkills = [...initialSkills].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.stats?.stars || 0) - (a.stats?.stars || 0);
      case "trending":
        return (b.stats?.installs_weekly || 0) - (a.stats?.installs_weekly || 0);
      case "verified":
        return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      case "recent":
        return +new Date(b.last_updated) - +new Date(a.last_updated);
      case "rising":
        const aRatio = (a.stats?.installs_weekly || 0) / Math.max(a.stats?.installs || 1, 1);
        const bRatio = (b.stats?.installs_weekly || 0) / Math.max(b.stats?.installs || 1, 1);
        return bRatio - aRatio;
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Search value={q} onChange={handleSearch} />
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
        <span>
          Showing {initialSkills.length} of {totalSkills.toLocaleString()} skills
          {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
        </span>
        {sortBy === "popular" && <span className="text-gray-400">• Sorted by stars</span>}
        {sortBy === "trending" && <span className="text-gray-400">• Skills with high weekly growth</span>}
        {sortBy === "verified" && <span className="text-gray-400">• Verified skills shown first</span>}
        {sortBy === "rising" && <span className="text-gray-400">• New skills gaining traction</span>}
        {sortBy === "recent" && <span className="text-gray-400">• Most recently updated</span>}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedSkills.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>

      {sortedSkills.length === 0 && (
        <div className="mt-10 rounded-xl border border-border bg-muted p-8 text-center text-gray-500">
          No results. Try a different keyword or a vertical page.
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
