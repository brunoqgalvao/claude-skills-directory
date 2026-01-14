"use client";

import { useState } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Tab = "readme" | "skillmd" | "versions";

interface SkillTabsProps {
  description?: string;
  skillMdContent?: string;
  skillMdUrl?: string;
}

// Strip YAML frontmatter (---...---) from markdown content
function stripFrontmatter(content: string): string {
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n?/;
  return content.replace(frontmatterRegex, "");
}

// Strip the first H1 heading and optional description line from SKILL.md
// since we already display the skill name/summary in the page header
function stripLeadingHeader(content: string): string {
  // First strip frontmatter
  let cleaned = stripFrontmatter(content);

  const lines = cleaned.split("\n");
  let startIndex = 0;

  // Skip leading empty lines
  while (startIndex < lines.length && lines[startIndex].trim() === "") {
    startIndex++;
  }

  // Check if first non-empty line is an H1
  if (startIndex < lines.length && /^#\s+/.test(lines[startIndex])) {
    startIndex++;

    // Skip empty lines after the H1
    while (startIndex < lines.length && lines[startIndex].trim() === "") {
      startIndex++;
    }

    // If next line looks like a short description (no markdown, under 200 chars), skip it too
    if (
      startIndex < lines.length &&
      !lines[startIndex].startsWith("#") &&
      !lines[startIndex].startsWith("-") &&
      !lines[startIndex].startsWith("*") &&
      !lines[startIndex].startsWith("`") &&
      lines[startIndex].trim().length > 0 &&
      lines[startIndex].trim().length < 200
    ) {
      startIndex++;
    }
  }

  return lines.slice(startIndex).join("\n").trim();
}

export default function SkillTabs({ description, skillMdContent, skillMdUrl }: SkillTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("readme");
  const [mdContent, setMdContent] = useState<string | null>(skillMdContent || null);
  const [rawContent, setRawContent] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSkillMd = async () => {
    if (mdContent || !skillMdUrl) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(skillMdUrl);
      if (!res.ok) throw new Error("Failed to fetch SKILL.md");
      const text = await res.text();
      setRawContent(text);
      setMdContent(stripLeadingHeader(text));
    } catch (e) {
      setError("Could not load SKILL.md");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "skillmd") {
      loadSkillMd();
    }
  };

  const tabs: { id: Tab; label: string; disabled?: boolean }[] = [
    { id: "readme", label: "Readme" },
    { id: "skillmd", label: "SKILL.md", disabled: !skillMdUrl && !skillMdContent },
    { id: "versions", label: "Versions", disabled: true }
  ];

  return (
    <div>
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={clsx(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-gray-500 hover:text-foreground",
              tab.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {tab.label}
            {tab.id === "versions" && (
              <span className="ml-1 text-xs text-gray-400">(soon)</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "readme" && (
          <div className="prose prose-gray max-w-none prose-headings:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0">
            {description ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {description}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">No description provided.</p>
            )}
          </div>
        )}

        {activeTab === "skillmd" && (
          <div>
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading SKILL.md...
              </div>
            )}
            {error && <p className="text-red-600">{error}</p>}
            {mdContent && !loading && (
              <div className="relative">
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => setShowRaw(!showRaw)}
                    className={clsx(
                      "text-xs px-3 py-1.5 rounded-md border transition-colors",
                      showRaw
                        ? "bg-accent text-white border-accent"
                        : "bg-white text-gray-600 border-border hover:border-accent hover:text-accent"
                    )}
                  >
                    {showRaw ? "View rendered" : "View raw"}
                  </button>
                </div>
                {showRaw ? (
                  <pre className="bg-gray-50 border border-border rounded-lg p-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap text-gray-700">
                    {rawContent}
                  </pre>
                ) : (
                  <div className="prose prose-gray max-w-none prose-headings:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {mdContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "versions" && (
          <p className="text-gray-500 italic">Version history coming soon.</p>
        )}
      </div>
    </div>
  );
}
