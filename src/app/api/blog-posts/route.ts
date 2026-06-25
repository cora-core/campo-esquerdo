import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/contentful";

export const runtime = 'edge'

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}