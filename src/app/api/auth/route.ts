import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { sendMemberWelcomeEmail } from '@/lib/email';

// POST /api/auth/register
export async function POST(request: NextRequest) {
  const { action, email, password, full_name, phone, locale } = await request.json();

  const supabase = createServiceRoleClient();

  if (action === 'register') {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, phone },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name,
      phone,
      preferred_language: locale || 'th',
      membership_tier: 'none',
      loyalty_points: 0,
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    return NextResponse.json({
      success: true,
      user_id: authData.user.id,
      message: 'Registration successful',
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
