"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * 0.5), 1);
      setScrollProgress(progress);
      
      if (progress > 0.3 && !isOpen) {
        controls.start("open");
      } else if (progress <= 0.3 && isOpen) {
        controls.start("closed");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, controls]);

  useEffect(() => {
    if (isOpen) {
      controls.start("open");
    } else {
      controls.start("closed");
    }
  }, [isOpen, controls]);

  const openSobre = () => {
    setIsOpen(true);
  };

  const openSite = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border p-2">Campo Esquerdo 2025 mam-rj</div>
      <div className="flex flex-1 relative">
        {/* Site  */}
        <div 
          id="site" 
          className="flex flex-col transition-all duration-500"
          style={{ 
            width: isOpen ? "15%" : "85%",
            borderRight: isOpen ? 'none' : '1px solid #000'
          }}
          onClick={openSite}
        >
          <div className="border-b p-2 h-[50px] flex items-center"><span>site</span></div>
          <div className="flex-1 p-2"><span>Main content area</span></div>
          <div className="border-t p-2 h-[50px] flex items-center"><span>Footer</span></div>
        </div>
        
        {/* Sobre */}
        <motion.div
          id="sobre"
          className="flex flex-col absolute right-0 top-0 h-full border-l"
          initial="closed"
          animate={controls}
          variants={{
            open: { width: "85%" },
            closed: { width: "15%" }
          }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            mass: 1
          }}
          onClick={openSobre}
        >
          <div className="border-b p-2 h-[50px] flex items-center">
            <motion.span
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                mass: 1
              }}
            >
              sobre
            </motion.span>
          </div>
          
          <div className="flex-1 p-2 overflow-y-auto">
            <motion.div
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                mass: 1
              }}
            >
              <p>This is the about section content.</p>
              {isOpen && (
                <>
                  <p className="mt-4">Scroll down to see the drawer open gradually.</p>
                  <div className="h-[200vh] mt-4 flex items-center justify-center">
                    <p>Keep scrolling...</p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
          
          <div className="border-t p-2 h-[50px] flex items-center">
            <motion.span
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                mass: 1
              }}
            >
              Footer info
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
