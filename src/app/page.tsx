"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import AnimatedArrows from "./BGArrows";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const controls = useAnimation();
  const sobreContainerRef = useRef<HTMLDivElement>(null);
  const mentoriasRef = useRef<HTMLDivElement>(null);

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
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, controls]);

  useEffect(() => {
    const handleSobreScroll = () => {
      // This will be handled by CSS only now
    };

    const sobreContainer = sobreContainerRef.current;
    if (sobreContainer) {
      sobreContainer.addEventListener('scroll', handleSobreScroll);
    }
    
    return () => {
      if (sobreContainer) {
        sobreContainer.removeEventListener('scroll', handleSobreScroll);
      }
    };
  }, []);

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
      <AnimatedArrows></AnimatedArrows>
      <div className="border min-h-[5vh] pl-2">Campo Esquerdo 2025 mam-rj</div>
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
          <div className="border-b border-l min-h-[5vh] pl-2 flex items-center"><span>site</span></div>
          <div className="flex-1 p-2 min-h-[85vh] border-l " ><span>Main content area</span></div>
          <div className="border-t border-l border-b min-h-[5vh] pl-2 flex items-center"></div>
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
          <div className="border-b pl-2 min-h-[5vh] items-center">
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
          
          <div 
            ref={sobreContainerRef}
            className="overflow-y-auto"
            style={{ height: 'calc(100% - 5vh)' }}
          >
            <motion.div
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                mass: 1
              }}
            >
              <div className="min-h-[85vh]">This is the about section content.</div>
              
              {/* Mentorias Section with proper sticky positioning */}
              <div className="relative">
                <div 
                  ref={mentoriasRef}
                  className="sticky top-0 border-b border-t flex items-center min-h-[5vh] pl-2 bg-black z-10"
                >
                  Mentorias
                </div>
                
                {/* Content below mentorias */}
                {isOpen && (
                  <>
                    <p className="mt-4">Scroll down to see the drawer open gradually.</p>
                    <div className="h-[200vh] mt-4 flex items-center justify-center">
                      <p>Keep scrolling...</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
