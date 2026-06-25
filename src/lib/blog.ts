import type { Document } from "@contentful/rich-text-types";

export type BlogPostType = "traducoes" | "artigos" | "news";

export type BlogPostAssetFields = {
  title?: string;
  description?: string;
  file?: {
    url?: string;
    contentType?: string;
  };
};

export type BlogPostFields = {
  slug: string;
  title: string;
  backgroundcolor: string;
  customcolor?: string;
  subtitle?: string;
  excerpt?: string;
  body: Document;
  sourceLabel?: string;
  date?: string;
  image?: BlogPostAssetFields;
  type: BlogPostType;
  author: string;
  tags?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  backgroundcolor: string;
  customcolor?: string;
  subtitle: string;
  excerpt: string;
  body: Document;
  sourceLabel: string;
  date: string;
  image?: string;
  type: BlogPostType;
  author: string;
  tags: string[];
};

export type BlogPostEntry = {
  fields: BlogPostFields;
};

export const normalizeAssetUrl = (url?: string) => {
  if (!url) {
    return undefined;
  }

  return url.startsWith("//") ? `https:${url}` : url;
};

export const documentToPlainText = (document: Document) => {
  const chunks: string[] = [];

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") {
      return;
    }

    const currentNode = node as {
      nodeType?: string;
      value?: string;
      content?: unknown[];
    };

    if (currentNode.nodeType === "text" && typeof currentNode.value === "string") {
      chunks.push(currentNode.value);
    }

    if (Array.isArray(currentNode.content)) {
      currentNode.content.forEach(visit);
    }
  };

  visit(document);

  return chunks.join(" ").replace(/\s+/g, " ").trim();
};

export const mapContentfulBlogPost = (entry: BlogPostEntry): BlogPost => {
  const imageUrl = normalizeAssetUrl(entry.fields.image?.file?.url);
  const fallbackDate = new Date().toISOString().slice(0, 10);
  const author = entry.fields.author?.trim() || entry.fields.sourceLabel?.trim() || "Campo Esquerdo";

  return {
    slug: entry.fields.slug,
    title: entry.fields.title,
    backgroundcolor: entry.fields.backgroundcolor,
    customcolor: entry.fields.customcolor,
    author: entry.fields.author, 
    subtitle: entry.fields.subtitle ?? "",
    excerpt: entry.fields.excerpt ?? "",
    body: entry.fields.body,
    sourceLabel: entry.fields.sourceLabel ?? "",
    date: entry.fields.date ?? fallbackDate,
    image: imageUrl,
    type: entry.fields.type,
    tags: entry.fields.tags ?? [],
  };
};