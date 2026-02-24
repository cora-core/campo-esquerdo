'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContentHubContextType {
  isOpen: boolean;
  openContentHub: (mode?: 'calendar' | 'galeria' | '+links' | 'conspiradorys') => void;
  closeContentHub: () => void;
  defaultMode: 'calendar' | 'galeria' | '+links' | 'conspiradorys';
}

const ContentHubContext = createContext<ContentHubContextType | undefined>(undefined);

export const ContentHubProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultMode, setDefaultMode] = useState<'calendar' | 'galeria' | '+links' | 'conspiradorys'>('calendar');

  const openContentHub = (mode: 'calendar' | 'galeria' | '+links' | 'conspiradorys' = 'calendar') => {
    setDefaultMode(mode);
    setIsOpen(true);
  };

  const closeContentHub = () => {
    setIsOpen(false);
  };

  return (
    <ContentHubContext.Provider value={{ isOpen, openContentHub, closeContentHub, defaultMode }}>
      {children}
    </ContentHubContext.Provider>
  );
};

export const useContentHub = () => {
  const context = useContext(ContentHubContext);
  if (!context) {
    throw new Error('useContentHub must be used within ContentHubProvider');
  }
  return context;
};
