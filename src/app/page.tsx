import { getBlogPosts } from "@/lib/contentful";
import HomePage from "./HomePage";

export default async function Home() {
  const blogPosts = await getBlogPosts()
  return <HomePage blogPosts={blogPosts} />
}