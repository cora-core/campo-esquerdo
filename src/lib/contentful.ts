import { createClient } from "contentful";
import type { BlogPost, BlogPostEntry, BlogPostFields } from "@/lib/blog";
import { mapContentfulBlogPost } from "@/lib/blog";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  throw new Error(
    "Missing Contentful environment variables. Set NEXT_PUBLIC_CONTENTFUL_SPACE_ID and NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN in .env.local."
  );
}

const client = createClient({
  space: spaceId,
  accessToken,
});

const BLOG_POST_CONTENT_TYPE = "blogPost";

type ContentfulCollectionItem = {
  fields: BlogPostFields;
};

const mapEntries = (items: ContentfulCollectionItem[]) =>
  items.map((entry) => mapContentfulBlogPost(entry as BlogPostEntry));

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await client.getEntries({
    content_type: BLOG_POST_CONTENT_TYPE,
  } as const);

  return mapEntries(response.items as unknown as ContentfulCollectionItem[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((post) => post.slug);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await client.getEntries({
    content_type: BLOG_POST_CONTENT_TYPE,
    "fields.slug": slug,
    limit: 1,
  } as const);

  const entry = response.items[0] as unknown as ContentfulCollectionItem | undefined;

  return entry ? mapContentfulBlogPost(entry as BlogPostEntry) : null;
}