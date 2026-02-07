import React, { useState, useMemo } from "react";

export interface CalendarEvent {
  day: number;
  month: number;  // 0-indexed (0 = January, 11 = December)
  year: number;
  title: string;
  /** Short text shown on calendar cells */
  description?: string;
  /** Subtitle shown in event detail header (independent from calendar cell text) */
  eventSubtitle?: string;
  /** Full description shown in event detail body */
  fullDescription?: string;
  local?: string;
  hora?: string;
  link?: string;
  linkText?: string;
  image?: string;
}

interface SimpleCalendarProps {
  className?: string;
  onEventClick?: (event: CalendarEvent) => void;
}

/** All calendar events – single source of truth */
export const calendarEvents: CalendarEvent[] = [
  { day: 6, month: 0, year: 2026, title: "CHAMADA ABERTA", description: "em breve", eventSubtitle: "Chamada aberta para participação", fullDescription: "Lorem ipsum dolor sit amet consectetur.", local: "Online", hora: "18:00" },
  { day: 26, month: 0, year: 2026, title: "FIM DA CHAMADA", description: "x", eventSubtitle: "Prazo final para inscrições" },
  { day: 7, month: 9, year: 2025, title: "EVENTO", description: "EVENTO EVENTO EVENTO", eventSubtitle: "0,4ML 30 X 7 NA BUNDINHA PFVR", fullDescription: "Lorem ipsum dolor sit amet consectetur. Odio velit in massa varius cursus aliquam." },
  { day: 2, month: 2, year: 2026, title: "SEMINÁRIOS", description: "14:00; Mari Herzer, J-P Caron", eventSubtitle: "14:00; Mari Herzer, J-P Caron", hora: "14:00", fullDescription: "Seminários com Mari Herzer e J-P Caron.", local: "Bloco Escola (MAM-Rio)", image: "/campes-instapfp.png", link: "https://www.instagram.com/campo.esquerdo", linkText: "SAIBA MAIS" },
  { day: 3, month: 2, year: 2026, title: "OFICINAS", description: "14:00; Escola de Mistérios, Capetini, Kaloan", eventSubtitle: "Seminários comEscola de Mistérios, Capetini, Kaloan", hora: "14:00", fullDescription: "Oficinas com Escola de Mistérios, Capetini e Kaloan.", local: "Bloco Escola (MAM-Rio)", image: "/campes-instapfp.png", link: "https://www.instagram.com/campo.esquerdo", linkText: "SAIBA MAIS" },
  { day: 6, month: 2, year: 2026, title: "EXPERIÊNCIA", description: "15:00; Anti Ribeiro, Nãovenhasemrosto, Pek0", eventSubtitle: "Anti Ribeiro, Nãovenhasemrosto, Pek0", hora: "15:00", fullDescription: "Experiência de escula com Anti Ribeiro, Nãovenhasemrosto e Pek0. Mediação sonora: numagama", local: "Vão Livre (MAM-Rio)", image: "/campes-instapfp.png", linkText: "SAIBA MAIS", link: "https://www.instagram.com/campo.esquerdo" },
];

/** Events sorted chronologically */
export const sortedCalendarEvents = [...calendarEvents].sort((a, b) => {
  const dateA = new Date(a.year, a.month, a.day);
  const dateB = new Date(b.year, b.month, b.day);
  return dateA.getTime() - dateB.getTime();
});

// Helper to find the next upcoming event
const getNextEventDate = (events: CalendarEvent[]): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.year, a.month, a.day);
    const dateB = new Date(b.year, b.month, b.day);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Find next event (>= today)
  const nextEvent = sortedEvents.find((event) => {
    const eventDate = new Date(event.year, event.month, event.day);
    return eventDate >= today;
  });
  
  // If no future event, return current date; otherwise return event's month
  if (nextEvent) {
    return new Date(nextEvent.year, nextEvent.month, 1);
  }
  return new Date();
};

export function SimpleCalendar({ className = "", onEventClick }: SimpleCalendarProps) {
  const events = calendarEvents;

  const initialDate = useMemo(() => getNextEventDate(events), []);
  const [currentDate, setCurrentDate] = useState(initialDate);

  const monthNames = [
    "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
  ];
  
  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (increment: number) =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));

  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: startDay }, (_, i) => i);

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [...emptyCells.map(() => null)];

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  // Always ensure 5 rows for consistent height
  while (weeks.length < 5) {
    weeks.push([null, null, null, null, null, null, null]);
  }

  const getEventForDay = (day: number) =>
    events.find((event) => 
      event.day === day && 
      event.month === currentDate.getMonth() && 
      event.year === currentDate.getFullYear()
    );

  return (
    <div className={`text-xs ${className}`}>
      <div className="w-full">
        <div className="grid grid-cols-7">
          <div className="col-span-5 text-left pl-2 py-1 font-bold text-xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <div className="col-span-2 flex items-center justify-end space-x-1 text-xs px-2 py-1">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <span>PRÓXIMO</span>
            <button onClick={() => changeMonth(1)}>&gt;</button>
          </div>
        </div>

        <div className="grid grid-cols-7">
          {["dom", "seg", "ter", "qua", "qui", "sex", "sab"].map((day) => (
            <div
              key={day}
              className="text-right pr-1 font-semibold py-0.5"
            >
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-t border-black">
            {week.map((day, di) => {
              const event = day ? getEventForDay(day) : null;
              return (
                <div
                  key={di}
                  className={`min-h-[4.5rem] md:min-h-[5rem] border-l first:border-l-0 border-black p-0.5 relative text-xs ${
                    event ? "bg-black text-white cursor-pointer hover:bg-gray-900" : ""
                  }`}
                  style={{ aspectRatio: 'auto' }}
                  onClick={() => event && onEventClick?.(event)}
                >
                  {day && (
                    <div className={`absolute top-0.5 right-0.5 text-xs ${
                      event ? "text-white" : ""
                    }`}>
                      {day}
                    </div>
                  )}
                  {event && (
                    <>
                      {/* Desktop view - show full event info */}
                      <div className="hidden md:block text-[9px] p-0.5 mt-4 w-full h-[calc(100%-1.5rem)]">
                        <div className="font-bold">{event.title}</div>
                        {event.description && (
                          <div className="text-[8px] leading-tight">
                            {event.description}
                          </div>
                        )}
                      </div>
                      
                      {/* Mobile view - show compact "infos +" */}
                      <div className="md:hidden flex flex-col items-center justify-center h-full w-full p-0.5">
                        <div className="text-[9px] font-bold leading-tight text-center">
                          <div>infos</div>
                          <div className="text-[10px] mt-[-2px]">+</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
