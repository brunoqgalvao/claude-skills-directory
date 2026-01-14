import DirectoryClient from "@/components/DirectoryClient";
import VerticalPills from "@/components/VerticalPills";
import { getAllVerticals, getPaginatedSkills, getVerticalsWithCounts } from "@/lib/data";
import { slugify } from "@/lib/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

// Dynamic rendering for pagination
export const dynamic = "force-dynamic";

const SKILLS_PER_PAGE = 60;

export async function generateMetadata({ params }: { params: { vertical: string } }): Promise<Metadata> {
  const verticals = await getAllVerticals();
  const vertical = verticals.find((v) => slugify(v.name) === params.vertical);

  if (!vertical) {
    return { title: "Category Not Found" };
  }

  const displayName = vertical.name;
  const emoji = vertical.emoji || "";
  const title = `${emoji} ${displayName} Skills`.trim();
  const description = `Browse Claude Skills for ${displayName}. Find AI-powered tools and integrations for ${displayName.toLowerCase()} professionals.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/v/${params.vertical}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/v/${params.vertical}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function VerticalPage({
  params,
  searchParams
}: {
  params: { vertical: string };
  searchParams: { page?: string; q?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.q;

  const [verticals, { skills, total, pages }] = await Promise.all([
    getVerticalsWithCounts(),
    getPaginatedSkills(page, SKILLS_PER_PAGE, search, params.vertical)
  ]);

  const exists = verticals.some((v) => slugify(v.name) === params.vertical);
  if (!exists) notFound();

  return (
    <div>
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight capitalize">
          {params.vertical.replace(/-/g, " ")}
        </h1>
        <p className="mt-2 text-gray-500">
          Showing {total.toLocaleString()} skills in this vertical.
        </p>
      </section>

      <div className="mt-6">
        <VerticalPills verticals={verticals} active={params.vertical} />
      </div>

      <DirectoryClient
        initialSkills={skills}
        initialQuery={search || ""}
        currentPage={page}
        totalPages={pages}
        totalSkills={total}
      />
    </div>
  );
}
