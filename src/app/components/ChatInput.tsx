'use client';

import { useState } from 'react';

interface Props {
  onEventsParsed: (events: AIEvent[]) => void;
}

type AIEvent = {
  title: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  description?: string;
  aiResponse: string;
};

export default function ChatInput({ onEventsParsed }: Props) {
  const [message, setMessage] = useState('');

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim() !== '') {
      const userInput = message;
      setMessage('');
  
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userInput }),
        });
  
        const rawData = await res.json();
        console.log('[RAW AI RESPONSE]', rawData);
  
        onEventsParsed([rawData]);
      } catch (err) {
        console.error('AI Error:', err);
      }
    }
  };

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask your calendar something..."
        className="w-full px-4 py-3 rounded-2xl bg-[#1e1e1e] text-white placeholder-gray-400 outline-none border border-gray-600 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
