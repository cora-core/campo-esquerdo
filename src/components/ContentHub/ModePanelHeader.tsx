import React from 'react';

type Mode = 'conspiradorys' | '+links' | 'calendar' | 'galeria';

interface ContentHubHeaderProps {
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
}

const modeLabels: Record<Mode, string> = {
  conspiradorys: 'CONSPIRADORYS',
  '+links': '+LINKS',
  calendar: 'CALENDÁRIO',
  galeria: 'GALERIA',
};

const ContentHubHeader: React.FC<ContentHubHeaderProps> = ({ currentMode, setCurrentMode }) => {
  return (
    <div className="flex justify-between items-center border-b border-black h-10 px-4 flex-shrink-0 bg-transparent font-ui-gothic">
      {/* Left: Small icon */}
      <div className="w-5 h-5 border border-black flex-shrink-0 flex items-center justify-center">
        <div className="w-2 h-2 border border-black"></div>
      </div>

      {/* Right: Current mode display */}
      <div className="text-xs font-bold">
        {modeLabels[currentMode]}
      </div>
    </div>
  );
};

export default ContentHubHeader;