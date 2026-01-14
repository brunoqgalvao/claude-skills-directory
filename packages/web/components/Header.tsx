"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { REPO_SLUG } from "@/lib/constants";
import UserMenu from "./UserMenu";

export default function Header() {
  // global "k" focuses search via a custom event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        const evt = new CustomEvent("focus-search");
        window.dispatchEvent(evt);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-2">
          <Image
            src="/logomark.png"
            alt="Agent Skills"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <span className="text-lg font-medium tracking-wide text-foreground">
            Agent <span className="text-orange-500">Skills</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/docs/cli"
            className="text-sm text-gray-500 hover:text-foreground transition-colors"
          >
            CLI Docs
          </Link>
          <a
            href="https://www.npmjs.com/package/@skills/cli"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            Download CLI
          </a>
          <Link
            href="/blog"
            className="text-sm text-gray-500 hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/add"
            className="hidden sm:inline-flex text-sm text-gray-500 hover:text-foreground transition-colors"
          >
            Share Skill
          </Link>
          <a
            className="text-sm text-gray-500 hover:text-foreground transition-colors"
            href={`https://github.com/${REPO_SLUG}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
