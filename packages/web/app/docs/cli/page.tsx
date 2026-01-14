import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "error";
export const revalidate = false;

export const metadata: Metadata = {
  title: `Skill CLI - The Package Manager for AI Agents | ${SITE_NAME}`,
  description: "Install skills in seconds. Give your AI agent superpowers with one command.",
};

function Terminal({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        {title && <span className="ml-2 text-xs text-gray-500 font-mono">{title}</span>}
      </div>
      <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

function TerminalLine({ prompt = "$", children, dim = false }: { prompt?: string; children: React.ReactNode; dim?: boolean }) {
  return (
    <div className={`flex gap-2 ${dim ? "text-gray-600" : "text-gray-300"}`}>
      <span className="text-green-400 select-none">{prompt}</span>
      <span>{children}</span>
    </div>
  );
}

function TerminalOutput({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-gray-400 pl-4 ${className}`}>{children}</div>;
}

function HighlightText({ children, color = "orange" }: { children: React.ReactNode; color?: "orange" | "green" | "blue" | "yellow" | "gray" }) {
  const colors = {
    orange: "text-orange-400",
    green: "text-green-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    gray: "text-gray-500",
  };
  return <span className={colors[color]}>{children}</span>;
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-5 hover:border-orange-500/30 transition-colors">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function UseCaseSection({
  title,
  subtitle,
  problem,
  solution,
  terminal
}: {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  terminal: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      <div>
        <div className="text-sm font-medium text-orange-500 mb-2">{subtitle}</div>
        <h3 className="text-2xl font-bold text-foreground mb-4">{title}</h3>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">The problem</div>
            <p className="text-gray-600">{problem}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">The solution</div>
            <p className="text-gray-600">{solution}</p>
          </div>
        </div>
      </div>
      <div>{terminal}</div>
    </div>
  );
}

export default function CliDocsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Now available
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          One command.<br />
          <span className="text-orange-500">Infinite capabilities.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Stop copy-pasting prompts. Stop configuring agents manually.
          Install battle-tested skills and watch your AI agent level up instantly.
        </p>

        {/* Quick install */}
        <div className="max-w-lg mx-auto">
          <Terminal title="Terminal">
            <TerminalLine>npm install -g <HighlightText>@skills/cli</HighlightText></TerminalLine>
          </Terminal>
        </div>
      </div>

      {/* Before/After */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">Before vs After</h2>
          <p className="text-gray-600">See what changes when you use the Skill CLI</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div>
            <div className="text-sm font-medium text-red-500 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs">✗</span>
              Without Skill CLI
            </div>
            <Terminal title="the-old-way.md">
              <div className="text-gray-500 text-xs space-y-2">
                <p># Step 1: Find a skill on GitHub</p>
                <p># Step 2: Read the README</p>
                <p># Step 3: Copy the SKILL.md content</p>
                <p># Step 4: Create .claude/skills/my-skill/</p>
                <p># Step 5: Paste and save as SKILL.md</p>
                <p># Step 6: Hope you got the path right</p>
                <p># Step 7: Restart Claude Code</p>
                <p># Step 8: Pray it works</p>
                <p className="text-red-400 mt-4"># Time spent: 15 minutes</p>
                <p className="text-red-400"># Chance of error: High</p>
              </div>
            </Terminal>
          </div>

          {/* After */}
          <div>
            <div className="text-sm font-medium text-green-500 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</span>
              With Skill CLI
            </div>
            <Terminal title="Terminal">
              <TerminalLine>skill install invoice-extractor</TerminalLine>
              <TerminalOutput className="mt-2">
                <div className="text-green-400">✓ Installed invoice-extractor to .claude/skills/</div>
                <div className="text-gray-500 mt-1">Ready to use. Just ask Claude!</div>
              </TerminalOutput>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-green-400 text-xs"># Time spent: 3 seconds</p>
                <p className="text-green-400 text-xs"># Chance of error: Zero</p>
              </div>
            </Terminal>
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className="mb-20 space-y-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Real-World Examples</h2>
          <p className="text-gray-600">See the CLI in action with actual use cases</p>
        </div>

        {/* Example 1: Finance Team */}
        <UseCaseSection
          subtitle="Finance & Accounting"
          title="Process 500 invoices in minutes"
          problem="Your AR team manually extracts data from PDF invoices. It takes hours, and errors cost money."
          solution="Install the invoice-extractor skill. Point Claude at a folder of PDFs. Get a clean CSV ready for your ERP."
          terminal={
            <Terminal title="Terminal">
              <TerminalLine>skill install invoice-extractor</TerminalLine>
              <TerminalOutput className="mt-1 text-green-400">✓ Installed invoice-extractor</TerminalOutput>
              <div className="mt-4" />
              <TerminalLine dim>cd ~/invoices</TerminalLine>
              <TerminalLine dim>claude</TerminalLine>
              <div className="mt-3 pl-4 text-gray-500 italic text-xs">
                "Extract all invoices in this folder to a CSV with vendor, amount, date, and invoice number"
              </div>
              <div className="mt-3" />
              <TerminalOutput>
                <HighlightText color="blue">Claude:</HighlightText> I'll use the invoice-extractor skill to process these 47 PDFs...
              </TerminalOutput>
              <TerminalOutput className="mt-2">
                <HighlightText color="green">✓</HighlightText> Exported to invoices-2024.csv (47 rows)
              </TerminalOutput>
            </Terminal>
          }
        />

        {/* Example 2: Legal Team */}
        <UseCaseSection
          subtitle="Legal & Compliance"
          title="Research case law in seconds"
          problem="Associates spend hours searching for relevant precedents. Senior partners wait. Billable time burns."
          solution="Install legal-research-assistant. Ask Claude to find cases. Get citations formatted for your motion."
          terminal={
            <Terminal title="Terminal">
              <TerminalLine>skill install legal-research-assistant</TerminalLine>
              <TerminalOutput className="mt-1 text-green-400">✓ Installed legal-research-assistant</TerminalOutput>
              <div className="mt-4" />
              <TerminalLine dim>claude</TerminalLine>
              <div className="mt-3 pl-4 text-gray-500 italic text-xs">
                "Find California precedents on breach of fiduciary duty in startup acquisitions"
              </div>
              <div className="mt-3" />
              <TerminalOutput>
                <HighlightText color="blue">Claude:</HighlightText> Using legal-research-assistant to search case law...
              </TerminalOutput>
              <TerminalOutput className="mt-2 space-y-1">
                <div><HighlightText color="yellow">1.</HighlightText> In re Dole Food Co. (Del. Ch. 2015)</div>
                <div><HighlightText color="yellow">2.</HighlightText> Gesoff v. IIC Industries (Del. Ch. 2000)</div>
                <div><HighlightText color="yellow">3.</HighlightText> PLX Technology Inc. (Del. Ch. 2018)</div>
                <div className="text-gray-500 text-xs mt-2">+ 12 more relevant cases with full citations</div>
              </TerminalOutput>
            </Terminal>
          }
        />

        {/* Example 3: Support Team */}
        <UseCaseSection
          subtitle="Customer Support"
          title="Triage 1000 tickets automatically"
          problem="Support tickets pile up. Wrong routing means angry customers. Your team drowns in backlog."
          solution="Install cs-ticket-triage. Feed it your ticket export. Get instant classification and routing suggestions."
          terminal={
            <Terminal title="Terminal">
              <TerminalLine>skill install cs-ticket-triage</TerminalLine>
              <TerminalOutput className="mt-1 text-green-400">✓ Installed cs-ticket-triage</TerminalOutput>
              <div className="mt-4" />
              <TerminalLine dim>claude</TerminalLine>
              <div className="mt-3 pl-4 text-gray-500 italic text-xs">
                "Classify these support tickets by urgency and route to the right team"
              </div>
              <div className="mt-3" />
              <TerminalOutput>
                <HighlightText color="blue">Claude:</HighlightText> Analyzing 1,247 tickets using cs-ticket-triage...
              </TerminalOutput>
              <TerminalOutput className="mt-2 space-y-1">
                <div><HighlightText color="orange">●</HighlightText> 23 Critical → Escalations Team</div>
                <div><HighlightText color="yellow">●</HighlightText> 156 High → Tier 2 Support</div>
                <div><HighlightText color="green">●</HighlightText> 891 Standard → Tier 1 Support</div>
                <div><HighlightText color="gray">●</HighlightText> 177 Auto-resolve → Knowledge Base</div>
              </TerminalOutput>
            </Terminal>
          }
        />
      </section>

      {/* Feature Grid */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">Why teams love it</h2>
          <p className="text-gray-600">Built for developers who value their time</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon="⚡"
            title="3-Second Installs"
            description="No config files. No manual setup. Just install and use."
          />
          <FeatureCard
            icon="🔄"
            title="Auto Updates"
            description="Skills update themselves. Always get the latest improvements."
          />
          <FeatureCard
            icon="📦"
            title="Offline Ready"
            description="Skills are stored locally. Work without internet."
          />
          <FeatureCard
            icon="🔒"
            title="Version Pinning"
            description="Lock to specific versions for reproducible results."
          />
          <FeatureCard
            icon="🌍"
            title="Global or Local"
            description="Install per-project or share across all your work."
          />
          <FeatureCard
            icon="🛠️"
            title="Extensible"
            description="Create and publish your own skills to the registry."
          />
        </div>
      </section>

      {/* Command Reference */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">Command Reference</h2>
          <p className="text-gray-600">Everything you need, nothing you don't</p>
        </div>

        <div className="space-y-4">
          {/* Install */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-3 border-b border-border">
              <code className="text-orange-500 font-semibold">skill install &lt;name&gt;</code>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">Install a skill from the registry, git URL, or local path.</p>
              <Terminal>
                <TerminalLine>skill install invoice-extractor</TerminalLine>
                <TerminalLine dim>skill install https://github.com/acme/custom-skill</TerminalLine>
                <TerminalLine dim>skill install ./my-local-skill</TerminalLine>
                <TerminalLine dim>skill install -g legal-research <HighlightText color="gray"># global install</HighlightText></TerminalLine>
              </Terminal>
            </div>
          </div>

          {/* Search */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-3 border-b border-border">
              <code className="text-orange-500 font-semibold">skill search &lt;query&gt;</code>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">Find skills in the registry by keyword, tag, or description.</p>
              <Terminal>
                <TerminalLine>skill search invoice</TerminalLine>
                <TerminalOutput className="mt-2 space-y-2">
                  <div>
                    <HighlightText color="orange">invoice-extractor</HighlightText>
                    <span className="text-gray-500"> - Parse PDFs and export to CSV</span>
                    <span className="text-gray-600 text-xs ml-2">★ 89 · 987 installs</span>
                  </div>
                  <div>
                    <HighlightText color="orange">invoice-generator</HighlightText>
                    <span className="text-gray-500"> - Create professional invoices</span>
                    <span className="text-gray-600 text-xs ml-2">★ 45 · 432 installs</span>
                  </div>
                </TerminalOutput>
              </Terminal>
            </div>
          </div>

          {/* List */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-3 border-b border-border">
              <code className="text-orange-500 font-semibold">skill list</code>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">See all installed skills with version and location info.</p>
              <Terminal>
                <TerminalLine>skill list</TerminalLine>
                <TerminalOutput className="mt-2 space-y-1">
                  <div className="text-gray-500 text-xs">LOCAL (.claude/skills/)</div>
                  <div>  <HighlightText color="green">●</HighlightText> invoice-extractor <HighlightText color="gray">v1.2.0</HighlightText></div>
                  <div>  <HighlightText color="green">●</HighlightText> cs-ticket-triage <HighlightText color="gray">v2.0.1</HighlightText></div>
                  <div className="mt-2 text-gray-500 text-xs">GLOBAL (~/.claude/skills/)</div>
                  <div>  <HighlightText color="blue">●</HighlightText> legal-research-assistant <HighlightText color="gray">v1.5.0</HighlightText></div>
                </TerminalOutput>
              </Terminal>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-3 border-b border-border">
              <code className="text-orange-500 font-semibold">skill info &lt;name&gt;</code>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">Get detailed information about a skill.</p>
              <Terminal>
                <TerminalLine>skill info invoice-extractor</TerminalLine>
                <TerminalOutput className="mt-2 space-y-1">
                  <div><HighlightText color="orange">invoice-extractor</HighlightText> v1.2.0</div>
                  <div className="text-gray-500">Parse PDFs and export key fields to CSV for AR teams</div>
                  <div className="mt-2">
                    <span className="text-gray-600">Author:</span> FinanceAI
                  </div>
                  <div>
                    <span className="text-gray-600">License:</span> MIT
                  </div>
                  <div>
                    <span className="text-gray-600">Stars:</span> 89 · <span className="text-gray-600">Installs:</span> 987
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600">Tags:</span> <HighlightText color="blue">pdf</HighlightText> <HighlightText color="blue">ocr</HighlightText> <HighlightText color="blue">finance</HighlightText>
                  </div>
                </TerminalOutput>
              </Terminal>
            </div>
          </div>

          {/* More commands */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-5">
              <code className="text-orange-500 font-semibold">skill update</code>
              <p className="text-gray-600 text-sm mt-2">Update all skills or a specific skill to the latest version.</p>
            </div>
            <div className="rounded-xl border border-border p-5">
              <code className="text-orange-500 font-semibold">skill uninstall &lt;name&gt;</code>
              <p className="text-gray-600 text-sm mt-2">Remove an installed skill from local or global scope.</p>
            </div>
            <div className="rounded-xl border border-border p-5">
              <code className="text-orange-500 font-semibold">skill init</code>
              <p className="text-gray-600 text-sm mt-2">Scaffold a new skill with SKILL.md and skill.json templates.</p>
            </div>
            <div className="rounded-xl border border-border p-5">
              <code className="text-orange-500 font-semibold">skill publish</code>
              <p className="text-gray-600 text-sm mt-2">Publish your skill to the registry for others to use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Install Locations */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">Where skills live</h2>
          <p className="text-gray-600">Local for project-specific, global for everywhere</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg">📁</div>
              <div>
                <div className="font-semibold text-foreground">Local Skills</div>
                <code className="text-xs text-gray-500">./.claude/skills/</code>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Project-specific skills that live in your repo. Great for team-shared skills or project-specific workflows.
            </p>
            <Terminal>
              <TerminalLine>skill install invoice-extractor</TerminalLine>
              <TerminalOutput className="text-xs mt-1 text-gray-500">→ .claude/skills/invoice-extractor/</TerminalOutput>
            </Terminal>
          </div>
          <div className="rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-lg">🌍</div>
              <div>
                <div className="font-semibold text-foreground">Global Skills</div>
                <code className="text-xs text-gray-500">~/.claude/skills/</code>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Available in all your projects. Perfect for general-purpose skills you use everywhere.
            </p>
            <Terminal>
              <TerminalLine>skill install -g legal-research</TerminalLine>
              <TerminalOutput className="text-xs mt-1 text-gray-500">→ ~/.claude/skills/legal-research/</TerminalOutput>
            </Terminal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-10 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">Ready to supercharge your AI agent?</h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Join thousands of developers who've already upgraded their workflow.
          Install the CLI and give your agent new superpowers in seconds.
        </p>
        <div className="max-w-md mx-auto mb-8">
          <Terminal>
            <TerminalLine>npm install -g <HighlightText>@skills/cli</HighlightText></TerminalLine>
          </Terminal>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.npmjs.com/package/@skills/cli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
          >
            Download CLI
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-orange-300 bg-white px-6 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors"
          >
            Browse Skills
          </a>
          <a
            href="https://github.com/skills-directory/skill-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-3 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
