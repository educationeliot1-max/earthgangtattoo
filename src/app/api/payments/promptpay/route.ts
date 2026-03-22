import { NextRequest, NextResponse } from 'next/server';
import { generatePromptPayQR } from '@/lib/promptpay';

// GET /api/payments/promptpay?amount=&ref=
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const amount = parseFloat(searchParams.get('amount') || '0');
  const ref    = searchParams.get('ref') || '';

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  try {
    const qrUrl = await generatePromptPayQR(amount);

    return NextResponse.json({
      qrUrl,
      amount,
      ref,
      phone: process.env.PROMPTPAY_PHONE,
      name: process.env.PROMPTPAY_NAME || 'ปัญญานนท์ วีระเดชะ',
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min
    });
  } catch (err) {
    console.error('PromptPay QR error:', err);
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
  }
}
