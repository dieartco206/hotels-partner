import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  Percent, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  ChevronRight,
  QrCode
} from 'lucide-react';

export default function Dashboard({ stats, hotel, onOpenCheckIn, onNavigate }) {
  const formatCurrency = (amount, currency = 'SGD') => {
    if (!amount) return '0';
    if (currency === 'IDR') {
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    } else if (currency === 'MYR') {
      return `RM ${Math.round(amount).toLocaleString('en-US')}`;
    }
    return `S$ ${Math.round(amount).toLocaleString('en-US')}`;
  };

  const arrivalsCount = stats?.today_arrivals || 0;
  const occupancyRate = stats?.occupancy_rate || 78.5;
  const monthlyRevenue = stats?.monthly_revenue || 0;
  const pendingSettlement = stats?.pending_settlement || 0;
  const recentBookings = stats?.recent_bookings || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Property Overview</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Today
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time occupancy, guest arrivals, and booking revenue for <span className="font-semibold text-slate-700">{hotel?.name || 'Your Property'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Check In Guest</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Arrivals */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Arrivals Today</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{arrivalsCount}</span>
            <span className="text-xs text-slate-400 font-medium">reservations</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-brand-600 font-semibold">Front desk ready</span> for check-in
          </div>
        </div>

        {/* Card 2: Occupancy Rate */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Occupancy Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{occupancyRate.toFixed(1)}%</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {stats?.active_bookings || 0} rooms currently occupied
          </div>
        </div>

        {/* Card 3: MTD Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 truncate">
            {formatCurrency(monthlyRevenue, hotel?.currency)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Cumulative confirmed bookings
          </div>
        </div>

        {/* Card 4: Pending Payout */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Pending Settlement</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 truncate">
            {formatCurrency(pendingSettlement, hotel?.currency)}
          </div>
          <div className="mt-2 text-[11px] text-purple-700 font-semibold flex items-center gap-1">
            <span>Net payout (after 15% commission)</span>
          </div>
        </div>
      </div>

      {/* Main Section: Recent Reservations */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Guest Reservations</h2>
            <p className="text-xs text-slate-500">Incoming arrivals and active stays at your property</p>
          </div>
          <button
            onClick={() => onNavigate('bookings')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Reservations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No reservations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Booking Code</th>
                  <th className="pb-3 font-semibold">Guest</th>
                  <th className="pb-3 font-semibold">Room Type</th>
                  <th className="pb-3 font-semibold">Check-In</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((booking) => {
                  const checkInStr = new Date(booking.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const isCheckedIn = booking.status === 'checked_in';
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-brand-600">
                        {booking.booking_code}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-900">{booking.guest_name}</div>
                        <div className="text-[11px] text-slate-400">{booking.guest_email}</div>
                      </td>
                      <td className="py-3 font-medium text-slate-700">
                        {booking.room?.name || 'Deluxe Room'}
                      </td>
                      <td className="py-3 text-slate-600">{checkInStr}</td>
                      <td className="py-3 text-slate-600">{booking.nights} night(s)</td>
                      <td className="py-3 font-semibold text-slate-900">
                        {formatCurrency(booking.total_amount, booking.currency)}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          isCheckedIn
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : booking.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-brand-700 border border-brand-200'
                        }`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {!isCheckedIn && booking.status !== 'cancelled' ? (
                          <button
                            onClick={onOpenCheckIn}
                            className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg font-bold text-[11px] transition-colors"
                          >
                            Check In
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">In House</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
