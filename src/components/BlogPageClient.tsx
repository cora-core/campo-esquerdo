'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import BlogGraph from "@/components/BlogGraph";
import type { BlogPost } from "@/lib/blog";

interface BlogPageClientProps {
  posts: BlogPost[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="min-h-screen bg-white"
    >
      <div className="fixed left-4 top-4 z-20">
        <Link
          href="/"
          scroll={false}
          className="inline-flex items-center rounded-sm border border-current bg-white px-3 py-2 text-sm uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
        >
          ← home
        </Link>
      </div>
      <BlogGraph posts={posts} />
    </motion.div>
  );
}