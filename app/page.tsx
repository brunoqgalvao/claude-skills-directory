import DirectoryClient from "@/components/DirectoryClient";
import VerticalPills from "@/components/VerticalPills";
import { getAllSkills, getVerticalsWithCounts } from "@/lib/data";

export const dynamic = "error";
export const revalidate = false;

export default async function HomePage() {
  const [skills, verticals] = await Promise.all([getAllSkills(), getVerticalsWithCounts()]);
  return (
    <div>
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Discover <span className="text-brand-300">Claude Skills</span>
        </h1>
        <p className="mt-2 text-white/70">
          Browse community skills by vertical. Install quickly. Contribute yours.
        </p>
      </section>

      <div className="mt-6">
        <VerticalPills verticals={verticals} active={null} />
      </div>

      <DirectoryClient allSkills={skills} />
    </div>
  );
}
