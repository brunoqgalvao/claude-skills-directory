import { Metadata } from "next";
import { REPO_SLUG, SITE_NAME } from "@/lib/constants";

export const dynamic = "error";
export const revalidate = false;

export const metadata: Metadata = {
  title: `Share a Skill | ${SITE_NAME}`,
  description: "Submit your AI agent skill to the Skills Directory and share it with the community.",
};

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="mt-2 text-gray-600">{children}</div>
      </div>
    </div>
  );
}

export default function ShareSkillPage() {
  const issueUrl = `https://github.com/${REPO_SLUG}/issues/new?template=add-skill.yml`;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Share a <span className="text-orange-500">Skill</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Built something useful? Share your skill with the community and help other developers supercharge their AI agents.
      </p>

      {/* Requirements */}
      <section className="mt-10 rounded-2xl border border-border bg-muted p-6">
        <h2 className="text-xl font-semibold text-foreground">Requirements</h2>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">•</span>
            <span>A valid <code className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-sm">SKILL.md</code> file with instructions for the AI agent</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">•</span>
            <span>At least one link: repository, SKILL.md URL, docs, or demo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">•</span>
            <span>Choose up to 3 verticals that best describe your skill</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">•</span>
            <span>A concise summary (180 characters or less)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">•</span>
            <span>Unique ID in <code className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-sm">kebab-case</code></span>
          </li>
        </ul>
      </section>

      {/* How it works */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground mb-6">How it works</h2>
        <div className="space-y-6">
          <Step number={1} title="Create your skill">
            Build a skill with a <code className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-sm">SKILL.md</code> file containing instructions for the AI agent. Check out our <a href="/docs/cli" className="text-orange-600 hover:underline">CLI docs</a> for the skill structure.
          </Step>
          <Step number={2} title="Submit via GitHub">
            Open a GitHub issue using our template. Fill in the skill metadata, links, and a brief description.
          </Step>
          <Step number={3} title="Review & publish">
            Our maintainers will review your submission. Once approved, your skill will be live in the directory and installable via the CLI.
          </Step>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-orange-50 to-amber-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Ready to share?</h2>
        <p className="text-gray-600 mb-6">Submit your skill and join the growing community of skill authors.</p>
        <a
          href={issueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
        >
          Submit Skill on GitHub
        </a>
      </section>

      {/* Alternative: CLI publish */}
      <section className="mt-8 text-center text-sm text-gray-500">
        <p>
          Or use the CLI: <code className="text-orange-600 bg-orange-50 px-2 py-1 rounded">skill publish</code> from your skill directory
        </p>
      </section>
    </div>
  );
}
