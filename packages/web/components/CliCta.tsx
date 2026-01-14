"use client";

import { useState } from "react";
import { Terminal, Copy, Check, ArrowRight } from "lucide-react";

interface CliCtaProps {
  command?: string;
  tagline?: string;
}

export default function CliCta({
  command = "npm install -g @skills/cli",
  tagline = "The package manager for AI agent skills"
}: CliCtaProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8">
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">Skill CLI</h3>
          </div>
          <p className="text-gray-400 mb-4">{tagline}</p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-orange-400">$</span> skill install
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1">
              <span className="text-orange-400">$</span> skill search
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1">
              <span className="text-orange-400">$</span> skill publish
            </span>
          </div>
        </div>

        <div className="w-full sm:w-auto flex flex-col gap-3">
          <button
            onClick={handleCopy}
            className="group flex items-center gap-3 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 font-mono text-sm text-gray-300 transition-all hover:border-orange-500/50 hover:bg-gray-750"
          >
            <span className="text-orange-400">$</span>
            <span className="flex-1 text-left">{command}</span>
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-300" />
            )}
          </button>

          <a
            href="/docs/cli"
            className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
