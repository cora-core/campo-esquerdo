import BlogPostContent from "@/components/BlogPostContent";
import { getBlogPostBySlug, getBlogPosts, getBlogPostSlugs } from "@/lib/contentful";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Blog | Campo Esquerdo",
    };
  }

  return {
    title: `${post.title} | Blog | Campo Esquerdo`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return <BlogPostContent slug={params.slug} />;
}