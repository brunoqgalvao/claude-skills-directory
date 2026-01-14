import Link from "next/link";
import { slugify } from "@skills/shared";

interface VerticalTagsProps {
  verticals: string[];
  tags?: string[];
}

export default function VerticalTags({ verticals, tags }: VerticalTagsProps) {
  return (
    <div className="rounded-lg border border-border bg-gray-50 p-3">
      <div className="text-xs font-medium text-gray-500 mb-2">Categories</div>
      <div className="flex flex-wrap gap-1.5">
        {verticals.map((v) => (
          <Link
            key={v}
            href={`/v/${slugify(v)}`}
            className="text-xs rounded-full bg-accent/10 border border-accent/30 px-2.5 py-1 text-accent font-medium hover:bg-accent/20 transition-colors"
          >
            {v}
          </Link>
        ))}
      </div>
      {tags && tags.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-500 mt-3 mb-2">Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs rounded-full bg-gray-100 border border-gray-200 px-2.5 py-1 text-gray-600"
              >
                #{t}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
