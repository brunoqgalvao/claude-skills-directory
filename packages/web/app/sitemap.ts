import { MetadataRoute } from "next";
import { getAllSkills, getAllVerticals } from "@/lib/data";
import { getBlogPosts } from "@/lib/blog";
import { slugify } from "@/lib/types";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [skills, verticals] = await Promise.all([
    getAllSkills(),
    getAllVerticals(),
  ]);
  const blogPosts = getBlogPosts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/add`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const skillPages: MetadataRoute.Sitemap = skills.map((skill) => ({
    url: `${SITE_URL}/skill/${skill.id}`,
    lastModified: new Date(skill.last_updated),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const verticalPages: MetadataRoute.Sitemap = verticals.map((v) => ({
    url: `${SITE_URL}/v/${slugify(v.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...skillPages, ...verticalPages, ...blogPages];
}
