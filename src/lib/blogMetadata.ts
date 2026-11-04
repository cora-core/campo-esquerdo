import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog";

/**
 * Builds the metadata for a single blog post.
 *
 * When the Contentful `image` field has an asset, it becomes the post's
 * Open Graph / Twitter thumbnail. When the field is empty we deliberately
 * return no `openGraph` or `twitter` keys: Next.js replaces those objects
 * wholesale instead of deep-merging them, so omitting them lets the root
 * layout's default `campes-thumbnail.png` keep applying.
 */
export function buildBlogPostMetadata(post: BlogPost): Metadata {
  const metadata: Metadata = {
    title: `${post.title} | Blog | Campo Esquerdo`,
    description: post.excerpt,
  };

  if (!post.image) {
    return metadata;
  }

  const image = { url: post.image, alt: post.title };

  return {
    ...metadata,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}
