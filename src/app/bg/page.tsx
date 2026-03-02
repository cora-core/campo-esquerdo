"use client";

import { motion, useAnimation, AnimatePresence, useMotionValue, animate } from "framer-motion";
import AnimatedArrows from "@/app/BGArrows";
import Image from "next/image";
import { useEffect } from "react";

export default function BgPage() {
  const controls = useAnimation();
  const perspectiveValue = useMotionValue(1000);

  useEffect(() => {
    controls.start({
      rotateX: [0, 0],
      rotateY: [0, 360],
      rotateZ: [0, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      },
    });
  }, [controls]);

  useEffect(() => {
    animate(perspectiveValue, [1000, 50, 1000], {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    });
  }, [perspectiveValue]);

  return (
    <motion.div className="w-full h-screen flex items-center justify-center relative overflow-hidden z-0"
      style={{
        backgroundColor: "#3C3C3B",
      }}>
     <div className="absolute inset-0 backdrop-opacity-30 z-10" style={{ filter: "invert(1)", opacity: 0.5, mixBlendMode: "lighten" }}></div>
      
      <motion.div 
        className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          perspective: perspectiveValue,
        }}
      >
        <motion.div
          animate={controls}
          className="w-64 h-64"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src="/logocampo26.svg"
            alt="ok"
            width={256}
            height={256}
            className="w-full h-full opacity-100"
            style={{
              filter: "invert(1) drop-shadow(0 0 5px white)",
            }}
            priority
          />
        </motion.div>
      </motion.div>
    </motion.div>
    

  );
}
