import React from 'react';
import type { CalendarEvent } from './SimpleCalendar';

interface EventDetailViewProps {
  event: CalendarEvent;
  onBack: () => void;
  /** Navigate to adjacent events if available */
  onPrev?: () => void;
  onNext?: () => void;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({ event, onBack, onPrev, onNext }) => {
  const dateStr = `${String(event.day).padStart(2, '0')}/${String(event.month + 1).padStart(2, '0')}`;

  return (
    <div className="event-detail-view text-xs h-full flex flex-col">
      {/* Header row - matches calendar header */}
      <div className="grid grid-cols-7 -mb-1">
        <div className="col-span-5 text-left pl-2 py-1 font-bold text-xl">
          {event.title} {dateStr}
        </div>
        <div className="col-span-2 flex items-center justify-end space-x-1 text-xs px-2 py-1">
          <button onClick={onPrev} disabled={!onPrev} className="disabled:opacity-30">&lt;</button>
          <span className="cursor-pointer" onClick={onBack}>VOLTAR</span>
          <button onClick={onNext} disabled={!onNext} className="disabled:opacity-30">&gt;</button>
        </div>
      </div>

      {/* Subtitle - independent from calendar cell description */}
      {event.eventSubtitle && (
        <div className="pl-2 pb-1 text-sm font-normal">
          {event.eventSubtitle}
        </div>
      )}

      {/* Content area — fills remaining space */}
      <div className="border-t border-black flex flex-col md:flex-row flex-1 min-h-0">

        {/* === MOBILE LAYOUT === */}
        <div className="md:hidden flex flex-col flex-1 min-h-0 p-3 gap-2">
          {/* Top: description + small image side by side */}
          <div className="flex gap-3 flex-1 min-h-0">
            <div className="flex-1 text-sm leading-snug min-w-0">
              {event.fullDescription ? (
                <p>{event.fullDescription}</p>
              ) : (
                <p className="text-gray-400 italic">Sem descrição disponível.</p>
              )}
            </div>
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="w-24 h-24 flex-shrink-0 object-contain self-start"
              />
            )}
          </div>

          {/* Bottom: local/hora + link button */}
          <div className="flex items-end justify-between gap-2 mt-auto">
            <div className="text-xs">
              <div>local: {event.local || ''}</div>
              <div>hora: {event.hora || ''}</div>
            </div>
            <a
              href={event.link || '#'}
              target={event.link ? '_blank' : undefined}
              rel={event.link ? 'noopener noreferrer' : undefined}
              className="border border-black flex flex-col items-center justify-center px-4 py-1.5 hover:bg-black hover:text-white transition-colors flex-shrink-0"
            >
              <svg
                width="62.47"
                height="7.95"
                viewBox="0 0 62.47 7.95"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-0.5 w-10"
              >
                <polyline
                  points=".11 7.46 31.24 .51 62.36 7.46"
                  fill="none"
                  stroke="currentColor"
                  strokeMiterlimit="10"
                />
              </svg>
              <span className="text-[10px] font-semibold tracking-wide">
                {event.linkText || 'TEXTO DO LINK'}
              </span>
            </a>
          </div>
        </div>

        {/* === DESKTOP LAYOUT === */}
        {/* Left column: description + meta */}
        <div className="hidden md:flex flex-1 p-4 flex-col justify-between min-w-0 min-h-0">
          {/* Body text */}
          <div className="text-base leading-relaxed">
            {event.fullDescription ? (
              <p>{event.fullDescription}</p>
            ) : (
              <p className="text-gray-400 italic">Sem descrição disponível.</p>
            )}
          </div>

          {/* Bottom: local/hora */}
          <div className="mt-auto pt-6 text-sm">
            <div>local: {event.local || ''}</div>
            <div>hora: {event.hora || ''}</div>
          </div>
        </div>

        {/* Right column: image + link button below */}
        <div className="hidden md:flex md:flex-col w-[38%] flex-shrink-0 p-4 items-center gap-2 min-h-0">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full min-h-0 flex-1 object-contain"
            />
          ) : (
            <div className="w-full flex-1" />
          )}

          {/* Link button with arc chevron */}
          <a
            href={event.link || '#'}
            target={event.link ? '_blank' : undefined}
            rel={event.link ? 'noopener noreferrer' : undefined}
            className="border border-black flex flex-col items-center justify-center px-6 py-2 hover:bg-black hover:text-white transition-colors"
          >
            <svg
              width="62.47"
              height="7.95"
              viewBox="0 0 62.47 7.95"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-1 w-12"
            >
              <polyline
                points=".11 7.46 31.24 .51 62.36 7.46"
                fill="none"
                stroke="currentColor"
                strokeMiterlimit="10"
              />
            </svg>
            <span className="text-xs font-semibold tracking-wide">
              {event.linkText || 'TEXTO DO LINK'}
            </span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default EventDetailView;
