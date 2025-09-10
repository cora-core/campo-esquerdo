"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

// Define available colors
const availableColors = [
  { name: 'White', value: '#ffffff', class: 'bg-[#ffffff] text-[#2f3032]' },
  { name: 'Dark', value: '#2f3032', class: 'bg-[#2f3032] text-white' },
  { name: 'Green', value: '#9fce98', class: 'bg-[#9fce98] text-[#2f3032]' },
  { name: 'Pink', value: '#eec2db', class: 'bg-[#eec2db] text-[#2f3032]' },
  { name: 'Gray One', value: '#8a8e80', class: 'bg-[#8a8e80] text-white' },
  { name: 'Gray Two', value: '#a5a3a4', class: 'bg-[#a5a3a4] text-[#2f3032]' },
  { name: 'Gray Three', value: '#d8dcdf', class: 'bg-[#d8dcdf] text-[#2f3032]' },
];

// Define color elements that can be customized
const colorElements = [
  { id: 'bgColor', name: 'Background', prefix: 'bg' },
  { id: 'textColor', name: 'Text', prefix: 'text' },
  { id: 'borderColor', name: 'Border', prefix: 'border' },
  { id: 'arrowColor', name: 'Arrows', prefix: 'text' },
];

export const ThemeSelector = () => {
  const { bgColor, textColor, borderColor, arrowColor, setIndividualColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (element: string, colorValue: string, prefix: string) => {
    setIndividualColor(element as any, `${prefix}-[${colorValue}]`);
  };

  const getCurrentColorValue = (colorClass: string) => {
    const match = colorClass.match(/\[(#.*)\]/);
    return match ? match[1] : '';
  };

  return (
    <div className="fixed left-6 top-30 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full border-2 ${borderColor} bg-opacity-90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-opacity-100 transition-all ${bgColor} ${textColor}`}
        aria-label="Change theme"
      >
        <svg 
          className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute left-14 top-0 ${bgColor} bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[250px] ${borderColor} border`}>
          <div className={`text-sm font-medium mb-4 ${textColor}`}>Customize Colors</div>
          
          <div className="space-y-4">
            {colorElements.map((element) => {
              const currentValue = getCurrentColorValue(
                element.id === 'bgColor' ? bgColor :
                element.id === 'textColor' ? textColor :
                element.id === 'borderColor' ? borderColor : arrowColor
              );
              
              return (
                <div key={element.id} className="space-y-2">
                  <label className={`text-xs font-medium ${textColor}`}>
                    {element.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={`${element.id}-${color.value}`}
                        onClick={() => handleColorChange(element.id, color.value, element.prefix)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          currentValue === color.value 
                            ? `${borderColor} scale-110` 
                            : 'border-transparent hover:scale-110'
                        }`}
                        style={{ backgroundColor: color.value }}
                        aria-label={`Set ${element.name} to ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preset themes for quick selection */}
          <div className="mt-6 pt-4 border-t border-opacity-50">
            <div className={`text-xs font-medium mb-2 ${textColor}`}>Preset Themes</div>
            <div className="space-y-1">
              {[
                { name: 'Default', bg: '#ffffff', text: '#2f3032', border: '#000000ff', arrow: '#000000ff' },
                { name: 'Dark Mode', bg: '#2f3032', text: '#ffffff', border: '#000000ff', arrow: '#eec2db' },
                { name: 'Pink Theme', bg: '#eec2db', text: '#2f3032', border: '#9fce98', arrow: '#9fce98' },
                { name: 'Green Theme', bg: '#9fce98', text: '#2f3032', border: '#eec2db', arrow: '#eec2db' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setIndividualColor('bgColor', `bg-[${preset.bg}]`);
                    setIndividualColor('textColor', `text-[${preset.text}]`);
                    setIndividualColor('borderColor', `border-[${preset.border}]`);
                    setIndividualColor('arrowColor', `text-[${preset.arrow}]`);
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-xs transition-all hover:bg-opacity-20 ${textColor} hover:${bgColor}`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
