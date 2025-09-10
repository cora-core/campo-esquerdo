"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ThemeContextType {
  bgColor: string;
  textColor: string;
  borderColor: string;
  arrowColor: string;
  setTheme: (theme: Partial<Omit<ThemeContextType, 'setTheme'>>) => void;
  setIndividualColor: (element: keyof Omit<ThemeContextType, 'setTheme' | 'setIndividualColor'>, color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState({
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-[#2f3032]',
    borderColor: 'border-[#000000]', 
    arrowColor: 'text-[#9fce98]'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState(parsedTheme);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);

  const setTheme = (newTheme: Partial<Omit<ThemeContextType, 'setTheme' | 'setIndividualColor'>>) => {
    const updatedTheme = { ...theme, ...newTheme };
    setThemeState(updatedTheme);
    localStorage.setItem('theme', JSON.stringify(updatedTheme));
  };

  const setIndividualColor = (element: keyof Omit<ThemeContextType, 'setTheme' | 'setIndividualColor'>, color: string) => {
    const updatedTheme = { ...theme, [element]: color };
    setThemeState(updatedTheme);
    localStorage.setItem('theme', JSON.stringify(updatedTheme));
  };

  return (
    <ThemeContext.Provider value={{ ...theme, setTheme, setIndividualColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
