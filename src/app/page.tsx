'use client';

import { useState } from 'react';
import Calendar from './components/Calendar';
import ChatInput from './components/ChatInput';

type AIEvent = {
  title: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  description?: string;
  aiResponse: string;
};

export default function HomePage() {
  const [events, setEvents] = useState<AIEvent[]>([]);

  return (
    <main className="min-h-screen flex flex-col items-center">
      <Calendar events={events} />
      <ChatInput onEventsParsed={(newEvents) => setEvents([...events, ...newEvents])} />
    </main>
  );
}
