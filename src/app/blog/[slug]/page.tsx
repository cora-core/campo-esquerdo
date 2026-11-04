import BlogPostContent from "@/components/BlogPostContent";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/contentful";
import { buildBlogPostMetadata } from "@/lib/blogMetadata";

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

  return buildBlogPostMetadata(post);
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return <BlogPostContent slug={params.slug} />;
}