"use client";

import { useEffect, ReactNode } from "react";

export default function StickyWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stickyElements = document.querySelectorAll(".sticky-border-transparent");

    stickyElements.forEach((el) => {
      // create a sentinel just above the sticky element
      const sentinel = document.createElement("div");
      el.parentElement?.insertBefore(sentinel, el);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.target instanceof HTMLElement) {
            el.classList.toggle("is-stuck", !entry.isIntersecting);
          }
        },
        { threshold: [0] } // sentinel leaves viewport
      );

      observer.observe(sentinel);
    });
  }, []);

  return <>{children}</>;
}
