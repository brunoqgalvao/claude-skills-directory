import Link from "next/link";
import { slugify } from "@/lib/slug";

export default function VerticalPills({
  verticals,
  active
}: {
  verticals: { name: string; emoji?: string; count?: number }[];
  active?: string | null;
}) {
  const pill = (v: { name: string; emoji?: string; count?: number }) => {
    const slug = slugify(v.name);
    const selected = active && slug === active;
    return (
      <Link
        key={slug}
        href={`/v/${slug}`}
        className={[
          "whitespace-nowrap rounded-full border text-sm px-3 py-1.5 transition",
          selected
            ? "border-brand-400/50 bg-brand-400/20 text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
        ].join(" ")}
        aria-current={selected ? "page" : undefined}
      >
        <span className="mr-1">{v.emoji || "•"}</span>
        {v.name}
        {typeof v.count === "number" && (
          <span className="ml-2 text-white/60">{v.count}</span>
        )}
      </Link>
    );
  };

  return (
    <div className="scrollbar-none flex items-center gap-2 overflow-x-auto py-2">
      <Link
        href="/"
        className={[
          "whitespace-nowrap rounded-full border text-sm px-3 py-1.5 transition",
          !active ? "border-brand-400/50 bg-brand-400/20" : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
        ].join(" ")}
      >
        All
      </Link>
      {verticals.map(pill)}
    </div>
  );
}
