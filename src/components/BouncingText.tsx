"use client";

import React, { useEffect, useRef, useState } from "react";

interface BouncingTextProps {
  isMobile?: boolean;
}

export default function BouncingText({ isMobile = false }: BouncingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  // Set different initial velocities based on device type
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [vel, setVel] = useState({ 
    x: isMobile ? 1 : 2, 
    y: isMobile ? 1 : 2 
  });

  useEffect(() => {
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
  }, [pos, vel]);

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
    
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfAlhyPX9oKMl6cMtd9-Ka9T_sC8cSqvdqmq9AXpiiNu5T1UA/viewform",
      "_blank"
    );
    
    isDragging.current = false;
  };

  const lines = [
    { text: "CHAMADA", dx: 20 },
    { text: "ABERTA", dx: 10 },
    { text: "CHAMADA", dx: 30 },
    { text: "ABERTA", dx: 40 },
    { text: "CHAMADA", dx: 50 },
    { text: "ABERTA", dx: 60 },
    { text: "CHAMA", dx: 70 },
    { text: "DA", dx: 80 },
    { text: "A", dx: 90 },
  ];

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <svg
        className="absolute cursor-move hover:cursor-grab active:cursor-grabbing"
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
