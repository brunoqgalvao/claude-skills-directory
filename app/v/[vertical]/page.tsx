import DirectoryClient from "@/components/DirectoryClient";
import VerticalPills from "@/components/VerticalPills";
import { getAllSkills, getAllVerticals, getSkillsForVerticalSlug, getVerticalsWithCounts } from "@/lib/data";
import { slugify } from "@/lib/slug";
import { notFound } from "next/navigation";

export const dynamic = "error";
export const revalidate = false;

export async function generateStaticParams() {
  const verticals = await getAllVerticals();
  return verticals.map((v) => ({ vertical: slugify(v.name) }));
}

export default async function VerticalPage({ params }: { params: { vertical: string } }) {
  const [verticals, skills] = await Promise.all([
    getVerticalsWithCounts(),
    getSkillsForVerticalSlug(params.vertical)
  ]);

  const exists = verticals.some((v) => slugify(v.name) === params.vertical);
  if (!exists) notFound();

  // show only skills from this vertical; still allow search within them
  return (
    <div>
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight capitalize">
          {params.vertical.replace(/-/g, " ")}
        </h1>
        <p className="mt-2 text-white/70">
          Showing skills in this vertical. Use search to narrow further.
        </p>
      </section>

      <div className="mt-6">
        <VerticalPills verticals={verticals} active={params.vertical} />
      </div>

      <DirectoryClient allSkills={skills} />
    </div>
  );
}
