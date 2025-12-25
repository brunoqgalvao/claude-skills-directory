import { REPO_SLUG } from "@/lib/constants";

export const dynamic = "error";
export const revalidate = false;

export default function AddPage() {
  const issueUrl = `https://github.com/${REPO_SLUG}/issues/new?template=add-skill.yml`;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold">Add a Skill</h1>
      <p className="mt-2 text-white/70">
        Submit your Claude Skill using our GitHub Issue form. Maintainers will review and merge it into the directory.
      </p>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Requirements</h2>
        <ul className="mt-3 list-disc pl-5 text-white/80 space-y-1">
          <li>Claude-only (for now).</li>
          <li>Include at least one link: repository, SKILL.md, docs, or demo.</li>
          <li>Choose ≤3 verticals, concise summary (≤180 chars).</li>
          <li>Use a unique ID (lowercase, <code>kebab-case</code>).</li>
        </ul>
        <a
          href={issueUrl}
          className="mt-6 inline-flex items-center rounded-xl border border-brand-400/40 bg-brand-400/20 px-4 py-2 text-white hover:bg-brand-400/30 transition"
          target="_blank"
        >
          ➕ Open Issue Form
        </a>
      </section>
    </div>
  );
}
