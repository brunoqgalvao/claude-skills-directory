import { getAllSkills, getSkillById } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  StatusBadge,
  VerifiedBadge,
  InstallBox,
  StatsDisplay,
  AuthorCard,
  ActionButtons,
  SkillTabs,
  SidebarMeta,
  VerticalTags
} from "@/components/skill-page";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import LikeButton from "@/components/LikeButton";
import Comments from "@/components/Comments";

// Using dynamic rendering for auth features (likes, comments)
// No generateStaticParams - we have 18k+ skills, render on-demand
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const skill = await getSkillById(params.slug);
  if (!skill) return { title: "Skill Not Found" };

  const url = `${SITE_URL}/skill/${skill.id}`;
  const title = `${skill.name} - Claude Skill`;

  return {
    title,
    description: skill.summary,
    keywords: [skill.name, ...skill.verticals, ...(skill.tags || []), "Claude Skill", "AI Agent"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: skill.summary,
      url,
      type: "website",
      images: [{ url: "/og-image.png", alt: skill.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: skill.summary,
    },
  };
}

function SkillJsonLd({ skill }: { skill: Awaited<ReturnType<typeof getSkillById>> }) {
  if (!skill) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.summary,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: skill.author.name,
      ...(skill.author.url && { url: skill.author.url }),
    },
    softwareVersion: skill.version || "1.0.0",
    license: skill.license || "MIT",
    ...(skill.links.repo && { codeRepository: skill.links.repo }),
    ...(skill.links.homepage && { url: skill.links.homepage }),
    ...(skill.stats?.installs && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        ratingCount: skill.stats.installs,
      },
    }),
    dateModified: skill.last_updated,
    ...(skill.created_at && { datePublished: skill.created_at }),
    keywords: [...skill.verticals, ...(skill.tags || [])].join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function SkillDetailPage({ params }: { params: { slug: string } }) {
  const skill = await getSkillById(params.slug);
  if (!skill) notFound();

  const installCommand = skill.installation?.command || `npx @skills/cli add ${skill.id}`;
  const version = skill.version || "1.0.0";
  const status = skill.status || "ready";
  const license = skill.license || "MIT";

  return (
    <>
      <SkillJsonLd skill={skill} />
      <div className="max-w-6xl mx-auto">
        <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-accent transition-colors">
          ← Back to all skills
        </Link>
      </nav>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-foreground">{skill.name}</h1>
          {skill.verified && <VerifiedBadge />}
          <StatusBadge status={status} />
          <LikeButton skillId={skill.id} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span className="font-mono">{version}</span>
          <span>•</span>
          <span className="capitalize">{skill.visibility || "public"}</span>
          <span>•</span>
          <span>Updated {new Date(skill.last_updated).toLocaleDateString()}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <main>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="mb-6">
              <p className="text-gray-600 text-lg">{skill.summary}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {skill.installation && (
                <span className="text-xs rounded-full bg-accent/10 border border-accent/30 px-2.5 py-1 text-accent font-medium">
                  {skill.installation.type === "git" ? "Git" : skill.installation.type === "npm" ? "NPM" : skill.installation.type === "cli" ? "CLI" : "Inline"}
                </span>
              )}
              {skill.verticals.map((v) => (
                <span key={v} className="text-xs rounded-full bg-muted border border-border px-2.5 py-1 text-gray-600">
                  {v}
                </span>
              ))}
              {skill.setup_time && (
                <span className="text-xs rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-emerald-700">
                  ~{skill.setup_time}
                </span>
              )}
            </div>

            {skill.installation && (
              <div className="mb-6">
                <InstallBox command={installCommand} />
              </div>
            )}

            <SkillTabs
              description={skill.description}
              skillMdUrl={skill.links.skill_md}
            />
          </div>

          <div className="mt-8">
            <Comments skillId={skill.id} />
          </div>
        </main>

        <aside className="space-y-4">
          <InstallBox command={installCommand} />

          {skill.stats && (
            <StatsDisplay
              installs={skill.stats.installs || 0}
              installsWeekly={skill.stats.installs_weekly}
            />
          )}

          <SidebarMeta
            version={version}
            license={license}
            setupTime={skill.setup_time}
            lastUpdated={skill.last_updated}
            stars={skill.stats?.stars}
            forks={skill.stats?.forks}
            repoUrl={skill.links.repo}
            docsUrl={skill.links.docs}
            homepageUrl={skill.links.homepage}
          />

          <AuthorCard
            author={skill.author}
            attribution={skill.attribution}
            collaborators={skill.collaborators}
          />

          <VerticalTags verticals={skill.verticals} tags={skill.tags} />

          <ActionButtons repoUrl={skill.links.repo} skillId={skill.id} skillName={skill.name} />
        </aside>
      </div>
      </div>
    </>
  );
}
