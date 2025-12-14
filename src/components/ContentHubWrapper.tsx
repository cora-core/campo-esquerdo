'use client';

import React from 'react';
import { ContentHub } from '@/components/ContentHub';

/**
 * ContentHubWrapper - A reusable component wrapper for the ContentHub
 * Can be easily placed in any part of your page layout
 * 
 * @param defaultMode - Starting mode for the hub (default: 'calendar')
 * 
 * Usage:
 * <ContentHubWrapper defaultMode="calendar" />
 * <ContentHubWrapper defaultMode="galeria" />
 */

interface ContentHubWrapperProps {
  defaultMode?: 'conspiradorys' | '+links' | 'calendar' | 'galeria';
}

const ContentHubWrapper: React.FC<ContentHubWrapperProps> = ({ defaultMode = 'calendar' }) => {
  return (
    <div className="w-full h-screen md:h-96 lg:h-[600px]">
      <ContentHub defaultMode={defaultMode} />
    </div>
  );
};

export default ContentHubWrapper;
