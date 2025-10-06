"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SVGData {
  content: string;
  viewBox: string;
  paths: string[];
  styles: string[];
}

const AnimatedSVGLayers = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svgLayers, setSvgLayers] = useState<SVGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [spawnedLayers, setSpawnedLayers] = useState<boolean[]>([false, false, false, false]);

  // Parse style string to object
  const parseStyleString = (styleString: string): React.CSSProperties => {
    const styleObj: React.CSSProperties = {};
    
    if (!styleString) return styleObj;
    
    const styles = styleString.split(';');
    styles.forEach(style => {
      const [property, value] = style.split(':').map(s => s.trim());
      if (property && value) {
        // Convert kebab-case to camelCase for React
        const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[camelCaseProperty as keyof React.CSSProperties] = value;
      }
    });
    
    return styleObj;
  };

  // Load SVG files from public directory
  useEffect(() => {
    const loadSVGs = async () => {
      try {
        const svgFiles = ['/l1.svg', '/l2.svg', '/l3.svg', '/l4.svg'];
        const loadedSVGs: SVGData[] = [];
        
        for (const file of svgFiles) {
          const response = await fetch(file);
          const text = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, "text/xml");
          const svgElement = xmlDoc.documentElement;
          
          // Extract viewBox
          const viewBox = svgElement.getAttribute('viewBox') || '0 0 100 100';
          
          // Extract all path elements and their styles
          const pathElements = svgElement.querySelectorAll('path');
          const paths: string[] = [];
          const styles: string[] = [];
          
          pathElements.forEach(path => {
            const d = path.getAttribute('d');
            if (d) paths.push(d);
            
            // Extract style if exists
            const style = path.getAttribute('style') || '';
            styles.push(style);
          });
          
          loadedSVGs.push({
            content: text,
            viewBox,
            paths,
            styles
          });
        }
        
        setSvgLayers(loadedSVGs);
        setLoading(false);
      } catch (error) {
        console.error('Error loading SVG files:', error);
        setLoading(false);
      }
    };

    loadSVGs();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Spawn layers sequentially with 2 second delays
  useEffect(() => {
    if (loading) return;
    
    const spawnTimers = [
      setTimeout(() => setSpawnedLayers([true, false, false, false]), 2000),
      setTimeout(() => setSpawnedLayers([true, true, false, false]), 4000),
      setTimeout(() => setSpawnedLayers([true, true, true, false]), 6000),
      setTimeout(() => setSpawnedLayers([true, true, true, true]), 8000),
    ];
    
    return () => {
      spawnTimers.forEach(timer => clearTimeout(timer));
    };
  }, [loading]);

  // Function to create SVG elements with proper animation
  const createAnimatedSVG = (layerIndex: number, baseScale: number) => {
    if (loading || svgLayers.length === 0 || !spawnedLayers[layerIndex]) return null;
    
    const layer = svgLayers[layerIndex];
    const viewBoxValues = layer.viewBox.split(' ').map(Number);
    const svgWidth = viewBoxValues[2];
    const svgHeight = viewBoxValues[3];
    
    // Calculate dimensions based on scale
    const width = svgWidth * baseScale;
    const height = svgHeight * baseScale;
    
    // Generate unique animation name
    const animationName = `float3DAnimation-${layerIndex}`;
    
    return (
      <div
        key={`layer-${layerIndex}`}
        className="absolute origin-center"
        style={{
          left: '50%',
          top: '50%',
          animationName: animationName,
          animationDuration: '15s',
          animationTimingFunction: 'linear',
          animationDelay: '0s',
          animationIterationCount: 'infinite',
          animationFillMode: 'forwards'
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={layer.viewBox}
          className="opacity-90"
          style={{
            transform: `translate(-50%, -50%)`
          }}
        >
          {layer.paths.map((path, idx) => {
            // Parse the style string to a proper style object
            const styleObj = parseStyleString(layer.styles[idx]);
            
            return (
              <path
                key={idx}
                d={path}
                style={styleObj}
              />
            );
          })}
        </svg>
        
        {/* Inline style for this specific animation */}
        <style jsx>{`
          @keyframes ${animationName} {
            0% {
              transform: translate(-50%, -50%) scale(0.1);
              opacity: 0;
            }
            5% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 overflow-hidden bg-white"
        style={{ pointerEvents: 'none' }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden bg-white"
      style={{ pointerEvents: 'none' }}
    >
      {/* Layer 1 - Largest (appear closest) */}
      {dimensions.width > 0 && createAnimatedSVG(0, 1.2)}
      
      {/* Layer 2 - Medium size */}
      {dimensions.width > 0 && createAnimatedSVG(1, 0.9)}
      
      {/* Layer 3 - Smaller */}
      {dimensions.width > 0 && createAnimatedSVG(2, 0.7)}
      
      {/* Layer 4 - Smallest (appear farthest) */}
      {dimensions.width > 0 && createAnimatedSVG(3, 0.5)}
    </div>
  );
};

export default AnimatedSVGLayers;
