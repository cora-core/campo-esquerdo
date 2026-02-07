import React, { useState, useMemo } from 'react';
import { SimpleCalendar, sortedCalendarEvents, type CalendarEvent } from './SimpleCalendar';
import EventDetailView from './EventDetailView';

const CalendarView: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Find current index in the chronologically sorted list
  const currentIndex = useMemo(() => {
    if (!selectedEvent) return -1;
    return sortedCalendarEvents.findIndex(
      (e) => e.day === selectedEvent.day && e.month === selectedEvent.month && e.year === selectedEvent.year
    );
  }, [selectedEvent]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < sortedCalendarEvents.length - 1;

  return (
    <div className="calendar-view relative overflow-hidden">
      {/* Calendar always rendered to set container size */}
      <div className={selectedEvent ? 'invisible' : ''}>
        <SimpleCalendar onEventClick={(event) => setSelectedEvent(event)} />
      </div>

      {/* Event detail overlays on top, constrained to calendar size */}
      {selectedEvent && (
        <div className="absolute inset-0 bg-white overflow-hidden flex flex-col">
          <EventDetailView
            event={selectedEvent}
            onBack={() => setSelectedEvent(null)}
            onPrev={hasPrev ? () => setSelectedEvent(sortedCalendarEvents[currentIndex - 1]) : undefined}
            onNext={hasNext ? () => setSelectedEvent(sortedCalendarEvents[currentIndex + 1]) : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarView;