import type { Skill } from "@skills/shared";

interface SidebarMetaProps {
  version: string;
  license: string;
  setupTime?: string;
  lastUpdated: string;
  stars?: number;
  forks?: number;
  repoUrl?: string;
  docsUrl?: string;
  homepageUrl?: string;
}

function MetaItem({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-foreground hover:text-accent transition-colors truncate max-w-[60%] text-right"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm font-medium text-foreground truncate max-w-[60%] text-right">
          {value}
        </span>
      )}
    </div>
  );
}

function LinkItem({ label, url, icon }: { label: string; url: string; icon: React.ReactNode }) {
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 py-2 border-b border-border last:border-0 group"
    >
      <span className="text-gray-400 group-hover:text-accent transition-colors">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-foreground group-hover:text-accent transition-colors truncate">
          {displayUrl}
        </div>
      </div>
    </a>
  );
}

export default function SidebarMeta({
  version,
  license,
  setupTime,
  lastUpdated,
  stars,
  forks,
  repoUrl,
  docsUrl,
  homepageUrl
}: SidebarMetaProps) {
  return (
    <div className="space-y-4">
      {repoUrl && (
        <div className="rounded-lg border border-border bg-gray-50 p-3">
          <LinkItem
            label="Repository"
            url={repoUrl}
            icon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            }
          />
          {(stars !== undefined || forks !== undefined) && (
            <div className="flex gap-4 mt-2 pt-2 border-t border-border">
              {stars !== undefined && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {stars.toLocaleString()}
                </div>
              )}
              {forks !== undefined && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {forks.toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {homepageUrl && (
        <div className="rounded-lg border border-border bg-gray-50 p-3">
          <LinkItem
            label="Homepage"
            url={homepageUrl}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          />
        </div>
      )}

      {docsUrl && (
        <div className="rounded-lg border border-border bg-gray-50 p-3">
          <LinkItem
            label="Documentation"
            url={docsUrl}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>
      )}

      <div className="rounded-lg border border-border bg-gray-50 p-3">
        <MetaItem label="Version" value={version} />
        <MetaItem label="License" value={license} />
        {setupTime && <MetaItem label="Setup time" value={`~${setupTime}`} />}
        <MetaItem label="Last updated" value={new Date(lastUpdated).toLocaleDateString()} />
      </div>
    </div>
  );
}
