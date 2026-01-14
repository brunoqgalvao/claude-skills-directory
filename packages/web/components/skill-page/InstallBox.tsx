"use client";

import { useState } from "react";

export default function InstallBox({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-gray-50 p-3">
      <div className="text-xs font-medium text-gray-500 mb-2">Install</div>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm font-mono text-foreground bg-white border border-border rounded px-3 py-2 overflow-x-auto">
          {command}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 p-2 rounded border border-border bg-white hover:bg-gray-50 hover:border-accent transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
