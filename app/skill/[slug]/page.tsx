import { getAllSkills, getSkillById } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "error";
export const revalidate = false;

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((s) => ({ slug: s.id }));
}

export default async function SkillDetailPage({ params }: { params: { slug: string } }) {
  const skill = await getSkillById(params.slug);
  if (!skill) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <header className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{skill.name}</h1>
            <p className="mt-1 text-sm text-white/60">
              by {skill.author.github ? (
                <a href={`https://github.com/${skill.author.github}`} target="_blank" className="text-brand-300 hover:text-brand-200">
                  @{skill.author.github}
                </a>
              ) : skill.author.name}
            </p>
          </div>
          {skill.stats && (
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-brand-300">{skill.stats.stars}</div>
                <div className="text-xs text-white/60">⭐ Stars</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">{skill.stats.installs}</div>
                <div className="text-xs text-white/60">📥 Installs</div>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-white/75">{skill.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {skill.installation && (
            <span className="text-xs rounded-lg bg-brand-400/20 border border-brand-400/30 px-2.5 py-1 text-brand-300">
              {skill.installation.type === 'git' ? '📦 Git' : skill.installation.type === 'npm' ? '📦 NPM' : '📄 Inline'}
            </span>
          )}
          {skill.verticals.map((v) => (
            <span key={v} className="text-xs rounded-lg bg-white/10 px-2.5 py-1 text-white/80">{v}</span>
          ))}
          {(skill.tags || []).map((t) => (
            <span key={t} className="text-xs rounded-lg bg-white/5 px-2.5 py-1 text-white/60">#{t}</span>
          ))}
          <span className="ml-auto text-xs text-white/60">
            Updated {new Date(skill.last_updated).toLocaleDateString()}
          </span>
        </div>
      </header>

      {/* Installation Section */}
      {skill.installation && (
        <section className="mt-6 rounded-xl border border-brand-400/20 bg-brand-400/5 p-6">
          <h2 className="text-lg font-semibold">Quick Install</h2>
          <p className="mt-2 text-sm text-white/75">
            Copy and run this command to install to your Claude Code:
          </p>
          {skill.installation.prerequisites && skill.installation.prerequisites.length > 0 && (
            <div className="mt-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
              <p className="text-xs font-semibold text-yellow-300">Prerequisites:</p>
              <ul className="mt-1 text-xs text-white/70 list-disc list-inside">
                {skill.installation.prerequisites.map((prereq, i) => (
                  <li key={i}>{prereq}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 rounded-lg bg-black/30 p-4 overflow-x-auto">
            <code className="text-sm text-white/90 break-all">
              {skill.installation.command || `npx @claude-skills/cli install ${skill.id}`}
            </code>
          </div>
          <p className="mt-3 text-xs text-white/60">
            Installs to <code className="bg-white/10 px-1.5 py-0.5 rounded">~/.claude/skills/{skill.id}/</code>
          </p>
        </section>
      )}

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {skill.links.repo && (
          <a className="rounded-xl border border-white/10 bg-white/10 p-4 hover:bg-white/20 transition" href={skill.links.repo} target="_blank">
            📦 Repository
            <div className="mt-1 text-sm text-white/70 break-all">{skill.links.repo}</div>
          </a>
        )}
        {skill.links.skill_md && (
          <a className="rounded-xl border border-white/10 bg-white/10 p-4 hover:bg-white/20 transition" href={skill.links.skill_md} target="_blank">
            📄 SKILL.md
            <div className="mt-1 text-sm text-white/70 break-all">{skill.links.skill_md}</div>
          </a>
        )}
        {skill.links.docs && (
          <a className="rounded-xl border border-white/10 bg-white/10 p-4 hover:bg-white/20 transition" href={skill.links.docs} target="_blank">
            📚 Docs
            <div className="mt-1 text-sm text-white/70 break-all">{skill.links.docs}</div>
          </a>
        )}
        {skill.links.demo && (
          <a className="rounded-xl border border-white/10 bg-white/10 p-4 hover:bg-white/20 transition" href={skill.links.demo} target="_blank">
            ▶️ Demo
            <div className="mt-1 text-sm text-white/70 break-all">{skill.links.demo}</div>
          </a>
        )}
      </section>

      <div className="mt-8">
        <Link href="/" className="underline text-white/80 hover:text-white">← Back to all skills</Link>
      </div>
    </article>
  );
}
