'use client';

import React, { useState, useRef, useEffect } from 'react';
import CalendarView from './CalendarView';
import GaleriaView from './GaleriaView';
import LinksView from './LinksView';
import ConspiradorysView from './ConspiradorysView';

type Mode = 'conspiradorys' | '+links' | 'calendar' | 'galeria';

const modeConfig: Record<Mode, { label: string; component: React.ComponentType }> = {
  conspiradorys: { label: 'CONSPIRADORYS', component: ConspiradorysView },
  '+links': { label: '+LINKS', component: LinksView },
  calendar: { label: 'CALENDÁRIO', component: CalendarView },
  galeria: { label: 'GALERIA', component: GaleriaView },
};

interface ContentHubProps {
  defaultMode?: Mode;
}

const ContentHub: React.FC<ContentHubProps> = ({ defaultMode = 'calendar' }) => {
  const [currentMode, setCurrentMode] = useState<Mode>(defaultMode);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // ========== BUTTON CONFIG (edit here to change all buttons) ==========
  // Font size uses clamp(min, preferred, max) for proportional scaling with rem units
  const buttonFontSize = 'clamp(0.625rem, 1vw, 0.875rem)'; // Scales between 10px-14px based on viewport
  const buttonPadding = 'clamp(0.25rem, 0.5vw, 0.5rem) clamp(0.5rem, 1vw, 1rem)'; // Mobile button padding
  // Button size based on ~5.38% of container width (using vw for consistency)
  const btnSize = 'clamp(1.5rem, 3.5vw, 2.5rem)'; // Responsive button height/width
  // ==========================================================================

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Reset position when collapsing
  const handleToggleExpand = () => {
    if (isExpanded) {
      // Trigger closing animation in place
      setIsClosing(true);
      setTimeout(() => {
        setIsExpanded(false);
        setIsClosing(false);
        setPosition({ x: 0, y: 0 });
      }, 300);
    } else {
      // Set center position immediately, then expand
      const centerX = window.innerWidth / 2 - 400;
      const centerY = window.innerHeight / 2 - 300;
      setPosition({ x: centerX, y: centerY });
      setIsExpanded(true);
    }
  };

  const renderView = () => {
    const ModeComponent = modeConfig[currentMode].component;
    return <ModeComponent />;
  };

  // Base content that's shared between normal and expanded views
  const hubContent = (
    <div 
      className={`content-hub w-full font-ui-gothic relative py-0 px-0 md:py-12 md:px-16 ${isExpanded ? 'max-w-5xl' : 'bg-white'}`}
      style={isExpanded ? { background: 'transparent' } : undefined}
    >
      {/* Mobile: Simple layout */}
       <div className="md:hidden border-x border-t-0 border-black bg-white mb-0">
        {/* Content area */}
        <div className="relative overflow-hidden">
          {/* Calendar always rendered to set size */}
          <div 
            className={`transition-opacity duration-300 ease-out ${
              currentMode === 'calendar' 
                ? 'opacity-100' 
                : 'opacity-0 invisible'
            }`}
          >
            <CalendarView />
          </div>
          {/* Other views overlay with fade-in animation */}
          <div 
            className={`absolute inset-0 bg-white overflow-auto transition-opacity duration-300 ease-out ${
              currentMode !== 'calendar' 
                ? 'opacity-100' 
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {renderView()}
          </div>
        </div>
        
        {/* Mobile: Horizontal button bar at bottom */}
        <div className="flex border-t border-black">
          <button
            onClick={() => setCurrentMode('calendar')}
            className={`flex-1 border-r border-black transition-colors duration-200 ease-out ${
              currentMode === 'calendar' ? 'bg-gray-300' : 'bg-white'
            }`}
            style={{ fontSize: buttonFontSize, padding: buttonPadding }}
          >
            CALENDÁRIO
          </button>
          <button
            onClick={() => setCurrentMode('galeria')}
            className={`flex-1 border-r border-black transition-colors duration-200 ease-out ${
              currentMode === 'galeria' ? 'bg-gray-300' : 'bg-white'
            }`}
            style={{ fontSize: buttonFontSize, padding: buttonPadding }}
          >
            GALERIA
          </button>
          <button
            onClick={() => setCurrentMode('+links')}
            className={`flex-1 border-r border-black transition-colors duration-200 ease-out ${
              currentMode === '+links' ? 'bg-gray-300' : 'bg-white'
            }`}
            style={{ fontSize: buttonFontSize, padding: buttonPadding }}
          >
            +LINKS
          </button>
          <button
            onClick={() => setCurrentMode('conspiradorys')}
            className={`flex-1 transition-colors duration-200 ease-out ${
              currentMode === 'conspiradorys' ? 'bg-gray-300' : 'bg-white'
            }`}
            style={{ fontSize: buttonFontSize, padding: buttonPadding }}
          >
            CONSP.
          </button>
        </div>
      </div>

      {/* Desktop: Original layout with side buttons */}
      <div className="hidden md:block">
        {/* Top row: icon box + horizontal line + CONSPIRADORYS */}
        <div 
          className={`flex items-end ${isExpanded ? 'ml-10' : 'ml-8'}`}
          onMouseDown={isExpanded ? handleMouseDown : undefined}
          style={isExpanded ? { cursor: isDragging ? 'grabbing' : 'grab' } : undefined}
        >
          {/* Expand/Collapse button */}
          <button
            onClick={handleToggleExpand}
            className="border border-black flex items-center justify-center flex-shrink-0 bg-white hover:bg-gray-50 transition-colors"
            style={{ width: btnSize, height: btnSize }}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <img 
              src="/expand.svg" 
              alt={isExpanded ? 'Collapse' : 'Expand'} 
              className={`w-3/5 h-3/5 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {/* Horizontal line */}
          <div className="flex-1 border-t border-black"></div>
          {/* CONSPIRADORYS button */}
          <button
            onClick={() => setCurrentMode('conspiradorys')}
            className={`border border-black flex-shrink-0 transition-colors duration-200 ease-out flex items-center justify-center ${
              currentMode === 'conspiradorys'
                ? 'bg-gray-300'
                : 'bg-white hover:bg-gray-50'
            }`}
            style={{ fontSize: buttonFontSize, height: btnSize, paddingLeft: '1em', paddingRight: '1em' }}
          >
            CONSPIRADORYS
          </button>
        </div>

        {/* Main row with content and side buttons */}
        <div 
          className={`relative ${isExpanded ? 'ml-10' : 'ml-8'}`}
          onMouseDown={isExpanded ? handleMouseDown : undefined}
          style={isExpanded ? { cursor: isDragging ? 'grabbing' : 'grab' } : undefined}
        >
          {/* Main content box */}
          <div className="border border-black border-t-0 relative bg-white">
            {/* Content area - stack all views, calendar sets the size */}
            <div className="relative overflow-hidden">
              {/* Calendar always rendered to set size */}
              <div 
                className={`transition-opacity duration-300 ease-out ${
                  currentMode === 'calendar' 
                    ? 'opacity-100' 
                    : 'opacity-0 invisible'
                }`}
              >
                <CalendarView />
              </div>
              {/* Other views overlay with fade-in animation */}
              <div 
                className={`absolute inset-0 bg-white overflow-auto transition-opacity duration-300 ease-out ${
                  currentMode !== 'calendar' 
                    ? 'opacity-100' 
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                {renderView()}
              </div>
            </div>

            {/* GALERIA button - left side, upper position */}
            <button
              onClick={() => setCurrentMode('galeria')}
              className={`absolute border border-black transition-colors duration-200 ease-out flex items-center justify-center ${
                currentMode === 'galeria'
                  ? 'bg-gray-300'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={{
                left: '0px',
                top: '6.8vh',
                transform: 'translateX(-100%) rotate(180deg)',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                fontSize: buttonFontSize,
                width: btnSize,
                paddingTop: '1em',
                paddingBottom: '1em',
              }}
            >
              GALERIA&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            </button>

            {/* +LINKS button - right side, middle-lower position */}
            <button
              onClick={() => setCurrentMode('+links')}
              className={`absolute border border-black transition-colors duration-200 ease-out flex items-center justify-center ${
                currentMode === '+links'
                  ? 'bg-gray-300'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={{
                right: '0px',
                top: isExpanded ? '25vh' : '25vh',
                transform: 'translateX(100%)',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                fontSize: buttonFontSize,
                width: btnSize,
                paddingTop: '1em',
                paddingBottom: '1em',
              }}
            >
              +LINKS&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            </button>

            {/* CALENDÁRIO button - bottom center */}
            <button
              onClick={() => setCurrentMode('calendar')}
              className={`absolute left-1/4 border border-black transition-colors duration-200 ease-out flex items-center justify-center ${
                currentMode === 'calendar'
                  ? 'bg-gray-300'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={{
                bottom: '0vh',
                transform: 'translateX(-40%) translateY(100%)',
                fontSize: buttonFontSize,
                height: btnSize,
                paddingLeft: '1em',
                paddingRight: '1em',
              }}
            >
              CALENDÁRIO&emsp;&emsp;&emsp;&emsp;&emsp;
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // If expanded, render as draggable floating element
  if (isExpanded) {
    return (
      <div
        ref={dragRef}
        className="fixed z-50 w-[70vw] max-w-5xl max-h-[80vh] overflow-auto"
        style={{
          left: position.x,
          top: position.y,
          background: 'transparent',
          transition: isDragging ? 'none' : 'left 0.3s ease-out, top 0.3s ease-out',
          animation: isClosing ? 'fadeScaleOut 0.3s ease-out forwards' : 'fadeScaleIn 0.3s ease-out',
        }}
      >
        <style jsx>{`
          @keyframes fadeScaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes fadeScaleOut {
            from {
              opacity: 1;
              transform: scale(1);
            }
            to {
              opacity: 0;
              transform: scale(0.95);
            }
          }
        `}</style>
        {hubContent}
      </div>
    );
  }

  // Normal inline view
  return hubContent;
};

export default ContentHub;