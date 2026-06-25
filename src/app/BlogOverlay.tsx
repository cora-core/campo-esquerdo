import BlogGraph from "@/components/BlogGraph";
import { BlogPost } from "@/lib/blog";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export function BlogOverlay({showBlog, posts}:{showBlog: boolean, posts: BlogPost[]}) {
  return <AnimatePresence mode="wait" initial={false}>
    {showBlog && (
      <motion.div
        key="blog-graph-mobile"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="fixed inset-0 z-50 overflow-auto bg-white"
      >
        <div className="fixed left-4 bottom-4 z-50">
          <Link
            type="button"
            href='/'
            className="inline-flex items-center border border-current bg-white px-3 py-2 text-sm uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
          >
            ← VOLTAR
          </Link>
        </div>  <div className="fixed right-4 top-4 z-50"> <img src="/logo.png" alt="icon" className="h-[2.5em]" /></div>
        <BlogGraph posts={posts} />
      </motion.div>
    )}
  </AnimatePresence>;
}
