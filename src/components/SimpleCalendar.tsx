import React, { useState } from "react";

interface Event {
  day: number;
  title: string;
  description?: string;
}

interface SimpleCalendarProps {
  className?: string;
}

export function SimpleCalendar({ className = "" }: SimpleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));

  const events: Event[] = [
    { day: 30, title: "EVENTO", description: "EVENTO EVENTO EVENTO" },
    { day: 7, title: "EVENTO", description: "EVENTO EVENTO EVENTO" },
    { day: 4, title: "OFICINA + SEMINÁRIO", description: "COM JP CARON E MARI HERZER" },
    { day: 11, title: "CAMPO ESQUERDO", description: "DETAIL TEXT CAN GO HERE OR FILL MULTILINE" }
  ];

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

  const getEventForDay = (day: number) =>
    events.find((event) => event.day === day);

  return (
    <div className={`text-xs p-2 ${className}`}>
      <div className="w-[90%] mx-auto border border-black">
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
                  className={`h-20 border-l first:border-l-0 border-black p-0.5 relative text-xs ${
                    event ? "bg-black text-white" : ""
                  }`}
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
