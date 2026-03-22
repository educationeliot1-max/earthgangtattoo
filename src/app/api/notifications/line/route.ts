import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { parseWebhookEvent, handleAutoReply } from '@/lib/line';

// POST /api/notifications/line — LINE Webhook
export async function POST(request: NextRequest) {
  const body    = await request.text();
  const signature = request.headers.get('x-line-signature') || '';

  // Verify LINE signature
  const secret   = process.env.LINE_CHANNEL_SECRET!;
  const hmac     = crypto.createHmac('SHA256', secret);
  const digest   = hmac.update(body).digest('base64');

  if (digest !== signature) {
    console.error('LINE signature mismatch');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: { events: unknown[] };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const events = parseWebhookEvent(payload as Parameters<typeof parseWebhookEvent>[0]);

  // Process events asynchronously
  Promise.all(
    events.map(async (event) => {
      try {
        if (event.type === 'follow') {
          // New follower — send welcome message
          await handleAutoReply({
            type: 'message',
            replyToken: event.replyToken,
            source: event.source,
            message: { text: 'hello' },
          });
        } else if (event.type === 'message') {
          await handleAutoReply(event as Parameters<typeof handleAutoReply>[0]);
        }
      } catch (err) {
        console.error('LINE event error:', err);
      }
    })
  );

  // Always return 200 quickly
  return NextResponse.json({ ok: true });
}

// GET — LINE webhook verification
export async function GET() {
  return NextResponse.json({ status: 'LINE webhook active', studio: 'EARTHGANG O.G. Tattoo' });
}
