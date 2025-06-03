'use client';

type Props = {
  title: string;
  time?: string | null;
};

function formatTimeTo12Hour(time: string) {
  const [hourStr, minute] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; 
  return `${hour}:${minute} ${ampm}`;
}

export default function EventBubble({ title, time }: Props) {
  const isAllDay = !time;

  return (
    <div
      className={`mt-1 px-2 py-1 rounded-md text-white text-xs font-medium w-full truncate ${
        isAllDay ? 'bg-purple-600' : 'bg-blue-500'
      }`}
    >
      {isAllDay ? title : `${formatTimeTo12Hour(time)} – ${title}`}
    </div>
  );
}
