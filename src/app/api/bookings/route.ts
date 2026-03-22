import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { sendBookingConfirmation } from '@/lib/email';
import { sendLineMessage, buildBookingConfirmMessage, notifyStudioAdmin } from '@/lib/line';
import { generateBookingRef } from '@/lib/utils';
import { calculateDeposit } from '@/lib/membership';

// ---- GET /api/bookings?date=&artist_id= ----
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date      = searchParams.get('date');
  const artist_id = searchParams.get('artist_id');

  if (!date) {
    return NextResponse.json({ error: 'date required' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  let query = supabase
    .from('bookings')
    .select('date, time, artist_id, status')
    .eq('date', date)
    .in('status', ['pending', 'deposit_paid', 'confirmed']);

  if (artist_id) query = query.eq('artist_id', artist_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return booked time slots
  const bookedSlots = data.map(b => b.time);
  return NextResponse.json({ booked_slots: bookedSlots });
}

// ---- POST /api/bookings ----
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      service_id, artist_id, date, time,
      placement, size, notes,
      total_price_thb, payment_method,
    } = body;

    // Validation
    if (!service_id || !artist_id || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Check auth
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Check availability
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .eq('artist_id', artist_id)
      .in('status', ['pending', 'deposit_paid', 'confirmed'])
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Time slot already booked' },
        { status: 409 }
      );
    }

    const booking_ref = generateBookingRef();
    const deposit_thb = calculateDeposit(total_price_thb);
    const remaining_thb = total_price_thb - deposit_thb;

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        booking_ref,
        user_id: userId,
        artist_id,
        service_id,
        date,
        time,
        total_price_thb,
        deposit_thb,
        remaining_thb,
        discount_applied: 0,
        points_redeemed: 0,
        status: 'pending',
        notes,
        tattoo_placement: placement,
        tattoo_size: size,
        payment_method,
      })
      .select(`
        *,
        artist:artists(id, name, nickname),
        service:services(id, name_th, name_en),
        user:users(id, full_name, email, phone)
      `)
      .single();

    if (error) throw error;

    // ---- Trigger Notifications (non-blocking) ----
    const notifyPromises: Promise<unknown>[] = [];

    // Email notification
    if (booking.user?.email) {
      notifyPromises.push(
        sendBookingConfirmation(booking, booking.user).catch(console.error)
      );
    }

    // LINE notification (if user has LINE ID)
    if (booking.user?.line_user_id) {
      notifyPromises.push(
        sendLineMessage(
          booking.user.line_user_id,
          buildBookingConfirmMessage(booking)
        ).catch(console.error)
      );
    }

    // Admin notification
    notifyPromises.push(
      notifyStudioAdmin(booking).catch(console.error)
    );

    // Don't await — fire and forget
    Promise.all(notifyPromises);

    return NextResponse.json({
      success: true,
      booking_ref,
      booking_id: booking.id,
      deposit_thb,
      remaining_thb,
    }, { status: 201 });

  } catch (err) {
    console.error('Booking creation error:', err);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
