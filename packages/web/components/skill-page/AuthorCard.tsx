import type { Author, Attribution, Collaborator } from "@skills/shared";

interface AuthorCardProps {
  author: Author;
  attribution?: Attribution;
  collaborators?: Collaborator[];
}

function Avatar({ name, avatar, github }: { name: string; avatar?: string; github?: string }) {
  const src = avatar || (github ? `https://github.com/${github}.png` : null);
  const initials = name.slice(0, 2).toUpperCase();
  
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-xs font-medium text-gray-600">
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default function AuthorCard({ author, attribution, collaborators }: AuthorCardProps) {
  const authorUrl = author.url || (author.github ? `https://github.com/${author.github}` : null);

  return (
    <div className="rounded-lg border border-border bg-gray-50 p-3 space-y-3">
      <div>
        <div className="text-xs font-medium text-gray-500 mb-2">Author</div>
        <div className="flex items-center gap-2">
          <Avatar name={author.name} avatar={author.avatar} github={author.github} />
          <div className="min-w-0">
            {authorUrl ? (
              <a
                href={authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors truncate block"
              >
                {author.github ? `@${author.github}` : author.name}
              </a>
            ) : (
              <span className="text-sm font-medium text-foreground truncate block">
                {author.name}
              </span>
            )}
            {attribution && (
              <span className="text-xs text-gray-500 truncate block">
                via{" "}
                {attribution.url ? (
                  <a href={attribution.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {attribution.source}
                  </a>
                ) : (
                  attribution.source
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {collaborators && collaborators.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-500 mb-2">Collaborators</div>
          <div className="flex -space-x-2">
            {collaborators.slice(0, 5).map((c, i) => (
              <a
                key={i}
                href={c.github ? `https://github.com/${c.github}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                title={c.name}
                className="relative hover:z-10 transition-transform hover:scale-110"
              >
                <Avatar name={c.name} avatar={c.avatar} github={c.github} />
              </a>
            ))}
            {collaborators.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                +{collaborators.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
