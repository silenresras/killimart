// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userMessage = body.message;

  if (!userMessage) {
    return NextResponse.json({ error: 'Missing user message' }, { status: 400 });
  }

  try {
    // 👉 Call your Express backend instead
    const res = await fetch('http://localhost:7000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ reply: data.reply });
  } catch (error) {
    console.error('Backend Chat Error:', error);
    return NextResponse.json({ error: 'Chat backend error' }, { status: 500 });
  }
}
