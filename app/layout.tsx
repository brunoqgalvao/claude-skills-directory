import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Claude Skills Directory",
  description: "A fast, open-source directory of Claude Skills—search by vertical and discover how to install and use them.",
  openGraph: {
    title: "Claude Skills Directory",
    description: "Searchable, open-source directory of Claude Skills.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Skills Directory",
    description: "Searchable, open-source directory of Claude Skills."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 bg-white text-black px-3 py-2 rounded"
        >
          Skip to content
        </a>
        <Header />
        <main id="content" className="mx-auto max-w-6xl px-4 py-10 sm:py-12">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Claude Skills Directory</p>
            <p>
              Made with ♥ · <span className="text-white/80">MIT</span> · Contribute on{" "}
              <a className="underline hover:text-white" href="https://github.com/YOUR_GH_USER/claude-skills-directory" target="_blank">GitHub</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
