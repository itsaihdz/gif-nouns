import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = "https://webhook.site/a1d4c769-2f20-4f74-9d40-6bd5ed303577";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the logs to the webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Failed to forward logs to webhook:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to forward logs' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error forwarding logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}