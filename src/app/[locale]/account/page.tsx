'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Star, Crown, User, ChevronRight, LogOut, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { MEMBERSHIP_PLANS, calculatePointsValue } from '@/lib/membership';
import { cn, formatCurrency } from '@/lib/utils';

interface Props {
  params: { locale: string };
}

export default function AccountPage({ params: { locale } }: Props) {
  const [user, setUser]             = useState<Record<string, unknown> | null>(null);
  const [bookings, setBookings]     = useState<unknown[]>([]);
  const [transactions, setTrans]    = useState<unknown[]>([]);
  const [loading, setLoading]       = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        window.location.href = `/${locale}/login`;
        return;
      }

      const [profileRes, bookingsRes, txRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', authUser.id).single(),
        supabase.from('bookings')
          .select('*, artist:artists(name, nickname), service:services(name_th, name_en)')
          .eq('user_id', authUser.id)
          .order('date', { ascending: false })
          .limit(5),
        supabase.from('loyalty_transactions')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      setUser(profileRes.data);
      setBookings(bookingsRes.data || []);
      setTrans(txRes.data || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  }

  const currentPlan = MEMBERSHIP_PLANS.find(p => p.tier === (user?.membership_tier as string));
  const points       = (user?.loyalty_points as number) || 0;
  const pointsValue  = calculatePointsValue(points, (user?.membership_tier as string || 'none') as any);

  const statusLabel: Record<string, { label_th: string; label_en: string; class: string }> = {
    pending:       { label_th: 'รอการยืนยัน', label_en: 'Pending',      class: 'status-pending' },
    deposit_paid:  { label_th: 'ชำระมัดจำแล้ว', label_en: 'Deposit Paid', class: 'status-deposit' },
    confirmed:     { label_th: 'ยืนยันแล้ว',   label_en: 'Confirmed',    class: 'status-confirmed' },
    completed:     { label_th: 'เสร็จสิ้น',     label_en: 'Completed',    class: 'status-completed' },
    cancelled:     { label_th: 'ยกเลิก',        label_en: 'Cancelled',    class: 'status-cancelled' },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container-max mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-red/10 border-2 border-brand-red/30 rounded-full
                           flex items-center justify-center">
              <span className="text-brand-red font-black text-2xl">
                {((user?.full_name as string) || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {locale === 'th' ? 'สวัสดี' : 'Hello'}, {(user?.full_name as string) || 'Member'}! 👋
              </h1>
              <p className="text-brand-gray text-sm">{user?.email as string}</p>
              {currentPlan && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold">
                  <span>{currentPlan.icon}</span>
                  <span style={{ color: currentPlan.color }}>{currentPlan.name_en} Member</span>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-brand-gray hover:text-white transition-colors
                       text-sm px-3 py-2 rounded-lg hover:bg-brand-dark-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">
              {locale === 'th' ? 'ออกจากระบบ' : 'Sign Out'}
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: '📅',
              value: bookings.length,
              label_th: 'การจองทั้งหมด',
              label_en: 'Total Bookings',
              link: `/${locale}/account/bookings`,
            },
            {
              icon: '⭐',
              value: `${points.toLocaleString()} pts`,
              label_th: 'คะแนนสะสม',
              label_en: 'Loyalty Points',
              link: `/${locale}/account/points`,
            },
            {
              icon: currentPlan?.icon || '🎖️',
              value: currentPlan?.name_en || 'No Tier',
              label_th: 'ระดับสมาชิก',
              label_en: 'Membership',
              link: `/${locale}/membership`,
            },
            {
              icon: '💰',
              value: `${pointsValue.toLocaleString()} ฿`,
              label_th: 'มูลค่าคะแนน',
              label_en: 'Points Value',
              link: `/${locale}/account/points`,
            },
          ].map((stat) => (
            <Link
              key={stat.label_en}
              href={stat.link}
              className="card-dark rounded-xl p-4 hover:border-brand-red/50 transition-colors group"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-white font-black text-lg">{stat.value}</p>
              <p className="text-brand-gray text-xs">
                {locale === 'th' ? stat.label_th : stat.label_en}
              </p>
              <ChevronRight size={14} className="text-brand-gray mt-2 group-hover:text-brand-red transition-colors" />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Calendar size={18} className="text-brand-red" />
                {locale === 'th' ? 'การจองล่าสุด' : 'Recent Bookings'}
              </h2>
              <Link href={`/${locale}/account/bookings`}
                    className="text-brand-red text-xs font-bold hover:underline">
                {locale === 'th' ? 'ดูทั้งหมด' : 'View All'}
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="card-dark rounded-xl p-8 text-center">
                <p className="text-5xl mb-4">📅</p>
                <p className="text-brand-gray">
                  {locale === 'th' ? 'ยังไม่มีการจอง' : 'No bookings yet'}
                </p>
                <Link href={`/${locale}/book`} className="btn-primary inline-flex mt-4 text-sm">
                  {locale === 'th' ? 'จองเลย' : 'Book Now'}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {(bookings as Record<string, unknown>[]).map((booking) => {
                  const status = statusLabel[booking.status as string];
                  const service = booking.service as Record<string, string>;
                  const artist  = booking.artist as Record<string, string>;
                  return (
                    <div key={booking.id as string} className="card-dark rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-brand-gold text-xs font-bold">{booking.booking_ref as string}</p>
                          <p className="text-white font-bold text-sm mt-0.5">
                            {locale === 'th' ? service?.name_th : service?.name_en}
                          </p>
                          <p className="text-brand-gray text-xs mt-1">
                            🎨 {artist?.nickname} · 📅 {booking.date as string} {booking.time as string}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={status?.class || 'badge'}>
                            {locale === 'th' ? status?.label_th : status?.label_en}
                          </span>
                          <p className="text-brand-gold text-sm font-bold mt-2">
                            {(booking.total_price_thb as number)?.toLocaleString()} ฿
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Membership Card */}
            <div className={`rounded-xl p-5 border ${currentPlan ? `border-${currentPlan.tier === 'gold' ? 'yellow-500' : 'brand-dark-3'}` : 'border-brand-dark-3 bg-brand-dark'}`}
                 style={currentPlan ? { background: `linear-gradient(135deg, ${currentPlan.color}22, #191919)` } : {}}>
              <p className="text-brand-gray text-xs mb-2">
                {locale === 'th' ? 'สมาชิกภาพ' : 'Membership'}
              </p>
              {currentPlan ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">{currentPlan.icon}</span>
                    <div>
                      <p className="text-white font-black">{currentPlan.name_en}</p>
                      <p className="text-xs" style={{ color: currentPlan.color }}>
                        {currentPlan.discount_percent}% {locale === 'th' ? 'ส่วนลด' : 'off'}
                      </p>
                    </div>
                  </div>
                  <Link href={`/${locale}/membership`}
                        className="text-xs text-brand-red font-bold hover:underline">
                    {locale === 'th' ? 'อัพเกรด →' : 'Upgrade →'}
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-white font-bold mb-3">
                    {locale === 'th' ? 'ยังไม่เป็นสมาชิก' : 'Not a member'}
                  </p>
                  <Link href={`/${locale}/membership`} className="btn-gold inline-flex text-xs px-4 py-2">
                    💎 {locale === 'th' ? 'สมัครสมาชิก' : 'Join Now'}
                  </Link>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card-dark rounded-xl p-4">
              <p className="text-brand-gray text-xs font-bold uppercase tracking-wider mb-3">
                Quick Actions
              </p>
              {[
                { href: `/${locale}/book`,               icon: '📅', label_th: 'จองคิว',        label_en: 'Book Session' },
                { href: `/${locale}/account/bookings`,   icon: '📋', label_th: 'ดูการจอง',      label_en: 'My Bookings' },
                { href: `/${locale}/account/points`,     icon: '⭐', label_th: 'คะแนนสะสม',    label_en: 'Loyalty Points' },
                { href: `/${locale}/contact`,            icon: '📞', label_th: 'ติดต่อสตูดิโอ', label_en: 'Contact Studio' },
              ].map(action => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 py-2.5 border-b border-brand-dark-3 last:border-0
                             text-brand-gray-light hover:text-white hover:text-brand-red transition-colors group"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm">{locale === 'th' ? action.label_th : action.label_en}</span>
                  <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand-red" />
                </Link>
              ))}
            </div>

            {/* Book CTA */}
            <Link href={`/${locale}/book`} className="btn-primary flex items-center justify-center gap-2 w-full">
              📅&nbsp;
              {locale === 'th' ? 'จองคิวใหม่' : 'Book New Session'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
