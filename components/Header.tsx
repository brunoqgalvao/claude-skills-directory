"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { REPO_SLUG } from "@/lib/constants";

export default function Header() {
  const searchHotkeyRef = useRef<HTMLButtonElement>(null);

  // global "k" focuses search via a custom event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey || !e.ctrlKey && !e.metaKey)) {
        const evt = new CustomEvent("focus-search");
        window.dispatchEvent(evt);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const issueUrl = `https://github.com/${REPO_SLUG}/issues/new?template=add-skill.yml`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/5">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-emerald-400 ring-1 ring-white/20 shadow-card" />
          <div className="text-lg font-semibold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Claude Skills
            </span>{" "}
            <span className="text-white/50 group-hover:text-white/70 transition">Directory</span>
          </div>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/add"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition"
            aria-label="Add a Skill"
          >
            ➕ Add Skill
          </Link>
          <a
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition"
            href={`https://github.com/${REPO_SLUG}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View GitHub repository"
          >
            ⎇ GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
