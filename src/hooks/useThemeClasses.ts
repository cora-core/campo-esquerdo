import { useTheme } from '@/contexts/ThemeContext';

export const useThemeClasses = () => {
  const { bgColor, textColor, borderColor, arrowColor } = useTheme();
  
  return {
    bg: bgColor,
    text: textColor,
    border: borderColor,
    arrow: arrowColor,
    bgText: `${bgColor} ${textColor}`,
  };
};
