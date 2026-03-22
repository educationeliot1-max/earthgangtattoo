import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { sendDepositPaidEmail } from '@/lib/email';
import { sendLineMessage, buildDepositPaidMessage } from '@/lib/line';

// GET /api/payments/promptpay/verify?ref=
// In production, this would check with your bank's API
// For now, we manually confirm and trigger next steps

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');

  if (!ref) {
    return NextResponse.json({ error: 'ref required' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      user:users(id, full_name, email, phone, line_user_id),
      artist:artists(id, name, nickname),
      service:services(id, name_th, name_en)
    `)
    .eq('booking_ref', ref)
    .single();

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found', paid: false }, { status: 404 });
  }

  // Check if already paid
  if (booking.status === 'deposit_paid' || booking.status === 'confirmed') {
    return NextResponse.json({ paid: true, booking_ref: ref });
  }

  // NOTE: In production, integrate with Kasikorn/SCB/KTB Open Banking API
  // For now, return pending — admin will manually confirm
  return NextResponse.json({
    paid: false,
    booking_ref: ref,
    message: 'Awaiting payment confirmation',
  });
}

// POST /api/payments/promptpay/verify — Admin manual confirmation
export async function POST(request: NextRequest) {
  try {
    const { booking_ref, admin_key } = await request.json();

    // Simple admin key check — in production use proper auth
    if (admin_key !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    const { data: booking } = await supabase
      .from('bookings')
      .select(`*, user:users(*), artist:artists(*), service:services(*)`)
      .eq('booking_ref', booking_ref)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking status
    await supabase
      .from('bookings')
      .update({
        status: 'deposit_paid',
        updated_at: new Date().toISOString(),
      })
      .eq('booking_ref', booking_ref);

    // Record payment
    await supabase.from('payments').insert({
      booking_id: booking.id,
      user_id: booking.user_id,
      amount_thb: booking.deposit_thb,
      method: 'promptpay',
      status: 'paid',
      promptpay_ref: booking_ref,
      paid_at: new Date().toISOString(),
    });

    // Add loyalty points
    if (booking.user_id) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('membership_tier, loyalty_points')
        .eq('id', booking.user_id)
        .single();

      if (userProfile) {
        const rates: Record<string, number> = {
          none: 1, bronze: 5, silver: 8, gold: 10, platinum: 15,
        };
        const rate = rates[userProfile.membership_tier] || 1;
        const pointsEarned = Math.floor((booking.total_price_thb / 100) * rate);

        await supabase.from('users')
          .update({ loyalty_points: (userProfile.loyalty_points || 0) + pointsEarned })
          .eq('id', booking.user_id);

        await supabase.from('loyalty_transactions').insert({
          user_id: booking.user_id,
          points: pointsEarned,
          type: 'earn',
          description: `Booking ${booking_ref}`,
          booking_id: booking.id,
        });
      }
    }

    // Notifications
    if (booking.user?.email) {
      sendDepositPaidEmail(booking, booking.user).catch(console.error);
    }
    if (booking.user?.line_user_id) {
      sendLineMessage(booking.user.line_user_id, buildDepositPaidMessage(booking)).catch(console.error);
    }

    return NextResponse.json({ success: true, message: 'Payment confirmed' });
  } catch (err) {
    console.error('Payment confirmation error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
