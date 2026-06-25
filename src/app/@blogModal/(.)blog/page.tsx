import BlogGraph from "@/components/BlogGraph";
import { getBlogPosts } from "@/lib/contentful";

export default async function BlogOverlayPage() {
  const posts = await getBlogPosts();

  return <BlogGraph posts={posts} />;
}