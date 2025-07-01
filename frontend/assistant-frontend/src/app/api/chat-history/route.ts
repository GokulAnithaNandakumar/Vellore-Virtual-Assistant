import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let authParam = searchParams.get('Authorization') || '';
  if (!authParam) {
    return NextResponse.json({ error: 'Missing Authorization token' }, { status: 401 });
  }
  try {
    // Send JWT as Authorization header, not as query param
    const backendRes = await fetch('http://localhost:8080/chats/history', {
      headers: {
        Authorization: `Bearer ${authParam}`,
      },
    });
    if (!backendRes.ok) {
      const text = await backendRes.text();
      return NextResponse.json({ error: text || 'Backend error' }, { status: backendRes.status });
    }
    const data = await backendRes.json();
    let messages: any[] = [];
    if (Array.isArray(data) && data.length > 0) {
      messages = data[0].messages.map((msg: any) => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: new Date(msg.timestamp * 1000).toISOString(),
      }));
    }
    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch chat history' }, { status: 500 });
  }
}
