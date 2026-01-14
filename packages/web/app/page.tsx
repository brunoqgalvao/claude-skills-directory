import DirectoryClient from "@/components/DirectoryClient";
import VerticalPills from "@/components/VerticalPills";
import CliCta from "@/components/CliCta";
import { getAllSkills, getVerticalsWithCounts } from "@/lib/data";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

// Dynamic rendering to handle 18k+ skills
export const dynamic = "force-dynamic";

function HomeJsonLd({ skillCount, totalDownloads }: { skillCount: number; totalDownloads: number }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logomark.png`,
    description: SITE_DESCRIPTION,
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: skillCount,
      itemListElement: [],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
    </>
  );
}

export default async function HomePage() {
  const [skills, verticals] = await Promise.all([getAllSkills(), getVerticalsWithCounts()]);
  const totalDownloads = skills.reduce((acc, s) => acc + (s.stats?.installs || 0), 0);

  return (
    <>
      <HomeJsonLd skillCount={skills.length} totalDownloads={totalDownloads} />
      <div>
      <section className="text-center py-10">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Skills <span className="text-orange-500">Directory</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 font-light leading-relaxed">
          A high-quality directory of capabilities for your AI agents. 
          Standardized, portable, and ready to use with Claude Code.
        </p>
        <div className="mt-8 flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{skills.length.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Skills</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{totalDownloads.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Downloads</div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <CliCta />
      </div>

      <div className="mt-10">
        <VerticalPills verticals={verticals} active={null} />
      </div>

      <DirectoryClient allSkills={skills} />
      </div>
    </>
  );
}
