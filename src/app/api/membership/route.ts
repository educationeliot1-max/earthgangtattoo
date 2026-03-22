import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { MembershipTier } from '@/types';
import { MEMBERSHIP_PLANS } from '@/lib/membership';
import { sendMemberWelcomeEmail } from '@/lib/email';

// POST /api/membership — Purchase or upgrade membership
export async function POST(request: NextRequest) {
  try {
    const { user_id, tier, payment_method } = await request.json() as {
      user_id: string;
      tier: MembershipTier;
      payment_method: 'stripe' | 'promptpay';
    };

    if (!user_id || !tier) {
      return NextResponse.json({ error: 'user_id and tier required' }, { status: 400 });
    }

    const plan = MEMBERSHIP_PLANS.find(p => p.tier === tier);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Get current user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update membership
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await supabase.from('users').update({
      membership_tier: tier,
      membership_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', user_id);

    // Record membership purchase
    await supabase.from('membership_purchases').insert({
      user_id,
      tier,
      amount_thb: plan.price_thb,
      payment_method,
      expires_at: expiresAt.toISOString(),
    });

    // Welcome email
    sendMemberWelcomeEmail({ ...user, membership_tier: tier }).catch(console.error);

    return NextResponse.json({
      success: true,
      tier,
      expires_at: expiresAt.toISOString(),
      message: `Upgraded to ${tier.toUpperCase()} successfully`,
    });
  } catch (err) {
    console.error('Membership error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET /api/membership?user_id=
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('users')
    .select('membership_tier, membership_expires_at, loyalty_points')
    .eq('id', user_id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const plan = MEMBERSHIP_PLANS.find(p => p.tier === data.membership_tier);

  return NextResponse.json({
    ...data,
    plan_details: plan,
  });
}
