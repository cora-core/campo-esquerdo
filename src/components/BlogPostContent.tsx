'use client';

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, type Document } from "@contentful/rich-text-types";
import type { BlogPost } from "@/lib/blog";
import { normalizeAssetUrl } from "@/lib/blog";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/contentful";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date + "T12:00:00"));

interface BlogPostContentProps {
  slug: string
}

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const [{ post, posts }, setData] = useState<{ post: BlogPost | null; posts: BlogPost[] | null }>({ post: null, posts: null });
  const { text, border, bg } = useThemeClasses();
  const router = useRouter();
  
  useEffect(() => {
    (async () => {
      const [post, posts] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()]);
      setData({ post, posts });
    })();
  }, [slug]);

  if (!post || !posts) {
    return <div>loading...</div>
  }
  const backgroundClass = post.backgroundcolor ?? bg;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/blog");
  };

  const handleRandom = () => {
    const options = posts.filter((item) => item.slug !== post.slug).map((item) => item.slug);
    const fallback = posts[0]?.slug ?? post.slug;
    const nextSlug = options[Math.floor(Math.random() * options.length)] ?? fallback;
    router.push(`/blog/${nextSlug}`);
  };

  const body = documentToReactComponents(post.body as Document, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const target = node.data.target as {
          fields?: {
            title?: string;
            description?: string;
            file?: { url?: string };
          };
        };

        const url = normalizeAssetUrl(target?.fields?.file?.url);

        if (!url) {
          return null;
        }

        const altText = target.fields?.description || target.fields?.title || post.title;

        return (
          <figure className="my-8 border border-current bg-white">
            <img src={url} alt={altText} className="h-auto w-full object-cover" />
          </figure>
        );
      },
    },
  });

  const customColorStyle = { "--custom-color": post.customcolor ?? "#5B0F00" } as CSSProperties;

  return (
    <div className={`min-h-screen ${bg} ${text}`} style={customColorStyle}>
      <div className="relative left-4 top-4 z-50">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 border border-current bg-white px-3 py-2 text-sm uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
        >
          ← VOLTAR

        </button>
      </div>
      <div className="fixed left-4 bottom-4 z-50"> <img src="/logo.png" alt="icon" className="h-[2.5em]" /></div>


      <div className={`px-4 ${backgroundClass} py-8 sm:px-8`}>
        <article className="mx-auto max-w-3xl space-y-6 ">
          {/* <div className="space-y-3">
            
            <h1 className="text-2xl sm:text-4xl font-semibold leading-tight">
              {post.title}
            </h1>
             <p className="text-base sm:text-lg leading-relaxed opacity-100">
              {post.author}
            </p>
            <p className="text-base sm:text-lg leading-relaxed opacity-80">
              {post.subtitle}
            </p>
          </div> */}

          {post.image && (
            <div className={`border ${border} bg-white`}>
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="contentful-post-body space-y-4 text-base sm:text-lg leading-relaxed">
            {body}
          </div>

          <div className="text-xs uppercase tracking-[0.25em] opacity-70">
            {post.sourceLabel}
          </div>

          <div className="text-xs uppercase tracking-[0.2em] opacity-70">
            {formatDate(post.date)}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">

            <button
              type="button"
              onClick={handleRandom}
              className={`border ${border} px-3 py-2 uppercase text-xs sm:text-sm`}
            >
              Random article
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
