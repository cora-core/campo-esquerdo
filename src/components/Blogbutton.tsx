"use client";


import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface BlogbuttonProps {
  isMobile?: boolean;
}

export default function Blogbutton({ isMobile = false }: BlogbuttonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const router = useRouter();

  // Set different initial velocities based on device type
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [vel, setVel] = useState({ 
    x: isMobile ? 1 : 2, 
    y: isMobile ? 1 : 2 
  });

const [isBouncing, setIsBouncing] = useState(true);

  useEffect(() => {

      if (!isBouncing) return; // 👈 don't animate if stopped
    let frame: number;

    const update = () => {
      if (!containerRef.current || !textRef.current || isDragging.current) return;
      
      const container = containerRef.current.getBoundingClientRect();
      const text = textRef.current.getBBox();
      const padding = 20;

      let { x, y } = pos;
      let { x: vx, y: vy } = vel;

      x += vx;
      y += vy;

      // check all 4 sides with padding
      if (x - padding <= 0 || x + text.width + padding >= container.width) vx = -vx;
      if (y - padding <= 0 || y + text.height + padding >= container.height) vy = -vy;

      setPos({ x, y });
      setVel({ x: vx, y: vy });

      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [pos, vel, isBouncing]); // 👈 include isBouncing

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY
    };
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !textRef.current) return;
    
    const moveThreshold = 5;
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    
    if (dx > moveThreshold || dy > moveThreshold) {
      isDragging.current = true;
    }
    
    if (!isDragging.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const text = textRef.current.getBBox();
    const padding = 20;
    
    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;
    
    newX = Math.max(padding, Math.min(newX, container.width - text.width - padding));
    newY = Math.max(padding, Math.min(newY, container.height - text.height - padding));
    
    setPos({ x: newX, y: newY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMouseMove as any);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    
const baseLine = linePattern[Math.floor(Math.random() * linePattern.length)];
const randomDx = baseLine.dx + (Math.random() - 0.5) * 2; 
const randomDy = baseLine.dy + (Math.random() - 0.5) * 2; 






    // start filling on click
progressivelyFillLines();
setIsBouncing(false); // 👈 stop movement


isDragging.current = false;
    
    setTimeout(() => {
      router.push('/blog');
    }, 1200);

    
    
  };

  // const lines = [
  //   { text: "CHAMADA", dx: 20 },
  //   { text: "ABERTA", dx: 10 },
  //   { text: "CHAMADA", dx: 30 },
  //   { text: "ABERTA", dx: 40 },
  //   { text: "CHAMADA", dx: 50 },
  //   { text: "ABERTA", dx: 60 },
  //   { text: "CHAMA", dx: 70 },
  //   { text: "DA", dx: 80 },
  //   { text: "A", dx: 90 },
  // ];
  


  
// replace your current const lines = [...] with:



const [lines, setLines] = useState<{ text: string; dx: number; y: number }[]>([
  { text: "BLOG", dx: 50, y: 0 },
  { text: "CAMPO ESQUERDO", dx: 50, y: 18 },
  { text: "OIII", dx: 70, y: 18 },
]);




// add below the state above
const linePattern: { text: string; dx: number; dy: number }[] = [ 
  { text: "CAMPO", dx: 20, dy:0},
  { text: "SÔNICA", dx: 10, dy:0 },
  { text: "ESQUERDO", dx: 30, dy:0 },
  { text: "F1CÇÃO SÔNICA", dx: 40, dy:0},
  { text: "HIP3RSTIÇÕES", dx: 50, dy:0},
  { text: "ARTE SONORA", dx: 60, dy:0},
  { text: "S0M", dx: 70, dy:0},
  { text: "CORPO", dx: 80, dy:0},
  { text: "AUTRE-TECH", dx: 90, dy:0},
  { text: "SOM<->FILOSOFIA", dx: -20, dy:20}, 
  { text: "CONVIDADES", dx: -10, dy:20 },
  { text: "FASE II CONTINUA", dx: -30, dy:20 },
  { text: "PUBLICAÇÕES", dx: -40   , dy:20},
  { text: "HIPERSTIÇÕES", dx: -50, dy:20},
  { text: "TRADUÇÕES", dx: -60, dy:20},
  { text: "+", dx: -70, dy:20},
  { text: "TEXTOS", dx: -80, dy:20},
  { text: "TEORIA-FICÇÃO", dx: -90, dy:20},
];







const fillingRef = useRef(false);
const intervalRef = useRef<number | null>(null);

const LINE_HEIGHT = 18; 
const PADDING = 20;

const getTargetLineCount = () => {
  if (!containerRef.current) return lines.length;
  const { height } = containerRef.current.getBoundingClientRect();
  const available = Math.max(0, height - PADDING * 2);
  return Math.max(lines.length, Math.floor(available / LINE_HEIGHT));
};

const getLineByIndex = (i: number) => linePattern[i % linePattern.length];

const progressivelyFillLines = () => {
  if (fillingRef.current) return; // guard: don't start twice
  fillingRef.current = true;

  const target = getTargetLineCount();
  let i = lines.length; // continue from current count

  intervalRef.current = window.setInterval(() => {
    i += 1; 
    setLines(prev => {
      if (prev.length >= target) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        fillingRef.current = false;
        return prev;
      }
      // pick a random line from the pattern
const baseLine = linePattern[Math.floor(Math.random() * linePattern.length)];

// add some horizontal randomness
const randomDx = baseLine.dx + (Math.random() - 0.5) * 60; // ±20px jitter

const lastY = prev[prev.length - 1]?.y ?? 0;
const randomY = lastY + LINE_HEIGHT + (Math.random() - 0.5) * 10; // ±5px

return [...prev, { text: baseLine.text, dx: randomDx, y: randomY }];

    });
  }, 10); 
};






  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <svg
        className="absolute cursor-pointer active:cursor-grabbing"
        overflow="visible"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        onMouseDown={handleMouseDown}
      >
        {/* Multiple layered strokes to create a smooth outline without artifacts */}
        <text
          x={0}
          y={0}
          fontSize="20"
          fontWeight="bold"
          fill="none"
          stroke="black"
          strokeWidth="20"
          strokeLinejoin="round"
          strokeLinecap="round"
          dominantBaseline="hanging"
        >
          {lines.map((line, i) => (
            <tspan key={i} x={line.dx} dy={i === 0 ? 0 : 18}>
              {line.text}
            </tspan>
          ))}
        </text>
        
        {/* Secondary stroke to clean up the edges */}
        <text
          x={0}
          y={0}
          fontSize="20"
          fontWeight="bold"
          fill="none"
          stroke="black"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"
          dominantBaseline="hanging"
        >
          {lines.map((line, i) => (
            <tspan key={i} x={line.dx} dy={i === 0 ? 0 : 18}>
              {line.text}
            </tspan>
          ))}
        </text>
        
        {/* Primary stroke */}
        <text
          x={0}
          y={0}
          fontSize="20"
          fontWeight="bold"
          fill="none"
          stroke="black"
          strokeWidth="12"
          strokeLinejoin="round"
          strokeLinecap="round"
          dominantBaseline="hanging"
        >
          {lines.map((line, i) => (
            <tspan key={i} x={line.dx} dy={i === 0 ? 0 : 18}>
              {line.text}
            </tspan>
          ))}
        </text>

        {/* Crisp white text on top */}
        <text
          ref={textRef}
          x={0}
          y={0}
          fontSize="20"
          fontWeight="bold"
          fill="white"
          dominantBaseline="hanging"
        >
          {lines.map((line, i) => (
            <tspan key={i} x={line.dx} dy={i === 0 ? 0 : 18}> 
              {line.text}
            </tspan>
          ))}
        </text>
      </svg>
    </div>
  );
}
