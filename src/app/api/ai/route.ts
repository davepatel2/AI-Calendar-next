import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userMessage = body.message;

  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const currentDayOfWeek = now.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  const systemPrompt = `
You are an intelligent assistant specializing in managing calendar events.
Today's date is ${formattedDate}, and today is ${currentDayOfWeek}.

### Required JSON Response Format:
   {
     "aiResponse": "A natural-language message summarizing the scheduling (e.g. 'Your 3 meetings have been scheduled...')"
     "title": "Event Title",
     "date": "YYYY-MM-DD",
     "startTime": "HH:mm",  
     "endTime": "HH:mm",    
     "description": "Optional description (null if none)"
   }

### Rules for Date and Time Formatting:
1. Dates must be in YYYY-MM-DD format (e.g., "2024-03-20")
2. Times must be in 24-hour HH:mm format (e.g., "14:30")
3. do not add times for events unless it is excplicitly stated in the user input, if there is no explicit ending time do not add one

### Rules for Handling Events:
1. Date Accuracy:
   - "Next <day of the week>": Schedule for the following week's occurrence of that day
   - "This <day of the week>": If the day has already passed this week, move it to next week
   - "Tomorrow": Calculate the next calendar day
   - "Next week": Add 7 days to current date
Always respond with a valid JSON matching the exact format above.
`;

  const payload = {
    model: 'gpt-3.5-turbo-1106',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  try {
    const json = JSON.parse(data.choices[0].message.content);
    console.log('[AI EVENT JSON]:', json); // 🔥 Logs full event object
    return NextResponse.json(json); 
  } catch (err) {
    console.error('[PARSE ERROR]', err);
    return NextResponse.json({ error: 'Failed to parse JSON' }, { status: 500 });
  }
}
