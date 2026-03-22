import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceRoleClient } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// POST /api/payments/stripe — Create payment intent
export async function POST(request: NextRequest) {
  try {
    const { booking_id, amount, booking_ref, locale = 'th' } = await request.json();

    if (!booking_id || !amount) {
      return NextResponse.json({ error: 'booking_id and amount required' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      locale: locale === 'th' ? 'th' : locale === 'zh' ? 'zh' : 'en',
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: `EARTHGANG Tattoo — Deposit ${booking_ref}`,
              description: `30% deposit for booking ${booking_ref}`,
              images: ['https://www.earthgangtattoo.com/og-image.jpg'],
            },
            unit_amount: amount * 100, // Stripe uses satang
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_id,
        booking_ref,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/account/bookings?payment=success&ref=${booking_ref}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/book?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url, session_id: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}

// POST /api/payments/stripe/webhook — Stripe webhook
export async function stripeWebhook(request: NextRequest) {
  const body = await request.text();
  const sig  = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession;
    const { booking_id, booking_ref } = session.metadata!;

    await supabase
      .from('bookings')
      .update({ status: 'deposit_paid', stripe_payment_intent_id: session.payment_intent as string })
      .eq('id', booking_id);

    await supabase.from('payments').insert({
      booking_id,
      amount_thb: (session.amount_total || 0) / 100,
      method: 'stripe',
      status: 'paid',
      stripe_payment_intent_id: session.payment_intent as string,
      paid_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ received: true });
}
