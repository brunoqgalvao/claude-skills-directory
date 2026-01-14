import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const url = `${SITE_URL}/blog/${params.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: post.image
        ? [{ url: post.image, alt: post.title }]
        : [{ url: "/og-image.png", alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : ["/og-image.png"],
    },
  };
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://skills.directory/blog/${slug}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-foreground transition-colors"
        title="Share on X"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-foreground transition-colors"
        title="Share on LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
      <a
        href={`https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-foreground transition-colors"
        title="Share on Hacker News"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 0v24h24V0H0zm12.3 13.27l-3.85-7.27h2.03l2.87 5.7 2.87-5.7h2.03l-3.85 7.27v4.73h-2.1v-4.73z" />
        </svg>
      </a>
    </div>
  );
}

function SocialQuotes({
  quotes,
}: {
  quotes: { author: string; handle: string; quote: string; platform: string }[];
}) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        What People Are Saying
      </h2>
      <div className="grid gap-4">
        {quotes.map((q, i) => (
          <blockquote
            key={i}
            className="bg-gray-50 border-l-4 border-amber-500 p-4 rounded-r"
          >
            <p className="text-gray-700 italic mb-2">&ldquo;{q.quote}&rdquo;</p>
            <footer className="text-sm text-gray-500">
              <span className="font-medium text-foreground">{q.author}</span>
              <span className="mx-1">&middot;</span>
              <span className="text-amber-600">@{q.handle}</span>
              <span className="mx-1">&middot;</span>
              <span>{q.platform}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function SourcesSection({
  sources,
}: {
  sources: { title: string; url: string }[];
}) {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="mt-12 pt-6 border-t border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Sources & Further Reading</h3>
      <ul className="space-y-2">
        {sources.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-amber-500 mt-1">→</span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:underline"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BlogPostJsonLd({
  post,
  slug,
}: {
  post: { title: string; excerpt: string; date: string; author?: string; image?: string };
  slug: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${slug}`,
    ...(post.image && { image: post.image }),
    author: {
      "@type": "Person",
      name: post.author || "Claude Skills Directory",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogPostJsonLd post={post} slug={params.slug} />
      <main className="min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-2xl px-6">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 font-mono">
              <time dateTime={post.date}>{post.date}</time>
              {post.author && (
                <>
                  <span className="mx-2">&middot;</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>
            <ShareButtons title={post.title} slug={params.slug} />
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-6 text-foreground">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 font-light leading-relaxed">
            {post.excerpt}
          </p>

          {post.image && (
            <div className="mt-8 rounded-lg overflow-hidden border border-border">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}
        </header>

        <div
          className="prose prose-gray prose-lg mx-auto prose-headings:font-semibold prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-lg prose-img:border prose-img:border-border"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <SourcesSection sources={post.sources || []} />

        <SocialQuotes quotes={post.socialQuotes || []} />

        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
          <Link
            href="/blog"
            className="text-gray-500 hover:text-foreground transition-colors"
          >
            ← Back to Blog
          </Link>
          <ShareButtons title={post.title} slug={params.slug} />
        </div>
      </article>
      </main>
    </>
  );
}
