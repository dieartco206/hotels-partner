import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  QrCode, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  BedDouble, 
  Calendar 
} from 'lucide-react';

export default function BookingsList({ bookings, hotel, onOpenCheckIn, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const formatCurrency = (amount, currency = 'SGD') => {
    if (!amount) return '0';
    if (currency === 'IDR') {
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    } else if (currency === 'MYR') {
      return `RM ${Math.round(amount).toLocaleString('en-US')}`;
    }
    return `S$ ${Math.round(amount).toLocaleString('en-US')}`;
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      b.booking_code.toLowerCase().includes(term) ||
      b.guest_name.toLowerCase().includes(term) ||
      b.guest_email.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reservations Directory</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-700 border border-brand-200">
              {bookings.length} Total Bookings
            </span>
          </div>
          <p className="text-xs text-slate-500">
            View, verify guest details, and process check-ins.
          </p>
        </div>

        <button
          onClick={onOpenCheckIn}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Check-In Scanner</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'checked_in', label: 'Checked In' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code or guest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-subtle overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No reservations found matching current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Booking Code</th>
                  <th className="py-3 px-4 font-semibold">Guest</th>
                  <th className="py-3 px-4 font-semibold">Room Type</th>
                  <th className="py-3 px-4 font-semibold">Check-In / Out</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => {
                  const checkInStr = new Date(b.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const checkOutStr = new Date(b.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const isCheckedIn = b.status === 'checked_in';

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-600">
                        {b.booking_code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{b.guest_name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{b.guest_phone}</span>
                          <span>•</span>
                          <span>{b.guests_count} guest(s)</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {b.room?.name || 'Deluxe Category'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-medium">{checkInStr} – {checkOutStr}</div>
                        <div className="text-[11px] text-slate-400">{b.nights} night(s)</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{formatCurrency(b.total_amount, b.currency)}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold capitalize">Paid ({b.payment_method})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          isCheckedIn
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-brand-700 border border-brand-200'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Details
                          </button>
                          {!isCheckedIn && b.status !== 'cancelled' && (
                            <button
                              onClick={onOpenCheckIn}
                              className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-bold transition-colors"
                            >
                              Check In
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
        )}
      </div>

      {/* Guest Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-modal border border-slate-100 relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reservation Details</span>
                <h3 className="text-base font-bold text-slate-900">{selectedBooking.booking_code}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Guest Name</span>
                  <span className="font-bold text-slate-800">{selectedBooking.guest_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-700">{selectedBooking.guest_email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="text-slate-700">{selectedBooking.guest_phone}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Room</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.room?.name || 'Deluxe Room'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nights</span>
                  <span className="text-slate-800 font-semibold">{selectedBooking.nights} Night(s)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Gross Total</span>
                  <span className="text-brand-600 font-bold">{formatCurrency(selectedBooking.total_amount, selectedBooking.currency)}</span>
                </div>
              </div>

              {selectedBooking.special_requests && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                  <div className="font-semibold text-amber-900 mb-1">Guest Special Request:</div>
                  <p className="text-amber-800">{selectedBooking.special_requests}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
