import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog";

/** Matches the dimensions of the default `campes-thumbnail.png`. */
const SOCIAL_CARD_WIDTH = 1200;
const SOCIAL_CARD_HEIGHT = 675;

const CONTENTFUL_IMAGE_HOST = /^images(\.eu)?\.ctfassets\.net$/;
const SOCIAL_SAFE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const UNTRANSFORMABLE_TYPES = new Set(["image/svg+xml", "image/gif"]);

/**
 * Gives the asset the card's aspect ratio instead of letting the social
 * platform center-crop it. `fit=pad` scales the image to fit inside
 * 1200x675 and fills the rest with white; it never crops.
 */
export function buildSocialThumbnailUrl(url: string, contentType?: string): string {
  if (!contentType?.startsWith("image/") || UNTRANSFORMABLE_TYPES.has(contentType)) {
    return url;
  }

  try {
    const parsed = new URL(url);

    if (!CONTENTFUL_IMAGE_HOST.test(parsed.hostname)) {
      return url;
    }

    parsed.searchParams.set("w", String(SOCIAL_CARD_WIDTH));
    parsed.searchParams.set("h", String(SOCIAL_CARD_HEIGHT));
    parsed.searchParams.set("fit", "pad");
    parsed.searchParams.set("bg", "rgb:ffffff");

    // Platforms don't reliably render AVIF/TIFF as link previews.
    if (!SOCIAL_SAFE_TYPES.has(contentType)) {
      parsed.searchParams.set("fm", "jpg");
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

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

  const image = {
    url: buildSocialThumbnailUrl(post.image, post.imageContentType),
    alt: post.title,
  };

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
