'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, DollarSign, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats]     = useState({
    bookings_today: 0,
    revenue_month: 0,
    active_members: 0,
    pending_bookings: 0,
  });
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading]   = useState(true);

  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [todayRes, revenueRes, membersRes, pendingRes, allBookingsRes] = await Promise.all([
      supabase.from('bookings').select('id', { count: 'exact' }).eq('date', today),
      supabase.from('payments').select('amount_thb').gte('paid_at', monthStart).eq('status', 'paid'),
      supabase.from('users').select('id', { count: 'exact' }).neq('membership_tier', 'none'),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('bookings')
        .select('*, user:users(full_name, phone), artist:artists(nickname), service:services(name_th,name_en)')
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    const revenue = (revenueRes.data || []).reduce((sum: number, p: Record<string, unknown>) => sum + (p.amount_thb as number), 0);

    setStats({
      bookings_today:  todayRes.count || 0,
      revenue_month:   revenue,
      active_members:  membersRes.count || 0,
      pending_bookings: pendingRes.count || 0,
    });
    setBookings((allBookingsRes.data as Record<string, unknown>[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('bookings').update({ status }).eq('id', id);
    loadData();
  }

  async function confirmPayment(booking_ref: string) {
    await fetch('/api/payments/promptpay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_ref, admin_key: process.env.NEXT_PUBLIC_ADMIN_KEY }),
    });
    loadData();
  }

  const statusColors: Record<string, string> = {
    pending:      'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    deposit_paid: 'bg-orange-900/50 text-orange-300 border-orange-700',
    confirmed:    'bg-green-900/50 text-green-300 border-green-700',
    completed:    'bg-blue-900/50 text-blue-300 border-blue-700',
    cancelled:    'bg-gray-800 text-gray-400 border-gray-600',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">🛠️ Admin Dashboard</h1>
          <p className="text-brand-gray text-sm">EARTHGANG O.G. Tattoo Studio</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="text-brand-gray hover:text-white transition-colors text-sm">← Back to Site</Link>
          <Link href="/admin/members" className="btn-secondary text-sm px-4 py-2">Members</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Calendar size={20} />, label: 'Today\'s Bookings', value: stats.bookings_today, color: 'text-brand-red' },
          { icon: <DollarSign size={20} />, label: 'Revenue This Month', value: `${stats.revenue_month.toLocaleString()} ฿`, color: 'text-brand-gold' },
          { icon: <Users size={20} />, label: 'Active Members', value: stats.active_members, color: 'text-blue-400' },
          { icon: <Clock size={20} />, label: 'Pending Bookings', value: stats.pending_bookings, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="card-dark rounded-xl p-5">
            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-brand-gray text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="card-dark rounded-xl overflow-hidden">
        <div className="p-4 border-b border-brand-dark-3 flex items-center justify-between">
          <h2 className="text-white font-bold">📋 All Bookings</h2>
          <button onClick={loadData} className="text-brand-red text-xs hover:underline">↻ Refresh</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-dark-3 text-brand-gray">
                <th className="text-left p-3">Ref</th>
                <th className="text-left p-3">Client</th>
                <th className="text-left p-3">Artist</th>
                <th className="text-left p-3">Date / Time</th>
                <th className="text-right p-3">Total</th>
                <th className="text-right p-3">Deposit</th>
                <th className="text-center p-3">Status</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const user    = booking.user as Record<string, string>;
                const artist  = booking.artist as Record<string, string>;
                const service = booking.service as Record<string, string>;
                const status  = booking.status as string;

                return (
                  <tr key={booking.id as string}
                      className="border-b border-brand-dark-3 hover:bg-brand-dark-2/50 transition-colors">
                    <td className="p-3">
                      <span className="text-brand-gold font-bold text-xs">{booking.booking_ref as string}</span>
                    </td>
                    <td className="p-3">
                      <p className="text-white text-xs font-medium">{user?.full_name || 'Guest'}</p>
                      <p className="text-brand-gray text-[11px]">{user?.phone || '—'}</p>
                    </td>
                    <td className="p-3">
                      <span className="text-brand-gray-light text-xs">{artist?.nickname || '—'}</span>
                    </td>
                    <td className="p-3">
                      <p className="text-white text-xs">{booking.date as string}</p>
                      <p className="text-brand-gray text-[11px]">{booking.time as string}</p>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-brand-gold font-bold text-xs">
                        {(booking.total_price_thb as number)?.toLocaleString()} ฿
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-brand-gray-light text-xs">
                        {(booking.deposit_thb as number)?.toLocaleString()} ฿
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[status] || 'bg-gray-800 text-gray-400'}`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-center">
                        {status === 'pending' && (
                          <button
                            onClick={() => confirmPayment(booking.booking_ref as string)}
                            className="bg-green-700 hover:bg-green-600 text-white text-[10px] px-2 py-1 rounded-lg transition-colors"
                            title="Confirm PromptPay"
                          >
                            ✅ Paid
                          </button>
                        )}
                        {status === 'deposit_paid' && (
                          <button
                            onClick={() => updateStatus(booking.id as string, 'confirmed')}
                            className="bg-blue-700 hover:bg-blue-600 text-white text-[10px] px-2 py-1 rounded-lg transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {['pending','deposit_paid','confirmed'].includes(status) && (
                          <button
                            onClick={() => updateStatus(booking.id as string, 'cancelled')}
                            className="bg-red-900 hover:bg-red-800 text-red-300 text-[10px] px-2 py-1 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(booking.id as string, 'completed')}
                            className="bg-purple-900 hover:bg-purple-800 text-purple-300 text-[10px] px-2 py-1 rounded-lg transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
