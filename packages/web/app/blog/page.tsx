import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export default function BlogIndex() {
  const posts = getBlogPosts();

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Blog</h1>
          <p className="text-gray-600 text-lg">
            Thoughts on the evolution of AI agents and the future of skills.
          </p>
        </header>

        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500 font-mono">
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                <h2 className="text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="text-amber-600 text-sm font-medium group-hover:underline">
                  Read more &rarr;
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
