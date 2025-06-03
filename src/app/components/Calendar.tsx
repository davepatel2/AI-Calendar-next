'use client';

import { useState } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, format, isSameMonth, isSameDay
} from 'date-fns';
import EventBubble from './EventBubble';

type Props = {
  events: {
    title: string;
    date: string;
    startTime: string | null;
    endTime: string | null;
    description?: string;
    aiResponse: string;
  }[];
};

export default function Calendar({ events }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    // Normalize to the first day of the current month to ensure consistent server/client render
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={prevMonth}>←</button>
      <h2 className="text-2xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth}>→</button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2 text-center text-gray-500 font-medium text-sm">
        {days.map((day) => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));

    const rows = [];
    let day = start;

    // Calculate today's date once and normalize it to avoid hydration mismatches
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    while (day <= end) {
      const row = [];

      for (let i = 0; i < 7; i++) {
        const formatted = format(day, 'd');
        const dateKey = format(day, 'yyyy-MM-dd');
        const isToday = isSameDay(day, normalizedToday); // Use the normalized today
        const inMonth = isSameMonth(day, currentMonth);
        const dayEvents = events
        .filter((e) => e.date === dateKey)
        .sort((a, b) => {
            // All-day events (null time) come first
            if (!a.startTime && b.startTime) return -1;
            if (a.startTime && !b.startTime) return 1;
            return 0;
        });

        row.push(
            <div
            key={day.toString()}
            className={`p-2 h-35 border rounded-xl mx-1 my-1 transition text-sm flex flex-col items-start
              ${inMonth ? 'text-white' : 'text-gray-500'}
              ${isToday ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-700'}
            `}
          >
            <div className="text-xs mb-1">{formatted}</div>
          
            <div className="flex flex-col gap-1 w-full">
              {dayEvents.map((event, i) => (
                <EventBubble key={i} title={event.title} time={event.startTime} />
              ))}
            </div>
          </div>
          
        );

        day = addDays(day, 1);
      }

      rows.push(<div key={day.toString()} className="grid grid-cols-7">{row}</div>);
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="w-full">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
