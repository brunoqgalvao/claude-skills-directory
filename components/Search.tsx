"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

export default function Search({
  value,
  onChange,
  placeholder = "Search skills (⌘/Ctrl + K)…"
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  // respond to global focus-search event
  useEffect(() => {
    const handler = () => ref.current?.focus();
    window.addEventListener("focus-search", handler);
    return () => window.removeEventListener("focus-search", handler);
  }, []);

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          "w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 pr-20 text-base placeholder:text-white/50",
          "focus:outline-none focus:ring-2 focus:ring-brand-400/60"
        )}
        aria-label="Search skills"
      />
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60">
        Press K
      </div>
    </div>
  );
}
